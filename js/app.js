// ─── Config pública cacheada ──────────────────────────────────────────────────
let _publicCfgCache = null;
async function getPublicConfig(force = false) {
  if (!force && _publicCfgCache) return _publicCfgCache;
  try {
    const r = await fetch('/api/public/config?_=' + Date.now());
    _publicCfgCache = await r.json();
  } catch { _publicCfgCache = {}; }
  return _publicCfgCache;
}
window.invalidatePublicCfgCache = function() { _publicCfgCache = null; };

async function applyBranding(force = false) {
  const cfg     = await getPublicConfig(force);
  const nome    = cfg.site_nome    || 'HelixWin';
  const suporte = cfg.site_suporte || '';
  const promo   = cfg.site_promo   || '';
  const logoUrl    = cfg.site_logo_url    || null;
  const faviconUrl = cfg.site_favicon_url || null;

  document.querySelectorAll('.brand-name').forEach(el => { el.textContent = nome; });
  document.title = `${nome} - Gire e ganhe`;
  document.querySelectorAll('[data-suporte-href]').forEach(el => {
    el.href = suporte || '#';
    el.style.display = suporte ? '' : 'none';
  });
  document.querySelectorAll('.brand-promo').forEach(el => {
    el.textContent = promo;
    el.style.display = promo ? '' : 'none';
  });

  // Logo dinâmico
  document.querySelectorAll('.brand-logo-wrap').forEach(wrap => {
    const imgEl  = wrap.querySelector('.brand-logo-img');
    const iconEl = wrap.querySelector('.brand-logo-icon');
    const nameEl = wrap.querySelector('.brand-name');
    if (logoUrl) {
      if (imgEl)  { imgEl.src = logoUrl + '?t=' + Date.now(); imgEl.style.display = ''; }
      if (iconEl) iconEl.style.display = 'none';
      if (nameEl) nameEl.style.display = 'none';
    } else {
      if (imgEl)  imgEl.style.display = 'none';
      if (iconEl) iconEl.style.display = '';
      if (nameEl) { nameEl.style.display = ''; nameEl.textContent = nome; }
    }
  });

  // Favicon
  if (faviconUrl) {
    let link = document.querySelector('link[rel~="icon"]');
    if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
    link.href = faviconUrl + '?t=' + Date.now();
  }
}
window.getPublicConfig = getPublicConfig;

// ─── Router SPA ───────────────────────────────────────────────────────────────
const PROTECTED = ['#painel', '#jogo'];
const PUBLIC    = ['#login', '#cadastro', '#landing', ''];

const Pages = {
  landing:  typeof renderLanding  !== 'undefined' ? renderLanding  : null,
  login:    typeof renderLogin    !== 'undefined' ? renderLogin    : null,
  cadastro: typeof renderCadastro !== 'undefined' ? renderCadastro : null,
  painel:   typeof renderPainel   !== 'undefined' ? renderPainel   : null,
  jogo:     typeof renderJogo     !== 'undefined' ? renderJogo     : null,
};

let currentPage = null;
let cleanupFn   = null;

function navigate(hash) {
  window.location.hash = hash;
}

function getHash() {
  return window.location.hash || '#landing';
}

async function route() {
  const hash     = getHash();
  const pageName = hash.replace('#', '') || 'landing';
  const pageEl   = document.getElementById(`page-${pageName}`);

  if (!pageEl) {
    navigate('#landing');
    return;
  }

  // Verificar autenticação
  const isProtected = PROTECTED.includes(hash);
  const token       = API.getToken();

  // Permitir acesso a #jogo sem token se for modo demo
  const isDemoGame = hash === '#jogo' && (() => {
    try { return JSON.parse(sessionStorage.getItem('partida_atual'))?.modo_demo === true; }
    catch { return false; }
  })();

  if (isProtected && !token && !isDemoGame) {
    navigate('#login');
    return;
  }
  if ((hash === '#login' || hash === '#cadastro') && token) {
    navigate('#painel');
    return;
  }

  // Cleanup da página anterior
  if (typeof cleanupFn === 'function') {
    cleanupFn();
    cleanupFn = null;
  }

  // Esconder todas as páginas
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Ativar página
  pageEl.classList.add('active');
  currentPage = pageName;

  // Renderizar
  const renderer = Pages[pageName];
  if (typeof renderer === 'function') {
    cleanupFn = await renderer(pageEl) || null;
  }
  // Aplicar branding dinâmico (nome da plataforma, suporte, etc.)
  applyBranding();

  // Scroll ao topo
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// Verificar token válido ao carregar página protegida
async function checkAuth() {
  const token = API.getToken();
  if (!token) return false;
  try {
    await API.me();
    return true;
  } catch {
    API.clearToken();
    return false;
  }
}

// Iniciar router
window.addEventListener('hashchange', () => route());
window.addEventListener('DOMContentLoaded', async () => {
  const hash = getHash();
  const isDemoGame = hash === '#jogo' && (() => {
    try { return JSON.parse(sessionStorage.getItem('partida_atual'))?.modo_demo === true; }
    catch { return false; }
  })();
  if (PROTECTED.includes(hash) && !isDemoGame) {
    showLoading();
    const ok = await checkAuth();
    hideLoading();
    if (!ok) { navigate('#login'); return; }
  }
  route();
});

// Expor navigate globalmente
window.navigate = navigate;
