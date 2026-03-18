// ─── Formatação ───────────────────────────────────────────────────────────────
function formatMoney(valor) {
  const n = parseFloat(valor) || 0;
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d)) return '—';
  return d.toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function showToast(msg, tipo = 'info', duracao = 3500) {
  const icons = { success:'✅', error:'❌', info:'ℹ️', warning:'⚠️' };
  const container = document.getElementById('toast-container');
  if (!container) return;
  const t = document.createElement('div');
  t.className = `toast ${tipo}`;
  const iconSpan = document.createElement('span');
  iconSpan.textContent = icons[tipo] || '';
  const msgSpan = document.createElement('span');
  msgSpan.textContent = msg;
  t.appendChild(iconSpan);
  t.appendChild(msgSpan);
  container.appendChild(t);
  setTimeout(() => {
    t.classList.add('out');
    t.addEventListener('animationend', () => t.remove(), { once: true });
  }, duracao);
}

// ─── Loading global ───────────────────────────────────────────────────────────
function showLoading() {
  document.getElementById('global-loading')?.classList.remove('hidden');
}
function hideLoading() {
  document.getElementById('global-loading')?.classList.add('hidden');
}

// ─── Debounce ─────────────────────────────────────────────────────────────────
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

// ─── Clipboard ───────────────────────────────────────────────────────────────
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copiado!', 'success', 2000);
  } catch {
    showToast('Não foi possível copiar.', 'warning');
  }
}

// ─── Animação de número ───────────────────────────────────────────────────────
function animateNumber(el, from, to, duration = 1200, format = (v) => Math.round(v).toLocaleString('pt-BR')) {
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = format(from + (to - from) * ease);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ─── Confetti simples ─────────────────────────────────────────────────────────
function launchConfetti() {
  const colors = ['#FF6B9D','#FFB3CB','#00C97A','#FFB800','#4D9EFF'];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed; top:-10px; left:${Math.random()*100}vw;
      width:${6+Math.random()*8}px; height:${6+Math.random()*8}px;
      background:${colors[i%colors.length]}; border-radius:${Math.random()>0.5?'50%':'2px'};
      z-index:9000; pointer-events:none;
      animation: confetti ${1.2+Math.random()*2}s ease ${Math.random()*0.6}s both;
    `;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }
}

// ─── Validações ───────────────────────────────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isStrongPassword(pwd) {
  return pwd && pwd.length >= 6;
}

// ─── DOM helpers ─────────────────────────────────────────────────────────────
function $(sel, ctx = document) { return ctx.querySelector(sel); }
function $$(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }

function setError(inputEl, errorEl, msg) {
  if (inputEl) inputEl.classList.add('error');
  if (errorEl) { errorEl.textContent = msg; errorEl.style.display = 'block'; }
}
function clearError(inputEl, errorEl) {
  if (inputEl) inputEl.classList.remove('error');
  if (errorEl) { errorEl.textContent = ''; errorEl.style.display = 'none'; }
}

// ─── Timer countdown ─────────────────────────────────────────────────────────
function startCountdown(el, minutes, onEnd) {
  let secs = minutes * 60;
  function tick() {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    if (el) el.textContent = `⏱ Expira em ${m}:${s}`;
    if (secs <= 0) { if (onEnd) onEnd(); return; }
    secs--;
    setTimeout(tick, 1000);
  }
  tick();
}
