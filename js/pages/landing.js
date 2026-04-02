// ─── Landing Page ─────────────────────────────────────────────────────────────
function renderLanding(el) {
  el.innerHTML = `
    <!-- ── Navbar ────────────────────────────────────────────────────── -->
    <nav class="lnd-nav">
      <div class="lnd-nav-brand brand-logo-wrap">
        <img class="brand-logo-img" src="" alt="logo" style="display:none;height:36px;object-fit:contain"/>
        <svg class="brand-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
        </svg>
        <span class="brand-name">HelixWin</span>
      </div>
      <div class="lnd-nav-menu">
        <button class="lnd-nav-link" onclick="navigate('#login')">Entrar</button>
        <button class="lnd-cta-sm" onclick="navigate('#cadastro')">Cadastrar</button>
      </div>
    </nav>

    <!-- ── Hero ──────────────────────────────────────────────────────── -->
    <div class="lnd-hero">
      <div class="lnd-orbs" aria-hidden="true">
        <div class="lnd-orb" style="width:500px;height:500px;top:-160px;left:-160px;background:rgba(120,0,200,0.16)"></div>
        <div class="lnd-orb" style="width:360px;height:360px;bottom:4%;right:-90px;background:rgba(255,50,110,0.11);animation-delay:2.5s"></div>
        <div class="lnd-orb" style="width:260px;height:260px;top:38%;left:36%;background:rgba(0,200,122,0.07);animation-delay:5s"></div>
      </div>

      <div class="lnd-hero-inner">
        <!-- Conteúdo principal -->
        <div class="lnd-hero-left anim-slide">
          <div class="lnd-live-badge">
            <span class="lnd-live-dot"></span>
            2.847 jogadores online agora
          </div>

          <h1 class="lnd-title">GIRE E<br><em>GANHE</em></h1>

          <p class="lnd-sub">
            Jogue Helix Jump e transforme suas habilidades em dinheiro real.
            Passe plataformas para ganhar dinheiro real!
          </p>

          <div class="brand-promo" style="display:none;margin-bottom:12px;background:linear-gradient(135deg,rgba(34,197,94,.15),rgba(16,185,129,.1));border:1px solid rgba(34,197,94,.3);border-radius:10px;padding:10px 16px;font-size:14px;font-weight:600;color:#4ade80;text-align:center"></div>

          <div class="lnd-actions">
            <button class="lnd-cta-btn" id="btn-jogar-gratis">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <span id="btn-jogar-label">JOGAR AGORA</span>
            </button>
            <button class="lnd-ghost-btn" onclick="navigate('#login')">Já tenho conta &rarr;</button>
          </div>

          <div class="lnd-trust">
            <span class="lnd-trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>
              Saque via PIX
            </span>
            <span class="lnd-trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>
              Depósito mín. <span id="lnd-dep-min">R$10</span>
            </span>
            <span class="lnd-trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>
              Resultado na hora
            </span>
          </div>
        </div>

        <!-- Notificações de ganhos flutuantes -->
        <div class="lnd-wins-col">
          <div class="lnd-win-card" style="animation-delay:0s">
            <div class="lnd-win-avatar" style="background:linear-gradient(135deg,#FF6B9D,#FF8CC8)">C</div>
            <div class="lnd-win-info">
              <div class="lnd-win-name">Carlos ganhou</div>
              <div class="lnd-win-amount">+R$ 70,00</div>
              <div class="lnd-win-label">há 2 minutos</div>
            </div>
            <svg viewBox="0 0 24 24" fill="#FFB800" width="22" height="22"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
          </div>
          <div class="lnd-win-card" style="animation-delay:1.4s">
            <div class="lnd-win-avatar" style="background:linear-gradient(135deg,#4D9EFF,#00C97A)">A</div>
            <div class="lnd-win-info">
              <div class="lnd-win-name">Ana ganhou</div>
              <div class="lnd-win-amount">+R$ 45,00</div>
              <div class="lnd-win-label">há 5 minutos</div>
            </div>
            <svg viewBox="0 0 24 24" fill="#FFB800" width="22" height="22"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
          </div>
          <div class="lnd-win-card" style="animation-delay:2.8s">
            <div class="lnd-win-avatar" style="background:linear-gradient(135deg,#FFB800,#FF8C42)">L</div>
            <div class="lnd-win-info">
              <div class="lnd-win-name">Lucas ganhou</div>
              <div class="lnd-win-amount">+R$ 14,00</div>
              <div class="lnd-win-label">há 8 minutos</div>
            </div>
            <svg viewBox="0 0 24 24" fill="#FFB800" width="22" height="22"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Jackpot + Ranking ────────────────────────────────────────── -->
    <section class="lnd-how" style="padding-top:40px;padding-bottom:32px;background:linear-gradient(180deg,rgba(255,215,0,.04) 0%,transparent 100%)">
      <div class="lnd-container">
        <!-- Jackpot Counter -->
        <div style="text-align:center;margin-bottom:28px">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:rgba(255,215,0,.6);font-weight:700;margin-bottom:8px">Jackpot do Dia</div>
          <div id="jackpot-valor" style="
            font-size:48px;font-weight:900;color:#fbbf24;line-height:1;
            text-shadow:0 0 40px rgba(251,191,36,.5),0 0 80px rgba(251,191,36,.2);
            font-variant-numeric:tabular-nums;letter-spacing:1px;
          ">R$ 0,00</div>
          <div style="font-size:12px;color:rgba(255,255,255,.35);margin-top:6px">
            Reseta em <span id="jackpot-timer" style="color:#fbbf24;font-weight:700">00:00:00</span>
          </div>
          <div style="font-size:11px;color:rgba(255,255,255,.3);margin-top:4px">O 1o lugar do ranking leva o jackpot!</div>
        </div>

        <!-- Ranking -->
        <div style="max-width:420px;margin:0 auto;background:linear-gradient(160deg,rgba(13,0,31,.9),rgba(30,0,58,.7));border:1px solid rgba(255,215,0,.15);border-radius:20px;overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,.4)">
          <div style="padding:16px 20px 12px;border-bottom:1px solid rgba(255,255,255,.06);display:flex;align-items:center;justify-content:space-between">
            <div style="font-size:14px;font-weight:800;color:#fff;display:flex;align-items:center;gap:8px">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" width="18" height="18"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>
              Ranking do Dia
            </div>
            <div style="font-size:10px;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.5px">Top 10</div>
          </div>
          <div id="ranking-list" style="padding:8px 0"></div>
        </div>
      </div>
    </section>

    <!-- ── Stats ──────────────────────────────────────────────────────── -->
    <div class="lnd-stats">
      <div class="lnd-stat">
        <div class="lnd-stat-val" id="stat-online">0</div>
        <div class="lnd-stat-lbl">Jogadores online</div>
      </div>
      <div class="lnd-stat">
        <div class="lnd-stat-val" id="stat-pago">R$ 0</div>
        <div class="lnd-stat-lbl">Total pago hoje</div>
      </div>
      <div class="lnd-stat">
        <div class="lnd-stat-val" id="stat-maior">R$ 0</div>
        <div class="lnd-stat-lbl">Maior ganho do dia</div>
      </div>
    </div>

    <!-- ── Como funciona ──────────────────────────────────────────────── -->
    <section class="lnd-how">
      <div class="lnd-container">
        <div class="lnd-section-head">
          <h2>Como funciona?</h2>
          <p>Simples, rápido e transparente</p>
        </div>
        <div class="lnd-how-grid">
          <div class="lnd-how-card anim-slide" style="animation-delay:.1s">
            <div class="lnd-how-num">01</div>
            <div class="lnd-how-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#FF6B9D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <h3>Defina sua aposta</h3>
            <p>Escolha de R$1,00 a R$100,00 e decida o quanto quer arriscar por partida.</p>
          </div>
          <div class="lnd-how-card anim-slide" style="animation-delay:.2s">
            <div class="lnd-how-num">02</div>
            <div class="lnd-how-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28">
                <circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><line x1="2" y1="12" x2="22" y2="12"/>
              </svg>
            </div>
            <h3>Jogue Helix Jump</h3>
            <p>Gire a hélice e guie a bolinha. Evite as peças pretas e alcance 14 plataformas.</p>
          </div>
          <div class="lnd-how-card anim-slide" style="animation-delay:.3s">
            <div class="lnd-how-num">03</div>
            <div class="lnd-how-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#00C97A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
              </svg>
            </div>
            <h3>Ganhe 7x</h3>
            <p>Alcance a meta e receba 7x o valor apostado no seu saldo. Saque via PIX na hora.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Depoimentos ────────────────────────────────────────────────── -->
    <section class="lnd-test">
      <div class="lnd-container">
        <div class="lnd-section-head">
          <h2>O que dizem nossos jogadores</h2>
          <p>Resultados reais de jogadores reais</p>
        </div>
        <div class="lnd-test-grid">
          <div class="lnd-test-card anim-slide">
            <div class="lnd-test-stars">★★★★★</div>
            <p class="lnd-test-text">"Comecei com R$10 e em 3 partidas já tinha R$70. O jogo é justo e o PIX cai na hora. Recomendo muito!"</p>
            <div class="lnd-test-author">
              <div class="lnd-test-avatar" style="background:linear-gradient(135deg,#FF6B9D,#FF8CC8)">A</div>
              <div>
                <div class="lnd-test-name">Ana Paula S.</div>
                <div class="lnd-test-since">Jogadora desde janeiro</div>
              </div>
            </div>
          </div>
          <div class="lnd-test-card anim-slide" style="animation-delay:.15s">
            <div class="lnd-test-stars">★★★★★</div>
            <p class="lnd-test-text">"Sou viciado em Helix Jump de qualquer forma, agora ainda ganho dinheiro jogando. Já saquei mais de R$300 esse mês!"</p>
            <div class="lnd-test-author">
              <div class="lnd-test-avatar" style="background:linear-gradient(135deg,#4D9EFF,#00C97A)">C</div>
              <div>
                <div class="lnd-test-name">Carlos M.</div>
                <div class="lnd-test-since">Jogador profissional</div>
              </div>
            </div>
          </div>
          <div class="lnd-test-card anim-slide" style="animation-delay:.3s">
            <div class="lnd-test-stars">★★★★★</div>
            <p class="lnd-test-text">"Sistema de indicação é incrível. Já ganhei R$20 só indicando amigos e nem precisei jogar. Transparente e confiável."</p>
            <div class="lnd-test-author">
              <div class="lnd-test-avatar" style="background:linear-gradient(135deg,#FFB800,#FF8C42)">L</div>
              <div>
                <div class="lnd-test-name">Lucas R.</div>
                <div class="lnd-test-since">4 amigos indicados</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Programa de Afiliados ────────────────────────────────────── -->
    <section class="lnd-how" style="background:linear-gradient(180deg,rgba(168,85,247,.06) 0%,rgba(0,0,0,0) 100%)">
      <div class="lnd-container">
        <div class="lnd-section-head">
          <h2>Programa de Afiliados</h2>
          <p>Indique amigos e ganhe comissao sobre cada partida deles</p>
        </div>
        <div style="max-width:520px;margin:0 auto;background:linear-gradient(135deg,rgba(168,85,247,.12),rgba(139,92,246,.08));border:1px solid rgba(168,85,247,.25);border-radius:16px;padding:32px 28px;text-align:center">
          <div style="font-size:48px;margin-bottom:12px">💰</div>
          <h3 style="color:#e9d5ff;font-size:20px;margin-bottom:16px">Ganhe dinheiro indicando amigos</h3>
          <div style="display:flex;gap:16px;justify-content:center;margin-bottom:20px;flex-wrap:wrap">
            <div style="flex:1;min-width:180px;background:rgba(0,0,0,.3);border-radius:12px;padding:16px;border:1px solid rgba(239,68,68,.25)">
              <div style="font-size:32px;font-weight:800;color:#f87171;line-height:1">40%</div>
              <div style="font-size:12px;color:#fca5a5;margin-top:6px">de comissao em cima da<br><strong>perda</strong> de cada indicado</div>
            </div>
            <div style="flex:1;min-width:180px;background:rgba(0,0,0,.3);border-radius:12px;padding:16px;border:1px solid rgba(34,197,94,.25)">
              <div style="font-size:32px;font-weight:800;color:#4ade80;line-height:1">10%</div>
              <div style="font-size:12px;color:#86efac;margin-top:6px">de comissao em cima do<br><strong>ganho</strong> de cada indicado</div>
            </div>
          </div>
          <p style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:20px">Cadastre-se e faca um deposito minimo de <strong style="color:#e9d5ff">R$ 20,00</strong> para ativar seu programa de afiliados. Depois disso, compartilhe seu link e ganhe comissao automatica sobre cada partida dos seus indicados. Saque via PIX a qualquer momento.</p>
          <button class="lnd-cta-btn" onclick="navigate('#cadastro')" style="width:100%;justify-content:center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
            QUERO SER AFILIADO
          </button>
        </div>
      </div>
    </section>

    <!-- ── CTA final ──────────────────────────────────────────────────── -->
    <section class="lnd-cta-sec">
      <div class="lnd-orbs" aria-hidden="true">
        <div class="lnd-orb" style="width:380px;height:380px;top:-100px;right:8%;background:rgba(168,85,247,0.20)"></div>
        <div class="lnd-orb" style="width:250px;height:250px;bottom:-60px;left:5%;background:rgba(255,107,157,0.14);animation-delay:3s"></div>
      </div>
      <h2>Pronto para girar e ganhar?</h2>
      <p>Crie sua conta grátis, deposite a partir de R$10 e comece a ganhar agora.</p>
      <button class="lnd-cta-btn" onclick="navigate('#cadastro')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
        </svg>
        CRIAR CONTA GRÁTIS
      </button>
    </section>

    <!-- ── Footer ─────────────────────────────────────────────────────── -->
    <footer class="lnd-footer">
      <div class="lnd-footer-brand">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
        </svg>
        <span class="brand-name">HelixWin</span>
      </div>
      <div class="lnd-footer-links">
        <a href="#" onclick="navigate('#landing');return false">Início</a>
        <a href="#" onclick="navigate('#cadastro');return false">Cadastrar</a>
        <a href="#" onclick="navigate('#login');return false">Entrar</a>
        <a href="#">Termos de uso</a>
        <a href="#" data-suporte-href>Suporte</a>
      </div>
      <div class="lnd-footer-warning">
        ⚠️ Jogo de entretenimento com apostas. Jogue com responsabilidade.
        Proibido para menores de 18 anos. Se sentir que o jogo está afetando sua vida,
        procure ajuda em <strong>jrc.org.br</strong>.
      </div>
      <p class="lnd-footer-copy">© 2026 <span class="brand-name">HelixWin</span>. Todos os direitos reservados. — Sistema desenvolvido por <strong style="color:rgba(255,255,255,.45)">BDSDEV + SLOTSCOMPANY</strong></p>
    </footer>
  `;

  // Animar stats com números simulados
  setTimeout(() => {
    const elOnline = document.getElementById('stat-online');
    const elPago   = document.getElementById('stat-pago');
    const elMaior  = document.getElementById('stat-maior');
    if (elOnline) animateNumber(elOnline, 0, 1847 + Math.floor(Math.random() * 200));
    if (elPago)   animateNumber(elPago,   0, 8420, 1400, v => 'R$ ' + Math.round(v).toLocaleString('pt-BR'));
    if (elMaior)  animateNumber(elMaior,  0, 700,  1000, v => 'R$ ' + Math.round(v).toLocaleString('pt-BR'));
  }, 300);

  // Preencher ref via URL
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get('ref');
  if (ref) sessionStorage.setItem('ref_code', ref);

  // Carregar config e ajustar botão
  let _testeGratisAtivo = false;

  fetch('/api/public/config')
    .then(r => r.json())
    .catch(() => ({ teste_gratis_ativo: false, deposito_minimo: 10 }))
    .then(cfg => {
      _testeGratisAtivo = !!cfg.teste_gratis_ativo;
      const label = document.getElementById('btn-jogar-label');
      if (label) label.textContent = _testeGratisAtivo ? 'JOGAR GRÁTIS' : 'JOGAR AGORA';
      const depMin = document.getElementById('lnd-dep-min');
      if (depMin && cfg.deposito_minimo) {
        depMin.textContent = 'R$' + parseFloat(cfg.deposito_minimo).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
      }
    });

  // Botão principal
  document.getElementById('btn-jogar-gratis').addEventListener('click', (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;

    if (_testeGratisAtivo) {
      sessionStorage.setItem('partida_atual', JSON.stringify({
        partida_id:           'demo',
        valor_entrada:        5,
        valor_meta:           20,
        valor_por_plataforma: 1,
        dificuldade:          'demo',
        modo_demo:            true,
      }));
      navigate('#jogo');
    } else {
      navigate('#cadastro');
    }

    btn.disabled = false;
  });

  // ── Jackpot + Ranking ───────────────────────────────────────────────────
  const JACKPOT_BASE = 1247.50;

  // Jackpot com incrementos aleatórios
  let _jackpotAtual = JACKPOT_BASE + ((new Date() - new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())) / 1000) * 0.55;
  function _tickJackpot() {
    _jackpotAtual += 0.01 + Math.random() * 1.99;
    return _jackpotAtual;
  }

  function _timeToMidnight() {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const diff = midnight - now;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  function _formatMoney(v) {
    return 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  const avatarColors = ['#FF6B9D','#a855f7','#4D9EFF','#00C97A','#f59e0b','#ec4899','#06b6d4','#8b5cf6','#ef4444','#14b8a6'];

  function _renderRanking(rankingData) {
    const list = document.getElementById('ranking-list');
    if (!list) return;

    // Identificar usuário logado
    const currentUser = API.getUser();
    const userId = currentUser?.id;

    // Marcar o usuário no ranking
    const data = rankingData.map(p => ({
      ...p,
      isUser: !!p.user_id && p.user_id === userId,
    }));

    const medals = ['🥇', '🥈', '🥉'];
    const bonuses = ['JACKPOT', '+R$1.000', '+R$500'];
    const posColors = [
      'background:linear-gradient(90deg,rgba(251,191,36,.15),transparent);border-left:3px solid #fbbf24',
      'background:linear-gradient(90deg,rgba(192,192,192,.1),transparent);border-left:3px solid #c0c0c0',
      'background:linear-gradient(90deg,rgba(205,127,50,.1),transparent);border-left:3px solid #cd7f32',
    ];

    list.innerHTML = data.map((p, i) => {
      const isTop3 = i < 3;
      const isUser = !!p.isUser;
      const color = avatarColors[i % avatarColors.length];
      const posStyle = isTop3 ? posColors[i] : (isUser ? 'background:rgba(255,107,157,.08);border-left:3px solid #FF6B9D' : 'border-left:3px solid transparent');
      const medal = isTop3 ? medals[i] : `<span style="color:rgba(255,255,255,.3);font-weight:700;font-size:13px">${i + 1}</span>`;
      const bonus = isTop3 ? `<span style="font-size:9px;font-weight:800;padding:2px 6px;border-radius:4px;${i === 0 ? 'background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#000' : 'background:rgba(255,255,255,.1);color:rgba(255,255,255,.5)'}">${bonuses[i]}</span>` : '';
      const nameStyle = isUser ? 'color:#FF6B9D;font-weight:800' : 'color:rgba(255,255,255,.8)';
      const displayName = isUser ? p.nome + ' (você)' : p.nome;

      return `
        <div style="display:flex;align-items:center;gap:10px;padding:10px 16px;${posStyle};transition:background .2s">
          <div style="width:24px;text-align:center;flex-shrink:0">${medal}</div>
          <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,${color},${color}88);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;flex-shrink:0">
            ${p.nome[0]}
          </div>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:600;${nameStyle};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${displayName}</div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <div style="font-size:13px;font-weight:800;color:#22c55e">${_formatMoney(p.ganho)}</div>
            ${bonus}
          </div>
        </div>
      `;
    }).join('');
  }

  // Atualizar jackpot e timer a cada segundo
  function _updateJackpot() {
    const el = document.getElementById('jackpot-valor');
    const timerEl = document.getElementById('jackpot-timer');
    if (!el) return;
    el.textContent = _formatMoney(_tickJackpot());
    if (timerEl) timerEl.textContent = _timeToMidnight();
  }

  _updateJackpot();
  setInterval(_updateJackpot, 1000);

  // Buscar ranking real do servidor
  fetch('/api/public/ranking')
    .then(r => r.json())
    .then(data => _renderRanking(data.ranking || []))
    .catch(() => _renderRanking([]));
}
