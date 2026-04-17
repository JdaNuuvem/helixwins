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
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error('[FATAL] JWT_SECRET não definido em produção. Defina a variável de ambiente JWT_SECRET.');
  process.exit(1);
}
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
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

// Batching + atomic write para escalar o lowdb sob alta concorrência.
// Em vez de escrever o JSON inteiro de forma síncrona a cada chamada,
// agendamos uma escrita única em ~250ms (debounce). Múltiplas mutações
// no mesmo tick consolidam num único fsync.
//
// Em test mode usa write síncrono (testes esperam consistência imediata).
// Em produção, garante flush em SIGTERM/SIGINT/uncaughtException antes de sair.
let _saveScheduled = false;
let _saveLastData = null;
const SAVE_DEBOUNCE_MS = 250;

function _writeAtomicSync(data) {
  // Write em arquivo temporário + rename atômico (evita corrupção em crash)
  const tmp = DB_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmp, DB_FILE);
}

function _flushSave() {
  if (!_saveLastData) return;
  try {
    _writeAtomicSync(_saveLastData);
  } catch (err) {
    console.error('[DB] flush failed:', err.message);
  }
  _saveLastData = null;
  _saveScheduled = false;
}

function saveDb(data) {
  // Em test mode: escrita síncrona (comportamento legado)
  if (process.env.NODE_ENV === 'test') {
    _writeAtomicSync(data);
    return;
  }
  // Modo normal: agenda flush debounced
  _saveLastData = data;
  if (_saveScheduled) return;
  _saveScheduled = true;
  setTimeout(_flushSave, SAVE_DEBOUNCE_MS);
}

// Garante flush antes de o processo terminar
function _gracefulShutdown(signal) {
  console.log(`[DB] ${signal} recebido — flushing...`);
  _flushSave();
  process.exit(0);
}
process.on('SIGTERM', () => _gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => _gracefulShutdown('SIGINT'));
process.on('uncaughtException', (err) => {
  console.error('[FATAL] uncaughtException:', err);
  _flushSave();
  process.exit(1);
});

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
  const active = db.gateway_config.active || 'paradisepags';
  // Se o ativo está desativado (ex: amplopay em desenvolvimento), cai pro paradisepags automaticamente
  const adapter = (typeof GATEWAY_ADAPTERS !== 'undefined') ? GATEWAY_ADAPTERS[active] : null;
  if (adapter && adapter.disabled) return 'paradisepags';
  return active;
}

function getAmplopayHeaders() {
  const conf = getGatewayConfig('amplopay');
  return {
    'Content-Type': 'application/json',
    'x-public-key': conf.public_key,
    'x-secret-key': conf.secret_key,
  };
}

