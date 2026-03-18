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
const DB_FILE = path.join(__dirname, 'database.json');

// ─── AmploPay Gateway Config ────────────────────────────────────────────────
const AMPLOPAY_BASE_URL = 'https://app.amplopay.com/api/v1';
const AMPLOPAY_PUBLIC_KEY = process.env.AMPLOPAY_PUBLIC_KEY || '';
const AMPLOPAY_SECRET_KEY = process.env.AMPLOPAY_SECRET_KEY || '';
const AMPLOPAY_WEBHOOK_TOKEN = process.env.AMPLOPAY_WEBHOOK_TOKEN || '';
const WEBHOOK_BASE_URL = process.env.WEBHOOK_BASE_URL || `http://localhost:${PORT}`;

const amplopayHeaders = {
  'Content-Type': 'application/json',
  'x-public-key': AMPLOPAY_PUBLIC_KEY,
  'x-secret-key': AMPLOPAY_SECRET_KEY,
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

const SITE_CONFIG = {
  teste_gratis_ativo: true,
  deposito_minimo: 20,
  site_nome: 'HelixWins',
  site_suporte: '',
  site_promo: '',
  site_logo_url: null,
  site_favicon_url: null,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function findUser(id) { return db.users.find(u => u.id === id); }

function generateReferralCode() {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

function safeUser(user) {
  const { senha_hash, admin, cpf, ...safe } = user;
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

    const cleanPhone = String(telefone).replace(/\D/g, '');

    // Rate limit: 10 tentativas de login por telefone a cada 15 minutos
    if (!rateLimit(`login:${cleanPhone}`, 10, 900000)) {
      return res.status(429).json({ error: 'Muitas tentativas. Aguarde 15 minutos.' });
    }

    const user = db.users.find(u => u.telefone === cleanPhone);
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
    if (!nome || !email || !telefone || !senha) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
    }
    if (senha.length < 6) return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres.' });

    const cleanPhone = String(telefone).replace(/\D/g, '');

    // Rate limit: 3 registros por IP a cada 1 hora
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    if (!rateLimit(`register:${ip}`, 3, 3600000)) {
      return res.status(429).json({ error: 'Muitos cadastros recentes. Aguarde.' });
    }

    if (db.users.find(u => u.telefone === cleanPhone || u.email === email)) {
      return res.status(409).json({ error: 'Telefone ou e-mail já cadastrado.' });
    }

    // Validação básica de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
      email: String(email).slice(0, 100).toLowerCase(),
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
  const { id, nome, email, telefone, saldo, chave_pix, codigo_indicacao, created_at } = user;
  res.json({ user: { id, nome, email, telefone, saldo, chave_pix, codigo_indicacao, created_at } });
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

    const mult = GAME_CONFIG.multiplicador;
    const taxa = GAME_CONFIG.taxa_por_plataforma;
    const valorMeta = money(entrada * mult);
    const valorPorPlataforma = money(entrada * taxa);
    const plataformasParaMeta = Math.ceil(valorMeta / valorPorPlataforma);

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
      dificuldade: 'facil',
      plataformas_passadas: 0,
      status: 'ativa',
      created_at: new Date().toISOString(),
      finished_at: null,
    };
    db.partidas.push(partida);
    saveDb(db);

    console.log(`[GAME] Partida #${partida.id} criada: user=${req.userId} entrada=${entrada} meta=${valorMeta}`);

    res.json({
      partida_id: partida.id,
      valor_entrada: entrada,
      multiplicador_meta: mult,
      valor_meta: valorMeta,
      taxa_por_plataforma: taxa,
      valor_por_plataforma: valorPorPlataforma,
      plataformas_referencia: plataformasParaMeta,
      dificuldade: 'facil',
      is_demo: false,
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

    // 1. Limitar ao máximo configurado
    plats = Math.min(plats, GAME_CONFIG.max_plataformas);

    // 2. Verificar tempo mínimo: se a partida foi criada há X ms, o máximo
    //    de plataformas possíveis é (tempo_decorrido / tempo_minimo_por_plataforma)
    const tempoDecorrido = Date.now() - new Date(partida.created_at).getTime();
    const maxPlatsPerTempo = Math.floor(tempoDecorrido / GAME_CONFIG.tempo_minimo_por_plataforma_ms);
    if (plats > maxPlatsPerTempo) {
      console.warn(`[ANTI-CHEAT] user=${req.userId} partida=${pid} plats_enviadas=${plats} max_por_tempo=${maxPlatsPerTempo} — AJUSTANDO`);
      plats = maxPlatsPerTempo;
    }

    // 3. Limitar ganho máximo a um múltiplo razoável da meta (ex: 3x a meta)
    const ganhoMaxPermitido = money(partida.valor_meta * 3);
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

// ── Depósito via AmploPay PIX ────────────────────────────────────────────────
app.post('/api/financeiro/deposito', authMiddleware, async (req, res) => {
  try {
    const v = money(req.body.valor);
    if (isNaN(v) || v < 10) return res.status(400).json({ error: 'Valor mínimo: R$ 10,00' });
    if (v > 10000) return res.status(400).json({ error: 'Valor máximo: R$ 10.000,00' });

    // Rate limit: 5 depósitos por usuário a cada 10 minutos
    if (!rateLimit(`deposito:${req.userId}`, 5, 600000)) {
      return res.status(429).json({ error: 'Muitas solicitações. Aguarde alguns minutos.' });
    }

    const user = findUser(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    const identifier = `DEP_${req.userId}_${Date.now()}`;

    // Criar cobrança PIX na AmploPay
    const amplopayPayload = {
      identifier,
      amount: v,
      client: {
        name: user.nome,
        email: user.email,
        phone: user.telefone,
        document: user.cpf || '',
      },
      callbackUrl: `${WEBHOOK_BASE_URL}/api/webhooks/amplopay`,
      metadata: {
        user_id: req.userId,
        tipo: 'deposito',
      },
    };

    const amplopayRes = await axios.post(
      `${AMPLOPAY_BASE_URL}/gateway/pix/receive`,
      amplopayPayload,
      { headers: amplopayHeaders, timeout: 15000 }
    );

    const { transactionId, pix } = amplopayRes.data;

    // Registrar transação como pendente (saldo será creditado no webhook)
    const antes = user.saldo;
    db.transacoes.push({
      id: db.nextIds.transacoes++,
      user_id: req.userId,
      tipo: 'deposito',
      valor: v,
      saldo_antes: antes,
      saldo_depois: antes, // ainda não creditado
      status: 'pendente',
      pix_chave: null,
      descricao: 'Depósito PIX',
      gateway_tx_id: transactionId,
      gateway_identifier: identifier,
      created_at: new Date().toISOString(),
    });
    saveDb(db);

    console.log(`[DEPOSITO] PIX criado: user=${req.userId} valor=${v} txid=${transactionId}`);

    res.json({
      txid: transactionId,
      qrcode_imagem: pix?.image || '',
      qrcode_base64: pix?.base64 || '',
      qrcode_texto: pix?.code || '',
      valor: v,
      expiracao_minutos: 30,
      status: 'pendente',
    });
  } catch (err) {
    console.error('[DEPOSITO ERROR]', err.response?.data || err.message);
    const msg = err.response?.data?.message || 'Erro ao gerar cobrança PIX.';
    res.status(500).json({ error: msg });
  }
});

// ── Status do depósito (consulta local + AmploPay) ───────────────────────────
app.get('/api/financeiro/deposito/status/:txid', authMiddleware, async (req, res) => {
  try {
    const txid = String(req.params.txid).slice(0, 200);

    // Verifica status local primeiro
    const tx = db.transacoes.find(
      t => t.gateway_tx_id === txid && t.user_id === req.userId && t.tipo === 'deposito'
    );
    if (!tx) return res.status(404).json({ error: 'Transação não encontrada.' });

    // Se já aprovado localmente, retorna direto
    if (tx.status === 'aprovado') {
      const user = findUser(req.userId);
      return res.json({ status: 'aprovado', txid, valor: tx.valor, saldo_novo: user?.saldo });
    }

    // Consulta AmploPay para status atualizado
    const amplopayRes = await axios.get(
      `${AMPLOPAY_BASE_URL}/gateway/transactions`,
      { headers: amplopayHeaders, params: { id: txid }, timeout: 10000 }
    );

    const txData = Array.isArray(amplopayRes.data) ? amplopayRes.data[0] : amplopayRes.data;

    if (txData && txData.status === 'COMPLETED') {
      // Creditar saldo se ainda pendente
      if (tx.status === 'pendente') {
        const user = findUser(req.userId);
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
        user.saldo = money(user.saldo + tx.valor);
        user.updated_at = new Date().toISOString();
        tx.status = 'aprovado';
        tx.saldo_depois = user.saldo;
        saveDb(db);
        console.log(`[DEPOSITO] Confirmado via polling: user=${req.userId} valor=${tx.valor}`);
        return res.json({ status: 'aprovado', txid, valor: tx.valor, saldo_novo: user.saldo });
      }
    }

    // Mapear status da AmploPay para o status local
    let statusLocal = 'pendente';
    if (txData?.status === 'FAILED' || txData?.status === 'CHARGED_BACK') statusLocal = 'rejeitado';
    if (txData?.status === 'REFUNDED') statusLocal = 'rejeitado';

    res.json({ status: statusLocal, txid });
  } catch (err) {
    console.error('[DEPOSITO STATUS ERROR]', err.response?.data || err.message);
    // Fallback: retorna status local
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

    // SEGURANÇA: Webhook token é OBRIGATÓRIO em produção
    if (!AMPLOPAY_WEBHOOK_TOKEN) {
      console.error('[WEBHOOK] AMPLOPAY_WEBHOOK_TOKEN não configurado! Rejeitando webhook.');
      return res.status(500).json({ error: 'Webhook não configurado.' });
    }

    if (token !== AMPLOPAY_WEBHOOK_TOKEN) {
      console.warn('[WEBHOOK] Token inválido recebido');
      return res.status(401).json({ error: 'Token inválido.' });
    }

    // Validar campos obrigatórios
    if (!event || typeof event !== 'string') {
      return res.status(400).json({ error: 'Evento não informado.' });
    }
    if (!transaction?.id) {
      return res.status(400).json({ error: 'Transação não informada.' });
    }

    // Validar que o evento é um dos esperados
    const eventosValidos = ['TRANSACTION_CREATED', 'TRANSACTION_PAID', 'TRANSACTION_CANCELED', 'TRANSACTION_REFUNDED'];
    if (!eventosValidos.includes(event)) {
      console.warn(`[WEBHOOK] Evento desconhecido: ${event}`);
      return res.status(200).json({ ok: true });
    }

    console.log(`[WEBHOOK] Evento: ${event} | TX: ${transaction.id} | Status: ${transaction?.status}`);

    // Buscar transação local pelo ID do gateway (somente gateway_tx_id, não identifier)
    const tx = db.transacoes.find(t => t.gateway_tx_id === transaction.id);

    if (!tx) {
      console.warn(`[WEBHOOK] Transação não encontrada: ${transaction.id}`);
      return res.status(200).json({ ok: true });
    }

    if (event === 'TRANSACTION_PAID' && tx.status === 'pendente') {
      const user = findUser(tx.user_id);
      if (user) {
        user.saldo = money(user.saldo + tx.valor);
        user.updated_at = new Date().toISOString();
        tx.status = 'aprovado';
        tx.saldo_depois = user.saldo;
        saveDb(db);
        console.log(`[WEBHOOK] Depósito creditado: user=${tx.user_id} valor=${tx.valor} saldo=${user.saldo}`);
      }
    } else if (event === 'TRANSACTION_CANCELED' || event === 'TRANSACTION_REFUNDED') {
      if (tx.status === 'aprovado') {
        const user = findUser(tx.user_id);
        if (user) {
          user.saldo = money(user.saldo - tx.valor);
          user.updated_at = new Date().toISOString();
          tx.status = 'rejeitado';
          tx.saldo_depois = user.saldo;
          saveDb(db);
          console.log(`[WEBHOOK] Depósito estornado: user=${tx.user_id} valor=${tx.valor}`);
        }
      } else {
        tx.status = 'rejeitado';
        saveDb(db);
      }
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[WEBHOOK ERROR]', err);
    res.status(200).json({ ok: true });
  }
});

app.post('/api/financeiro/saque', authMiddleware, (req, res) => {
  try {
    const { valor, chave_pix } = req.body;
    const v = money(valor);
    if (isNaN(v) || v < 20) return res.status(400).json({ error: 'Valor mínimo para saque: R$ 20,00' });
    if (v > 50000) return res.status(400).json({ error: 'Valor máximo para saque: R$ 50.000,00' });
    if (!chave_pix || String(chave_pix).trim().length < 3) return res.status(400).json({ error: 'Informe uma chave PIX válida.' });

    // Rate limit: 3 saques por hora
    if (!rateLimit(`saque:${req.userId}`, 3, 3600000)) {
      return res.status(429).json({ error: 'Muitas solicitações de saque. Aguarde.' });
    }

    const user = findUser(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    if (user.saldo < v) return res.status(400).json({ error: 'Saldo insuficiente.' });

    const antes = user.saldo;
    user.saldo = money(user.saldo - v);
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
    res.json({ ok: true, message: 'Saque solicitado com sucesso.', saldo_novo: user.saldo });
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
    .map(({ gateway_tx_id, gateway_identifier, ...safe }) => safe); // Não expor IDs internos do gateway
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
app.listen(PORT, '0.0.0.0', () => {
  const warnings = [];
  if (!AMPLOPAY_PUBLIC_KEY) warnings.push('AMPLOPAY_PUBLIC_KEY');
  if (!AMPLOPAY_SECRET_KEY) warnings.push('AMPLOPAY_SECRET_KEY');
  if (!AMPLOPAY_WEBHOOK_TOKEN) warnings.push('AMPLOPAY_WEBHOOK_TOKEN');
  if (JWT_SECRET === 'clone_demo_secret_key_2026') warnings.push('JWT_SECRET (usando padrão!)');

  console.log('');
  console.log('  ╔══════════════════════════════════════════════════════╗');
  console.log(`  ║  HELIXWINS — Gateway AmploPay                       ║`);
  console.log(`  ║  http://localhost:${PORT}                              ║`);
  console.log('  ║  Backend: JSON database     Frontend: local files   ║');
  console.log(`  ║  Users: ${db.users.length}    Partidas: ${db.partidas.length}                          ║`);
  console.log('  ╚══════════════════════════════════════════════════════╝');
  if (warnings.length > 0) {
    console.log('');
    console.log('  ⚠ VARIÁVEIS NÃO CONFIGURADAS:');
    warnings.forEach(w => console.log(`    - ${w}`));
    console.log('  Configure no .env para produção.');
  }
  console.log('');
});
