// ─── API Client ───────────────────────────────────────────────────────────────
// Autenticação via httpOnly cookie (setado pelo servidor).
// O token em localStorage é mantido apenas para verificar se há sessão ativa
// no lado do cliente (routing). O cookie httpOnly é imune a XSS.
const API = (() => {
  const BASE = '/api';

  // Sessão marker: indica se o usuário fez login (não contém o token real)
  function getToken() {
    return localStorage.getItem('hw_session');
  }
  function setToken(t) {
    if (t) localStorage.setItem('hw_session', '1');
    else   localStorage.removeItem('hw_session');
  }
  function clearToken() {
    localStorage.removeItem('hw_session');
    localStorage.removeItem('hw_user');
  }

  function saveUser(u) {
    // Armazenar apenas dados não-sensíveis para UI
    if (u) {
      const { id, nome, email, telefone, saldo, saldo_afiliado, chave_pix, codigo_indicacao, created_at, admin } = u;
      localStorage.setItem('hw_user', JSON.stringify({ id, nome, email, telefone, saldo, saldo_afiliado, chave_pix, codigo_indicacao, created_at, admin: !!admin }));
    }
  }
  function getUser() {
    try { return JSON.parse(localStorage.getItem('hw_user') || 'null'); } catch { return null; }
  }

  async function request(method, path, body = null, auth = true) {
    const headers = { 'Content-Type': 'application/json' };
    // Cookie httpOnly é enviado automaticamente pelo browser (credentials: 'same-origin')

    const opts = { method, headers, credentials: 'same-origin' };
    if (body && method !== 'GET') opts.body = JSON.stringify(body);

    const res = await fetch(BASE + path, opts);
    const data = await res.json().catch(() => ({}));

    if (res.status === 401) {
      if (auth) {
        clearToken();
        window.location.hash = '#login';
      }
      throw new Error(data.error || 'Sessão expirada.');
    }
    if (!res.ok) {
      const err = new Error(data.error || `Erro ${res.status}`);
      err.data = data;
      err.code = data.code || null;
      throw err;
    }
    return data;
  }

  // ── Auth ─────────────────────────────────────────────────────────────────
  async function login(telefone, senha) {
    const data = await request('POST', '/auth/login', { telefone, senha }, false);
    setToken(data.token); // marca sessão ativa
    saveUser(data.user);
    return data;
  }

  async function register(payload) {
    const data = await request('POST', '/auth/register', payload, false);
    setToken(data.token);
    saveUser(data.user);
    return data;
  }

  async function me() {
    const data = await request('GET', '/auth/me');
    saveUser(data.user);
    return data;
  }

  async function logout() {
    try { await request('POST', '/auth/logout', null, false); } catch {}
    clearToken();
  }

  // ── User ─────────────────────────────────────────────────────────────────
  async function dashboard() {
    return request('GET', '/user/dashboard');
  }
  async function salvarPix(chave_pix) {
    return request('PUT', '/user/pix', { chave_pix });
  }
  async function alterarSenha(senha_atual, senha_nova) {
    return request('PUT', '/user/senha', { senha_atual, senha_nova });
  }

  // ── Game ─────────────────────────────────────────────────────────────────
  async function gameConfigs() {
    return request('GET', '/game/configs');
  }
  async function iniciarPartida(valor_entrada) {
    return request('POST', '/game/iniciar', { valor_entrada });
  }
  async function finalizarPartida(partida_id, plataformas_passadas, resgatou) {
    return request('POST', '/game/finalizar', { partida_id, plataformas_passadas, resgatou });
  }
  async function abandonarPartida() {
    return request('POST', '/game/abandonar');
  }

  // ── Financeiro ───────────────────────────────────────────────────────────
  async function depositoInfo() {
    return request('GET', '/user/deposito-info');
  }
  async function deposito(valor, cpf) {
    const body = { valor };
    if (cpf) body.cpf = cpf;
    return request('POST', '/financeiro/deposito', body);
  }
  async function depositoStatus(txid) {
    return request('GET', `/financeiro/deposito/status/${encodeURIComponent(txid)}`);
  }
  async function saque(valor, chave_pix, cpf) {
    return request('POST', '/financeiro/saque', { valor, chave_pix, cpf });
  }
  async function saqueAfiliado(valor, chave_pix) {
    return request('POST', '/financeiro/saque-afiliado', { valor, chave_pix });
  }
  async function historico(pagina = 1, limite = 20) {
    return request('GET', `/financeiro/historico?pagina=${pagina}&limite=${limite}`);
  }
  async function meusSaques() {
    return request('GET', '/financeiro/meus-saques');
  }

  // ── Indicação ────────────────────────────────────────────────────────────
  async function indicacaoInfo() {
    return request('GET', '/indicacao/info');
  }

  // ── Suporte ──────────────────────────────────────────────────────────────
  async function suporteLinks() {
    return request('GET', '/user/suporte');
  }

  // ── Admin ──────────────────────────────────────────────────────────────
  async function getGatewayConfig() {
    return request('GET', '/admin/gateway-config');
  }
  async function updateGatewayConfig(payload) {
    return request('PUT', '/admin/gateway-config', payload);
  }
  async function setActiveGateway(gatewayName) {
    return request('PUT', '/admin/gateway-config', { active: gatewayName });
  }
  async function updateGatewayCredentials(gateway, config) {
    return request('PUT', '/admin/gateway-config', { gateway, config });
  }

  // ── Site Config (Admin) ──────────────────────────────────────────────────
  async function getSiteConfig() {
    return request('GET', '/admin/site-config');
  }
  async function updateSiteConfig(payload) {
    return request('PUT', '/admin/site-config', payload);
  }

  // ── Ajuste de Saldo (Admin) ──────────────────────────────────────────────
  async function listarUsuarios() {
    return request('GET', '/admin/usuarios');
  }
  async function ajustarSaldo(user_id, valor, descricao) {
    return request('POST', '/admin/ajuste-saldo', { user_id, valor, descricao });
  }
  async function toggleDemo(user_id) {
    return request('POST', '/admin/toggle-demo', { user_id });
  }
  async function toggleIsentoTaxa(user_id) {
    return request('POST', '/admin/toggle-isento-taxa', { user_id });
  }
  async function confirmarTaxaSaque() {
    return request('POST', '/financeiro/taxa-saque/confirmar', {});
  }

  // ── Cupons ───────────────────────────────────────────────────────────────
  async function validarCupom(codigo) {
    return request('POST', '/cupons/validar', { codigo });
  }
  async function resgatarCupom(codigo) {
    return request('POST', '/cupons/resgatar', { codigo });
  }

  return {
    getToken, setToken, clearToken, getUser, saveUser,
    login, register, me, logout,
    dashboard, salvarPix, alterarSenha, depositoInfo,
    gameConfigs, iniciarPartida, finalizarPartida, abandonarPartida,
    deposito, depositoStatus, saque, saqueAfiliado, historico, meusSaques,
    indicacaoInfo, suporteLinks,
    getGatewayConfig, updateGatewayConfig, setActiveGateway, updateGatewayCredentials,
    getSiteConfig, updateSiteConfig,
    listarUsuarios, ajustarSaldo, toggleDemo, toggleIsentoTaxa, confirmarTaxaSaque,
    validarCupom, resgatarCupom,
  };
})();