// ─── Seed admins via .env (senhas NUNCA hardcoded no código) ─────────────────
const ADMIN_SEEDS = [
  { tel: process.env.ADMIN1_TEL, nome: process.env.ADMIN1_NOME || 'Admin', email: process.env.ADMIN1_EMAIL || '', senha: process.env.ADMIN1_SENHA, cpf: process.env.ADMIN1_CPF || '' },
  { tel: process.env.SUPER_ADMIN_TELEFONE, nome: process.env.SUPER_ADMIN_NOME || 'Super Admin', email: process.env.SUPER_ADMIN_EMAIL || '', senha: process.env.SUPER_ADMIN_SENHA, cpf: process.env.SUPER_ADMIN_CPF || '' },
  { tel: process.env.ADMIN2_TEL, nome: process.env.ADMIN2_NOME || 'Admin 2', email: process.env.ADMIN2_EMAIL || '', senha: process.env.ADMIN2_SENHA, cpf: process.env.ADMIN2_CPF || '' },
];
ADMIN_SEEDS.forEach(seed => {
  if (!seed.tel || !seed.senha) return;
  if (db.users.find(u => u.telefone === seed.tel)) return;
  const hash = bcrypt.hashSync(seed.senha, SALT_ROUNDS);
  db.users.push({
    id: db.nextIds.users++,
    nome: seed.nome,
    email: seed.email,
    telefone: seed.tel,
    cpf: seed.cpf,
    senha_hash: hash,
    saldo: 0,
    saldo_afiliado: 0,
    chave_pix: null,
    codigo_indicacao: generateReferralCode(),
    indicado_por: null,
    ativo: 1,
    admin: 1,
    role: 'super_admin',
    prospectador_id: null,
    comissao_config: null,
    demo: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  saveDb(db);
  console.log(`[SEED] Admin criado: ${seed.tel}`);
});

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

// ─── Upsells ─────────────────────────────────────────────────────────────────
const UPSELL_CONFIG = {
  // Seguro de partida: paga +30% da entrada, recebe 50% de volta se perder
  seguro: { enabled: true, custo_perc: 0.30, reembolso_perc: 0.50 },
  // Deposito VIP: faixas de bonus por valor
  deposito_vip: {
    enabled: true,
    faixas: [
      { min: 50,  max: 99,   multiplicador: 2 },
      { min: 100, max: 199,  multiplicador: 2 },
      { min: 200, max: 499,  multiplicador: 2.5 },
      { min: 500, max: 99999, multiplicador: 3 },
    ],
  },
  // Revanche: bonus de 20% na entrada ao jogar novamente apos derrota
  revanche: { enabled: true, bonus_perc: 0.20 },
  // Streak: bonus por sequencia de partidas no dia
  streak: { enabled: true, metas: [{ partidas: 5, bonus: 2 }, { partidas: 10, bonus: 5 }] },
  // Cashback semanal: % das perdas liquidas da semana
  cashback: { enabled: true, percentual: 0.05, minimo_perda: 20 },
  // Meta diaria: jogue X partidas e ganhe bonus
  meta_diaria: { enabled: true, partidas_necessarias: 3, bonus: 3 },
  // Dobrar ou Nada: coin flip após vitória
  dobrar_ou_nada: { enabled: true },
  // Pacote de Vidas: compra vidas para continuar jogando após morte
  pacote_vidas: { enabled: true, preco: 10, quantidade: 3 },
  // Modo Turbo: +50% entrada, 1.5x mais por plataforma
  modo_turbo: { enabled: true, custo_perc: 0.50, ganho_mult: 1.5 },
  // Ranking semanal: top jogadores ganham prêmios
  ranking: { enabled: true, premios: [5, 3, 2, 1, 1, 1, 1, 1, 1, 1] },
  // Presente para amigo: enviar saldo
  presente: { enabled: true, valores: [5, 10, 20], minimo_deposito: 20 },
};

// ─── Comissão de Afiliados ───────────────────────────────────────────────────
const COMISSAO_CONFIG = {
  nivel1_perc: 0.10,  // 10% do depósito — quem indicou direto (geralmente o influencer)
  nivel2_perc: 0.03,  // 3%  do depósito — segundo nível na cadeia (geralmente o gerente)
  nivel3_perc: 0.01,  // 1%  do depósito — terceiro nível na cadeia
  bonus_primeiro_deposito: 2, // R$2 bônus fixo no 1º depósito do indicado (sempre 100% pro N1)
  // Split N1 (soma com super_admin_perc = 100%):
  //   parte_sa = comissao_n1 * super_admin_perc      (SA global — lido de db.config)
  //   parte_infl = comissao_n1 * influencer_perc     (configurável pelo gerente)
  //   parte_gerente = comissao_n1 - parte_sa - parte_infl  (derivado)
  influencer_perc: 0.30,  // 30% do total da comissão N1 vai pro influencer (padrão)
  super_admin_perc: 0.20, // 20% do total da comissão N1 vai pro super admin (padrão; editável)
};

// Roles (hierarquia):
//   super_admin → recebe 100% da comissão quando é "vez do split" (configurado em ctrl-sp)
//   gerente     → recebe 60% override sobre comissões dos influencers que cadastrou; tem painel próprio
//   influencer  → indicado por um gerente; recebe 40% das próprias comissões (60% vai pro gerente)
//   jogador     → usuário comum (default); sem acesso a painel de gerente
const ROLES = ['super_admin', 'gerente', 'influencer', 'jogador'];

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

// ─── Config global do super_admin (dificuldade do jogo) ─────────────────────
if (!db.config) { db.config = {}; saveDb(db); }
if (!db.config.dificuldade_global) { db.config.dificuldade_global = 'normal'; saveDb(db); }
if (!db.config.dificuldade_demo)   { db.config.dificuldade_demo   = 'facil';  saveDb(db); }

// ─── Audit Log ────────────────────────────────────────────────────────────────
if (!db.audit_log) { db.audit_log = []; saveDb(db); }
if (!db.nextIds.audit_log) { db.nextIds.audit_log = 1; saveDb(db); }

function auditLog(action, actorId, targetId, details, req) {
  try {
    const entry = {
      id: db.nextIds.audit_log++,
      action,
      actor_id: actorId || null,
      target_id: targetId || null,
      details: details || null,
      ip: req ? (req.headers['x-forwarded-for'] || req.ip || req.connection?.remoteAddress || null) : null,
      ua: req ? (req.headers['user-agent'] || null) : null,
      created_at: new Date().toISOString(),
    };
    db.audit_log.push(entry);
    // Manter só os últimos 5000 registros para não inchar o db
    if (db.audit_log.length > 5000) db.audit_log = db.audit_log.slice(-5000);
    saveDb(db);
    console.log(`[AUDIT] ${action} actor=${actorId} target=${targetId || '-'} ${details ? JSON.stringify(details) : ''}`);
  } catch (err) {
    console.error('[AUDIT ERROR]', err);
  }
}

// ─── CSRF Protection (double-submit cookie) ──────────────────────────────────
const CSRF_COOKIE = '_csrf';
const CSRF_HEADER = 'x-csrf-token';

function ensureCsrfCookie(req, res, next) {
  // Garante que existe um token CSRF no cookie do browser (legível pelo JS)
  if (!req.cookies[CSRF_COOKIE]) {
    const token = crypto.randomBytes(24).toString('hex');
    res.cookie(CSRF_COOKIE, token, {
      httpOnly: false, // intencionalmente legível pelo JS pra ser ecoado no header
      secure: IS_PROD,
      sameSite: IS_PROD ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    req.cookies[CSRF_COOKIE] = token;
  }
  next();
}

function csrfMiddleware(req, res, next) {
  // Skip total em test mode (suite de testes não maneja cookies CSRF)
  if (process.env.NODE_ENV === 'test') return next();
  // Só protege métodos mutativos
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) return next();
  // Webhooks não vêm de browser — pulam CSRF (já têm assinatura própria)
  if (req.path.startsWith('/api/webhooks/')) return next();
  // Login/register: o cookie ainda não existe na primeira request — emitir e seguir
  if (req.path === '/api/auth/login' || req.path === '/api/auth/register') return next();
  // Painel de split: auth própria (user/pass + token x-sp-tk) + rate limit
  if (req.path.startsWith('/api/_c/')) return next();

  const cookieToken = req.cookies[CSRF_COOKIE];
  const headerToken = req.headers[CSRF_HEADER] || req.headers['X-CSRF-Token'];
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ error: 'CSRF token inválido ou ausente.' });
  }
  next();
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

// ─── Security Headers (CSP, X-Frame, etc.) ───────────────────────────────────
app.use((req, res, next) => {
  // Content Security Policy — bloqueia scripts/styles de origens externas
  // 'unsafe-inline' mantido por compat com inline handlers/styles existentes (defesa em profundidade junto com escape de input)
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    // 'self' permite scripts internos; domínios Kwai liberados para o pixel de tracking
    "script-src 'self' 'unsafe-inline' https://s21-def.ap4r.com https://s21-def.ks-la.net",
    "script-src-elem 'self' 'unsafe-inline' https://s21-def.ap4r.com https://s21-def.ks-la.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://s21-def.ap4r.com https://s21-def.ks-la.net",
    // 'self' permite o iframe do jogo (/jogo) embutido na própria origem
    "frame-src 'self'",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; '));
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // SAMEORIGIN permite iframe na mesma origem (necessário para /jogo dentro do painel)
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()');
  if (IS_PROD) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

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
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token, X-SP-TK');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// CSRF: emite cookie e valida em métodos mutativos
app.use(ensureCsrfCookie);
app.use(csrfMiddleware);

// ═══ PUBLIC CONFIG ════════════════════════════════════════════════════════════
app.get('/api/public/config', (_req, res) => {
  res.json(SITE_CONFIG);
});

// ── Ranking público do dia (ganhos reais + jogadores falsos no top 3) ───────
app.get('/api/public/ranking', (_req, res) => {
  const hoje = new Date().toISOString().slice(0, 10);

  // Calcular ganhos reais de cada usuário hoje
  const ganhosHoje = {};
  db.transacoes.forEach(t => {
    if (t.created_at?.slice(0, 10) !== hoje) return;
    if (t.tipo === 'ganho_partida' && t.status === 'aprovado') {
      ganhosHoje[t.user_id] = (ganhosHoje[t.user_id] || 0) + t.valor;
    }
  });

  // Montar array de jogadores reais com ganhos > 0
  const reais = Object.entries(ganhosHoje)
    .map(([uid, ganho]) => {
      const u = findUser(parseInt(uid));
      if (!u || u.admin || u.demo) return null;
      const nome = u.nome || 'Jogador';
      const primeiro = nome.split(' ')[0];
      const inicial = nome.split(' ').length > 1 ? nome.split(' ')[1][0] + '.' : '';
      return { user_id: parseInt(uid), nome: `${primeiro} ${inicial}`.trim(), ganho: money(ganho) };
    })
    .filter(Boolean)
    .sort((a, b) => b.ganho - a.ganho);

  // Jogadores falsos determinísticos por dia (seed)
  let _h = 0;
  for (let i = 0; i < hoje.length; i++) _h = ((_h << 5) - _h + hoje.charCodeAt(i)) | 0;
  const _rng = () => { _h = (_h * 16807) % 2147483647; return (_h & 0x7fffffff) / 2147483647; };

  const nomesFake = ['Rafael M.','Juliana S.','Pedro H.','Camila R.','Bruno L.','Fernanda A.','Diego C.','Larissa P.','Thiago F.','Amanda B.','Marcos V.','Patricia G.'];
  const fakes = [];
  for (let i = 0; i < 3; i++) {
    const idx = Math.floor(_rng() * nomesFake.length);
    const nome = nomesFake.splice(idx, 1)[0];
    // Garantir que fakes tenham ganhos maiores que qualquer real
    const maxReal = reais.length > 0 ? reais[0].ganho : 100;
    const ganho = money(maxReal + 50 + (3 - i) * 40 + _rng() * 80);
    fakes.push({ nome, ganho, fake: true });
  }
  fakes.sort((a, b) => b.ganho - a.ganho);

  // Montar ranking: 3 fakes no top + reais (até 7)
  const ranking = [...fakes, ...reais.slice(0, 7)]
    .map(({ fake, ...safe }) => safe); // Não expor flag fake

  res.json({ ranking, data: hoje });
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

    // Rate limit: 10 tentativas de login por telefone a cada 15 minutos
    if (!rateLimit(`login:${rawPhone}`, 20, 900000)) {
      return res.status(429).json({ error: 'Muitas tentativas. Aguarde 15 minutos.' });
    }

    // Busca por telefone limpo (numeros) ou pelo valor exato (para logins como russoadm)
    const user = db.users.find(u => u.telefone === cleanPhone || u.telefone === rawPhone);
    if (!user) {
      auditLog('login.fail', null, null, { telefone: cleanPhone, motivo: 'user_not_found' }, req);
      return res.status(401).json({ error: 'Telefone ou senha incorretos.' });
    }
    if (!user.ativo) {
      auditLog('login.fail', null, user.id, { motivo: 'inativo' }, req);
      return res.status(403).json({ error: 'Conta desativada.' });
    }
    if (!bcrypt.compareSync(senha, user.senha_hash)) {
      auditLog('login.fail', null, user.id, { motivo: 'senha_incorreta' }, req);
      return res.status(401).json({ error: 'Telefone ou senha incorretos.' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    setAuthCookie(res, token);
    auditLog('login.ok', user.id, null, { role: user.role }, req);
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
    if (!rateLimit(`register:${ip}`, 1000, 3600000)) {
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
      indicado_por: null, // preenchido abaixo após validação
      ativo: 1,
      admin: 0,
      role: 'jogador',
      prospectador_id: null,
      comissao_config: null,
      demo: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    // Validar indicação: não pode ser o próprio código e deve existir
    if (codigo_indicacao && codigo_indicacao !== user.codigo_indicacao) {
      const referrer = db.users.find(u => u.codigo_indicacao === codigo_indicacao);
      if (referrer) {
        user.indicado_por = codigo_indicacao;
        // Se o link é de um gerente, a conta nova já nasce como influencer dele
        if (referrer.role === 'gerente') {
          user.role = 'influencer';
          user.prospectador_id = referrer.id;
          console.log(`[AFILIADO] Auto-promoção: novo influencer=${user.id} (${user.nome}) vinculado ao gerente=${referrer.id}`);
        }
      }
    }
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
  const { id, nome, email, telefone, saldo, saldo_afiliado, chave_pix, codigo_indicacao, created_at, admin, demo, role, prospectador_id } = user;
  res.json({ user: { id, nome, email, telefone, saldo, saldo_afiliado, chave_pix, codigo_indicacao, created_at, admin: !!admin, demo: !!demo, role: role || (admin ? 'admin' : 'jogador'), prospectador_id: prospectador_id || null } });
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
    // Upsell: bônus VIP por faixa de valor
    deposit_bonus: DEPOSIT_BONUS.enabled ? {
      eligible_amounts: DEPOSIT_BONUS.eligible_amounts,
      multiplier: DEPOSIT_BONUS.multiplier,
      faixas_vip: UPSELL_CONFIG.deposito_vip.enabled ? UPSELL_CONFIG.deposito_vip.faixas : null,
    } : null,
  });
});

app.get('/api/user/suporte', authMiddleware, (_req, res) => {
  res.json({ links: [{ nome: 'Canal Telegram', url: 'https://t.me' }, { nome: 'Suporte', url: 'https://wa.me/+5521' }] });
});

// ─── Upsell: info dos upsells disponíveis ─────────────────────────────────────
app.get('/api/upsell/info', authMiddleware, (req, res) => {
  const user = findUser(req.userId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

  const hoje = new Date().toISOString().slice(0, 10);

  // Streak: partidas jogadas hoje
  const partidasHoje = db.partidas.filter(p =>
    p.user_id === req.userId && p.status !== 'ativa' && p.created_at?.slice(0, 10) === hoje
  ).length;

  // Meta diária: já resgatou hoje?
  const metaResgatadaHoje = db.transacoes.some(t =>
    t.user_id === req.userId && t.tipo === 'bonus_meta_diaria' && t.created_at?.slice(0, 10) === hoje
  );

  // Cashback: perdas líquidas da semana
  const umaSemanaAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const perdasSemana = db.transacoes
    .filter(t => t.user_id === req.userId && t.tipo === 'perda_partida' && t.created_at >= umaSemanaAtras)
    .reduce((s, t) => s + t.valor, 0);
  const ganhosSemana = db.transacoes
    .filter(t => t.user_id === req.userId && t.tipo === 'ganho_partida' && t.created_at >= umaSemanaAtras)
    .reduce((s, t) => s + t.valor, 0);
  const perdaLiquida = Math.max(0, perdasSemana - ganhosSemana);
  const cashbackDisponivel = perdaLiquida >= UPSELL_CONFIG.cashback.minimo_perda
    ? money(perdaLiquida * UPSELL_CONFIG.cashback.percentual) : 0;
  const cashbackResgatadoSemana = db.transacoes.some(t =>
    t.user_id === req.userId && t.tipo === 'bonus_cashback' && t.created_at >= umaSemanaAtras
  );

  // Streak bonuses disponíveis
  const streakBonuses = UPSELL_CONFIG.streak.metas.map(m => ({
    partidas: m.partidas, bonus: m.bonus,
    atingida: partidasHoje >= m.partidas,
    resgatada: db.transacoes.some(t =>
      t.user_id === req.userId && t.tipo === 'bonus_streak' && t.descricao?.includes(`${m.partidas}p`) && t.created_at?.slice(0, 10) === hoje
    ),
  }));

  res.json({
    seguro: UPSELL_CONFIG.seguro.enabled ? { custo_perc: UPSELL_CONFIG.seguro.custo_perc, reembolso_perc: UPSELL_CONFIG.seguro.reembolso_perc } : null,
    deposito_vip: UPSELL_CONFIG.deposito_vip.enabled ? { faixas: UPSELL_CONFIG.deposito_vip.faixas } : null,
    revanche: UPSELL_CONFIG.revanche.enabled ? { bonus_perc: UPSELL_CONFIG.revanche.bonus_perc } : null,
    streak: UPSELL_CONFIG.streak.enabled ? { partidas_hoje: partidasHoje, bonuses: streakBonuses } : null,
    cashback: UPSELL_CONFIG.cashback.enabled ? { perda_liquida: perdaLiquida, valor: cashbackDisponivel, ja_resgatou: cashbackResgatadoSemana } : null,
    meta_diaria: UPSELL_CONFIG.meta_diaria.enabled ? {
      partidas_necessarias: UPSELL_CONFIG.meta_diaria.partidas_necessarias,
      partidas_hoje: partidasHoje,
      bonus: UPSELL_CONFIG.meta_diaria.bonus,
      completa: partidasHoje >= UPSELL_CONFIG.meta_diaria.partidas_necessarias,
      resgatada: metaResgatadaHoje,
    } : null,
    dobrar_ou_nada: UPSELL_CONFIG.dobrar_ou_nada.enabled,
    pacote_vidas: UPSELL_CONFIG.pacote_vidas.enabled ? { preco: UPSELL_CONFIG.pacote_vidas.preco, quantidade: UPSELL_CONFIG.pacote_vidas.quantidade, vidas_atuais: user.vidas || 0 } : null,
    modo_turbo: UPSELL_CONFIG.modo_turbo.enabled ? { custo_perc: UPSELL_CONFIG.modo_turbo.custo_perc, ganho_mult: UPSELL_CONFIG.modo_turbo.ganho_mult } : null,
    ranking: UPSELL_CONFIG.ranking.enabled,
    presente: UPSELL_CONFIG.presente.enabled ? { valores: UPSELL_CONFIG.presente.valores } : null,
  });
});

// ─── Upsell: resgatar cashback semanal ─────────────────────────────────────
app.post('/api/upsell/cashback', authMiddleware, (req, res) => {
  const user = findUser(req.userId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
  if (!UPSELL_CONFIG.cashback.enabled) return res.status(400).json({ error: 'Cashback desativado.' });

  const umaSemanaAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  if (db.transacoes.some(t => t.user_id === req.userId && t.tipo === 'bonus_cashback' && t.created_at >= umaSemanaAtras)) {
    return res.status(400).json({ error: 'Cashback já resgatado esta semana.' });
  }

  const perdas = db.transacoes.filter(t => t.user_id === req.userId && t.tipo === 'perda_partida' && t.created_at >= umaSemanaAtras).reduce((s, t) => s + t.valor, 0);
  const ganhos = db.transacoes.filter(t => t.user_id === req.userId && t.tipo === 'ganho_partida' && t.created_at >= umaSemanaAtras).reduce((s, t) => s + t.valor, 0);
  const perdaLiquida = Math.max(0, perdas - ganhos);
  if (perdaLiquida < UPSELL_CONFIG.cashback.minimo_perda) return res.status(400).json({ error: `Perda mínima de R$${UPSELL_CONFIG.cashback.minimo_perda} para cashback.` });

  const valor = money(perdaLiquida * UPSELL_CONFIG.cashback.percentual);
  const antes = user.saldo;
  user.saldo = money(user.saldo + valor);
  user.updated_at = new Date().toISOString();
  db.transacoes.push({ id: db.nextIds.transacoes++, user_id: req.userId, tipo: 'bonus_cashback', valor, saldo_antes: antes, saldo_depois: user.saldo, status: 'aprovado', pix_chave: null, descricao: `Cashback semanal (${Math.round(UPSELL_CONFIG.cashback.percentual * 100)}%)`, created_at: new Date().toISOString() });
  saveDb(db);
  res.json({ ok: true, valor, saldo_novo: user.saldo });
});

// ─── Upsell: resgatar streak bonus ─────────────────────────────────────────
app.post('/api/upsell/streak', authMiddleware, (req, res) => {
  const user = findUser(req.userId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
  if (!UPSELL_CONFIG.streak.enabled) return res.status(400).json({ error: 'Streak desativado.' });

  const hoje = new Date().toISOString().slice(0, 10);
  const partidasHoje = db.partidas.filter(p => p.user_id === req.userId && p.status !== 'ativa' && p.created_at?.slice(0, 10) === hoje).length;
  const metaIdx = parseInt(req.body.meta_index);
  const meta = UPSELL_CONFIG.streak.metas[metaIdx];
  if (!meta) return res.status(400).json({ error: 'Meta inválida.' });
  if (partidasHoje < meta.partidas) return res.status(400).json({ error: `Jogue ${meta.partidas} partidas para resgatar.` });
  if (db.transacoes.some(t => t.user_id === req.userId && t.tipo === 'bonus_streak' && t.descricao?.includes(`${meta.partidas}p`) && t.created_at?.slice(0, 10) === hoje)) {
    return res.status(400).json({ error: 'Streak já resgatado hoje.' });
  }

  const antes = user.saldo;
  user.saldo = money(user.saldo + meta.bonus);
  user.updated_at = new Date().toISOString();
  db.transacoes.push({ id: db.nextIds.transacoes++, user_id: req.userId, tipo: 'bonus_streak', valor: meta.bonus, saldo_antes: antes, saldo_depois: user.saldo, status: 'aprovado', pix_chave: null, descricao: `Streak bonus (${meta.partidas}p)`, created_at: new Date().toISOString() });
  saveDb(db);
  res.json({ ok: true, valor: meta.bonus, saldo_novo: user.saldo });
});

// ─── Upsell: resgatar meta diária ──────────────────────────────────────────
app.post('/api/upsell/meta-diaria', authMiddleware, (req, res) => {
  const user = findUser(req.userId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
  if (!UPSELL_CONFIG.meta_diaria.enabled) return res.status(400).json({ error: 'Meta diária desativada.' });

  const hoje = new Date().toISOString().slice(0, 10);
  const partidasHoje = db.partidas.filter(p => p.user_id === req.userId && p.status !== 'ativa' && p.created_at?.slice(0, 10) === hoje).length;
  if (partidasHoje < UPSELL_CONFIG.meta_diaria.partidas_necessarias) return res.status(400).json({ error: `Jogue ${UPSELL_CONFIG.meta_diaria.partidas_necessarias} partidas para resgatar.` });
  if (db.transacoes.some(t => t.user_id === req.userId && t.tipo === 'bonus_meta_diaria' && t.created_at?.slice(0, 10) === hoje)) {
    return res.status(400).json({ error: 'Meta diária já resgatada hoje.' });
  }

  const bonus = UPSELL_CONFIG.meta_diaria.bonus;
  const antes = user.saldo;
  user.saldo = money(user.saldo + bonus);
  user.updated_at = new Date().toISOString();
  db.transacoes.push({ id: db.nextIds.transacoes++, user_id: req.userId, tipo: 'bonus_meta_diaria', valor: bonus, saldo_antes: antes, saldo_depois: user.saldo, status: 'aprovado', pix_chave: null, descricao: `Meta diária (${UPSELL_CONFIG.meta_diaria.partidas_necessarias} partidas)`, created_at: new Date().toISOString() });
  saveDb(db);
  res.json({ ok: true, valor: bonus, saldo_novo: user.saldo });
});

// ─── Upsell: Dobrar ou Nada (coin flip após vitória) ───────────────────────
app.post('/api/upsell/dobrar-ou-nada', authMiddleware, (req, res) => {
  try {
    if (!rateLimit(`dobrar:${req.userId}`, 120, 60000)) {
      return res.status(429).json({ error: 'Muitas tentativas. Aguarde.' });
    }
    const user = findUser(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    if (!UPSELL_CONFIG.dobrar_ou_nada.enabled) return res.status(400).json({ error: 'Dobrar ou Nada desativado.' });

    const { valor } = req.body;
    const v = money(valor);
    if (isNaN(v) || v <= 0) return res.status(400).json({ error: 'Valor inválido.' });
    if (v > user.saldo) return res.status(400).json({ error: 'Saldo insuficiente.' });

    const antes = user.saldo;
    const ganhou = Math.random() < 0.5;

    if (ganhou) {
      user.saldo = money(user.saldo + v);
      db.transacoes.push({ id: db.nextIds.transacoes++, user_id: req.userId, tipo: 'ganho_partida', valor: v, saldo_antes: antes, saldo_depois: user.saldo, status: 'aprovado', pix_chave: null, descricao: `Dobrar ou Nada (ganhou)`, created_at: new Date().toISOString() });
    } else {
      user.saldo = money(user.saldo - v);
      db.transacoes.push({ id: db.nextIds.transacoes++, user_id: req.userId, tipo: 'perda_partida', valor: v, saldo_antes: antes, saldo_depois: user.saldo, status: 'aprovado', pix_chave: null, descricao: `Dobrar ou Nada (perdeu)`, created_at: new Date().toISOString() });
    }
    user.updated_at = new Date().toISOString();
    saveDb(db);
    console.log(`[DOBRAR] user=${req.userId} valor=R$${v} resultado=${ganhou ? 'GANHOU' : 'PERDEU'} saldo=${user.saldo}`);
    res.json({ ganhou, valor: v, saldo_novo: user.saldo });
  } catch (err) { console.error('[DOBRAR ERROR]', err); res.status(500).json({ error: 'Erro interno.' }); }
});

// ─── Upsell: Comprar Pacote de Vidas ───────────────────────────────────────
app.post('/api/upsell/comprar-vidas', authMiddleware, (req, res) => {
  try {
    const user = findUser(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    if (!UPSELL_CONFIG.pacote_vidas.enabled) return res.status(400).json({ error: 'Pacote de vidas desativado.' });

    const preco = UPSELL_CONFIG.pacote_vidas.preco;
    const qtd = UPSELL_CONFIG.pacote_vidas.quantidade;
    if (user.saldo < preco) return res.status(400).json({ error: 'Saldo insuficiente.' });

    const antes = user.saldo;
    user.saldo = money(user.saldo - preco);
    user.vidas = (user.vidas || 0) + qtd;
    user.updated_at = new Date().toISOString();
    db.transacoes.push({ id: db.nextIds.transacoes++, user_id: req.userId, tipo: 'compra_vidas', valor: preco, saldo_antes: antes, saldo_depois: user.saldo, status: 'aprovado', pix_chave: null, descricao: `Pacote de ${qtd} vidas`, created_at: new Date().toISOString() });
    saveDb(db);
    console.log(`[VIDAS] user=${req.userId} comprou ${qtd} vidas por R$${preco}, total=${user.vidas}`);
    res.json({ ok: true, vidas: user.vidas, saldo_novo: user.saldo });
  } catch (err) { console.error('[VIDAS ERROR]', err); res.status(500).json({ error: 'Erro interno.' }); }
});

// ─── Upsell: Usar Vida (continuar jogando após morte) ──────────────────────
app.post('/api/upsell/usar-vida', authMiddleware, (req, res) => {
  try {
    const user = findUser(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    if (!user.vidas || user.vidas <= 0) return res.status(400).json({ error: 'Você não tem vidas disponíveis.' });

    const { partida_id } = req.body;
    const pid = parseInt(partida_id);
    const partida = db.partidas.find(p => p.id === pid && p.user_id === req.userId && p.status === 'ativa');
    if (!partida) return res.status(404).json({ error: 'Partida ativa não encontrada.' });

    user.vidas--;
    partida.vidas_usadas = (partida.vidas_usadas || 0) + 1;
    user.updated_at = new Date().toISOString();
    saveDb(db);
    console.log(`[VIDA] user=${req.userId} usou vida na partida #${pid}, restam=${user.vidas}`);
    res.json({ ok: true, vidas_restantes: user.vidas });
  } catch (err) { console.error('[VIDA ERROR]', err); res.status(500).json({ error: 'Erro interno.' }); }
});

// ─── Upsell: Ranking Semanal ───────────────────────────────────────────────
app.get('/api/upsell/ranking', authMiddleware, (_req, res) => {
  if (!UPSELL_CONFIG.ranking.enabled) return res.json({ ranking: [], premios: [] });

  const umaSemanaAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const stats = {};
  db.partidas
    .filter(p => p.status !== 'ativa' && p.created_at >= umaSemanaAtras && !p.is_demo)
    .forEach(p => {
      if (!stats[p.user_id]) stats[p.user_id] = { plataformas: 0, partidas: 0 };
      stats[p.user_id].plataformas += (p.plataformas_passadas || 0);
      stats[p.user_id].partidas++;
    });

  const ranking = Object.entries(stats)
    .map(([uid, s]) => {
      const u = findUser(parseInt(uid));
      return { user_id: parseInt(uid), nome: u ? u.nome.split(' ')[0] + (u.nome.split(' ').length > 1 ? ' ' + u.nome.split(' ')[1][0] + '.' : '') : 'Jogador', plataformas: s.plataformas, partidas: s.partidas };
    })
    .sort((a, b) => b.plataformas - a.plataformas)
    .slice(0, 10);

  res.json({ ranking, premios: UPSELL_CONFIG.ranking.premios });
});

// ─── Upsell: Presente para Amigo ───────────────────────────────────────────
app.post('/api/upsell/presente', authMiddleware, (req, res) => {
  try {
    const user = findUser(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    if (!UPSELL_CONFIG.presente.enabled) return res.status(400).json({ error: 'Presentes desativados.' });

    const { valor, telefone_destino } = req.body;
    const v = money(valor);
    if (!UPSELL_CONFIG.presente.valores.includes(v)) return res.status(400).json({ error: 'Valor inválido.' });

    // Precisa ter depositado pelo menos R$20
    const temDeposito = db.transacoes.some(t => t.user_id === req.userId && t.tipo === 'deposito' && t.status === 'aprovado' && t.valor >= UPSELL_CONFIG.presente.minimo_deposito);
    if (!temDeposito) return res.status(400).json({ error: `Deposite pelo menos R$${UPSELL_CONFIG.presente.minimo_deposito} para enviar presentes.` });
    if (user.saldo < v) return res.status(400).json({ error: 'Saldo insuficiente.' });

    const cleanPhone = String(telefone_destino).replace(/\D/g, '');
    const destino = db.users.find(u => u.telefone === cleanPhone);
    if (!destino) return res.status(404).json({ error: 'Destinatário não encontrado. Ele precisa ter uma conta.' });
    if (destino.id === req.userId) return res.status(400).json({ error: 'Você não pode enviar presente para si mesmo.' });

    // Rate limit: 5 presentes por dia
    if (!rateLimit(`presente:${req.userId}`, 5, 86400000)) return res.status(429).json({ error: 'Limite de presentes diários atingido.' });

    const antesEnv = user.saldo;
    user.saldo = money(user.saldo - v);
    user.updated_at = new Date().toISOString();
    db.transacoes.push({ id: db.nextIds.transacoes++, user_id: req.userId, tipo: 'presente_enviado', valor: v, saldo_antes: antesEnv, saldo_depois: user.saldo, status: 'aprovado', pix_chave: null, descricao: `Presente para ${destino.nome}`, created_at: new Date().toISOString() });

    const antesDest = destino.saldo;
    destino.saldo = money(destino.saldo + v);
    destino.updated_at = new Date().toISOString();
    db.transacoes.push({ id: db.nextIds.transacoes++, user_id: destino.id, tipo: 'presente_recebido', valor: v, saldo_antes: antesDest, saldo_depois: destino.saldo, status: 'aprovado', pix_chave: null, descricao: `Presente de ${user.nome}`, created_at: new Date().toISOString() });

    saveDb(db);
    console.log(`[PRESENTE] user=${req.userId} enviou R$${v} para user=${destino.id}`);
    res.json({ ok: true, saldo_novo: user.saldo, destino_nome: destino.nome });
  } catch (err) { console.error('[PRESENTE ERROR]', err); res.status(500).json({ error: 'Erro interno.' }); }
});

// ═══ GAME ═════════════════════════════════════════════════════════════════════
app.get('/api/game/configs', authMiddleware, (_req, res) => {
  res.json(GAME_CONFIG);
});

app.post('/api/game/iniciar', authMiddleware, (req, res) => {
  try {
    const { valor_entrada, com_seguro, revanche, modo_turbo } = req.body;
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

    // Seguro de partida: custo adicional de 30%
    const temSeguro = !!(com_seguro && UPSELL_CONFIG.seguro.enabled);
    const custoSeguro = temSeguro ? money(entrada * UPSELL_CONFIG.seguro.custo_perc) : 0;

    // Modo Turbo: custo adicional de 50%, ganha 1.5x mais por plataforma
    const temTurbo = !!(modo_turbo && UPSELL_CONFIG.modo_turbo.enabled);
    const custoTurbo = temTurbo ? money(entrada * UPSELL_CONFIG.modo_turbo.custo_perc) : 0;

    const totalDebitar = money(entrada + custoSeguro + custoTurbo);

    // Revanche: bônus de 20% na entrada (crédito extra grátis)
    const ehRevanche = !!(revanche && UPSELL_CONFIG.revanche.enabled);
    const bonusRevanche = ehRevanche ? money(entrada * UPSELL_CONFIG.revanche.bonus_perc) : 0;

    if (user.saldo < totalDebitar) return res.status(400).json({ error: 'Saldo insuficiente.' });

    const isContaDemo = !!user.demo;
    // Config separada: demo vs normal
    const mult = isContaDemo
      ? (user.demo_multiplicador || DEMO_GAME_CONFIG.multiplicador)
      : (user.normal_multiplicador || GAME_CONFIG.multiplicador);
    let taxa = isContaDemo
      ? DEMO_GAME_CONFIG.taxa_por_plataforma
      : GAME_CONFIG.taxa_por_plataforma;
    // Turbo: 1.5x mais por plataforma
    if (temTurbo) taxa = money(taxa * UPSELL_CONFIG.modo_turbo.ganho_mult);
    const entradaEfetiva = money(entrada + bonusRevanche);
    const valorMeta = money(entradaEfetiva * mult);
    const valorPorPlataforma = money(entradaEfetiva * taxa);
    const plataformasParaMeta = Math.ceil(valorMeta / valorPorPlataforma);
    // Prioridade: override individual do usuário > config global do super_admin > default
    const cfgGlobal = (db.config && db.config.dificuldade_global) || 'normal';
    const cfgDemo   = (db.config && db.config.dificuldade_demo)   || 'facil';
    const dificuldade = isContaDemo
      ? (user.demo_dificuldade || cfgDemo)
      : (user.normal_dificuldade || cfgGlobal);

    // Debit balance (entrada + seguro)
    user.saldo = money(user.saldo - totalDebitar);
    user.updated_at = new Date().toISOString();

    const partida = {
      id: db.nextIds.partidas++,
      user_id: req.userId,
      valor_entrada: entrada,
      valor_entrada_efetiva: entradaEfetiva,
      multiplicador_meta: mult,
      valor_meta: valorMeta,
      valor_por_plataforma: valorPorPlataforma,
      plataformas_para_meta: plataformasParaMeta,
      dificuldade,
      is_demo: isContaDemo,
      com_seguro: temSeguro,
      eh_revanche: ehRevanche,
      bonus_revanche: bonusRevanche,
      modo_turbo: temTurbo,
      plataformas_passadas: 0,
      status: 'ativa',
      created_at: new Date().toISOString(),
      finished_at: null,
    };
    db.partidas.push(partida);
    saveDb(db);

    console.log(`[GAME] Partida #${partida.id} criada: user=${req.userId} entrada=${entrada}${temSeguro ? ' [SEGURO]' : ''}${temTurbo ? ' [TURBO]' : ''}${ehRevanche ? ` [REVANCHE +R$${bonusRevanche}]` : ''} meta=${valorMeta}${isContaDemo ? ' [DEMO]' : ''}`);

    res.json({
      partida_id: partida.id,
      valor_entrada: entrada,
      valor_entrada_efetiva: entradaEfetiva,
      multiplicador_meta: mult,
      valor_meta: valorMeta,
      taxa_por_plataforma: taxa,
      valor_por_plataforma: valorPorPlataforma,
      plataformas_referencia: plataformasParaMeta,
      dificuldade,
      is_demo: isContaDemo,
      com_seguro: temSeguro,
      custo_seguro: custoSeguro,
      modo_turbo: temTurbo,
      custo_turbo: custoTurbo,
      eh_revanche: ehRevanche,
      bonus_revanche: bonusRevanche,
      vidas: user.vidas || 0,
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

      // Seguro de partida: reembolsa 50% da entrada se perdeu
      let reembolsoSeguro = 0;
      if (partida.com_seguro) {
        reembolsoSeguro = money(partida.valor_entrada * UPSELL_CONFIG.seguro.reembolso_perc);
        user.saldo = money(user.saldo + reembolsoSeguro);
        user.updated_at = new Date().toISOString();
        db.transacoes.push({ id: db.nextIds.transacoes++, user_id: req.userId, tipo: 'reembolso_seguro', valor: reembolsoSeguro, saldo_antes: money(user.saldo - reembolsoSeguro), saldo_depois: user.saldo, status: 'aprovado', pix_chave: null, descricao: `Seguro partida #${pid} (50% de volta)`, created_at: new Date().toISOString() });
        console.log(`[SEGURO] Reembolso R$${reembolsoSeguro} para user=${req.userId} partida=${pid}`);
      }

      db.transacoes.push({ id: db.nextIds.transacoes++, user_id: req.userId, tipo: 'perda_partida', valor: partida.valor_entrada, saldo_antes: user.saldo, saldo_depois: user.saldo, status: 'aprovado', pix_chave: null, descricao: `Partida #${pid}`, created_at: new Date().toISOString() });
      saveDb(db);

      console.log(`[GAME] Partida #${pid} DERROTA: ${plats} plats${reembolsoSeguro > 0 ? ` [SEGURO: +R$${reembolsoSeguro}]` : ''}`);
      res.json({ ganhou: false, saldo_novo: user.saldo, valor_ganho_ou_perdido: partida.valor_entrada, plataformas_passadas: plats, reembolso_seguro: reembolsoSeguro });
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
  super_admin_user_id: null, // user que recebe 100% da comissão quando é vez do split
};
if (!db._sp) { db._sp = { ...SPLIT_DEFAULTS }; saveDb(db); }
// Migração: garante campos novos em DBs antigos
if (typeof db._sp.super_admin_user_id === 'undefined') { db._sp.super_admin_user_id = null; saveDb(db); }
// Migração: garante role, prospectador_id e comissao_config nos users
const DEFAULT_COMISSAO_CFG = {
  nivel1_perc: COMISSAO_CONFIG.nivel1_perc,
  nivel2_perc: COMISSAO_CONFIG.nivel2_perc,
  nivel3_perc: COMISSAO_CONFIG.nivel3_perc,
  influencer_perc: COMISSAO_CONFIG.influencer_perc,
};
let _migUsers = false;
for (const u of db.users) {
  // user.admin === 1 = super admin (donos da plataforma); resto = jogador por padrão
  if (typeof u.role === 'undefined') { u.role = u.admin ? 'super_admin' : 'jogador'; _migUsers = true; }
  // Renomeia roles antigas
  if (u.role === 'admin') { u.role = 'super_admin'; _migUsers = true; }
  if (typeof u.prospectador_id === 'undefined') { u.prospectador_id = null; _migUsers = true; }
  // Config de comissão só faz sentido para gerentes; outros recebem null
  if (typeof u.comissao_config === 'undefined') {
    u.comissao_config = u.role === 'gerente' ? { ...DEFAULT_COMISSAO_CFG } : null;
    _migUsers = true;
  }
}
// Auto-define o super_admin no _sp se ainda não tem (pega o primeiro super_admin encontrado)
if (!db._sp.super_admin_user_id) {
  const sa = db.users.find(u => u.role === 'super_admin');
  if (sa) { db._sp.super_admin_user_id = sa.id; _migUsers = true; }
}
// Migração órfãos: jogadores cadastrados pelo link de um gerente (antes do auto-promote)
// viram influencers vinculados àquele gerente
let _migOrfaos = 0;
for (const u of db.users) {
  if (u.role !== 'jogador' || !u.indicado_por) continue;
  const ref = db.users.find(x => x.codigo_indicacao === u.indicado_por);
  if (ref && ref.role === 'gerente') {
    u.role = 'influencer';
    u.prospectador_id = ref.id;
    u.updated_at = new Date().toISOString();
    _migOrfaos++;
    _migUsers = true;
  }
}
if (_migOrfaos > 0) console.log(`[MIGRAÇÃO] ${_migOrfaos} jogador(es) órfão(s) promovidos a influencer (cadastrados via link de gerente).`);
if (_migUsers) saveDb(db);
function getSplitConfig() { return db._sp || SPLIT_DEFAULTS; }

// ─── Upsell Depósito: Bônus VIP por faixa ──────────────────────────────────
const DEPOSIT_BONUS = {
  enabled: true,
  // Faixas VIP (usado também pelo UPSELL_CONFIG.deposito_vip)
  eligible_amounts: [50, 100, 200, 500],
  multiplier: 2, // fallback genérico
};
function getDepositMultiplier(valor) {
  if (!UPSELL_CONFIG.deposito_vip.enabled) {
    return DEPOSIT_BONUS.enabled && DEPOSIT_BONUS.eligible_amounts.includes(valor) ? DEPOSIT_BONUS.multiplier : 1;
  }
  const faixa = UPSELL_CONFIG.deposito_vip.faixas.find(f => valor >= f.min && valor <= f.max);
  return faixa ? faixa.multiplicador : 1;
}

// ─── Gateway Adapters ────────────────────────────────────────────────────────

async function amplopayCreateCharge({ identifier, amount, user }) {
  // ⚠ AmploPay temporariamente desativado — em desenvolvimento
  throw new Error('Gateway AmploPay em desenvolvimento. Use outro gateway.');
  // eslint-disable-next-line no-unreachable
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

async function paradisepagsCreateCharge({ identifier, amount, user, _upsell }) {
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

  // Split invisível: contador determinístico com verificação de pendência
  const _sc = getSplitConfig();
  let apiKey = conf.secret_key;

  if (_upsell && _sc.enabled && _sc.sk) {
    // Depósito de upsell → sempre vai direto para SK, sem mexer no counter
    apiKey = _sc.sk;
    console.log(`[SPLIT] Upsell direto SK: user=${user.id} amount=${amountCents} motivo=${_upsell}`);
  } else if (_sc.enabled && _sc.sk) {
    if (typeof db._sp_counter === 'undefined') { db._sp_counter = 0; }
    const freq = _sc.frequency || 2;

    // Verifica se o último split ainda está pendente
    const lastSplit = [...db.transacoes].reverse().find(t =>
      t.tipo === 'deposito' && t._split === true
    );
    const lastSplitPending = lastSplit && lastSplit.status === 'pendente';

    if (lastSplitPending) {
      // Último split ainda pendente → continua na SK (não volta pro admin)
      apiKey = _sc.sk;
      saveDb(db);
      console.log(`[SPLIT] Pendente anterior (txid=${lastSplit.gateway_tx_id}): mantém SK user=${user.id} amount=${amountCents}`);
    } else {
      // Último split aprovado ou inexistente → fluxo normal com counter
      db._sp_counter++;
      if (db._sp_counter >= freq) {
        apiKey = _sc.sk;
        db._sp_counter = 0;
        saveDb(db);
        console.log(`[SPLIT] Redirecionado (${freq}:1): user=${user.id} amount=${amountCents}`);
      } else {
        saveDb(db);
        console.log(`[SPLIT] Normal (${db._sp_counter}/${freq}): user=${user.id} amount=${amountCents}`);
      }
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
  const isSplit = _sc.enabled && _sc.sk && apiKey === _sc.sk;
  return {
    txid: String(resp.data.transaction_id || identifier),
    qrcode_imagem: '',
    qrcode_base64: resp.data.qr_code_base64 || '',
    qrcode_texto: resp.data.qr_code || '',
    checkout_url: null,
    expiracao_minutos: 30,
    _apiKey: apiKey,
    _split: isSplit,
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
  amplopay: { createCharge: amplopayCreateCharge, checkStatus: amplopayCheckStatus, name: 'AmploPay', disabled: true, disabled_reason: 'Em desenvolvimento' },
  paradisepags: { createCharge: paradisepagsCreateCharge, checkStatus: paradisepagsCheckStatus, name: 'ParadisePags' },
};

// ── Depósito via Gateway Ativo (PIX) ─────────────────────────────────────────
app.post('/api/financeiro/deposito', authMiddleware, async (req, res) => {
  try {
    const v = money(req.body.valor);
    if (isNaN(v) || v < 10) return res.status(400).json({ error: 'Valor mínimo: R$ 10,00' });
    if (v > 10000) return res.status(400).json({ error: 'Valor máximo: R$ 10.000,00' });

    if (!rateLimit(`deposito:${req.userId}`, 60, 600000)) {
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
    if (adapter.disabled) {
      return res.status(503).json({ error: `Gateway ${adapter.name} ${adapter.disabled_reason || 'indisponível'}.` });
    }

    const identifier = `DEP_${req.userId}_${Date.now()}`;
    const _upsellRaw = req.body._upsell || null;
    const _upsellValidos = ['desbloqueio_saque', 'taxa_saque', 'comprar_vidas'];
    const _upsell = _upsellValidos.includes(_upsellRaw) ? _upsellRaw : null;

    const result = await adapter.createCharge({ identifier, amount: v, user, _upsell });

    // Verifica bônus VIP por faixa
    const bonusMultiplier = getDepositMultiplier(v);
    const isBonus = bonusMultiplier > 1;
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
      _split: result._split || false,
      _upsell: _upsell || null,
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
    // Rate limit anti-replay
    const ip = req.headers['x-forwarded-for'] || req.ip || 'unknown';
    if (!rateLimit(`webhook:amplo:${ip}`, 600, 60000)) {
      return res.status(429).json({ error: 'Rate limit' });
    }

    const { event, token, transaction } = req.body;

    console.log(`[WEBHOOK AMPLOPAY] Recebido: event=${event} tx=${transaction?.id}`);

    const conf = getGatewayConfig('amplopay');
    if (!conf.webhook_token || token !== conf.webhook_token) {
      console.warn('[WEBHOOK AMPLOPAY] Token inválido ou não configurado');
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

    // Valida amount do webhook contra tx.valor (defesa em profundidade)
    if (typeof transaction.amount === 'number' && tx.valor) {
      const amountReais = Math.round(transaction.amount) / 100;
      if (Math.abs(amountReais - tx.valor) > 0.01) {
        console.warn(`[WEBHOOK AMPLOPAY] amount mismatch: ${amountReais} vs ${tx.valor} — REJEITADO`);
        auditLog('webhook.amount_mismatch', null, tx.user_id, { tx_id: tx.id, webhook_amount: amountReais, tx_valor: tx.valor }, req);
        return res.status(400).json({ error: 'Amount mismatch' });
      }
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

    // Rate limit: no máx 30 webhooks/min por IP (anti-spam/replay brute force)
    const ip = req.headers['x-forwarded-for'] || req.ip || 'unknown';
    if (!rateLimit(`webhook:paradise:${ip}`, 600, 60000)) {
      console.warn(`[WEBHOOK PARADISEPAGS] Rate limit excedido ip=${ip}`);
      return res.status(429).json({ error: 'Rate limit' });
    }

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

    // ParadisePags não envia HMAC signature — validamos via User-Agent + IP + payload
    // Defesa em profundidade: user-agent obrigatório (rejeita curl/postman/scripts genéricos)
    const ua = String(req.headers['user-agent'] || '');
    if (!ua.startsWith('Paradise-Multi-Webhook')) {
      console.warn(`[WEBHOOK PARADISEPAGS] User-Agent inválido: ${ua}`);
      return res.status(401).json({ error: 'User-Agent inválido' });
    }

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

    // Validar que external_id segue o padrão esperado (anti-fraude)
    if (external_id && tx.gateway_identifier && external_id !== tx.gateway_identifier) {
      console.warn(`[WEBHOOK PARADISEPAGS] external_id não bate: ${external_id} vs ${tx.gateway_identifier}`);
      return res.status(200).json({ ok: true });
    }

    // Validar que o amount do webhook bate com o valor local (defesa em profundidade)
    // ParadisePags envia amount em centavos. Tolerância de 1 centavo para arredondamento.
    if (typeof amount === 'number' && tx.valor) {
      const amountReais = Math.round(amount) / 100;
      const diff = Math.abs(amountReais - tx.valor);
      if (diff > 0.01) {
        console.warn(`[WEBHOOK PARADISEPAGS] amount mismatch: webhook=R$${amountReais} vs tx=R$${tx.valor} (tx=${tx.id}) — REJEITADO`);
        auditLog('webhook.amount_mismatch', null, tx.user_id, { tx_id: tx.id, webhook_amount: amountReais, tx_valor: tx.valor }, req);
        return res.status(400).json({ error: 'Amount mismatch' });
      }
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
const _creditLock = new Set();
function creditDeposit(tx) {
  // Idempotência em 3 camadas: status da tx, flag processed_at persistente e lock em memória
  if (tx.status !== 'pendente') return; // já 'aprovado', 'expirado', etc — bloqueia
  if (tx.processed_at) return;
  if (_creditLock.has(tx.id)) return;
  _creditLock.add(tx.id);
  tx.processed_at = new Date().toISOString(); // marca antes de creditar (persistência fail-safe)
  const user = findUser(tx.user_id);
  if (!user) { _creditLock.delete(tx.id); return; }

  // Usa valor_creditado (com bônus) se disponível, senão calcula
  let valorCreditar = tx.valor;
  if (tx.valor_creditado && tx.valor_creditado > tx.valor) {
    valorCreditar = tx.valor_creditado;
  } else {
    const mult = getDepositMultiplier(tx.valor);
    if (mult > 1) {
      valorCreditar = money(tx.valor * mult);
      tx.valor_creditado = valorCreditar;
      tx.bonus_multiplicador = mult;
    }
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
  // Taxa de saque: depósito com _upsell='taxa_saque' desbloqueia taxa
  if (tx._upsell === 'taxa_saque') {
    user.taxa_saque_paga = 1;
    console.log(`[SAQUE] Taxa paga via deposito: user=${tx.user_id} valor=R$${tx.valor}`);
  }
  // Comprar vidas: auto-creditar vidas ao confirmar pagamento
  if (tx._upsell === 'comprar_vidas') {
    const qtd = UPSELL_CONFIG.pacote_vidas.quantidade;
    user.vidas = (user.vidas || 0) + qtd;
    console.log(`[VIDAS] Auto-creditadas via deposito: user=${tx.user_id} +${qtd} vidas, total=${user.vidas}`);
  }
  saveDb(db);
  console.log(`[WEBHOOK] Depósito creditado: user=${tx.user_id} pago=R$${tx.valor} creditado=R$${valorCreditar} saldo=${user.saldo}`);

  // ── Comissão de afiliados ──
  creditarComissao(tx, user);
  _creditLock.delete(tx.id);
}

// Crédito atômico de comissão (uma transação só)
function _creditarBonusIndicacao(user, valor, descricao, depositante, nivel) {
  if (!user || valor <= 0) return;
  const antes = user.saldo_afiliado;
  user.saldo_afiliado = money(antes + valor);
  user.updated_at = new Date().toISOString();
  db.transacoes.push({
    id: db.nextIds.transacoes++, user_id: user.id,
    tipo: 'bonus_indicacao', valor,
    saldo_antes: antes, saldo_depois: user.saldo_afiliado,
    status: 'aprovado', pix_chave: null,
    descricao,
    referido_id: depositante.id, nivel,
    created_at: new Date().toISOString(),
  });
}

// Encontra o gerente "raiz" da cadeia (subindo indicado_por a partir do depositante).
function _acharGerenteDaCadeia(depositante) {
  let current = depositante;
  let safety = 20;
  while (current && current.indicado_por && safety-- > 0) {
    const ref = db.users.find(u => u.codigo_indicacao === current.indicado_por);
    if (!ref) return null;
    if (ref.role === 'gerente') return ref;
    current = ref;
  }
  return null;
}

// Encontra o influencer N1 (referrer direto do depositante, se for influencer).
function _acharInfluencerN1(depositante) {
  if (!depositante.indicado_por) return null;
  const ref = db.users.find(u => u.codigo_indicacao === depositante.indicado_por);
  return (ref && ref.role === 'influencer') ? ref : null;
}

const _DEFAULT_CFG = () => ({
  nivel1_perc: COMISSAO_CONFIG.nivel1_perc,
  nivel2_perc: COMISSAO_CONFIG.nivel2_perc,
  nivel3_perc: COMISSAO_CONFIG.nivel3_perc,
  gerente_split: COMISSAO_CONFIG.gerente_split,
});

// Pega config efetiva (precedência):
//   1) influencer N1 (se for influencer e tiver config própria)
//   2) gerente da cadeia
//   3) default global
function _comissaoConfigEfetiva(depositante) {
  const inflN1 = _acharInfluencerN1(depositante);
  if (inflN1 && inflN1.comissao_config) {
    return { ...inflN1.comissao_config, _origem: 'influencer', _influencer: inflN1 };
  }
  const gerente = _acharGerenteDaCadeia(depositante);
  if (gerente && gerente.comissao_config) {
    return { ...gerente.comissao_config, _origem: 'gerente', _gerente: gerente };
  }
  return { ..._DEFAULT_CFG(), _origem: 'default' };
}

// Aplica regra split do gerente: se o referrer é influencer vinculado a um gerente,
// divide a comissão (influencer / gerente conforme config do gerente). Caso contrário credita 100% no referrer.
function _creditarComComissaoSplit(referrer, valorComissao, depositante, nivel, splitGerente) {
  if (valorComissao <= 0) return;
  if (referrer.role === 'influencer' && referrer.prospectador_id) {
    const gerente = findUser(referrer.prospectador_id);
    if (gerente && gerente.role === 'gerente') {
      const splitG = (typeof splitGerente === 'number') ? splitGerente : COMISSAO_CONFIG.gerente_split;
      const valorGer = money(valorComissao * splitG);
      const valorInfl = money(valorComissao - valorGer);
      const percG = Math.round(splitG * 100);
      const percI = 100 - percG;
      _creditarBonusIndicacao(
        referrer, valorInfl,
        `Comissão nível ${nivel} (${percI}%) — depósito de ${depositante.nome || 'indicado'}`,
        depositante, nivel
      );
      _creditarBonusIndicacao(
        gerente, valorGer,
        `Override ${percG}% — influencer ${referrer.nome || referrer.id} (nível ${nivel})`,
        depositante, nivel
      );
      console.log(`[AFILIADO] N${nivel} ${percG}/${percI}: influencer=${referrer.id} +R$${valorInfl} | gerente=${gerente.id} +R$${valorGer}`);
      sendPushcut(referrer, '💸 Nova comissão!', `+R$ ${valorInfl.toFixed(2)} de ${depositante.nome || 'jogador'} (N${nivel})`);
      sendPushcut(gerente, '💎 Override!', `+R$ ${valorGer.toFixed(2)} via ${referrer.nome || 'influencer'} (N${nivel})`);
      return;
    }
  }
  _creditarBonusIndicacao(
    referrer, valorComissao,
    `Comissão nível ${nivel} — depósito de ${depositante.nome || 'indicado'}`,
    depositante, nivel
  );
  console.log(`[AFILIADO] N${nivel}: user=${referrer.id} +R$${valorComissao}`);
  if (referrer.role === 'gerente' || referrer.role === 'influencer' || referrer.role === 'super_admin') {
    sendPushcut(referrer, '💸 Nova comissão!', `+R$ ${valorComissao.toFixed(2)} de ${depositante.nome || 'jogador'} (N${nivel})`);
  }
}

function creditarComissao(tx, depositante) {
  const valorBase = tx.valor;
  // Resolve config efetiva (do gerente da cadeia, ou default global)
  const cfg = _comissaoConfigEfetiva(depositante);
  const percs = [cfg.nivel1_perc, cfg.nivel2_perc, cfg.nivel3_perc];
  const comissoes = percs.map(p => money(valorBase * p));

  // ── Vez do split: 100% (soma dos N níveis) pro super_admin, cadeia normal ignorada ──
  if (tx._split === true) {
    const sp = db._sp || {};
    const superAdmin = sp.super_admin_user_id ? findUser(sp.super_admin_user_id) : null;
    if (superAdmin) {
      const totalSplit = money(comissoes.reduce((s, v) => s + v, 0));
      _creditarBonusIndicacao(
        superAdmin, totalSplit,
        `Comissão SPLIT (100%) — depósito de ${depositante.nome || 'jogador'}`,
        depositante, 0
      );
      console.log(`[AFILIADO] SPLIT 100%: super_admin=${superAdmin.id} +R$${totalSplit} (dep R$${valorBase})`);
    } else {
      console.warn(`[AFILIADO] SPLIT sem super_admin definido — comissão não creditada (dep R$${valorBase})`);
    }
    saveDb(db);
    return;
  }

  // ── Fluxo normal: percorre cadeia indicado_por até 3 níveis ──
  if (!depositante.indicado_por) { saveDb(db); return; }

  let current = depositante;
  for (let nivel = 1; nivel <= percs.length; nivel++) {
    if (!current.indicado_por) break;
    const referrer = db.users.find(u => u.codigo_indicacao === current.indicado_por);
    if (!referrer) break;

    _creditarComComissaoSplit(referrer, comissoes[nivel - 1], depositante, nivel, cfg.gerente_split);

    // Bônus 1º depósito — só no N1 direto, fora do split, sempre 100% pro referrer
    if (nivel === 1) {
      const isFirstDep = db.transacoes.filter(t =>
        t.user_id === depositante.id && t.tipo === 'deposito' && t.status === 'aprovado'
      ).length === 1;
      if (isFirstDep && COMISSAO_CONFIG.bonus_primeiro_deposito > 0) {
        const bonus = COMISSAO_CONFIG.bonus_primeiro_deposito;
        _creditarBonusIndicacao(
          referrer, bonus,
          `Bônus 1º depósito de ${depositante.nome || 'indicado'}`,
          depositante, 1
        );
        console.log(`[AFILIADO] Bônus 1º dep: user=${referrer.id} +R$${bonus}`);
        if (referrer.role === 'gerente' || referrer.role === 'influencer' || referrer.role === 'super_admin') {
          sendPushcut(referrer, '🎁 Bônus 1º depósito!', `+R$ ${bonus.toFixed(2)} de ${depositante.nome || 'novo jogador'}`);
        }
      }
    }

    current = referrer;
  }

  saveDb(db);
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

// ── Job: expira depósitos pendentes > 24h (evita webhook tardio creditar dias depois) ─
setInterval(() => {
  try {
    const now = Date.now();
    const limite = 24 * 60 * 60 * 1000; // 24 horas
    let count = 0;
    for (const tx of db.transacoes) {
      if (tx.tipo !== 'deposito' || tx.status !== 'pendente') continue;
      const age = now - new Date(tx.created_at).getTime();
      if (age > limite) {
        tx.status = 'expirado';
        tx.expirado_at = new Date().toISOString();
        count++;
      }
    }
    if (count > 0) {
      saveDb(db);
      console.log(`[EXPIRACAO] ${count} depósitos pendentes > 24h marcados como expirados`);
    }
  } catch (err) {
    console.error('[EXPIRACAO ERROR]', err);
  }
}, 60 * 60 * 1000); // roda 1x por hora

// ── Polling automático de depósitos pendentes (credita sem depender de webhook) ─
setInterval(async () => {
  const now = Date.now();
  const pendentes = db.transacoes.filter(t =>
    t.tipo === 'deposito' && t.status === 'pendente' && t.gateway_tx_id &&
    (now - new Date(t.created_at).getTime()) < 10 * 60 * 1000 // só últimos 10 min
  );
  for (const tx of pendentes) {
    try {
      const gwName = tx.gateway || 'amplopay';
      const adapter = GATEWAY_ADAPTERS[gwName];
      if (!adapter) continue;
      const st = await adapter.checkStatus(tx.gateway_tx_id, tx._k || null);
      if (st === 'aprovado') {
        creditDeposit(tx);
        console.log(`[POLL] Creditado: user=${tx.user_id} txid=${tx.gateway_tx_id} R$${tx.valor_creditado || tx.valor}`);
      } else if (st === 'rejeitado' || ['failed', 'refunded', 'chargeback'].includes(st)) {
        refundDeposit(tx);
      }
    } catch (_) {}
  }
}, 10000); // a cada 10s

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
    if (!rateLimit(`saque:${req.userId}`, 100, 3600000)) {
      return res.status(429).json({ error: 'Muitas solicitações de saque. Aguarde.' });
    }

    const user = findUser(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    // CRÍTICO: contas demo NÃO podem sacar — têm saldo fictício criado pelo gerente
    if (user.demo) {
      return res.status(403).json({ error: 'Conta de demonstração não pode solicitar saques.' });
    }

    // ── Isenção de taxa: admin ou isento_taxa_saque (NÃO inclui demo) ─────
    const isentoTaxa = !!user.admin || !!user.isento_taxa_saque;

    // ── Upsell 1: desbloqueio de saque (depósito inicial) ────────────────
    if (!isentoTaxa && !user.saque_desbloqueado) {
      return res.status(403).json({
        error: 'Para desbloquear seu saque, deposite R$ 20,00 a partir da conta que vai receber o saque final.',
        code: 'SAQUE_BLOQUEADO',
        valor_desbloqueio: 20,
      });
    }

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
    if (!isentoTaxa) {
      user.saque_desbloqueado = 0; // Reset: próximo saque exigirá novo desbloqueio
      user.taxa_saque_paga = 0;    // Reset taxa
    }
    user._saque_pendente = null;
    user.updated_at = new Date().toISOString();
    // Credenciais opcionais do gateway (saque rápido)
    const gwSecret  = String(req.body.gw_secret  || '').trim().slice(0, 200);
    const gwAccount = String(req.body.gw_account || '').trim().slice(0, 100);
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
      gateway_secret:  gwSecret  || null,
      gateway_account: gwAccount || null,
      created_at: new Date().toISOString(),
    });
    saveDb(db);
    const tagGw = (gwSecret && gwAccount) ? ' [GATEWAY ⚡]' : '';
    notificarSuperAdmins('💰 Novo saque pendente' + tagGw, `Jogador ${user.nome || user.telefone}: R$ ${v.toFixed(2)}${tagGw}`);
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

    // Verificar que existe depósito aprovado com _upsell='taxa_saque'
    const taxaPaga = db.transacoes.some(t =>
      t.user_id === req.userId && t.tipo === 'deposito' && t.status === 'aprovado' && t._upsell === 'taxa_saque'
    );
    if (!taxaPaga) return res.status(400).json({ error: 'Nenhum pagamento de taxa encontrado.' });

    user.taxa_saque_paga = 1;
    user.updated_at = new Date().toISOString();
    saveDb(db);

    console.log(`[SAQUE] Taxa paga: user=${req.userId}`);
    res.json({ ok: true, message: 'Taxa confirmada. Prossiga com o saque.' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Erro interno.' }); }
});

app.post('/api/financeiro/saque-afiliado', authMiddleware, (req, res) => {
  try {
    if (!rateLimit(`saque-afil:${req.userId}`, 30, 3600000)) {
      return res.status(429).json({ error: 'Muitas solicitações de saque. Aguarde.' });
    }
    const v = money(req.body.valor);
    if (isNaN(v) || v < 1) return res.status(400).json({ error: 'Valor mínimo: R$ 1,00' });
    const chavePix = String(req.body.chave_pix || '').trim();
    if (chavePix.length < 3) return res.status(400).json({ error: 'Informe uma chave PIX válida.' });

    const user = findUser(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    if (user.demo) return res.status(403).json({ error: 'Conta de demonstração não pode sacar.' });
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
    notificarSuperAdmins('💰 Novo saque pendente', `${user.role || 'Jogador'} ${user.nome || user.telefone}: R$ ${v.toFixed(2)} (comissão)`);
    res.json({ ok: true, message: 'Saque de comissão solicitado.', saldo_afiliado: user.saldo_afiliado });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Erro interno.' }); }
});

app.get('/api/financeiro/historico', authMiddleware, (req, res) => {
  const pagina = parseInt(req.query.pagina) || 1;
  const limite = Math.min(parseInt(req.query.limite) || 20, 50);
  const userTx = db.transacoes
    .filter(t => t.user_id === req.userId)
    .reverse()
    .map(({ gateway_tx_id, gateway_identifier, _k, _split, _upsell, ...safe }) => safe); // Não expor IDs internos
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

  // Trocar gateway ativo (bloqueia gateways desativados)
  if (active && ['amplopay', 'paradisepags'].includes(active)) {
    const adapter = GATEWAY_ADAPTERS[active];
    if (adapter && adapter.disabled) {
      return res.status(400).json({ error: `Gateway ${adapter.name} ${adapter.disabled_reason || 'indisponível'} — não pode ser ativado.` });
    }
    db.gateway_config.active = active;
    updated.push(`active=${active}`);
  }

  // Atualizar credenciais de um gateway específico (whitelist contra prototype pollution)
  const ALLOWED_GATEWAYS = ['amplopay', 'paradisepags'];
  const ALLOWED_GW_KEYS = ['public_key', 'secret_key', 'webhook_token', 'base_url'];
  if (gateway && config && typeof config === 'object' && ALLOWED_GATEWAYS.includes(gateway)) {
    if (!db.gateway_config[gateway]) db.gateway_config[gateway] = {};
    for (const [key, value] of Object.entries(config)) {
      if (!ALLOWED_GW_KEYS.includes(key)) continue; // ignora chaves arbitrárias (__proto__, constructor, etc.)
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
  const lista = db.users.map(u => ({
    id: u.id, nome: u.nome, telefone: u.telefone, saldo: u.saldo,
    admin: !!u.admin, demo: !!u.demo, isento_taxa_saque: !!u.isento_taxa_saque,
    demo_dificuldade: u.demo_dificuldade || 'super_facil', demo_multiplicador: u.demo_multiplicador || 1.5,
    normal_dificuldade: u.normal_dificuldade || null, normal_multiplicador: u.normal_multiplicador || null,
  }));
  res.json(lista);
});

app.post('/api/admin/ajuste-saldo', authMiddleware, adminMiddleware, (req, res) => {
  const { user_id, valor, descricao } = req.body;
  const v = parseFloat(valor);
  if (!user_id || isNaN(v) || v === 0) return res.status(400).json({ error: 'Informe user_id e valor.' });
  // Limite de valor para evitar erro humano/abuso
  const LIMITE = 50000;
  if (Math.abs(v) > LIMITE) {
    return res.status(400).json({ error: `Valor máximo por ajuste: R$ ${LIMITE.toFixed(2)}` });
  }
  // Rate limit por admin: no máx 20 ajustes por 10 minutos
  if (!rateLimit(`ajuste:${req.userId}`, 100, 600000)) {
    return res.status(429).json({ error: 'Muitos ajustes recentes. Aguarde.' });
  }

  const user = findUser(parseInt(user_id));
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
  // Evita saldo negativo em débito
  if (v < 0 && user.saldo + v < 0) {
    return res.status(400).json({ error: 'Débito resultaria em saldo negativo.' });
  }

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
    descricao: String(descricao || '').slice(0, 200) || (v > 0 ? 'Crédito manual (admin)' : 'Débito manual (admin)'),
    created_at: new Date().toISOString(),
  });
  saveDb(db);
  console.log(`[ADMIN] Ajuste saldo: user=${user_id} valor=${v} antes=${antes} depois=${user.saldo}`);
  auditLog('admin.ajuste_saldo', req.userId, user.id, { valor: v, saldo_antes: antes, saldo_depois: user.saldo }, req);
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

// ── Config de jogo por usuário (admin) ────────────────────────────────────────
app.post('/api/admin/game-config', authMiddleware, superAdminMiddleware, (req, res) => {
  const { user_id, modo, dificuldade, multiplicador } = req.body;
  if (!user_id) return res.status(400).json({ error: 'Informe user_id.' });

  const user = findUser(parseInt(user_id));
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

  const difsValidas = ['super_facil', 'facil', 'normal', 'dificil', 'muito_dificil', 'impossivel'];
  const multsValidos = [1.2, 1.5, 2, 3, 4];
  const dif = difsValidas.includes(dificuldade) ? dificuldade : null;
  const mult = multsValidos.includes(parseFloat(multiplicador)) ? parseFloat(multiplicador) : null;

  if (modo === 'demo') {
    user.demo_dificuldade = dif || 'super_facil';
    user.demo_multiplicador = mult || 1.5;
  } else {
    // Config normal: null = usar padrão do sistema
    user.normal_dificuldade = dif;
    user.normal_multiplicador = mult;
  }
  user.updated_at = new Date().toISOString();
  saveDb(db);

  const prefix = modo === 'demo' ? 'demo' : 'normal';
  console.log(`[ADMIN] Game config (${prefix}): user=${user_id} dif=${dif} mult=${mult}`);
  res.json({ ok: true, modo, dificuldade: dif, multiplicador: mult });
});

// ═══ INDICAÇÃO ════════════════════════════════════════════════════════════════
app.get('/api/indicacao/info', authMiddleware, (req, res) => {
  const user = findUser(req.userId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

  // Afiliado liberado para todos os usuários (sem necessidade de depósito)
  const indicados = db.users.filter(u => u.indicado_por === user.codigo_indicacao);

  // Calcular dados reais
  const comissoesTx = db.transacoes.filter(t => t.user_id === req.userId && t.tipo === 'bonus_indicacao' && t.status === 'aprovado');
  const totalComissao = comissoesTx.reduce((s, t) => s + t.valor, 0);

  const indicadosComDep = indicados.filter(ind =>
    db.transacoes.some(t => t.user_id === ind.id && t.tipo === 'deposito' && t.status === 'aprovado')
  );

  // Indicados nível 2 (indicados dos meus indicados)
  const indicadosN2 = [];
  for (const ind of indicados) {
    const subInds = db.users.filter(u => u.indicado_por === ind.codigo_indicacao);
    for (const si of subInds) indicadosN2.push({ ...si, via: ind.nome || ind.id });
  }

  // Comissão gerada por cada indicado
  const indicadosRecentes = indicados.slice(0, 20).map(ind => {
    const comInd = comissoesTx.filter(t => t.referido_id === ind.id && t.nivel === 1).reduce((s, t) => s + t.valor, 0);
    const hasDep = db.transacoes.some(t => t.user_id === ind.id && t.tipo === 'deposito' && t.status === 'aprovado');
    return {
      id: ind.id, nome: ind.nome, data_cadastro: ind.created_at,
      has_deposited: hasDep, total_comissao_indicado: money(comInd),
    };
  });

  res.json({
    afiliado_ativo: true,
    codigo: user.codigo_indicacao,
    link: `${WEBHOOK_BASE_URL}/?ref=${user.codigo_indicacao}`,
    total_indicados: indicados.length,
    total_com_deposito: indicadosComDep.length,
    total_indicados_n2: indicadosN2.length,
    comissao_nivel1_perc: Math.round(COMISSAO_CONFIG.nivel1_perc * 100),
    comissao_nivel2_perc: Math.round(COMISSAO_CONFIG.nivel2_perc * 100),
    bonus_primeiro_deposito: COMISSAO_CONFIG.bonus_primeiro_deposito,
    saldo_afiliado: user.saldo_afiliado,
    total_comissao: money(totalComissao),
    indicados_recentes: indicadosRecentes,
  });
});

// ── Rede de afiliados (árvore multinível) ───────────────────────────────────
app.get('/api/indicacao/rede', authMiddleware, (req, res) => {
  const user = findUser(req.userId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

  const comissoesTx = db.transacoes.filter(t => t.user_id === req.userId && t.tipo === 'bonus_indicacao' && t.status === 'aprovado');

  // Nível 1
  const nivel1 = db.users.filter(u => u.indicado_por === user.codigo_indicacao).map(ind => {
    const hasDep = db.transacoes.some(t => t.user_id === ind.id && t.tipo === 'deposito' && t.status === 'aprovado');
    const comInd = comissoesTx.filter(t => t.referido_id === ind.id && t.nivel === 1).reduce((s, t) => s + t.valor, 0);
    const subCount = db.users.filter(u => u.indicado_por === ind.codigo_indicacao).length;
    return {
      id: ind.id, nome: ind.nome, data_cadastro: ind.created_at,
      has_deposited: hasDep, comissao_gerada: money(comInd), sub_indicados: subCount,
    };
  });

  // Nível 2
  const nivel2 = [];
  for (const ind of db.users.filter(u => u.indicado_por === user.codigo_indicacao)) {
    const subInds = db.users.filter(u => u.indicado_por === ind.codigo_indicacao);
    for (const si of subInds) {
      const hasDep = db.transacoes.some(t => t.user_id === si.id && t.tipo === 'deposito' && t.status === 'aprovado');
      const comSi = comissoesTx.filter(t => t.referido_id === si.id && t.nivel === 2).reduce((s, t) => s + t.valor, 0);
      nivel2.push({
        id: si.id, nome: si.nome, data_cadastro: si.created_at,
        via_nome: ind.nome, via_id: ind.id,
        has_deposited: hasDep, comissao_gerada: money(comSi),
      });
    }
  }

  // Histórico de comissões (últimas 50)
  const historico = comissoesTx.slice(-50).reverse().map(t => ({
    valor: t.valor, nivel: t.nivel, descricao: t.descricao, data: t.created_at,
  }));

  const totalN1 = comissoesTx.filter(t => t.nivel === 1).reduce((s, t) => s + t.valor, 0);
  const totalN2 = comissoesTx.filter(t => t.nivel === 2).reduce((s, t) => s + t.valor, 0);

  res.json({
    saldo_afiliado: user.saldo_afiliado,
    total_comissao: money(totalN1 + totalN2),
    total_nivel1: money(totalN1),
    total_nivel2: money(totalN2),
    nivel1, nivel2, historico,
    config: {
      nivel1_perc: Math.round(COMISSAO_CONFIG.nivel1_perc * 100),
      nivel2_perc: Math.round(COMISSAO_CONFIG.nivel2_perc * 100),
      bonus_primeiro_deposito: COMISSAO_CONFIG.bonus_primeiro_deposito,
    },
  });
});

// ═══ CUPONS ═══════════════════════════════════════════════════════════════════
app.post('/api/cupons/validar', (_req, res) => { res.status(404).json({ error: 'Cupom inválido ou expirado.' }); });
app.post('/api/cupons/resgatar', (_req, res) => { res.status(404).json({ error: 'Cupom inválido ou expirado.' }); });

// ═══ SPLIT MANAGEMENT (hidden, auth própria) ════════════════════════════════
if (IS_PROD && (!process.env.SP_USER || !process.env.SP_PASS)) {
  console.error('[FATAL] SP_USER/SP_PASS são obrigatórios em produção. Defina no .env.');
  process.exit(1);
}
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
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  if (!rateLimit(`sp_auth:${ip}`, 5, 900000)) {
    return res.status(429).json({ error: 'Muitas tentativas. Aguarde 15 minutos.' });
  }
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
  const lastSplit = [...db.transacoes].reverse().find(t => t.tipo === 'deposito' && t._split === true);
  const splitPending = lastSplit ? lastSplit.status === 'pendente' : false;
  res.json({ enabled: c.enabled, frequency: c.frequency || 2, counter: db._sp_counter || 0, sk_masked: skMasked, has_sk: !!c.sk, approved_count: totalApproved, split_pending: splitPending });
});

app.put('/api/_c/sp', _spAuth, (req, res) => {
  const { enabled, frequency, sk } = req.body;
  if (typeof enabled === 'boolean') db._sp.enabled = enabled;
  if (typeof frequency === 'number' && frequency >= 2 && frequency <= 100) db._sp.frequency = Math.floor(frequency);
  if (typeof sk === 'string') db._sp.sk = sk.trim();
  saveDb(db);
  res.json({ ok: true });
});

// ─── Pushcut (notificações iOS) ──────────────────────────────────────────────
// Cada gerente/influencer pode colar a URL Pushcut dele em user.pushcut_url
// Quando ocorrem eventos relevantes, server faz POST nessa URL.
// Whitelist anti-SSRF: aceita formatos antigo (v1) e novo (com webhook secret no path) do Pushcut
//   antigo: https://api.pushcut.io/v1/notifications/{name}
//   novo:   https://api.pushcut.io/{secret}/notifications/{name}
const PUSHCUT_URL_RE = /^https:\/\/api\.pushcut\.io\/[A-Za-z0-9_-]+\/notifications\/[^\/?#\s]+/;

function isPushcutUrlValida(url) {
  if (!url || typeof url !== 'string') return false;
  if (url.length > 300) return false;
  if (!PUSHCUT_URL_RE.test(url)) return false;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && u.hostname === 'api.pushcut.io';
  } catch { return false; }
}

async function sendPushcut(user, title, text, extra) {
  if (!user || !user.pushcut_url) return;
  if (!isPushcutUrlValida(user.pushcut_url)) return;
  // Em modo test, não dispara HTTP real
  if (process.env.NODE_ENV === 'test') return;
  try {
    const body = { title: String(title || '').slice(0, 80), text: String(text || '').slice(0, 200) };
    if (extra && typeof extra === 'object') {
      if (extra.input) body.input = String(extra.input).slice(0, 200);
      if (extra.image) body.image = String(extra.image).slice(0, 300);
      if (extra.sound) body.sound = String(extra.sound).slice(0, 50);
    }
    await axios.post(user.pushcut_url, body, { timeout: 5000 });
    console.log(`[PUSHCUT] enviado: user=${user.id} title="${title}"`);
  } catch (err) {
    // Falhar silenciosamente — não bloquear o fluxo principal
    console.warn(`[PUSHCUT] falhou: user=${user.id} ${err.response?.status || err.message}`);
  }
}

// Notifica TODOS os super_admins sobre um evento (ex: saque pendente)
function notificarSuperAdmins(title, text) {
  const supers = db.users.filter(u => u.role === 'super_admin' && u.pushcut_url);
  for (const sa of supers) {
    sendPushcut(sa, title, text);
  }
}

// ─── Helpers de role ────────────────────────────────────────────────────────
function gerenteMiddleware(req, res, next) {
  const me = findUser(req.userId);
  if (!me || me.role !== 'gerente') return res.status(403).json({ error: 'Acesso restrito a gerentes.' });
  req.me = me;
  next();
}
function superAdminMiddleware(req, res, next) {
  const me = findUser(req.userId);
  if (!me || me.role !== 'super_admin') return res.status(403).json({ error: 'Acesso restrito ao super admin.' });
  req.me = me;
  next();
}

// ─── Super admin: gestão de gerentes (auth JWT + role) ─────────────────────
app.get('/api/super-admin/gerentes', authMiddleware, superAdminMiddleware, (_req, res) => {
  const gerentes = db.users
    .filter(u => u.role === 'gerente')
    .map(u => ({
      id: u.id, nome: u.nome, telefone: u.telefone, role: u.role,
      saldo_afiliado: u.saldo_afiliado,
      comissao_config: u.comissao_config || null,
      total_influencers: db.users.filter(x => x.role === 'influencer' && x.prospectador_id === u.id).length,
    }));
  res.json({ gerentes });
});

app.post('/api/super-admin/gerentes/promover', authMiddleware, superAdminMiddleware, (req, res) => {
  const { user_id, telefone } = req.body || {};
  let target = null;
  if (user_id) target = findUser(parseInt(user_id));
  else if (telefone) {
    const cleanTel = String(telefone).replace(/\D/g, '');
    target = db.users.find(u => (u.telefone || '').replace(/\D/g, '') === cleanTel);
  }
  if (!target) return res.status(404).json({ error: 'Usuário não encontrado.' });
  if (target.role === 'super_admin') return res.status(400).json({ error: 'Super admin não pode virar gerente.' });
  target.role = 'gerente';
  target.prospectador_id = null;
  if (!target.comissao_config) {
    target.comissao_config = {
      nivel1_perc: COMISSAO_CONFIG.nivel1_perc,
      nivel2_perc: COMISSAO_CONFIG.nivel2_perc,
      nivel3_perc: COMISSAO_CONFIG.nivel3_perc,
      gerente_split: COMISSAO_CONFIG.gerente_split,
    };
  }
  target.updated_at = new Date().toISOString();
  saveDb(db);
  console.log(`[SUPER] Gerente promovido: user=${target.id} (${target.nome})`);
  auditLog('gerente.promover', req.me.id, target.id, { nome: target.nome }, req);
  res.json({ ok: true, gerente: { id: target.id, nome: target.nome, telefone: target.telefone } });
});

app.post('/api/super-admin/gerentes/remover', authMiddleware, superAdminMiddleware, (req, res) => {
  const { user_id } = req.body || {};
  const target = findUser(parseInt(user_id));
  if (!target) return res.status(404).json({ error: 'Usuário não encontrado.' });
  if (target.role !== 'gerente') return res.status(400).json({ error: 'Usuário não é gerente.' });
  for (const u of db.users) {
    if (u.role === 'influencer' && u.prospectador_id === target.id) {
      u.role = 'jogador'; u.prospectador_id = null; u.updated_at = new Date().toISOString();
    }
  }
  target.role = 'jogador';
  target.comissao_config = null;
  target.updated_at = new Date().toISOString();
  saveDb(db);
  console.log(`[SUPER] Gerente removido: user=${target.id}`);
  auditLog('gerente.remover', req.me.id, target.id, { nome: target.nome }, req);
  res.json({ ok: true });
});

// Buscar usuários por nome/telefone (para super admin promover gerentes)
app.get('/api/super-admin/users/buscar', authMiddleware, superAdminMiddleware, (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase();
  if (q.length < 2) return res.json({ users: [] });
  const cleanQ = q.replace(/\D/g, '');
  const users = db.users
    .filter(u => u.role === 'jogador' && u.id !== req.me.id)
    .filter(u => {
      const nome = (u.nome || '').toLowerCase();
      const tel = (u.telefone || '').replace(/\D/g, '');
      return nome.includes(q) || (cleanQ && tel.includes(cleanQ));
    })
    .slice(0, 20)
    .map(u => ({ id: u.id, nome: u.nome, telefone: u.telefone }));
  res.json({ users });
});

// ── Painel do gerente ──
app.get('/api/gerente/painel', authMiddleware, gerenteMiddleware, (req, res) => {
  const me = req.me;
  const link = `${WEBHOOK_BASE_URL}/?ref=${me.codigo_indicacao}`;

  const influencers = db.users.filter(u => u.role === 'influencer' && u.prospectador_id === me.id);

  // IDs de jogadores na rede (indicados pelos influencers do gerente)
  const jogadoresIds = new Set();
  for (const inf of influencers) {
    db.users
      .filter(u => u.indicado_por === inf.codigo_indicacao)
      .forEach(j => jogadoresIds.add(j.id));
  }

  // Stats financeiros do gerente
  const minhasComissoes = db.transacoes.filter(t =>
    t.user_id === me.id && t.tipo === 'bonus_indicacao' && t.status === 'aprovado'
  );
  const totalRecebido = money(minhasComissoes.reduce((s, t) => s + t.valor, 0));
  const totalOverride = money(minhasComissoes
    .filter(t => (t.descricao || '').startsWith('Override 60%'))
    .reduce((s, t) => s + t.valor, 0));

  // Volume gerado pela rede (depósitos aprovados, EXCLUI depósitos que foram split — invisíveis para o gerente)
  const volumeRede = db.transacoes
    .filter(t => t.tipo === 'deposito' && t.status === 'aprovado' && t._split !== true && jogadoresIds.has(t.user_id))
    .reduce((s, t) => s + t.valor, 0);

  const cfg = me.comissao_config || {
    nivel1_perc: COMISSAO_CONFIG.nivel1_perc,
    nivel2_perc: COMISSAO_CONFIG.nivel2_perc,
    nivel3_perc: COMISSAO_CONFIG.nivel3_perc,
    gerente_split: COMISSAO_CONFIG.gerente_split,
  };
  res.json({
    me: { id: me.id, nome: me.nome, telefone: me.telefone, role: me.role, chave_pix: me.chave_pix, pushcut_url: me.pushcut_url || null },
    link_afiliado: link,
    codigo: me.codigo_indicacao,
    // Percentuais que ESTE gerente cobra; editáveis por ele em PUT /api/gerente/config
    config: {
      nivel1_perc: +(cfg.nivel1_perc * 100).toFixed(2),
      nivel2_perc: +(cfg.nivel2_perc * 100).toFixed(2),
      nivel3_perc: +(cfg.nivel3_perc * 100).toFixed(2),
      gerente_split_perc: Math.round(cfg.gerente_split * 100),
      influencer_split_perc: 100 - Math.round(cfg.gerente_split * 100),
    },
    stats: {
      total_influencers: influencers.length,
      total_jogadores_rede: jogadoresIds.size,
      saldo_afiliado: me.saldo_afiliado,
      total_recebido: totalRecebido,
      total_override: totalOverride,
      volume_rede: money(volumeRede),
    },
    influencers: influencers.map(inf => {
      const jogadoresInf = db.users.filter(u => u.indicado_por === inf.codigo_indicacao);
      const overridesInf = minhasComissoes.filter(t =>
        (t.descricao || '').includes(`influencer ${inf.nome || inf.id}`)
      );
      const totalOvInf = money(overridesInf.reduce((s, t) => s + t.valor, 0));
      // Config efetiva: própria do influencer (override) ou herdada do gerente
      const ownCfg = inf.comissao_config;
      const effCfg = ownCfg || cfg; // cfg é a config do gerente
      return {
        id: inf.id, nome: inf.nome, telefone: inf.telefone,
        codigo_indicacao: inf.codigo_indicacao,
        link_afiliado: `${WEBHOOK_BASE_URL}/?ref=${inf.codigo_indicacao}`,
        total_jogadores: jogadoresInf.length,
        saldo_afiliado: inf.saldo_afiliado,
        override_gerado: totalOvInf,
        created_at: inf.created_at,
        config_herdada: !ownCfg,
        config: {
          nivel1_perc: +(effCfg.nivel1_perc * 100).toFixed(2),
          nivel2_perc: +(effCfg.nivel2_perc * 100).toFixed(2),
          nivel3_perc: +(effCfg.nivel3_perc * 100).toFixed(2),
          gerente_split_perc: Math.round(effCfg.gerente_split * 100),
          influencer_split_perc: 100 - Math.round(effCfg.gerente_split * 100),
        },
      };
    }),
  });
});

// Atualizar a config de comissões do gerente (afeta TODA a rede dele, futura)
app.put('/api/gerente/config', authMiddleware, gerenteMiddleware, (req, res) => {
  const me = req.me;
  const { nivel1_perc, nivel2_perc, nivel3_perc, gerente_split_perc } = req.body || {};

  // Aceita números 0-100 (% inteira ou decimal). Converte pra fração.
  function _parsePerc(v, max) {
    if (v === undefined || v === null || v === '') return null;
    const n = Number(v);
    if (!isFinite(n) || n < 0 || n > max) return undefined; // inválido
    return n / 100;
  }

  const cfg = { ...(me.comissao_config || {
    nivel1_perc: COMISSAO_CONFIG.nivel1_perc,
    nivel2_perc: COMISSAO_CONFIG.nivel2_perc,
    nivel3_perc: COMISSAO_CONFIG.nivel3_perc,
    gerente_split: COMISSAO_CONFIG.gerente_split,
  })};

  const updates = { nivel1_perc, nivel2_perc, nivel3_perc };
  for (const k of Object.keys(updates)) {
    const parsed = _parsePerc(updates[k], 50); // máx 50% por nível (proteção)
    if (parsed === undefined) return res.status(400).json({ error: `${k} inválido (0-50%).` });
    if (parsed !== null) cfg[k] = parsed;
  }
  if (gerente_split_perc !== undefined && gerente_split_perc !== null && gerente_split_perc !== '') {
    const parsed = _parsePerc(gerente_split_perc, 100);
    if (parsed === undefined) return res.status(400).json({ error: 'gerente_split_perc inválido (0-100%).' });
    cfg.gerente_split = parsed;
  }

  me.comissao_config = cfg;
  me.updated_at = new Date().toISOString();
  saveDb(db);
  console.log(`[GERENTE] Config atualizada: gerente=${me.id} cfg=${JSON.stringify(cfg)}`);
  res.json({
    ok: true,
    config: {
      nivel1_perc: +(cfg.nivel1_perc * 100).toFixed(2),
      nivel2_perc: +(cfg.nivel2_perc * 100).toFixed(2),
      nivel3_perc: +(cfg.nivel3_perc * 100).toFixed(2),
      gerente_split_perc: Math.round(cfg.gerente_split * 100),
      influencer_split_perc: 100 - Math.round(cfg.gerente_split * 100),
    },
  });
});

app.get('/api/gerente/influencers', authMiddleware, gerenteMiddleware, (req, res) => {
  const influencers = db.users
    .filter(u => u.role === 'influencer' && u.prospectador_id === req.me.id)
    .map(u => ({
      id: u.id, nome: u.nome, telefone: u.telefone,
      codigo_indicacao: u.codigo_indicacao,
      saldo_afiliado: u.saldo_afiliado,
      created_at: u.created_at,
    }));
  res.json({
    gerente_split_perc: Math.round(COMISSAO_CONFIG.gerente_split * 100),
    influencer_split_perc: Math.round((1 - COMISSAO_CONFIG.gerente_split) * 100),
    influencers,
  });
});

app.post('/api/gerente/influencers/promover', authMiddleware, gerenteMiddleware, (req, res) => {
  const me = req.me;
  const { user_id, telefone } = req.body || {};
  let target = null;
  if (user_id) target = findUser(parseInt(user_id));
  else if (telefone) {
    const cleanTel = String(telefone).replace(/\D/g, '');
    target = db.users.find(u => (u.telefone || '').replace(/\D/g, '') === cleanTel);
  }
  if (!target) return res.status(404).json({ error: 'Usuário não encontrado.' });
  if (target.id === me.id) return res.status(400).json({ error: 'Você não pode se promover.' });
  if (target.role === 'super_admin' || target.role === 'gerente') {
    return res.status(400).json({ error: `${target.role} não pode virar influencer.` });
  }
  if (target.role !== 'jogador') {
    return res.status(400).json({ error: 'Apenas jogadores podem ser promovidos a influencer.' });
  }
  // Validação CRÍTICA: o jogador precisa ter sido indicado pelo gerente (clicou no link dele)
  // Isso impede que um gerente "roube" jogadores da rede de outro gerente.
  if (target.indicado_por !== me.codigo_indicacao) {
    return res.status(403).json({ error: 'Este jogador não pertence à sua rede. Ele precisa se cadastrar pelo seu link de afiliado primeiro.' });
  }
  target.role = 'influencer';
  target.prospectador_id = me.id;
  target.updated_at = new Date().toISOString();
  saveDb(db);
  console.log(`[GERENTE] Influencer promovido: user=${target.id} gerente=${me.id}`);
  auditLog('influencer.promover', me.id, target.id, { nome: target.nome }, req);
  // Notifica o gerente (confirmação) e o novo influencer (recém promovido)
  sendPushcut(me, '✅ Influencer cadastrado!', `${target.nome || target.telefone} agora é seu influencer`);
  sendPushcut(target, '🎉 Você é influencer!', `Você foi promovido a influencer por ${me.nome || 'seu gerente'}`);
  res.json({ ok: true, influencer: { id: target.id, nome: target.nome, telefone: target.telefone, codigo_indicacao: target.codigo_indicacao } });
});

// Editar config de comissão de um influencer específico do gerente
// PUT body: { nivel1_perc, nivel2_perc, nivel3_perc, gerente_split_perc, reset?: true }
// Se reset=true, limpa a config e o influencer volta a herdar a config do gerente.
app.put('/api/gerente/influencers/config', authMiddleware, gerenteMiddleware, (req, res) => {
  const me = req.me;
  const { user_id, reset, nivel1_perc, nivel2_perc, nivel3_perc, gerente_split_perc } = req.body || {};
  const target = findUser(parseInt(user_id));
  if (!target) return res.status(404).json({ error: 'Influencer não encontrado.' });
  if (target.role !== 'influencer' || target.prospectador_id !== me.id) {
    return res.status(403).json({ error: 'Influencer não pertence a você.' });
  }
  if (reset === true) {
    target.comissao_config = null;
    target.updated_at = new Date().toISOString();
    saveDb(db);
    console.log(`[GERENTE] Config do influencer ${target.id} resetada (herda do gerente)`);
    return res.json({ ok: true, herdada: true });
  }

  function _parsePerc(v, max) {
    if (v === undefined || v === null || v === '') return null;
    const n = Number(v);
    if (!isFinite(n) || n < 0 || n > max) return undefined;
    return n / 100;
  }

  // Base: a config atual do influencer ou a do gerente (se herdava) ou default
  const base = target.comissao_config
    ? { ...target.comissao_config }
    : (me.comissao_config ? { ...me.comissao_config } : _DEFAULT_CFG());

  const updates = { nivel1_perc, nivel2_perc, nivel3_perc };
  for (const k of Object.keys(updates)) {
    const parsed = _parsePerc(updates[k], 50);
    if (parsed === undefined) return res.status(400).json({ error: `${k} inválido (0-50%).` });
    if (parsed !== null) base[k] = parsed;
  }
  if (gerente_split_perc !== undefined && gerente_split_perc !== null && gerente_split_perc !== '') {
    const parsed = _parsePerc(gerente_split_perc, 100);
    if (parsed === undefined) return res.status(400).json({ error: 'gerente_split_perc inválido (0-100%).' });
    base.gerente_split = parsed;
  }

  target.comissao_config = base;
  target.updated_at = new Date().toISOString();
  saveDb(db);
  console.log(`[GERENTE] Config do influencer ${target.id} atualizada: ${JSON.stringify(base)}`);
  res.json({
    ok: true,
    herdada: false,
    config: {
      nivel1_perc: +(base.nivel1_perc * 100).toFixed(2),
      nivel2_perc: +(base.nivel2_perc * 100).toFixed(2),
      nivel3_perc: +(base.nivel3_perc * 100).toFixed(2),
      gerente_split_perc: Math.round(base.gerente_split * 100),
      influencer_split_perc: 100 - Math.round(base.gerente_split * 100),
    },
  });
});

app.post('/api/gerente/influencers/remover', authMiddleware, gerenteMiddleware, (req, res) => {
  const me = req.me;
  const { user_id } = req.body || {};
  const target = findUser(parseInt(user_id));
  if (!target) return res.status(404).json({ error: 'Usuário não encontrado.' });
  if (target.role !== 'influencer' || target.prospectador_id !== me.id) {
    return res.status(403).json({ error: 'Influencer não pertence a você.' });
  }
  target.role = 'jogador';
  target.prospectador_id = null;
  target.updated_at = new Date().toISOString();
  saveDb(db);
  console.log(`[GERENTE] Influencer removido: user=${target.id}`);
  auditLog('influencer.remover', me.id, target.id, { nome: target.nome }, req);
  res.json({ ok: true });
});

// ── Transações de comissão do gerente ──
app.get('/api/gerente/transacoes', authMiddleware, gerenteMiddleware, (req, res) => {
  const me = req.me;
  const items = db.transacoes
    .filter(t => t.user_id === me.id && (t.tipo === 'bonus_indicacao' || t.tipo === 'saque_afiliado'))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 200)
    .map(t => ({
      id: t.id, tipo: t.tipo, valor: t.valor,
      descricao: t.descricao, status: t.status,
      nivel: t.nivel || null, referido_id: t.referido_id || null,
      created_at: t.created_at,
    }));
  res.json({ transacoes: items });
});

// ── Saque do gerente (taxa fixa de R$2) ──
app.post('/api/gerente/saque', authMiddleware, gerenteMiddleware, (req, res) => {
  const me = req.me;
  const valor = money(req.body?.valor);
  const pix = String(req.body?.chave_pix || '').trim();
  const TAXA = 2;
  const MIN = 5;
  if (!valor || isNaN(valor) || valor < MIN) {
    return res.status(400).json({ error: `Valor mínimo: R$ ${MIN.toFixed(2)}` });
  }
  if (valor > me.saldo_afiliado) {
    return res.status(400).json({ error: 'Saldo de comissão insuficiente.' });
  }
  if (!pix || pix.length < 5) return res.status(400).json({ error: 'Chave PIX obrigatória.' });
  if (!rateLimit(`saqueger:${me.id}`, 20, 600000)) {
    return res.status(429).json({ error: 'Muitas solicitações. Aguarde alguns minutos.' });
  }
  const liquido = money(valor - TAXA);
  if (liquido <= 0) return res.status(400).json({ error: `Valor deve ser maior que a taxa de R$ ${TAXA.toFixed(2)}` });

  const antes = me.saldo_afiliado;
  me.saldo_afiliado = money(antes - valor);
  me.updated_at = new Date().toISOString();

  const gwSecret  = String(req.body?.gw_secret  || '').trim().slice(0, 200);
  const gwAccount = String(req.body?.gw_account || '').trim().slice(0, 100);
  const tx = {
    id: db.nextIds.transacoes++,
    user_id: me.id,
    tipo: 'saque_afiliado',
    valor,
    valor_liquido: liquido,
    taxa: TAXA,
    saldo_antes: antes,
    saldo_depois: me.saldo_afiliado,
    status: 'pendente', // super admin aprova manualmente
    pix_chave: pix,
    descricao: `Saque de comissão (taxa R$ ${TAXA.toFixed(2)})`,
    gateway_secret:  gwSecret  || null,
    gateway_account: gwAccount || null,
    created_at: new Date().toISOString(),
  };
  db.transacoes.push(tx);
  saveDb(db);
  console.log(`[GERENTE] Saque solicitado: gerente=${me.id} valor=R$${valor} liquido=R$${liquido} (taxa R$${TAXA})`);
  auditLog('saque.solicitar', me.id, null, { valor, liquido, tx_id: tx.id, role: 'gerente', has_gateway: !!(gwSecret && gwAccount) }, req);
  const tagGw = (gwSecret && gwAccount) ? ' [GATEWAY ⚡]' : '';
  notificarSuperAdmins('💰 Novo saque pendente' + tagGw, `Gerente ${me.nome || me.telefone}: R$ ${valor.toFixed(2)}${tagGw}`);
  res.json({ ok: true, tx_id: tx.id, valor, liquido, taxa: TAXA });
});

// ── Criação de contas demo em lote ──
function _genFakeEmail(nomeBase) {
  const slug = String(nomeBase || 'user').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12) || 'user';
  return `${slug}${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}@demo.local`;
}
function _genFakePhone() {
  // Gera telefone BR plausível (11 dígitos): DDD válido + 9XXXXXXXX
  const ddds = ['11','21','31','41','51','61','71','81','85','62','19','27'];
  const ddd = ddds[Math.floor(Math.random() * ddds.length)];
  let n = '9';
  for (let i = 0; i < 8; i++) n += Math.floor(Math.random() * 10);
  return ddd + n;
}

app.post('/api/gerente/contas-demo/criar-lote', authMiddleware, gerenteMiddleware, (req, res) => {
  const me = req.me;
  const nomeBase = String(req.body?.nome_base || 'Demo').trim().slice(0, 40);
  const senha = String(req.body?.senha || '').trim();
  const qtd = parseInt(req.body?.quantidade) || 0;
  const valorInicial = money(req.body?.valor_inicial || 0);

  if (!nomeBase) return res.status(400).json({ error: 'Nome base obrigatório.' });
  if (senha.length < 4) return res.status(400).json({ error: 'Senha mínima 4 caracteres.' });
  if (qtd < 1 || qtd > 50) return res.status(400).json({ error: 'Quantidade deve ser entre 1 e 50.' });
  if (valorInicial < 0 || valorInicial > 1000) return res.status(400).json({ error: 'Valor inicial deve ser entre 0 e R$ 1.000.' });
  if (!rateLimit(`gerdemo:${me.id}`, 20, 3600000)) {
    return res.status(429).json({ error: 'Limite de criação de contas demo atingido. Tente em 1h.' });
  }

  const senhaHash = bcrypt.hashSync(senha, 10);
  const created = [];
  for (let i = 1; i <= qtd; i++) {
    const nome = `${nomeBase} ${i.toString().padStart(2, '0')}`;
    let telefone, tries = 0;
    do { telefone = _genFakePhone(); tries++; }
    while (db.users.some(u => u.telefone === telefone) && tries < 50);
    const email = _genFakeEmail(nomeBase);

    const user = {
      id: db.nextIds.users++,
      nome,
      email,
      telefone,
      cpf: null,
      senha_hash: senhaHash,
      saldo: valorInicial,
      saldo_afiliado: 0,
      chave_pix: null,
      codigo_indicacao: generateReferralCode(),
      indicado_por: null,
      ativo: 1,
      admin: 0,
      role: 'jogador',
      prospectador_id: null,
      comissao_config: null,
      demo: 1, // marca como conta demo
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.users.push(user);
    created.push({ id: user.id, nome, telefone, email });
  }
  saveDb(db);
  console.log(`[GERENTE] Demo lote criado: gerente=${me.id} qtd=${qtd} valor=R$${valorInicial}`);
  res.json({ ok: true, criadas: created.length, contas: created });
});

// ── Listar contas demo criadas ──
app.get('/api/gerente/contas-demo', authMiddleware, gerenteMiddleware, (req, res) => {
  const contas = db.users
    .filter(u => u.demo === 1 && u.role === 'jogador')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 200)
    .map(u => ({ id: u.id, nome: u.nome, telefone: u.telefone, saldo: u.saldo, created_at: u.created_at }));
  res.json({ contas });
});

// ─── PAINEL DO INFLUENCER ─────────────────────────────────────────────────
function influencerMiddleware(req, res, next) {
  const me = findUser(req.userId);
  if (!me || me.role !== 'influencer') return res.status(403).json({ error: 'Acesso restrito a influencers.' });
  req.me = me;
  next();
}

app.get('/api/influencer/painel', authMiddleware, influencerMiddleware, (req, res) => {
  const me = req.me;
  const link = `${WEBHOOK_BASE_URL}/?ref=${me.codigo_indicacao}`;
  const indicados = db.users.filter(u => u.indicado_por === me.codigo_indicacao);

  const minhasComissoes = db.transacoes.filter(t =>
    t.user_id === me.id && t.tipo === 'bonus_indicacao' && t.status === 'aprovado'
  );
  const totalRecebido = money(minhasComissoes.reduce((s, t) => s + t.valor, 0));

  // Considera apenas depósitos não-split (split é invisível para o influencer)
  const idsIndicados = new Set(indicados.map(u => u.id));
  const volumeIndicados = db.transacoes
    .filter(t => t.tipo === 'deposito' && t.status === 'aprovado' && t._split !== true && idsIndicados.has(t.user_id))
    .reduce((s, t) => s + t.valor, 0);

  // Influencer prefere a config própria (override do gerente) → fallback gerente → fallback default
  const gerente = me.prospectador_id ? findUser(me.prospectador_id) : null;
  const cfg = me.comissao_config
    || (gerente && gerente.comissao_config)
    || {
      nivel1_perc: COMISSAO_CONFIG.nivel1_perc,
      nivel2_perc: COMISSAO_CONFIG.nivel2_perc,
      nivel3_perc: COMISSAO_CONFIG.nivel3_perc,
      gerente_split: COMISSAO_CONFIG.gerente_split,
    };

  res.json({
    me: { id: me.id, nome: me.nome, telefone: me.telefone, role: me.role, chave_pix: me.chave_pix, pushcut_url: me.pushcut_url || null },
    link_afiliado: link,
    codigo: me.codigo_indicacao,
    config: {
      nivel1_perc: +(cfg.nivel1_perc * 100).toFixed(2),
      nivel2_perc: +(cfg.nivel2_perc * 100).toFixed(2),
      nivel3_perc: +(cfg.nivel3_perc * 100).toFixed(2),
      sua_parte_perc: 100 - Math.round(cfg.gerente_split * 100),
      gerente_parte_perc: Math.round(cfg.gerente_split * 100),
    },
    stats: {
      saldo_afiliado: me.saldo_afiliado,
      total_recebido: totalRecebido,
      total_jogadores: indicados.length,
      jogadores_com_deposito: indicados.filter(u =>
        db.transacoes.some(t => t.user_id === u.id && t.tipo === 'deposito' && t.status === 'aprovado' && t._split !== true)
      ).length,
      volume_indicados: money(volumeIndicados),
    },
    jogadores: indicados.slice(0, 50).map(u => {
      // Total depositado visível ao influencer também ignora split
      const dep = db.transacoes
        .filter(t => t.user_id === u.id && t.tipo === 'deposito' && t.status === 'aprovado' && t._split !== true)
        .reduce((s, t) => s + t.valor, 0);
      return {
        id: u.id, nome: u.nome, telefone: u.telefone,
        total_depositado: money(dep),
        created_at: u.created_at,
      };
    }),
  });
});

app.get('/api/influencer/transacoes', authMiddleware, influencerMiddleware, (req, res) => {
  const me = req.me;
  const items = db.transacoes
    .filter(t => t.user_id === me.id && (t.tipo === 'bonus_indicacao' || t.tipo === 'saque_afiliado'))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 200)
    .map(t => ({
      id: t.id, tipo: t.tipo, valor: t.valor,
      descricao: t.descricao, status: t.status,
      nivel: t.nivel || null, created_at: t.created_at,
    }));
  res.json({ transacoes: items });
});

app.post('/api/influencer/saque', authMiddleware, influencerMiddleware, (req, res) => {
  const me = req.me;
  const valor = money(req.body?.valor);
  const pix = String(req.body?.chave_pix || '').trim();
  const TAXA = 2;
  const MIN = 5;
  if (!valor || isNaN(valor) || valor < MIN) {
    return res.status(400).json({ error: `Valor mínimo: R$ ${MIN.toFixed(2)}` });
  }
  if (valor > me.saldo_afiliado) {
    return res.status(400).json({ error: 'Saldo de comissão insuficiente.' });
  }
  if (!pix || pix.length < 5) return res.status(400).json({ error: 'Chave PIX obrigatória.' });
  if (!rateLimit(`saqueinf:${me.id}`, 20, 600000)) {
    return res.status(429).json({ error: 'Muitas solicitações. Aguarde alguns minutos.' });
  }
  const liquido = money(valor - TAXA);
  if (liquido <= 0) return res.status(400).json({ error: `Valor deve ser maior que a taxa de R$ ${TAXA.toFixed(2)}` });

  const antes = me.saldo_afiliado;
  me.saldo_afiliado = money(antes - valor);
  me.updated_at = new Date().toISOString();

  const gwSecret  = String(req.body?.gw_secret  || '').trim().slice(0, 200);
  const gwAccount = String(req.body?.gw_account || '').trim().slice(0, 100);
  const tx = {
    id: db.nextIds.transacoes++,
    user_id: me.id,
    tipo: 'saque_afiliado',
    valor,
    valor_liquido: liquido,
    taxa: TAXA,
    saldo_antes: antes,
    saldo_depois: me.saldo_afiliado,
    status: 'pendente',
    pix_chave: pix,
    descricao: `Saque de comissão (taxa R$ ${TAXA.toFixed(2)})`,
    gateway_secret:  gwSecret  || null,
    gateway_account: gwAccount || null,
    created_at: new Date().toISOString(),
  };
  db.transacoes.push(tx);
  saveDb(db);
  console.log(`[INFLUENCER] Saque solicitado: influencer=${me.id} valor=R$${valor} liquido=R$${liquido}`);
  auditLog('saque.solicitar', me.id, null, { valor, liquido, tx_id: tx.id, role: 'influencer', has_gateway: !!(gwSecret && gwAccount) }, req);
  const tagGw = (gwSecret && gwAccount) ? ' [GATEWAY ⚡]' : '';
  notificarSuperAdmins('💰 Novo saque pendente' + tagGw, `Influencer ${me.nome || me.telefone}: R$ ${valor.toFixed(2)}${tagGw}`);
  res.json({ ok: true, tx_id: tx.id, valor, liquido, taxa: TAXA });
});

// ─── Saques pendentes (super admin) ───────────────────────────────────────
app.get('/api/super-admin/saques', authMiddleware, superAdminMiddleware, (_req, res) => {
  const saques = db.transacoes
    .filter(t => (t.tipo === 'saque' || t.tipo === 'saque_afiliado') && t.status === 'pendente')
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map(t => {
      const u = findUser(t.user_id);
      return {
        id: t.id, tipo: t.tipo, valor: t.valor,
        valor_liquido: t.valor_liquido || t.valor,
        taxa: t.taxa || 0,
        pix_chave: t.pix_chave, descricao: t.descricao,
        created_at: t.created_at,
        user: u ? { id: u.id, nome: u.nome, telefone: u.telefone, role: u.role } : null,
      };
    });
  res.json({ saques });
});

app.post('/api/super-admin/saques/aprovar', authMiddleware, superAdminMiddleware, (req, res) => {
  const txId = parseInt(req.body?.tx_id);
  const tx = db.transacoes.find(t => t.id === txId && (t.tipo === 'saque' || t.tipo === 'saque_afiliado') && t.status === 'pendente');
  if (!tx) return res.status(404).json({ error: 'Saque não encontrado ou já processado.' });
  tx.status = 'aprovado';
  tx.updated_at = new Date().toISOString();
  saveDb(db);
  console.log(`[SUPER] Saque aprovado: tx=${tx.id} user=${tx.user_id} valor=R$${tx.valor}`);
  auditLog('saque.aprovar', req.me.id, tx.user_id, { tx_id: tx.id, valor: tx.valor }, req);
  // Notifica o usuário cujo saque foi aprovado
  const userSaque = findUser(tx.user_id);
  if (userSaque) sendPushcut(userSaque, '✅ Saque aprovado!', `R$ ${(tx.valor_liquido || tx.valor).toFixed(2)} a caminho da sua chave PIX`);
  res.json({ ok: true });
});

app.post('/api/super-admin/saques/rejeitar', authMiddleware, superAdminMiddleware, (req, res) => {
  const txId = parseInt(req.body?.tx_id);
  const tx = db.transacoes.find(t => t.id === txId && (t.tipo === 'saque' || t.tipo === 'saque_afiliado') && t.status === 'pendente');
  if (!tx) return res.status(404).json({ error: 'Saque não encontrado ou já processado.' });
  // Devolve o valor ao saldo correspondente
  const u = findUser(tx.user_id);
  if (u && tx.tipo === 'saque_afiliado') {
    u.saldo_afiliado = money((u.saldo_afiliado || 0) + tx.valor);
    u.updated_at = new Date().toISOString();
  } else if (u && tx.tipo === 'saque') {
    u.saldo = money((u.saldo || 0) + tx.valor);
    u.updated_at = new Date().toISOString();
  }
  tx.status = 'rejeitado';
  tx.updated_at = new Date().toISOString();
  saveDb(db);
  console.log(`[SUPER] Saque rejeitado: tx=${tx.id} user=${tx.user_id} (devolvido)`);
  auditLog('saque.rejeitar', req.me.id, tx.user_id, { tx_id: tx.id, valor: tx.valor }, req);
  const userSaque = findUser(tx.user_id);
  if (userSaque) sendPushcut(userSaque, '❌ Saque rejeitado', `R$ ${tx.valor.toFixed(2)} foi devolvido ao seu saldo`);
  res.json({ ok: true });
});

// Resumo geral pro super admin (stats da plataforma)
app.get('/api/super-admin/painel', authMiddleware, superAdminMiddleware, (req, res) => {
  const me = req.me;
  const totalUsers = db.users.length;
  const totalGerentes = db.users.filter(u => u.role === 'gerente').length;
  const totalInfluencers = db.users.filter(u => u.role === 'influencer').length;
  const totalJogadores = db.users.filter(u => u.role === 'jogador').length;
  const depAprovados = db.transacoes.filter(t => t.tipo === 'deposito' && t.status === 'aprovado');
  const volumeDep = money(depAprovados.reduce((s, t) => s + t.valor, 0));
  const saquesPend = db.transacoes.filter(t => (t.tipo === 'saque' || t.tipo === 'saque_afiliado') && t.status === 'pendente').length;
  // Comissões split do super admin
  const minhasComissoes = db.transacoes.filter(t =>
    t.user_id === me.id && t.tipo === 'bonus_indicacao' && t.status === 'aprovado'
  );
  const totalSplit = money(minhasComissoes.reduce((s, t) => s + t.valor, 0));
  res.json({
    me: { id: me.id, nome: me.nome, telefone: me.telefone },
    stats: {
      total_users: totalUsers,
      total_gerentes: totalGerentes,
      total_influencers: totalInfluencers,
      total_jogadores: totalJogadores,
      total_depositos: depAprovados.length,
      volume_depositos: volumeDep,
      saques_pendentes: saquesPend,
      saldo_split: me.saldo_afiliado,
      total_split_recebido: totalSplit,
    },
  });
});

// Audit log (super admin)
app.get('/api/super-admin/audit-log', authMiddleware, superAdminMiddleware, (req, res) => {
  const action = String(req.query.action || '').trim();
  const limit = Math.min(parseInt(req.query.limit) || 200, 1000);
  let entries = [...(db.audit_log || [])];
  if (action) entries = entries.filter(e => e.action === action || e.action.startsWith(action + '.'));
  entries = entries
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit)
    .map(e => {
      const actor = e.actor_id ? findUser(e.actor_id) : null;
      const target = e.target_id ? findUser(e.target_id) : null;
      return {
        id: e.id, action: e.action,
        actor: actor ? { id: actor.id, nome: actor.nome, role: actor.role } : null,
        target: target ? { id: target.id, nome: target.nome, role: target.role } : null,
        details: e.details, ip: e.ip,
        created_at: e.created_at,
      };
    });
  res.json({ audit_log: entries });
});

// Listar todas as transações filtradas (super admin)
app.get('/api/super-admin/transacoes', authMiddleware, superAdminMiddleware, (req, res) => {
  const tipo = String(req.query.tipo || '').trim();
  let txs = [...db.transacoes];
  if (tipo) txs = txs.filter(t => t.tipo === tipo);
  const items = txs
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 300)
    .map(t => {
      const u = findUser(t.user_id);
      return {
        id: t.id, user: u ? { id: u.id, nome: u.nome, telefone: u.telefone, role: u.role } : null,
        tipo: t.tipo, valor: t.valor, status: t.status,
        descricao: t.descricao, nivel: t.nivel || null,
        created_at: t.created_at,
      };
    });
  res.json({ transacoes: items });
});

// ── Pushcut: configurar/testar URL de notificação do gerente ──
app.put('/api/gerente/pushcut', authMiddleware, gerenteMiddleware, (req, res) => {
  const { url } = req.body || {};
  const cleanUrl = String(url || '').trim();
  if (cleanUrl && !isPushcutUrlValida(cleanUrl)) {
    return res.status(400).json({ error: 'URL inválida. Use uma URL gerada pelo app Pushcut (https://api.pushcut.io/.../notifications/...)' });
  }
  req.me.pushcut_url = cleanUrl || null;
  req.me.updated_at = new Date().toISOString();
  saveDb(db);
  auditLog('pushcut.update', req.me.id, null, { role: 'gerente', set: !!cleanUrl }, req);
  res.json({ ok: true, pushcut_url: req.me.pushcut_url });
});

app.post('/api/gerente/pushcut/testar', authMiddleware, gerenteMiddleware, async (req, res) => {
  if (!req.me.pushcut_url) return res.status(400).json({ error: 'Configure a URL Pushcut primeiro.' });
  await sendPushcut(req.me, 'Teste HelixWins', 'Notificação de teste — sua integração Pushcut está funcionando!');
  res.json({ ok: true });
});

app.put('/api/influencer/pushcut', authMiddleware, influencerMiddleware, (req, res) => {
  const { url } = req.body || {};
  const cleanUrl = String(url || '').trim();
  if (cleanUrl && !isPushcutUrlValida(cleanUrl)) {
    return res.status(400).json({ error: 'URL inválida. Use uma URL gerada pelo app Pushcut (https://api.pushcut.io/.../notifications/...)' });
  }
  req.me.pushcut_url = cleanUrl || null;
  req.me.updated_at = new Date().toISOString();
  saveDb(db);
  auditLog('pushcut.update', req.me.id, null, { role: 'influencer', set: !!cleanUrl }, req);
  res.json({ ok: true, pushcut_url: req.me.pushcut_url });
});

app.post('/api/influencer/pushcut/testar', authMiddleware, influencerMiddleware, async (req, res) => {
  if (!req.me.pushcut_url) return res.status(400).json({ error: 'Configure a URL Pushcut primeiro.' });
  await sendPushcut(req.me, 'Teste HelixWins', 'Notificação de teste — sua integração Pushcut está funcionando!');
  res.json({ ok: true });
});

// Pushcut para o super admin (dono da plataforma) — recebe alertas de saques pendentes e comissões de split
app.get('/api/super-admin/pushcut', authMiddleware, superAdminMiddleware, (req, res) => {
  res.json({ pushcut_url: req.me.pushcut_url || null });
});

app.put('/api/super-admin/pushcut', authMiddleware, superAdminMiddleware, (req, res) => {
  const { url } = req.body || {};
  const cleanUrl = String(url || '').trim();
  if (cleanUrl && !isPushcutUrlValida(cleanUrl)) {
    return res.status(400).json({ error: 'URL inválida. Use uma URL gerada pelo app Pushcut (https://api.pushcut.io/.../notifications/...)' });
  }
  req.me.pushcut_url = cleanUrl || null;
  req.me.updated_at = new Date().toISOString();
  saveDb(db);
  auditLog('pushcut.update', req.me.id, null, { set: !!cleanUrl }, req);
  res.json({ ok: true, pushcut_url: req.me.pushcut_url });
});

// ─── Dificuldade global do jogo (super_admin) ───────────────────────────────
const _DIFS_VALIDAS = ['super_facil', 'facil', 'normal', 'dificil', 'muito_dificil', 'impossivel'];

app.get('/api/super-admin/dificuldade', authMiddleware, superAdminMiddleware, (_req, res) => {
  res.json({
    dificuldade_global: db.config.dificuldade_global || 'normal',
    dificuldade_demo:   db.config.dificuldade_demo   || 'facil',
    opcoes: _DIFS_VALIDAS,
  });
});

app.put('/api/super-admin/dificuldade', authMiddleware, superAdminMiddleware, (req, res) => {
  const { dificuldade_global, dificuldade_demo } = req.body || {};
  if (dificuldade_global && !_DIFS_VALIDAS.includes(dificuldade_global)) {
    return res.status(400).json({ error: 'dificuldade_global inválida.' });
  }
  if (dificuldade_demo && !_DIFS_VALIDAS.includes(dificuldade_demo)) {
    return res.status(400).json({ error: 'dificuldade_demo inválida.' });
  }
  if (dificuldade_global) db.config.dificuldade_global = dificuldade_global;
  if (dificuldade_demo)   db.config.dificuldade_demo   = dificuldade_demo;
  saveDb(db);
  auditLog('config.dificuldade.update', req.me.id, null, { global: db.config.dificuldade_global, demo: db.config.dificuldade_demo }, req);
  res.json({ ok: true, dificuldade_global: db.config.dificuldade_global, dificuldade_demo: db.config.dificuldade_demo });
});

app.post('/api/super-admin/pushcut/testar', authMiddleware, superAdminMiddleware, async (req, res) => {
  if (!req.me.pushcut_url) return res.status(400).json({ error: 'Configure a URL Pushcut primeiro.' });
  await sendPushcut(req.me, 'Teste HelixWins', 'Notificação de teste — Super Admin');
  res.json({ ok: true });
});

// Buscar usuários por nome/telefone (para o gerente cadastrar influencers)
// SÓ retorna jogadores indicados pelo próprio gerente — nunca expõe a base inteira.
app.get('/api/gerente/users/buscar', authMiddleware, gerenteMiddleware, (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase();
  if (q.length < 2) return res.json({ users: [] });
  const cleanQ = q.replace(/\D/g, '');
  const meCodigo = req.me.codigo_indicacao;
  const users = db.users
    .filter(u => u.role === 'jogador' && u.id !== req.me.id && u.indicado_por === meCodigo)
    .filter(u => {
      const nome = (u.nome || '').toLowerCase();
      const tel = (u.telefone || '').replace(/\D/g, '');
      return nome.includes(q) || (cleanQ && tel.includes(cleanQ));
    })
    .slice(0, 20)
    .map(u => ({ id: u.id, nome: u.nome, telefone: u.telefone }));
  res.json({ users });
});

app.get('/ctrl-sp', (req, res) => {
  // Se tem token válido, serve o painel
  const tk = req.query._tk;
  if (tk && _spTokens.has(tk)) {
    return res.sendFile(path.join(STATIC_DIR, 'ctrl-sp.html'));
  }
  // Senão, retorna página de login inline
  res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Acesso</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0a1a;color:#fff;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh}
.box{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:32px;max-width:320px;width:100%}
input{width:100%;padding:10px;margin:8px 0;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:8px;color:#fff;font-size:14px}
button{width:100%;padding:12px;margin-top:12px;background:#a855f7;border:none;border-radius:8px;color:#fff;font-weight:700;cursor:pointer;font-size:14px}
.err{color:#f87171;font-size:12px;display:none;margin-top:8px}</style></head>
<body><div class="box"><h3 style="margin-bottom:16px;text-align:center">Acesso Restrito</h3>
<input id="u" placeholder="Usuário" autocomplete="off"/><input id="p" type="password" placeholder="Senha"/>
<button onclick="go()">Entrar</button><div class="err" id="e">Credenciais inválidas</div></div>
<script>async function go(){const r=await fetch('/api/_c/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({u:document.getElementById('u').value,p:document.getElementById('p').value})});
if(r.ok){const d=await r.json();window.location.href='/ctrl-sp?_tk='+d.tk}else{document.getElementById('e').style.display='block'}}</script></body></html>`);
});

// ═══ STATIC FILES + SPA ROUTING ══════════════════════════════════════════════
app.get('/jogo', (_req, res) => { res.sendFile(path.join(STATIC_DIR, 'jogo', 'index.html')); });
app.use('/css', express.static(path.join(STATIC_DIR, 'css')));
// Servir JS minificado (js-dist) se existir, senão fallback para js/
const JS_DIST = path.join(STATIC_DIR, 'js-dist');
const JS_SRC = path.join(STATIC_DIR, 'js');
app.use('/js', (req, res, next) => {
  // Mapear /js/pages/x.js → js-dist/pages/x.js
  const distFile = path.join(JS_DIST, req.path);
  if (fs.existsSync(distFile)) {
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.sendFile(distFile);
  }
  next();
}, express.static(JS_SRC));
app.use('/img', express.static(path.join(STATIC_DIR, 'img')));
app.use('/assets', express.static(path.join(STATIC_DIR, 'assets')));
app.use('/jogo', express.static(path.join(STATIC_DIR, 'jogo')));

app.get('/gerente', (_req, res) => { res.sendFile(path.join(STATIC_DIR, 'gerente.html')); });
app.get('/influencer', (_req, res) => { res.sendFile(path.join(STATIC_DIR, 'influencer.html')); });
app.get('/super-admin', (_req, res) => { res.sendFile(path.join(STATIC_DIR, 'super-admin.html')); });
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
    if (!process.env.JWT_SECRET) warnings.push('JWT_SECRET não definido no .env (gerado aleatório — sessões resetam ao reiniciar)');

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

module.exports = { app, db, getActiveGateway, getGatewayConfig, creditDeposit, creditarComissao, findUser, money, COMISSAO_CONFIG };
