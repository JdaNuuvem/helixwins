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
}
