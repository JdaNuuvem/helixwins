// ── Página do Jogo — mecânica de resgate livre ────────────────────────────────
// Nova mecânica:
//  • Plataformas infinitas — o jogo não para por número de plataformas
//  • Cada plataforma = valor_por_plataforma (fixo, configurado no admin)
//  • Meta = valor_entrada × multiplicador — indica quando o botão de resgate aparece
//  • Jogador ESCOLHE quando parar clicando em "Resgatar"
//  • Se morrer sem resgatar: perde o valor de entrada

function renderJogo(container) {
  // Ler dificuldade ANTES de montar o HTML para que o iframe já nasça com src correto
  let _difInicial = 'normal';
  try {
    const _p = JSON.parse(sessionStorage.getItem('partida_atual'));
    if (_p && _p.dificuldade) _difInicial = _p.dificuldade;
  } catch (_e) {}

  container.innerHTML = `
    <div id="jogo-wrapper" style="position:relative;width:100%;height:100vh;overflow:hidden;background:#0a0a1a">

      <!-- iframe do jogo Three.js (src já inclui ?dif= para funcionar no mobile) -->
      <iframe id="game-iframe" src="/jogo?dif=${encodeURIComponent(_difInicial)}"
        style="width:100%;height:100%;border:none;display:block"
        allow="accelerometer; autoplay"
        title="Game">
      </iframe>

      <!-- HUD overlay -->
      <div id="hud-container" style="
        position:fixed;top:0;left:0;right:0;z-index:1000;
        background:linear-gradient(180deg,rgba(0,0,0,.85) 0%,transparent 100%);
        padding:12px 16px 20px;
        display:none;
      ">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">

          <!-- Aposta e meta -->
          <div style="display:flex;flex-direction:column;gap:2px">
            <div style="font-size:11px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.5px">Aposta</div>
            <div id="hud-aposta" style="font-size:16px;font-weight:800;color:#fff">R$ 0,00</div>
          </div>

          <!-- Progresso central -->
          <div style="flex:1;max-width:360px;text-align:center">
            <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:5px">
              <div id="hud-acumulado" style="font-size:20px;font-weight:800;color:#00C97A;transition:all .2s">R$ 0,00</div>
              <div style="font-size:12px;color:rgba(255,255,255,.4)">/</div>
              <div id="hud-meta" style="font-size:14px;color:rgba(255,255,255,.6)">R$ 0,00</div>
            </div>
            <!-- Barra de progresso -->
            <div style="background:rgba(255,255,255,.1);border-radius:50px;height:8px;overflow:visible;position:relative">
              <div id="hud-barra" style="height:100%;border-radius:50px;width:0%;transition:width .35s ease,background .6s ease,box-shadow .6s ease;position:relative"></div>
            </div>
            <div id="hud-plat" style="font-size:11px;color:rgba(255,255,255,.4);margin-top:4px">0 plataformas • R$0,00/plat</div>
          </div>

          <!-- Meta e botão sair -->
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
            <div style="font-size:11px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.5px">Meta</div>
            <div id="hud-meta-label" style="font-size:16px;font-weight:800;color:#FFD700">R$ 0,00</div>
            <button onclick="voltarPainel()" style="
              background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);
              border-radius:8px;padding:4px 10px;color:rgba(255,255,255,.5);
              font-size:11px;cursor:pointer;font-family:inherit
            ">Sair</button>
          </div>
        </div>
      </div>

      <!-- Botão RESGATAR — aparece ao atingir a meta -->
      <button id="btn-resgatar" onclick="executarResgate()" style="
        display:none;
        position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
        background:linear-gradient(135deg,#FFD700,#FFA500);
        color:#000;font-size:18px;font-weight:800;
        padding:16px 36px;border-radius:50px;border:none;
        cursor:pointer;z-index:2000;
        box-shadow:0 0 30px rgba(255,215,0,.6),0 4px 20px rgba(0,0,0,.4);
        font-family:inherit;white-space:nowrap;
        animation:pulseGold 1.2s ease-in-out infinite;
      ">
        🏆 RESGATAR R$ 0,00
      </button>
      <div id="btn-resgatar-hint" style="
        display:none;position:fixed;bottom:56px;left:50%;transform:translateX(-50%);
        font-size:11px;color:rgba(255,215,0,.75);text-align:center;
        white-space:nowrap;z-index:2000;
      ">Continue jogando para ganhar mais!</div>

      <!-- Tela de carregamento -->
      <div id="tela-loading" style="
        position:fixed;inset:0;z-index:3000;
        background:radial-gradient(ellipse at 50% 40%, #1a0040 0%, #0a0a1a 70%);
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;
        overflow:hidden;
      ">
        <!-- Orbs de fundo -->
        <div style="position:absolute;width:340px;height:340px;border-radius:50%;
          background:radial-gradient(circle,rgba(100,0,255,0.18) 0%,transparent 70%);
          top:50%;left:50%;transform:translate(-50%,-60%);pointer-events:none"></div>
        <div style="position:absolute;width:220px;height:220px;border-radius:50%;
          background:radial-gradient(circle,rgba(255,107,157,0.13) 0%,transparent 70%);
          top:50%;left:50%;transform:translate(-30%,-30%);pointer-events:none"></div>

        <!-- Logo animado -->
        <div style="position:relative;width:88px;height:88px;margin-bottom:32px">
          <!-- Anel externo -->
          <svg viewBox="0 0 88 88" style="position:absolute;inset:0;width:100%;height:100%;animation:ldRingSpin 1.4s linear infinite">
            <circle cx="44" cy="44" r="38" fill="none" stroke="rgba(255,107,157,0.18)" stroke-width="4"/>
            <circle cx="44" cy="44" r="38" fill="none" stroke="url(#ldGrad1)" stroke-width="4"
              stroke-linecap="round" stroke-dasharray="60 180" stroke-dashoffset="0"/>
            <defs>
              <linearGradient id="ldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FF6B9D"/>
                <stop offset="100%" stop-color="#a855f7"/>
              </linearGradient>
            </defs>
          </svg>
          <!-- Anel interno -->
          <svg viewBox="0 0 88 88" style="position:absolute;inset:0;width:100%;height:100%;animation:ldRingSpin 0.9s linear infinite reverse">
            <circle cx="44" cy="44" r="26" fill="none" stroke="rgba(168,85,247,0.15)" stroke-width="3"/>
            <circle cx="44" cy="44" r="26" fill="none" stroke="url(#ldGrad2)" stroke-width="3"
              stroke-linecap="round" stroke-dasharray="30 120" stroke-dashoffset="0"/>
            <defs>
              <linearGradient id="ldGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#a855f7"/>
                <stop offset="100%" stop-color="#00C97A"/>
              </linearGradient>
            </defs>
          </svg>
          <!-- Ícone central -->
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">
            <svg viewBox="0 0 32 32" fill="none" width="32" height="32" style="animation:ldPulse 1.8s ease-in-out infinite">
              <circle cx="16" cy="16" r="14" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
              <path d="M16 2a17 17 0 0 1 5 14 17 17 0 0 1-5 14 17 17 0 0 1-5-14A17 17 0 0 1 16 2z"
                stroke="#FF6B9D" stroke-width="2" stroke-linecap="round"/>
              <line x1="2" y1="16" x2="30" y2="16" stroke="#FF6B9D" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </div>

        <!-- Texto principal -->
        <div style="font-size:20px;font-weight:800;color:#fff;letter-spacing:-0.3px;margin-bottom:10px;text-align:center">
          Preparando partida...
        </div>

        <!-- Subtítulo dinâmico -->
        <div id="loading-msg" style="font-size:14px;color:rgba(255,255,255,0.42);font-weight:500;text-align:center;margin-bottom:36px">
          Aguarde
        </div>

        <!-- Barra de progresso animada -->
        <div style="width:180px;height:3px;background:rgba(255,255,255,0.08);border-radius:50px;overflow:hidden">
          <div style="height:100%;border-radius:50px;
            background:linear-gradient(90deg,#FF6B9D,#a855f7,#00C97A);
            background-size:200% 100%;
            animation:ldShimmer 1.5s ease-in-out infinite">
          </div>
        </div>

        <style>
          @keyframes ldRingSpin { to { transform: rotate(360deg); } }
          @keyframes ldPulse {
            0%,100% { opacity:1; transform:scale(1); }
            50%      { opacity:0.6; transform:scale(0.88); }
          }
          @keyframes ldShimmer {
            0%   { background-position: 200% 0; width:0%; }
            50%  { width:100%; }
            100% { background-position: -200% 0; width:0%; }
          }
        </style>
      </div>

      <!-- Tela de resultado -->
      <div id="tela-resultado" style="
        position:fixed;inset:0;z-index:3000;display:none;
        align-items:center;justify-content:center;
        background:rgba(0,0,0,.88);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
        padding:20px;
      ">
        <div id="resultado-card" style="
          background:linear-gradient(160deg,#13001f 0%,#1e003a 100%);
          border-radius:28px;padding:0;
          max-width:360px;width:100%;text-align:center;
          border:1.5px solid transparent;
          box-shadow:0 32px 80px rgba(0,0,0,.7);
          overflow:hidden;
          animation:resCardIn .45s cubic-bezier(.34,1.56,.64,1) both;
        ">
          <!-- Faixa topo colorida -->
          <div id="resultado-topo" style="padding:28px 28px 20px;position:relative;">
            <!-- Ícone com glow -->
            <div id="resultado-icon-wrap" style="
              width:72px;height:72px;border-radius:50%;margin:0 auto 14px;
              display:flex;align-items:center;justify-content:center;
              font-size:36px;
            "></div>
            <div id="resultado-titulo" style="font-size:22px;font-weight:900;letter-spacing:.5px;margin-bottom:6px"></div>
            <div id="resultado-subtitulo" style="font-size:13px;color:rgba(255,255,255,.55);line-height:1.5"></div>
          </div>

          <!-- Valor principal -->
          <div id="resultado-valor-wrap" style="
            margin:0 20px 16px;border-radius:16px;padding:16px 20px;
          ">
            <div style="font-size:11px;font-weight:700;letter-spacing:.08em;opacity:.7;margin-bottom:6px" id="resultado-valor-label"></div>
            <div id="resultado-valor" style="font-size:38px;font-weight:900;line-height:1"></div>
          </div>

          <!-- Info -->
          <div style="padding:0 24px 20px">
            <div id="resultado-plat" style="font-size:12px;color:rgba(255,255,255,.45);margin-bottom:6px"></div>
            <div id="resultado-saldo" style="
              font-size:13px;font-weight:600;color:rgba(255,255,255,.65);
              background:rgba(255,255,255,.06);border-radius:10px;
              padding:8px 14px;margin-top:10px;
            "></div>
          </div>

          <!-- Botões -->
          <div style="padding:0 20px 24px;display:flex;gap:10px">
            <button onclick="jogarNovamente()" style="
              flex:1;background:linear-gradient(135deg,#FF6B9D,#c026d3);
              color:#fff;border:none;border-radius:50px;
              padding:14px 0;font-size:14px;font-weight:800;
              cursor:pointer;font-family:inherit;letter-spacing:.3px;
              box-shadow:0 4px 20px rgba(255,107,157,.4);
              display:flex;align-items:center;justify-content:center;gap:8px;
              transition:transform .15s,box-shadow .15s;
            " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform=''">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Jogar Novamente
            </button>
            <button onclick="voltarPainel()" style="
              background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.15);
              color:rgba(255,255,255,.75);border-radius:50px;
              padding:14px 20px;font-size:14px;font-weight:700;
              cursor:pointer;font-family:inherit;
              display:flex;align-items:center;justify-content:center;gap:6px;
              transition:background .15s;
            " onmouseover="this.style.background='rgba(255,255,255,.14)'" onmouseout="this.style.background='rgba(255,255,255,.08)'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Painel
            </button>
          </div>
        </div>
      </div>

      <!-- Confetti canvas -->
      <canvas id="confetti-canvas" style="position:fixed;inset:0;z-index:3500;pointer-events:none;display:none"></canvas>

      <!-- Modal Usar Vida / Comprar Vidas -->
      <div id="modal-vida" style="
        position:fixed;inset:0;z-index:4000;display:none;
        align-items:center;justify-content:center;
        background:rgba(0,0,0,.88);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
        padding:20px;
      ">
        <div style="
          background:linear-gradient(160deg,#13001f 0%,#1e003a 100%);
          border:1.5px solid rgba(239,68,68,.45);border-radius:28px;
          max-width:360px;width:100%;text-align:center;overflow:hidden;
          box-shadow:0 32px 80px rgba(0,0,0,.7);
          animation:resCardIn .45s cubic-bezier(.34,1.56,.64,1) both;
        ">
          <div style="padding:28px 24px 20px;background:linear-gradient(160deg,rgba(239,68,68,.10) 0%,transparent 100%)">
            <div style="font-size:48px;margin-bottom:12px;animation:iconPop .55s cubic-bezier(.34,1.56,.64,1) both">💀</div>
            <div style="font-size:22px;font-weight:900;color:#f87171;margin-bottom:6px">VOCÊ MORREU!</div>
            <div id="vida-subtitulo" style="font-size:13px;color:rgba(255,255,255,.55);line-height:1.5"></div>
          </div>
          <div style="padding:0 20px 8px">
            <div style="background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:14px;padding:14px;margin-bottom:12px">
              <div style="font-size:11px;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Acumulado até agora</div>
              <div id="vida-acumulado" style="font-size:28px;font-weight:900;color:#f97316">R$ 0,00</div>
            </div>
          </div>
          <!-- Botão usar vida (se tem) -->
          <div id="vida-usar-wrap" style="padding:0 20px 8px;display:none">
            <button id="btn-usar-vida" style="
              width:100%;background:linear-gradient(135deg,#22c55e,#16a34a);
              color:#fff;border:none;border-radius:50px;padding:14px 0;
              font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;
              box-shadow:0 4px 20px rgba(34,197,94,.4);
              display:flex;align-items:center;justify-content:center;gap:8px;
            ">❤️ USAR VIDA E CONTINUAR (<span id="vida-count">0</span> restantes)</button>
          </div>
          <!-- Botão comprar vidas via PIX -->
          <div id="vida-comprar-wrap" style="padding:0 20px 8px">
            <button id="btn-comprar-vida-pix" style="
              width:100%;background:linear-gradient(135deg,#a855f7,#7c3aed);
              color:#fff;border:none;border-radius:50px;padding:14px 0;
              font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;
              box-shadow:0 4px 20px rgba(168,85,247,.4);
              display:flex;align-items:center;justify-content:center;gap:8px;
            ">🛒 COMPRAR 3 VIDAS — R$ 10,00 via PIX</button>
          </div>
          <!-- Botão desistir -->
          <div style="padding:0 20px 20px">
            <button id="btn-desistir-vida" style="
              width:100%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);
              color:rgba(255,255,255,.5);border-radius:50px;padding:12px 0;
              font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;
            ">Desistir e ver resultado</button>
          </div>
        </div>
      </div>

      <!-- Modal QR Code Compra Vidas -->
      <div id="modal-vida-pix" style="
        position:fixed;inset:0;z-index:4500;display:none;
        align-items:center;justify-content:center;
        background:rgba(0,0,0,.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
        padding:20px;
      ">
        <div style="
          background:linear-gradient(160deg,#13001f 0%,#1e003a 100%);
          border:1.5px solid rgba(168,85,247,.4);border-radius:28px;
          max-width:360px;width:100%;text-align:center;overflow:hidden;
          box-shadow:0 32px 80px rgba(0,0,0,.7);
          animation:resCardIn .35s cubic-bezier(.34,1.56,.64,1) both;
        ">
          <div style="padding:24px 24px 16px;background:linear-gradient(160deg,rgba(168,85,247,.12) 0%,transparent 100%)">
            <div style="font-size:36px;margin-bottom:8px">❤️</div>
            <div style="font-size:18px;font-weight:800;color:#c084fc;margin-bottom:4px">Comprar 3 Vidas</div>
            <div style="font-size:13px;color:rgba(255,255,255,.5)">Pague R$ 10,00 via PIX para continuar jogando</div>
          </div>
          <div id="vida-pix-loading" style="padding:20px;display:flex;align-items:center;justify-content:center">
            <svg class="spin-icon" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2.5" width="32" height="32"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          </div>
          <div id="vida-pix-content" style="padding:0 20px 20px;display:none">
            <div style="background:#fff;border-radius:16px;padding:12px;margin-bottom:12px;display:inline-block">
              <img id="vida-pix-qr" src="" alt="QR Code" style="width:200px;height:200px;display:block"/>
            </div>
            <div style="margin-bottom:12px">
              <div style="font-size:11px;color:rgba(255,255,255,.4);margin-bottom:4px">Ou copie o codigo PIX:</div>
              <div style="position:relative">
                <input id="vida-pix-code" readonly style="
                  width:100%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);
                  border-radius:10px;padding:10px 40px 10px 12px;color:#fff;font-size:11px;
                  font-family:monospace;box-sizing:border-box;
                " value=""/>
                <button id="vida-pix-copy" style="
                  position:absolute;right:4px;top:50%;transform:translateY(-50%);
                  background:rgba(168,85,247,.3);border:none;border-radius:6px;
                  padding:6px 8px;cursor:pointer;color:#fff;font-size:10px;
                ">Copiar</button>
              </div>
            </div>
            <div id="vida-pix-timer" style="font-size:12px;color:rgba(255,255,255,.4);margin-bottom:8px"></div>
            <div id="vida-pix-status" style="font-size:13px;font-weight:700;color:#a855f7">Aguardando pagamento...</div>
          </div>
          <div style="padding:0 20px 16px">
            <button id="btn-vida-pix-voltar" style="
              width:100%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);
              color:rgba(255,255,255,.5);border-radius:50px;padding:10px 0;
              font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;
            ">Voltar</button>
          </div>
        </div>
      </div>

    </div>

    <style>
      @keyframes pulseGold {
        0%,100% { transform:translateX(-50%) scale(1);    box-shadow:0 0 30px rgba(255,215,0,.6),0 4px 20px rgba(0,0,0,.4); }
        50%      { transform:translateX(-50%) scale(1.04); box-shadow:0 0 50px rgba(255,215,0,.9),0 4px 24px rgba(0,0,0,.5); }
      }
      @keyframes jogoPopIn {
        from { transform:translateX(-50%) scale(.5); opacity:0; }
        to   { transform:translateX(-50%) scale(1);  opacity:1; }
      }
      @keyframes resCardIn {
        from { transform:scale(.75) translateY(30px); opacity:0; }
        to   { transform:scale(1)   translateY(0);    opacity:1; }
      }
      @keyframes iconPop {
        0%   { transform:scale(0) rotate(-20deg); }
        70%  { transform:scale(1.25) rotate(5deg); }
        100% { transform:scale(1) rotate(0deg); }
      }
      @keyframes slideDown {
        from { transform:translateY(-20px); opacity:0; }
        to   { transform:translateY(0);     opacity:1; }
      }
      @keyframes spin { to { transform:rotate(360deg); } }
      .spin-icon { animation: spin .7s linear infinite; }
    </style>
  `;

  // ── Expor funções globais necessárias pelos botões inline ─────────────────
  window.executarResgate = executarResgate;
  window.jogarNovamente  = jogarNovamente;
  window.voltarPainel    = voltarPainel;

  // ── Estado da partida ─────────────────────────────────────────────────────
  let partida            = null;
  let plataformasPassadas = 0;
  let valorAcumulado      = 0;
  let metaAtingida        = false;
  let resgatou            = false;
  let partidaFinalizada   = false;

  // ── Carregar dados da partida do sessionStorage ───────────────────────────
  try {
    partida = JSON.parse(sessionStorage.getItem('partida_atual'));
  } catch {}

  if (!partida?.partida_id) {
    document.getElementById('loading-msg').textContent = 'Nenhuma partida ativa. Voltando...';
    setTimeout(voltarPainel, 2000);
    return;
  }

  const {
    partida_id,
    valor_entrada,
    valor_meta,
    valor_por_plataforma,
    dificuldade,
    modo_demo,
    is_demo,
  } = partida;

  const IS_DEMO = !!modo_demo;
  const IS_CONTA_DEMO = !!is_demo;
  const dificuladadeAtiva = dificuldade || 'normal';

  // ── Configurar gameEvents (comunicação com o iframe) ──────────────────────
  window.gameEvents = {
    onPlataformaPassada:  null,
    onMorreu:             null,
    onMetaAtingida:       null, // não usado mais, mas mantido por compatibilidade
    metaPlataformas:      999999,   // infinito — jogo nunca para por plataformas
    valorPorPlataforma:   parseFloat(valor_por_plataforma),
    valorMeta:            parseFloat(valor_meta),
    dificuldade:          dificuladadeAtiva,
    is_demo:              IS_CONTA_DEMO,
    partidaAtiva:         false,
    _plataformasPassadas: 0,
  };

  // ── Ativar a partida após o iframe carregar ───────────────────────────────
  function ativarPartida() {
    plataformasPassadas = 0;
    valorAcumulado      = 0;
    metaAtingida        = false;
    resgatou            = false;
    partidaFinalizada   = false;

    window.gameEvents._plataformasPassadas = 0;
    window.gameEvents.partidaAtiva         = true;

    // Resetar temperatura do fundo ao iniciar partida
    const _heatIframe = () => document.getElementById('game-iframe')?.contentWindow;
    _heatIframe()?.setHeatPct?.(0);

    // Callback: plataforma passada
    window.gameEvents.onPlataformaPassada = (n) => {
      plataformasPassadas = n;
      valorAcumulado      = parseFloat((n * parseFloat(valor_por_plataforma)).toFixed(2));
      atualizarHUD(n, valorAcumulado);

      // Atualizar temperatura do fundo conforme % acumulada
      const pct = Math.min(100, (valorAcumulado / parseFloat(valor_meta)) * 100);
      _heatIframe()?.setHeatPct?.(pct);

      if (!metaAtingida && valorAcumulado >= parseFloat(valor_meta)) {
        metaAtingida = true;
        _heatIframe()?.setHeatPct?.(100);
        mostrarBotaoResgatar(valorAcumulado);
      } else if (metaAtingida) {
        atualizarBotaoResgatar(valorAcumulado);
      }
    };

    // Callback: morreu sem resgatar
    window.gameEvents.onMorreu = async () => {
      if (resgatou || partidaFinalizada) return;
      window.gameEvents.partidaAtiva = false;
      esconderBotaoResgatar();

      if (IS_DEMO) {
        partidaFinalizada = true;
        esconderHUD();
        mostrarModalDemo(valorAcumulado, false);
        return;
      }

      // Oferecer usar vida antes de finalizar (sempre mostra — com opção de comprar se não tem)
      _mostrarModalVida(_vidasJogo);
      return;
    };

    // Atualizar HUD
    document.getElementById('hud-container').style.display = 'block';
    document.getElementById('hud-aposta').textContent   = IS_DEMO ? 'DEMO' : formatMoney(valor_entrada);
    document.getElementById('hud-meta-label').textContent = formatMoney(valor_meta);
    document.getElementById('hud-meta').textContent     = formatMoney(valor_meta);
    atualizarHUD(0, 0);

    // Esconder loading
    document.getElementById('tela-loading').style.display = 'none';
  }

  // Aguardar iframe carregar, depois ativar
  const iframe = document.getElementById('game-iframe');
  iframe.addEventListener('load', () => setTimeout(ativarPartida, 400));
  // Fallback: se iframe já carregou
  setTimeout(() => {
    if (!window.gameEvents.partidaAtiva) ativarPartida();
  }, 3000);

  // ── HUD ──────────────────────────────────────────────────────────────────
  // ── Estilos da barra injetados uma vez ───────────────────────────────────
  (function injetarEstilosBarra() {
    if (document.getElementById('hud-barra-styles')) return;
    const s = document.createElement('style');
    s.id = 'hud-barra-styles';
    s.textContent = `
      @keyframes barraPulse {
        0%,100% { opacity: 1; filter: brightness(1); }
        50%      { opacity: .82; filter: brightness(1.35); }
      }
      @keyframes barraGold {
        0%,100% { box-shadow: 0 0 8px 2px rgba(255,215,0,.55), 0 0 18px 4px rgba(255,165,0,.35); filter: brightness(1); }
        50%      { box-shadow: 0 0 18px 6px rgba(255,215,0,.85), 0 0 36px 10px rgba(255,165,0,.55); filter: brightness(1.45); }
      }
      #hud-barra.pulso   { animation: barraPulse 1.1s ease-in-out infinite; }
      #hud-barra.ouro    { animation: barraGold  0.75s ease-in-out infinite; }
    `;
    document.head.appendChild(s);
  })();

  function atualizarHUD(n, acumulado) {
    const meta = parseFloat(valor_meta);
    const vpp  = parseFloat(valor_por_plataforma);
    const pct  = Math.min((acumulado / meta) * 100, 100);

    document.getElementById('hud-acumulado').textContent = formatMoney(acumulado);
    document.getElementById('hud-plat').textContent =
      `${n} plataforma${n !== 1 ? 's' : ''} • +${formatMoney(vpp)}/plat`;

    const barra     = document.getElementById('hud-barra');
    const acumEl    = document.getElementById('hud-acumulado');

    // ── Cor da barra conforme progresso (interpolação de cor) ────────────
    let bg, shadow, acumColor;

    if (pct >= 100) {
      // Dourado — meta atingida
      bg         = 'linear-gradient(90deg,#FFD700,#FFA500,#FFD700)';
      shadow     = '0 0 14px 4px rgba(255,215,0,.7), 0 0 28px 8px rgba(255,165,0,.45)';
      acumColor  = '#FFD700';
      barra.classList.remove('pulso');
      barra.classList.add('ouro');
    } else if (pct >= 75) {
      // Vermelho quente — tensão máxima
      bg         = 'linear-gradient(90deg,#ef4444,#f97316)';
      shadow     = `0 0 10px 3px rgba(239,68,68,${0.4 + (pct - 75) / 100})`;
      acumColor  = '#f97316';
      barra.classList.remove('ouro');
      barra.classList.add('pulso');
    } else if (pct >= 50) {
      // Laranja — aquecendo
      const t    = (pct - 50) / 25;
      bg         = `linear-gradient(90deg,#f97316,${lerpColor('#f97316','#ef4444',t)})`;
      shadow     = `0 0 8px 2px rgba(249,115,22,${0.25 + t * 0.2})`;
      acumColor  = '#f97316';
      barra.classList.remove('pulso','ouro');
    } else if (pct >= 25) {
      // Verde → amarelo → laranja
      const t    = (pct - 25) / 25;
      bg         = `linear-gradient(90deg,${lerpColor('#22c55e','#f97316',t)},${lerpColor('#16a34a','#ea580c',t)})`;
      shadow     = `0 0 6px 1px rgba(34,197,94,${0.2 + t * 0.15})`;
      acumColor  = lerpColor('#22c55e', '#f97316', t);
      barra.classList.remove('pulso','ouro');
    } else {
      // Azul frio — início tranquilo
      const t    = pct / 25;
      bg         = `linear-gradient(90deg,#3b82f6,${lerpColor('#3b82f6','#22c55e',t)})`;
      shadow     = '0 0 4px 1px rgba(59,130,246,0.2)';
      acumColor  = lerpColor('#3b82f6', '#22c55e', t);
      barra.classList.remove('pulso','ouro');
    }

    barra.style.width      = pct + '%';
    barra.style.background = bg;
    barra.style.boxShadow  = shadow;
    acumEl.style.color     = acumColor;
    acumEl.style.textShadow = pct >= 75 ? `0 0 12px ${acumColor}88` : 'none';
  }

  // Interpolação linear entre duas cores hex
  function lerpColor(a, b, t) {
    const ah = parseInt(a.slice(1),16), bh = parseInt(b.slice(1),16);
    const ar = ah>>16, ag = (ah>>8)&0xff, ab = ah&0xff;
    const br = bh>>16, bg2 = (bh>>8)&0xff, bb = bh&0xff;
    const r = Math.round(ar + (br-ar)*t);
    const g = Math.round(ag + (bg2-ag)*t);
    const bl= Math.round(ab + (bb-ab)*t);
    return `#${((r<<16)|(g<<8)|bl).toString(16).padStart(6,'0')}`;
  }

  function esconderHUD() {
    document.getElementById('hud-container').style.display = 'none';
  }

  // ── Botão Resgatar ────────────────────────────────────────────────────────
  function mostrarBotaoResgatar(valor) {
    const btn  = document.getElementById('btn-resgatar');
    const hint = document.getElementById('btn-resgatar-hint');
    btn.textContent = `🏆 RESGATAR ${formatMoney(valor)}`;
    btn.style.display = 'block';
    btn.style.animation = 'jogoPopIn .4s ease, pulseGold 1.2s ease-in-out .4s infinite';
    hint.style.display = 'block';
    // Borda dourada no HUD
    document.getElementById('hud-container').style.borderBottom = '2px solid rgba(255,215,0,.5)';
  }

  function atualizarBotaoResgatar(valor) {
    const btn = document.getElementById('btn-resgatar');
    btn.textContent = `🏆 RESGATAR ${formatMoney(valor)}`;
  }

  function esconderBotaoResgatar() {
    document.getElementById('btn-resgatar').style.display = 'none';
    document.getElementById('btn-resgatar-hint').style.display = 'none';
  }

  // ── Ação de resgate ───────────────────────────────────────────────────────
  async function executarResgate() {
    if (resgatou || partidaFinalizada) return;
    if (valorAcumulado <= 0) {
      alert('Você ainda não acumulou nenhum valor! Continue jogando.');
      return;
    }
    resgatou            = true;
    partidaFinalizada   = true;
    window.gameEvents.partidaAtiva = false;
    esconderBotaoResgatar();
    esconderHUD();

    // Som de vitória — acessa o AudioContext que já está ativo dentro do iframe
    try {
      const gIframe = document.getElementById('game-iframe');
      gIframe?.contentWindow?._gameMusic?.playVictory?.();
    } catch (_) {}

    if (IS_DEMO) {
      mostrarModalDemo(valorAcumulado, true);
      return;
    }

    const btn = document.getElementById('btn-resgatar');
    btn.textContent = '⏳ Resgatando...';
    btn.style.display = 'block';
    btn.style.animation = 'none';
    btn.style.background = 'rgba(255,215,0,.3)';

    try {
      const res = await API.finalizarPartida(partida_id, plataformasPassadas, true);
      btn.style.display = 'none';
      mostrarVitoria(res);
    } catch (e) {
      btn.style.display = 'none';
      mostrarVitoria({
        saldo_novo: null,
        valor_ganho_ou_perdido: valorAcumulado,
        plataformas_passadas: plataformasPassadas,
      });
    }
  }

  // ── Telas de resultado ────────────────────────────────────────────────────
  function mostrarVitoria(res) {
    const valor = res.valor_ganho_ou_perdido ?? valorAcumulado;
    const plat  = res.plataformas_passadas  ?? plataformasPassadas;

    // Cores de vitória — dourado
    const card = document.getElementById('resultado-card');
    card.style.border = '1.5px solid rgba(255,215,0,.5)';
    card.style.boxShadow = '0 32px 80px rgba(0,0,0,.7), 0 0 60px rgba(255,215,0,.15)';

    const topo = document.getElementById('resultado-topo');
    topo.style.background = 'linear-gradient(160deg,rgba(255,180,0,.12) 0%,rgba(255,215,0,.05) 100%)';

    const iconWrap = document.getElementById('resultado-icon-wrap');
    iconWrap.style.background = 'linear-gradient(135deg,#f59e0b,#fbbf24)';
    iconWrap.style.boxShadow  = '0 0 40px rgba(251,191,36,.5)';
    iconWrap.style.animation  = 'iconPop .55s cubic-bezier(.34,1.56,.64,1) both';
    iconWrap.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="36" height="36"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>';

    document.getElementById('resultado-titulo').textContent  = 'PRÊMIO RESGATADO!';
    document.getElementById('resultado-titulo').style.color  = '#fbbf24';
    document.getElementById('resultado-subtitulo').textContent = `Você passou ${plat} plataforma${plat !== 1 ? 's' : ''} e resgatou o prêmio!`;

    const vWrap = document.getElementById('resultado-valor-wrap');
    vWrap.style.background = 'linear-gradient(135deg,rgba(251,191,36,.15),rgba(245,158,11,.08))';
    vWrap.style.border     = '1px solid rgba(251,191,36,.25)';
    document.getElementById('resultado-valor-label').textContent = 'VOCÊ GANHOU';
    document.getElementById('resultado-valor-label').style.color = '#fbbf24';
    document.getElementById('resultado-valor').textContent = `+ ${formatMoney(valor)}`;
    document.getElementById('resultado-valor').style.color = '#fbbf24';

    document.getElementById('resultado-plat').textContent =
      `${plat} plataformas × ${formatMoney(valor_por_plataforma)} = ${formatMoney(valor)}`;

    const saldoEl = document.getElementById('resultado-saldo');
    saldoEl.textContent = res.saldo_novo != null ? `Novo saldo: ${formatMoney(res.saldo_novo)}` : '';
    saldoEl.style.display = res.saldo_novo != null ? '' : 'none';

    // Dobrar ou Nada — botão após vitória
    if (!IS_DEMO && valor > 0) {
      const dobrarDiv = document.createElement('div');
      dobrarDiv.style.cssText = 'padding:0 20px 8px';
      dobrarDiv.innerHTML = `
        <button id="btn-dobrar" style="
          width:100%;background:linear-gradient(135deg,#7c3aed,#a855f7);
          color:#fff;border:none;border-radius:50px;
          padding:12px 0;font-size:13px;font-weight:800;
          cursor:pointer;font-family:inherit;letter-spacing:.3px;
          box-shadow:0 4px 20px rgba(168,85,247,.35);
          display:flex;align-items:center;justify-content:center;gap:8px;
          margin-bottom:4px;
        ">
          🎲 DOBRAR OU NADA (${formatMoney(valor)} → ${formatMoney(valor * 2)})
        </button>
        <div style="text-align:center;font-size:10px;color:rgba(255,255,255,.35)">50% de chance de dobrar seu premio</div>
      `;
      const btnsDiv = document.querySelector('#resultado-card > div:last-child');
      if (btnsDiv) btnsDiv.parentElement.insertBefore(dobrarDiv, btnsDiv);

      document.getElementById('btn-dobrar').addEventListener('click', async function() {
        this.disabled = true;
        this.innerHTML = '🎲 Girando...';
        try {
          const r = await API.dobrarOuNada(valor);
          if (r.ganhou) {
            this.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
            this.innerHTML = '🎉 GANHOU! +' + formatMoney(valor);
            saldoEl.textContent = 'Novo saldo: ' + formatMoney(r.saldo_novo);
          } else {
            this.style.background = 'linear-gradient(135deg,#ef4444,#dc2626)';
            this.innerHTML = '💀 PERDEU ' + formatMoney(valor);
            saldoEl.textContent = 'Saldo: ' + formatMoney(r.saldo_novo);
          }
        } catch (err) {
          this.innerHTML = 'Erro: ' + err.message;
        }
      });
    }

    document.getElementById('tela-resultado').style.display = 'flex';
    dispararConfetti();
  }

  function fraseDerrota() {
    const meta  = parseFloat(valor_meta) || 1;
    const perc  = Math.min(100, (valorAcumulado / meta) * 100);
    const n     = plataformasPassadas;
    if (perc >= 75) return [
      `${Math.round(perc)}% da meta em ${n} plataformas — uma rodada e você resgata! 🔥`,
      `Tão perto assim e vai deixar escapar? Jogar de novo! 💥`,
      `${Math.round(perc)}% — você estava na reta final. Revanche agora! 🎯`,
    ][Math.floor(Math.random() * 3)];
    if (perc >= 50) return [
      `${Math.round(perc)}% da meta com ${n} plataformas — você está melhorando! 🔥`,
      `Mais da metade do caminho em ${n} plataformas. Tente de novo! 💪`,
      `${n} plataformas passadas — você está pegando o ritmo. Revanche? ⚡`,
    ][Math.floor(Math.random() * 3)];
    if (perc >= 25) return [
      `${n} plataformas passadas — você já sabe o que fazer. Jogar de novo! 🎯`,
      `${Math.round(perc)}% da meta em ${n} plataformas. Vai ficar nisso? 😤`,
      `Você chegou a ${Math.round(perc)}% — a próxima é sua! 💥`,
    ][Math.floor(Math.random() * 3)];
    return [
      `${n} plataformas — na próxima vai mais longe. Tente de novo! 🚀`,
      `Você passou ${n} plataformas. Agora que você sabe, vai mais fundo! ⚡`,
      `Começo de jogo. Daqui a pouco você vai resgatar — jogar de novo! 🔥`,
    ][Math.floor(Math.random() * 3)];
  }

  function tremerTela() {
    const wrapper = document.getElementById('jogo-wrapper') || document.body;
    if (!document.getElementById('shake-style')) {
      const s = document.createElement('style');
      s.id = 'shake-style';
      s.textContent = `
        @keyframes telaShake {
          0%          { transform: translate(0,0) rotate(0deg); }
          10%         { transform: translate(-8px,-4px) rotate(-1.2deg); }
          20%         { transform: translate(8px,4px)  rotate(1.2deg); }
          30%         { transform: translate(-6px,6px)  rotate(-0.8deg); }
          40%         { transform: translate(6px,-6px) rotate(0.8deg); }
          50%         { transform: translate(-4px,3px)  rotate(-0.5deg); }
          60%         { transform: translate(4px,-3px) rotate(0.5deg); }
          75%         { transform: translate(-2px,2px)  rotate(-0.2deg); }
          90%         { transform: translate(2px,-1px) rotate(0.2deg); }
          100%        { transform: translate(0,0) rotate(0deg); }
        }
        .tela-shake { animation: telaShake 0.3s ease-out both; }
      `;
      document.head.appendChild(s);
    }
    wrapper.classList.remove('tela-shake');
    void wrapper.offsetWidth; // força reflow para reiniciar a animação
    wrapper.classList.add('tela-shake');
    wrapper.addEventListener('animationend', () => wrapper.classList.remove('tela-shake'), { once: true });
  }

  function mostrarDerrota(res) {
    tremerTela();
    const perdido = res.valor_ganho_ou_perdido ?? parseFloat(valor_entrada);
    const meta    = parseFloat(valor_meta) || 1;
    const perc    = Math.min(100, (valorAcumulado / meta) * 100);

    const acumuladoMsg = metaAtingida
      ? `Você tinha acumulado ${formatMoney(valorAcumulado)} mas não resgatou a tempo!`
      : valorAcumulado > 0
        ? `${formatMoney(valorAcumulado)} acumulados — ${Math.round(perc)}% da meta`
        : `Você passou ${plataformasPassadas} plataforma${plataformasPassadas !== 1 ? 's' : ''}`;

    // Cores de derrota — vermelho-rosa
    const card = document.getElementById('resultado-card');
    card.style.border = '1.5px solid rgba(239,68,68,.45)';
    card.style.boxShadow = '0 32px 80px rgba(0,0,0,.7), 0 0 60px rgba(239,68,68,.12)';

    const topo = document.getElementById('resultado-topo');
    topo.style.background = 'linear-gradient(160deg,rgba(239,68,68,.10) 0%,rgba(30,0,58,.0) 100%)';

    const iconWrap = document.getElementById('resultado-icon-wrap');
    iconWrap.style.background = 'linear-gradient(135deg,#ef4444,#f97316)';
    iconWrap.style.boxShadow  = '0 0 40px rgba(239,68,68,.45)';
    iconWrap.style.animation  = 'iconPop .55s cubic-bezier(.34,1.56,.64,1) both';
    iconWrap.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="36" height="36"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';

    document.getElementById('resultado-titulo').textContent  = 'VOCÊ PERDEU!';
    document.getElementById('resultado-titulo').style.color  = '#f87171';
    const motivMsg = valorAcumulado > 0 && !metaAtingida ? fraseDerrota() : '';
    document.getElementById('resultado-subtitulo').innerHTML =
      acumuladoMsg + (motivMsg ? `<br><span style="color:rgba(255,255,255,.70);font-style:italic">${motivMsg}</span>` : '');

    const vWrap = document.getElementById('resultado-valor-wrap');
    vWrap.style.background = 'linear-gradient(135deg,rgba(239,68,68,.13),rgba(239,68,68,.05))';
    vWrap.style.border     = '1px solid rgba(239,68,68,.22)';
    document.getElementById('resultado-valor-label').textContent = 'VALOR PERDIDO';
    document.getElementById('resultado-valor-label').style.color = '#f87171';
    document.getElementById('resultado-valor').textContent = `- ${formatMoney(perdido)}`;
    document.getElementById('resultado-valor').style.color = '#f87171';

    document.getElementById('resultado-plat').textContent =
      `Você passou ${plataformasPassadas} plataforma${plataformasPassadas !== 1 ? 's' : ''}`;

    const saldoEl = document.getElementById('resultado-saldo');
    saldoEl.textContent = res.saldo_novo != null ? `Saldo restante: ${formatMoney(res.saldo_novo)}` : '';
    saldoEl.style.display = res.saldo_novo != null ? '' : 'none';

    // Seguro reembolsado
    if (res.reembolso_seguro > 0) {
      const seguroMsg = document.createElement('div');
      seguroMsg.style.cssText = 'background:rgba(168,85,247,.12);border:1px solid rgba(168,85,247,.3);border-radius:10px;padding:10px 16px;margin:8px 24px 0;font-size:13px;color:#e9d5ff;font-weight:600';
      seguroMsg.innerHTML = `🛡️ Seguro ativado: <span style="color:#a855f7">+${formatMoney(res.reembolso_seguro)}</span> devolvidos`;
      const infoDiv = saldoEl.parentElement;
      infoDiv.appendChild(seguroMsg);
    }

    // Botão de revanche com bônus
    if (!IS_DEMO) {
      const revBtn = document.createElement('div');
      revBtn.style.cssText = 'padding:0 20px 8px';
      const bonusPct = 20;
      const entradaOriginal = parseFloat(valor_entrada);
      const bonusValor = Math.round(entradaOriginal * bonusPct) / 100;
      revBtn.innerHTML = `
        <button onclick="sessionStorage.setItem('_revanche','1');sessionStorage.setItem('_revanche_valor','${entradaOriginal}');window.location.hash='#painel'" style="
          width:100%;background:linear-gradient(135deg,#f59e0b,#d97706);
          color:#fff;border:none;border-radius:50px;
          padding:12px 0;font-size:13px;font-weight:800;
          cursor:pointer;font-family:inherit;letter-spacing:.3px;
          box-shadow:0 4px 20px rgba(245,158,11,.35);
          display:flex;align-items:center;justify-content:center;gap:8px;
          margin-bottom:4px;
        ">
          ⚡ REVANCHE (+${bonusPct}% bonus = R$ ${(entradaOriginal + bonusValor).toFixed(2).replace('.',',')})
        </button>
        <div style="text-align:center;font-size:10px;color:rgba(255,255,255,.35)">Jogue R$ ${entradaOriginal.toFixed(2).replace('.',',')} e entre com R$ ${(entradaOriginal + bonusValor).toFixed(2).replace('.',',')}</div>
      `;
      const btnsDiv = document.querySelector('#resultado-card > div:last-child');
      if (btnsDiv) btnsDiv.parentElement.insertBefore(revBtn, btnsDiv);
    }

    document.getElementById('tela-resultado').style.display = 'flex';
  }


  // ── Upsell: Usar Vida / Comprar Vidas ────────────────────────────────────
  let _vidaPollTimer = null;
  let _vidasJogo = 0;

  // Buscar vidas atuais do server
  async function _fetchVidas() {
    try {
      const info = await API.upsellInfo();
      _vidasJogo = info.pacote_vidas?.vidas_atuais || 0;
      return _vidasJogo;
    } catch { return 0; }
  }

  function _mostrarModalVida(vidas) {
    tremerTela();
    const modal = document.getElementById('modal-vida');
    const meta = parseFloat(valor_meta) || 1;
    const perc = Math.min(100, (valorAcumulado / meta) * 100);

    document.getElementById('vida-acumulado').textContent = formatMoney(valorAcumulado);
    document.getElementById('vida-subtitulo').innerHTML = valorAcumulado > 0
      ? `${formatMoney(valorAcumulado)} acumulados (${Math.round(perc)}% da meta). Use uma vida para continuar!`
      : `Use uma vida para continuar de onde parou!`;

    // Reset botões
    const btnUsar = document.getElementById('btn-usar-vida');
    btnUsar.disabled = false;
    btnUsar.innerHTML = `❤️ USAR VIDA E CONTINUAR (<span id="vida-count">${vidas}</span> restantes)`;
    const btnComprar = document.getElementById('btn-comprar-vida-pix');
    btnComprar.disabled = false;
    btnComprar.innerHTML = '🛒 COMPRAR 3 VIDAS — R$ 10,00 via PIX';

    if (vidas > 0) {
      document.getElementById('vida-usar-wrap').style.display = '';
    } else {
      document.getElementById('vida-usar-wrap').style.display = 'none';
    }
    modal.style.display = 'flex';
  }

  // Botão USAR VIDA
  document.getElementById('btn-usar-vida').addEventListener('click', async () => {
    const btn = document.getElementById('btn-usar-vida');
    btn.disabled = true;
    btn.innerHTML = '⏳ Usando vida...';
    try {
      const r = await API.usarVida(partida_id);
      _vidasJogo = r.vidas_restantes;
      document.getElementById('modal-vida').style.display = 'none';

      // Reativar a partida — ressuscitar no jogo
      partidaFinalizada = false;
      window.gameEvents.partidaAtiva = true;
      document.getElementById('hud-container').style.display = 'block';

      // Reiniciar o jogo no iframe a partir da posição atual
      const gIframe = document.getElementById('game-iframe');
      gIframe?.contentWindow?.postMessage({ type: 'revive' }, '*');
      // Fallback: se o iframe não suportar revive, recarregar
      setTimeout(() => {
        if (!window.gameEvents.partidaAtiva) {
          gIframe.src = gIframe.src; // force reload
        }
      }, 500);
    } catch (err) {
      btn.innerHTML = '❌ ' + (err.message || 'Erro');
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = '❤️ USAR VIDA E CONTINUAR';
      }, 2000);
    }
  });

  // Botão COMPRAR VIDAS via PIX
  document.getElementById('btn-comprar-vida-pix').addEventListener('click', async () => {
    const btn = document.getElementById('btn-comprar-vida-pix');
    btn.disabled = true;
    btn.innerHTML = '⏳ Gerando PIX...';

    try {
      // Criar depósito de R$10 com _upsell para ir pro split
      const data = await API.deposito(10, undefined, 'comprar_vidas');

      document.getElementById('modal-vida').style.display = 'none';
      const modalPix = document.getElementById('modal-vida-pix');
      modalPix.style.display = 'flex';

      // Preencher QR code
      document.getElementById('vida-pix-loading').style.display = 'none';
      document.getElementById('vida-pix-content').style.display = '';

      const qrSrc = data.qrcode_imagem || data.qrcode_base64 || '';
      const qrImg = document.getElementById('vida-pix-qr');
      if (qrSrc) {
        qrImg.src = qrSrc;
        qrImg.style.display = 'block';
      } else {
        qrImg.style.display = 'none';
      }

      const pixCode = data.qrcode_texto || '';
      document.getElementById('vida-pix-code').value = pixCode;

      // Copiar PIX
      document.getElementById('vida-pix-copy').onclick = () => {
        navigator.clipboard.writeText(pixCode).catch(() => {});
        document.getElementById('vida-pix-copy').textContent = 'Copiado!';
        setTimeout(() => document.getElementById('vida-pix-copy').textContent = 'Copiar', 2000);
      };

      // Polling para verificar pagamento
      _iniciarPollingVida(data.txid);

    } catch (err) {
      btn.innerHTML = '❌ ' + (err.message || 'Erro ao gerar PIX');
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = '🛒 COMPRAR 3 VIDAS — R$ 10,00 via PIX';
      }, 3000);
    }
  });

  function _iniciarPollingVida(txid) {
    if (_vidaPollTimer) clearTimeout(_vidaPollTimer);
    const expira = Date.now() + 30 * 60 * 1000;

    async function checar() {
      if (Date.now() > expira) {
        document.getElementById('vida-pix-status').textContent = 'Expirado';
        return;
      }
      try {
        const res = await API.depositoStatus(txid);
        if (res.status === 'aprovado') {
          document.getElementById('vida-pix-status').innerHTML = '<span style="color:#22c55e;font-size:16px">✅ Pagamento confirmado!</span>';
          // Vidas já creditadas automaticamente pelo server via _upsell='comprar_vidas'
          await _fetchVidas();
          setTimeout(() => {
            document.getElementById('modal-vida-pix').style.display = 'none';
            // Mostrar modal de vida novamente com vidas disponíveis
            _mostrarModalVida(_vidasJogo);
          }, 1500);
          return;
        }
      } catch {}
      _vidaPollTimer = setTimeout(checar, 4000);
    }
    _vidaPollTimer = setTimeout(checar, 4000);
  }

  // Botão DESISTIR
  document.getElementById('btn-desistir-vida').addEventListener('click', async () => {
    document.getElementById('modal-vida').style.display = 'none';
    partidaFinalizada = true;
    esconderHUD();
    try {
      const res = await API.finalizarPartida(partida_id, plataformasPassadas, false);
      mostrarDerrota(res);
    } catch (e) {
      mostrarDerrota({ saldo_novo: null, valor_ganho_ou_perdido: parseFloat(valor_entrada) });
    }
  });

  // Botão VOLTAR do modal PIX
  document.getElementById('btn-vida-pix-voltar').addEventListener('click', () => {
    if (_vidaPollTimer) clearTimeout(_vidaPollTimer);
    document.getElementById('modal-vida-pix').style.display = 'none';
    _mostrarModalVida(_vidasJogo);
  });

  // Buscar vidas ao iniciar
  _fetchVidas();

  // ── Ações dos botões de resultado ─────────────────────────────────────────
  function jogarNovamente() {
    if (IS_DEMO) {
      // Re-inicia a demo sem sair
      sessionStorage.setItem('partida_atual', JSON.stringify({
        partida_id: 'demo', valor_entrada: 5, valor_meta: 30,
        valor_por_plataforma: 1, dificuldade: 'super_facil', modo_demo: true,
      }));
      window.location.hash = '#jogo';
      window.location.reload();
      return;
    }
    window.location.hash = '#painel';
  }

  function voltarPainel() {
    // Abandonar partida ativa no servidor (idempotente — OK chamar mesmo se já finalizada)
    if (!IS_DEMO) {
      // Fire-and-forget: navegação não espera o fetch
      fetch('/api/game/abandonar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
      }).catch(() => {});
    }
    sessionStorage.removeItem('partida_atual');
    window.location.hash = IS_DEMO ? '#landing' : '#painel';
  }

  // ── Modal Demo ── aparece no fim da partida demo ───────────────────────────
  function mostrarModalDemo(valorGanho, resgatou) {
    const overlay = document.getElementById('tela-resultado');
    const displayValor = valorGanho > 0 ? valorGanho : parseFloat(valor_meta);

    overlay.innerHTML = `
      <div id="demo-modal" style="
        background:linear-gradient(160deg,#13001f 0%,#1e003a 100%);
        border:1.5px solid rgba(255,215,0,.4);
        border-radius:28px; max-width:360px; width:92%;
        text-align:center; overflow:hidden;
        box-shadow:0 32px 80px rgba(0,0,0,.75), 0 0 60px rgba(255,215,0,.12);
        animation:resCardIn .45s cubic-bezier(.34,1.56,.64,1) both;
      ">

        <!-- Topo dourado -->
        <div style="
          background:linear-gradient(160deg,rgba(255,180,0,.14) 0%,rgba(255,215,0,.04) 100%);
          padding:30px 28px 22px; position:relative;
        ">
          <!-- Ícone troféu -->
          <div style="
            width:76px;height:76px;border-radius:50%;margin:0 auto 16px;
            display:flex;align-items:center;justify-content:center;
            background:linear-gradient(135deg,#f59e0b,#fbbf24);
            box-shadow:0 0 40px rgba(251,191,36,.55);
            animation:iconPop .55s cubic-bezier(.34,1.56,.64,1) both;
          ">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="38" height="38">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
              <path d="M4 22h16"/>
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
            </svg>
          </div>

          <div style="font-size:24px;font-weight:900;color:#fbbf24;letter-spacing:.6px;margin-bottom:6px">
            PARABÉNS!
          </div>
          <div style="font-size:13px;color:rgba(255,255,255,.5);line-height:1.5">
            Veja quanto você poderia ter ganho:
          </div>
        </div>

        <!-- Valor -->
        <div style="
          margin:0 20px 16px;
          background:linear-gradient(135deg,rgba(251,191,36,.14),rgba(245,158,11,.07));
          border:1px solid rgba(251,191,36,.28); border-radius:16px;
          padding:18px 20px;
        ">
          <div style="font-size:11px;font-weight:700;letter-spacing:.1em;color:rgba(251,191,36,.7);margin-bottom:6px;text-transform:uppercase">
            Você poderia ter ganhado
          </div>
          <div style="font-size:42px;font-weight:900;color:#fbbf24;line-height:1;letter-spacing:1px">
            + ${formatMoney(displayValor)}
          </div>
        </div>

        <!-- Texto CTA -->
        <div style="padding:0 24px 20px;font-size:13px;color:rgba(255,255,255,.6);line-height:1.7">
          Parabéns pelo seu desempenho no teste grátis!<br>
          <span style="color:#FF6B9D;font-weight:700">Ganhe 50% de bônus</span> no seu primeiro depósito.<br>
          Comece a ganhar dinheiro de verdade agora!
        </div>

        <!-- Botões -->
        <div style="padding:0 20px 24px;display:flex;flex-direction:column;gap:10px">
          <button onclick="navigate('#cadastro')" style="
            width:100%;padding:16px;border-radius:50px;border:none;cursor:pointer;
            background:linear-gradient(135deg,#FF6B9D,#c026d3);
            color:#fff;font-size:16px;font-weight:900;letter-spacing:.5px;
            font-family:inherit;text-transform:uppercase;
            box-shadow:0 6px 28px rgba(255,107,157,.50);
            transition:transform .15s,box-shadow .15s;
            display:flex;align-items:center;justify-content:center;gap:10px;
          " onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 10px 36px rgba(255,107,157,.65)'"
             onmouseout="this.style.transform='';this.style.boxShadow='0 6px 28px rgba(255,107,157,.50)'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
            CRIAR CONTA GRÁTIS
          </button>
        </div>
      </div>
    `;

    overlay.style.display = 'flex';
    overlay.style.background = 'rgba(0,0,0,.75)';
    overlay.style.backdropFilter = 'blur(10px)';

    if (resgatou) dispararConfetti();
  }

  // ── Confetti ──────────────────────────────────────────────────────────────
  function dispararConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    canvas.style.display = 'block';
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 3,
      color: ['#FFD700','#FFA500','#FF6B9D','#00C97A','#4D9EFF'][Math.floor(Math.random() * 5)],
      speed: Math.random() * 3 + 1,
      wobble: Math.random() * 10,
    }));
    let frames = 0;
    const anim = () => {
      if (++frames > 200) { canvas.style.display = 'none'; return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y += p.speed;
        p.x += Math.sin(frames * 0.05 + p.wobble) * 1.5;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(anim);
    };
    anim();
  }

  // ── Helper de formatação ──────────────────────────────────────────────────
  function formatMoney(v) {
    return 'R$ ' + parseFloat(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // ── Limpeza ao sair da página ─────────────────────────────────────────────
  return function cleanup() {
    // Remove <style> tags injetadas pelo jogo para não vazar animações globais
    container.querySelectorAll('style').forEach(s => s.remove());
  };
}
