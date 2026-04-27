// ─── Painel Page — mobile-first redesign ──────────────────────────────────────
function renderPainel(el) {
  const user    = API.getUser() || {};
  const inicial = (user.nome || 'U').charAt(0).toUpperCase();

  el.innerHTML = `
    <div class="pnl-root">

      <!-- ══ HEADER ══════════════════════════════════════════════════════ -->
      <header class="pnl-header">
        <div class="pnl-header-inner">
          <div class="pnl-logo brand-logo-wrap">
            <img class="brand-logo-img" src="" alt="logo" style="display:none;max-height:32px;width:auto;object-fit:contain"/>
            <div class="pnl-logo-icon brand-logo-icon">🌀</div>
            <span class="brand-name">HelixWin</span>
          </div>
          <div class="pnl-header-right">
            <!-- Saldo chip com dropdown -->
            <div class="pnl-saldo-wrap" id="saldo-chip-wrap">
              <div class="pnl-saldo-chip" id="saldo-chip">
                <div class="pnl-saldo-chip-inner">
                  <span class="pnl-saldo-chip-lbl">Saldo</span>
                  <span class="pnl-saldo-chip-val" id="saldo-badge">...</span>
                </div>
                <svg class="saldo-chip-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="10" height="10"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
              <div class="pnl-saldo-drop hidden" id="saldo-drop">
                <div class="psd-arrow"></div>
                <button class="psd-item" id="psd-btn-depositar">
                  <span class="psd-icon psd-icon-green">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                  </span>
                  <div class="psd-text">
                    <span class="psd-label">Depositar</span>
                    <span class="psd-sub">Adicionar saldo via PIX</span>
                  </div>
                </button>
                <div class="psd-divider"></div>
                <button class="psd-item" id="psd-btn-sacar">
                  <span class="psd-icon psd-icon-red">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                  </span>
                  <div class="psd-text">
                    <span class="psd-label">Sacar</span>
                    <span class="psd-sub">Retirar seu saldo</span>
                  </div>
                </button>
              </div>
            </div>
            <div class="pnl-avatar-wrap">
              <div class="pnl-avatar" id="btn-perfil" title="${user.nome || ''}">${inicial}</div>
              <!-- Dropdown do perfil -->
              <div class="pnl-profile-drop hidden" id="profile-drop">
                <div class="ppd-arrow"></div>
                <div class="ppd-header">
                  <div class="ppd-avatar">${inicial}</div>
                  <div>
                    <div class="ppd-name" id="ppd-nome">${user.nome || 'Usuário'}</div>
                    <div class="ppd-email" id="ppd-email">${user.email || ''}</div>
                  </div>
                </div>
                <div class="ppd-divider"></div>
                <button class="ppd-item" id="ppd-btn-perfil">
                  <span class="ppd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></span>
                  <span>Meu Perfil</span>
                </button>
                <button class="ppd-item" id="ppd-btn-indique">
                  <span class="ppd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
                  <span>Indique & Ganhe</span>
                  <span class="ppd-badge" id="ppd-saldo-afil">R$ 0,00</span>
                </button>
                <button class="ppd-item" id="ppd-btn-suporte">
                  <span class="ppd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
                  <span>Suporte</span>
                </button>
                ${user.admin ? `
                <div class="ppd-divider"></div>
                <button class="ppd-item" id="ppd-btn-gateway">
                  <span class="ppd-icon" style="color:#f59e0b"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></span>
                  <span>Gateway de Pagamento</span>
                </button>
                <button class="ppd-item" id="ppd-btn-siteconfig">
                  <span class="ppd-icon" style="color:#3b82f6"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></span>
                  <span>Config do Site</span>
                </button>
                <button class="ppd-item" id="ppd-btn-ajuste">
                  <span class="ppd-icon" style="color:#22c55e"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></span>
                  <span>Ajustar Saldo</span>
                </button>
                ` : ''}
                ${(user.role === 'super_admin' || user.role === 'gerente' || user.role === 'influencer') ? `
                <div class="ppd-divider"></div>
                <button class="ppd-item" id="ppd-btn-meu-painel">
                  <span class="ppd-icon" style="color:#a855f7"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg></span>
                  <span>Painel ${user.role === 'super_admin' ? 'Super Admin' : user.role === 'gerente' ? 'Gerente' : 'Influencer'}</span>
                </button>
                ` : ''}
                <div class="ppd-divider"></div>
                <button class="ppd-item ppd-item-danger" id="ppd-btn-sair">
                  <span class="ppd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span>
                  <span>Sair</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- ══ SCROLL AREA ══════════════════════════════════════════════════ -->
      <div class="pnl-scroll">

        <!-- ── Hero saldo ────────────────────────────────────────────── -->
        <div class="pnl-hero">
          <div class="pnl-hero-label">Seu saldo disponível</div>
          <div class="pnl-hero-value" id="st-saldo">...</div>
          <div class="pnl-hero-actions">
            <button class="pnl-action-btn pnl-action-green" id="btn-depositar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
              Depositar
            </button>
            <button class="pnl-action-btn pnl-action-outline" id="btn-sacar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
              Sacar
            </button>
            <button class="pnl-action-btn pnl-action-outline" id="btn-indicar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Indicar
            </button>
          </div>
        </div>

        <!-- ── Dicas rotativas ───────────────────────────────────────── -->
        <div class="pnl-tips-wrap" id="pnl-tips-wrap">
          <div class="pnl-tips-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div class="pnl-tips-text" id="pnl-tips-text"></div>
        </div>

        <!-- ── Guia boas-vindas (visível só para novos usuários) ───── -->
        <div id="guia-boas-vindas" class="pnl-guia-card" style="display:none">
          <div class="pnl-guia-header">
            <span style="font-size:20px">👋</span>
            <div>
              <div class="pnl-guia-title">Como funciona em 3 passos</div>
              <div class="pnl-guia-sub">Simples assim — em menos de 2 minutos você já está jogando</div>
            </div>
            <button class="pnl-guia-close" id="guia-close-btn" title="Fechar">✕</button>
          </div>
          <div class="pnl-guia-steps">
            <div class="pnl-guia-step">
              <div class="pnl-guia-step-num">1</div>
              <div>
                <div class="pnl-guia-step-title">Deposite via PIX</div>
                <div class="pnl-guia-step-desc">Toque em <strong>Depositar</strong> abaixo. Mínimo R$10. O saldo cai na hora após o pagamento.</div>
              </div>
            </div>
            <div class="pnl-guia-step">
              <div class="pnl-guia-step-num">2</div>
              <div>
                <div class="pnl-guia-step-title">Escolha um valor e jogue</div>
                <div class="pnl-guia-step-desc">Toque num valor (ex: R$5), depois em <strong>JOGAR AGORA</strong>. Passe plataformas e acumule prêmio.</div>
              </div>
            </div>
            <div class="pnl-guia-step">
              <div class="pnl-guia-step-num">3</div>
              <div>
                <div class="pnl-guia-step-title">Resgate quando quiser</div>
                <div class="pnl-guia-step-desc">Durante o jogo, toque em <strong>Resgatar</strong> para transformar seu prêmio em saldo real. Depois saque via PIX.</div>
              </div>
            </div>
          </div>
          <button class="pnl-guia-cta" id="guia-cta-dep">
            💰 Depositar agora e começar
          </button>
        </div>

        <!-- ── Game card ─────────────────────────────────────────────── -->
        <div class="pnl-game-card">

          <!-- Topo do card -->
          <div class="pnl-game-top">
            <div>
              <div class="pnl-game-title">INICIAR PARTIDA</div>
              <div class="pnl-game-sub">Passe plataformas, acumule dinheiro e escolha quando resgatar!</div>
            </div>
            <div class="pnl-game-badge" id="users-playing-badge">
              <span class="badge-dot"></span>
              <span class="badge-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </span>
              <span id="n-jogando">0</span>
              <span class="badge-label">online</span>
            </div>
          </div>

          <!-- Chips informativos -->
          <div class="pnl-chips">
            <div class="pnl-chip pnl-chip-gold" id="chip-mult">
              <span class="chip-icon">🎯</span>
              <span>Meta = <strong id="chip-mult-val">...×</strong></span>
            </div>
            <div class="pnl-chip pnl-chip-blue">
              <span class="chip-icon">∞</span>
              <span>Plataformas</span>
            </div>
          </div>

          <!-- Seção de aposta centralizada -->
          <div class="pnl-bet-center">

            <div class="pnl-quick-label">Valor de entrada</div>
            <div class="pnl-quick-row" id="quick-amounts">
              <button class="pnl-quick" data-v="1">R$1</button>
              <button class="pnl-quick" data-v="2">R$2</button>
              <button class="pnl-quick" data-v="5">R$5</button>
              <button class="pnl-quick" data-v="10">R$10</button>
              <button class="pnl-quick" data-v="20">R$20</button>
              <button class="pnl-quick" data-v="50">R$50</button>
            </div>
            <!-- valores dinâmicos sobrescrevem os acima via JS -->

            <div class="pnl-input-wrap">
              <span class="pnl-input-prefix">R$</span>
              <input id="entrada-val" class="pnl-input" type="number"
                placeholder="0,00" min="1" max="100" step="0.01" inputmode="decimal" />
            </div>

            <div class="pnl-meta-row" id="meta-preview">
              <div class="pnl-meta-item">
                <div class="pnl-meta-lbl">Meta de ganho</div>
                <div class="pnl-meta-val pnl-meta-gold" id="meta-val">R$ 0,00</div>
              </div>
              <div class="pnl-meta-item">
                <div class="pnl-meta-lbl">Por plataforma</div>
                <div class="pnl-meta-val" id="meta-vpp">R$ 0,10</div>
              </div>
              <div class="pnl-meta-item">
                <div class="pnl-meta-lbl">Plat. p/ meta</div>
                <div class="pnl-meta-val" id="meta-plat">~70</div>
              </div>
            </div>

          </div>

          <!-- Seguro de partida -->
          <label id="seguro-wrap" class="pnl-seguro-toggle" style="display:flex;align-items:center;gap:10px;background:rgba(168,85,247,.08);border:1px solid rgba(168,85,247,.2);border-radius:10px;padding:10px 14px;margin-top:8px;cursor:pointer;user-select:none">
            <input type="checkbox" id="chk-seguro" style="accent-color:#a855f7;width:18px;height:18px;cursor:pointer"/>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:600;color:#e9d5ff">Seguro de Partida</div>
              <div style="font-size:11px;color:rgba(255,255,255,.45)">Pague +30% e receba 50% de volta se perder</div>
            </div>
            <div id="seguro-custo" style="font-size:12px;font-weight:700;color:#c084fc;white-space:nowrap">+R$ 0,00</div>
          </label>

          <!-- Modo Turbo -->
          <label style="display:flex;align-items:center;gap:10px;background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.2);border-radius:10px;padding:10px 14px;margin-top:6px;cursor:pointer;user-select:none">
            <input type="checkbox" id="chk-turbo" style="accent-color:#f59e0b;width:18px;height:18px;cursor:pointer"/>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:600;color:#fde68a">Modo Turbo</div>
              <div style="font-size:11px;color:rgba(255,255,255,.45)">Pague +50% e ganhe 1.5x mais por plataforma</div>
            </div>
            <div id="turbo-custo" style="font-size:12px;font-weight:700;color:#fbbf24;white-space:nowrap">+R$ 0,00</div>
          </label>

          <!-- Vidas -->
          <div id="vidas-wrap" style="display:flex;align-items:center;gap:10px;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:10px;padding:10px 14px;margin-top:6px">
            <span style="font-size:22px">❤️</span>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:600;color:#fca5a5">Vidas: <span id="vidas-count">0</span></div>
              <div style="font-size:11px;color:rgba(255,255,255,.45)">Morra e continue de onde parou</div>
            </div>
            <button id="btn-comprar-vidas" style="background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;border:none;border-radius:8px;padding:6px 12px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap">+3 por R$10</button>
          </div>

          <!-- Alerta saldo -->
          <div id="saldo-warn" class="pnl-warn hidden">
            ⚠️ Saldo insuficiente
            <button class="pnl-warn-btn" id="dep-from-warn">Depositar agora</button>
          </div>

          <!-- Botão jogar -->
          <button class="pnl-play-btn" id="btn-jogar">
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><polygon points="5,3 19,12 5,21"/></svg>
            JOGAR AGORA
          </button>
        </div>

        <!-- ══ MISSÕES DIÁRIAS ═══════════════════════════════════════════ -->
        <div id="missoes-card" class="pnl-card" style="margin-top:16px;padding:16px;display:none">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
            <span style="font-size:20px">🎯</span>
            <div style="font-size:15px;font-weight:700;color:#e9d5ff">Missoes e Bonus</div>
          </div>
          <div id="missoes-lista" style="display:flex;flex-direction:column;gap:8px"></div>
        </div>

        <div style="height:100px"></div>
      </div><!-- /scroll -->

      <!-- ══ BOTTOM NAV ══════════════════════════════════════════════════ -->
      <nav class="pnl-bottom-nav">
        <button class="pnl-nav-item pnl-nav-active" id="nav-jogar" onclick="document.getElementById('btn-jogar')?.scrollIntoView({behavior:'smooth',block:'center'})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
          <span>Jogar</span>
        </button>
        <button class="pnl-nav-item" id="nav-dep">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          <span>Depositar</span>
        </button>
        <button class="pnl-nav-item" id="nav-sac">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
          <span>Sacar</span>
        </button>
        <button class="pnl-nav-item" id="nav-ind">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span>Indicar</span>
        </button>
        ${(user.role === 'super_admin' || user.role === 'gerente' || user.role === 'influencer') ? `
        <button class="pnl-nav-item" id="nav-meu-painel" style="color:#a855f7">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
          <span>Painel</span>
        </button>
        ` : ''}
        <button class="pnl-nav-item" id="nav-sair">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          <span>Sair</span>
        </button>
      </nav>

    </div><!-- /pnl-root -->

    <!-- ══ MODAIS ══════════════════════════════════════════════════════════ -->

    <!-- Modal Depositar -->
    <div class="pnl-modal-bg hidden" id="modal-deposito">
      <div class="pnl-modal">
        <div class="pnl-modal-header">
          <span class="pnl-modal-title">Depositar via PIX</span>
          <button class="pnl-modal-close" id="close-deposito">✕</button>
        </div>
        <div id="dep-step1">
          <div class="pnl-quick-row" id="dep-quick-row" style="margin-bottom:14px">
            <button class="pnl-quick" data-dep="10">R$10</button>
            <button class="pnl-quick" data-dep="20">R$20</button>
            <button class="pnl-quick" data-dep="50">R$50</button>
            <button class="pnl-quick" data-dep="100">R$100</button>
          </div>
          <div class="pnl-input-wrap" style="margin-bottom:14px">
            <span class="pnl-input-prefix">R$</span>
            <input id="dep-valor" class="pnl-input" type="number" placeholder="Mínimo R$10,00" min="10" step="1" inputmode="decimal" data-min="10" data-max="0" />
          </div>
          <div class="pnl-input-wrap" style="margin-bottom:16px;background:#f8f8f8" id="dep-cpf-wrap">
            <span class="pnl-input-prefix" style="font-size:11px;white-space:nowrap">CPF</span>
            <input id="dep-cpf" class="pnl-input" type="text" placeholder="000.000.000-00" maxlength="14" inputmode="numeric" style="background:transparent" />
          </div>
          <!-- Card de bônus — só aparece quando bônus está ativo -->
          <div id="dep-bonus-card" class="hidden" style="background:linear-gradient(135deg,#1a7a3a,#22a850);border-radius:12px;padding:14px 16px;margin-bottom:16px;color:#fff">
            <div style="font-size:11px;font-weight:700;letter-spacing:.08em;opacity:.85;margin-bottom:6px" id="dep-bonus-label">BÔNUS DE 0%</div>
            <div style="font-size:22px;font-weight:800;margin-bottom:8px" id="dep-bonus-valor">+ R$ 0,00</div>
            <div style="border-top:1px solid rgba(255,255,255,.25);padding-top:8px;font-size:13px;opacity:.9">
              💰 Total na conta: <strong id="dep-bonus-total">R$ 0,00</strong>
            </div>
          </div>
          <!-- Cupom discreto -->
          <div id="dep-cupom-wrap" style="margin-bottom:14px">
            <div id="dep-cupom-toggle" style="display:flex;align-items:center;gap:6px;cursor:pointer;width:fit-content;opacity:.6;font-size:12px;color:var(--pnl-muted,#52796f)" onclick="toggleDepCupom()">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
              Tenho um cupom
            </div>
            <div id="dep-cupom-field" style="display:none;margin-top:8px">
              <div style="display:flex;gap:8px;align-items:center">
                <input id="dep-cupom-input" class="pnl-input" type="text" placeholder="Código do cupom" style="flex:1;text-transform:uppercase;background:transparent" oninput="this.value=this.value.toUpperCase().replace(/\s/g,'')" />
                <button id="dep-cupom-btn" style="flex-shrink:0;background:#2d6a4f;color:#fff;border:none;border-radius:8px;padding:9px 14px;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap" onclick="aplicarCupomDep()">Aplicar</button>
              </div>
              <div id="dep-cupom-status" style="margin-top:6px;font-size:12px;min-height:18px;display:flex;align-items:center;flex-wrap:wrap;gap:8px">
              </div>
              <div id="dep-cupom-alterar-wrap" style="display:none;margin-top:6px">
                <button onclick="alterarCupomDep()" style="display:inline-flex;align-items:center;gap:5px;background:none;border:1px solid #d1d5db;border-radius:6px;padding:5px 10px;font-size:11px;font-weight:600;color:#6b7280;cursor:pointer;transition:all .15s">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Alterar cupom
                </button>
              </div>
            </div>
          </div>
          <button class="pnl-play-btn" id="dep-confirmar">Gerar QR Code PIX</button>
        </div>
        <div id="dep-step2" class="hidden" style="text-align:center">
          <!-- Loading enquanto aguarda resposta do gateway -->
          <div id="dep-loading" style="padding:40px 0">
            <div style="width:48px;height:48px;border:4px solid #d0f5e8;border-top-color:#2d6a4f;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 16px"></div>
            <div style="font-size:13px;color:#52796f">Gerando cobrança PIX...</div>
          </div>
          <!-- Conteúdo após retorno do gateway -->
          <div id="dep-content" class="hidden">
            <div id="dep-qr-wrap" style="background:linear-gradient(135deg,#e8fff4,#d0f5e8);border-radius:12px;padding:16px;margin-bottom:16px">
              <img id="dep-qr-img" src="" alt="QR PIX" style="width:180px;height:180px;border-radius:8px;display:block;margin:0 auto" />
            </div>
            <div style="margin-bottom:14px">
              <div style="font-size:11px;color:#52796f;margin-bottom:6px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Código Copia e Cola</div>
              <div style="display:flex;align-items:center;gap:8px;background:#f1fdf7;border:1px solid #b7e4c7;border-radius:10px;padding:10px 12px">
                <div id="dep-pix-txt" style="flex:1;font-size:11px;color:#1b4332;text-align:left;overflow:hidden;white-space:nowrap;text-overflow:ellipsis"></div>
                <button id="dep-copy-btn"
                  style="flex-shrink:0;background:#2d6a4f;color:#fff;border:none;border-radius:7px;padding:7px 12px;font-size:12px;font-weight:600;cursor:pointer">Copiar</button>
              </div>
            </div>
            <div class="pnl-info-box pnl-info-green">✅ Após o pagamento seu saldo é creditado automaticamente em até 1 minuto.</div>
            <div class="pnl-timer" id="dep-timer"></div>
          </div>
          <button class="pnl-btn-outline" onclick="document.getElementById('modal-deposito').classList.add('hidden')" style="margin-top:12px">Fechar</button>
        </div>
      </div>
    </div>

    <!-- Modal Depósito Confirmado -->
    <div class="pnl-modal-bg hidden" id="modal-dep-confirmado">
      <div class="pnl-modal" style="text-align:center;max-width:360px">
        <div style="margin:0 auto 16px;width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#22c55e,#16a34a);display:flex;align-items:center;justify-content:center;animation:depConfirmPop .5s cubic-bezier(.34,1.56,.64,1) both">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" width="36" height="36"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div style="font-size:20px;font-weight:800;color:#22c55e;margin-bottom:6px">Depósito Confirmado!</div>
        <div style="font-size:13px;color:#5a4a6e;margin-bottom:18px">Seu pagamento foi recebido com sucesso.</div>
        <div style="background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3);border-radius:12px;padding:14px;margin-bottom:20px">
          <div style="font-size:11px;color:#8b7a9e;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Valor creditado</div>
          <div id="dep-confirmado-valor" style="font-size:28px;font-weight:800;color:#22c55e">R$ 0,00</div>
          <div style="font-size:12px;color:#5a4a6e;margin-top:6px">Novo saldo: <strong id="dep-confirmado-saldo" style="color:#2d0040">R$ 0,00</strong></div>
        </div>
        <button class="pnl-play-btn" onclick="document.getElementById('modal-dep-confirmado').classList.add('hidden')" style="width:100%">Jogar Agora 🎮</button>
      </div>
    </div>

    <!-- Modal Saque -->
    <div class="pnl-modal-bg hidden" id="modal-saque">
      <div class="pnl-modal">
        <div class="pnl-modal-header">
          <span class="pnl-modal-title">Solicitar Saque</span>
          <button class="pnl-modal-close" id="close-saque">✕</button>
        </div>
        <div class="pnl-saldo-modal-info">Saldo disponível: <strong id="saldo-saque-disp">...</strong></div>
        <div class="pnl-input-wrap" style="margin-bottom:14px">
          <span class="pnl-input-prefix">R$</span>
          <input id="saq-valor" class="pnl-input" type="number" placeholder="Mínimo R$20,00" min="20" step="0.01" inputmode="decimal" data-min="20" data-max="0" />
        </div>
        <div class="pnl-input-wrap" style="margin-bottom:14px;background:#f8f8f8">
          <span class="pnl-input-prefix" style="font-size:11px;white-space:nowrap">PIX</span>
          <input id="saq-pix" class="pnl-input" type="text" placeholder="Chave PIX (e-mail, telefone ou chave aleatória)" style="background:transparent" />
        </div>
        <div class="pnl-input-wrap" style="margin-bottom:14px;background:#f8f8f8">
          <span class="pnl-input-prefix" style="font-size:11px;white-space:nowrap">CPF</span>
          <input id="saq-cpf" class="pnl-input" type="text" placeholder="CPF do titular (somente números)" maxlength="14" inputmode="numeric" style="background:transparent" />
        </div>
        <div class="pnl-info-box pnl-info-orange">⏱ Saques processados em até 24h úteis.</div>
        <button class="pnl-play-btn" id="saq-confirmar" style="margin-top:16px;background:linear-gradient(135deg,#FF6B9D,#FF8CC8)">Solicitar Saque</button>

        <!-- Meus Saques -->
        <div id="meus-saques-section" style="display:none;margin-top:22px">
          <div style="font-size:13px;font-weight:700;color:#9980aa;margin-bottom:10px;display:flex;align-items:center;gap:6px">
            <span>📋</span> Meus Saques
          </div>
          <div id="meus-saques-lista"></div>
        </div>
      </div>
    </div>

    <!-- ══ MODAL DESBLOQUEIO DE SAQUE (Upsell) ═══════════════════════════ -->
    <div class="pnl-modal-bg hidden" id="modal-desbloqueio">
      <div class="pnl-modal" style="text-align:center">
        <div class="pnl-modal-header">
          <span class="pnl-modal-title" style="color:#f59e0b">
            <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" width="20" height="20"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Desbloqueio de Saque
          </span>
          <button class="pnl-modal-close" id="close-desbloqueio">✕</button>
        </div>
        <div style="padding:8px 0 16px">
          <div style="font-size:48px;margin-bottom:12px">🔒</div>
          <div style="font-size:15px;color:#4a3560;line-height:1.6;margin-bottom:16px">
            Para desbloquear seu saque, deposite <strong style="color:#059669">R$ 20,00</strong> a partir da conta que vai receber o saque final.
          </div>
          <div class="pnl-info-box pnl-info-orange" style="text-align:left;margin-bottom:16px">
            Esse deposito sera adicionado ao seu saldo normalmente. Apos a confirmacao, seu saque sera liberado automaticamente.
          </div>
          <button class="pnl-play-btn" id="desbl-depositar-btn" style="background:linear-gradient(135deg,#10b981,#059669);font-size:16px;padding:14px 24px">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
            Depositar R$ 20,00 para Desbloquear
          </button>
        </div>
      </div>
    </div>

    <!-- ══ MODAL TAXA DE SAQUE (Upsell 2) ═══════════════════════════════════ -->
    <div class="pnl-modal-bg hidden" id="modal-taxa-saque">
      <div class="pnl-modal" style="text-align:center">
        <div class="pnl-modal-header">
          <span class="pnl-modal-title" style="color:#f59e0b">
            <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" width="20" height="20"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Taxa de Processamento
          </span>
          <button class="pnl-modal-close" id="close-taxa-saque">&#10005;</button>
        </div>
        <div style="padding:8px 0 16px">
          <div style="font-size:48px;margin-bottom:12px">&#128179;</div>
          <div style="font-size:15px;color:#4a3560;line-height:1.6;margin-bottom:8px">
            Para processar seu saque de <strong id="taxa-saque-valor-saque" style="color:#059669">R$ 0,00</strong>, e necessario pagar a taxa de processamento bancario.
          </div>
          <div style="background:linear-gradient(135deg,rgba(251,191,36,.12),rgba(251,191,36,.05));border:1px solid rgba(251,191,36,.25);border-radius:14px;padding:18px;margin:16px 0">
            <div style="font-size:12px;color:#8b7a9e;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Taxa de Processamento</div>
            <div id="taxa-saque-valor-taxa" style="font-size:28px;font-weight:800;color:#d97706">R$ 0,00</div>
          </div>
          <div class="pnl-info-box pnl-info-orange" style="text-align:left;margin-bottom:16px">
            Apos o pagamento da taxa, seu saque sera processado e o valor enviado para sua chave PIX em ate 24h uteis.
          </div>
          <button class="pnl-play-btn" id="taxa-saque-pagar-btn" style="background:linear-gradient(135deg,#f59e0b,#d97706);font-size:16px;padding:14px 24px">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Depositar Taxa via PIX
          </button>
        </div>
      </div>
    </div>

    <!-- ══ MODAL SAQUE SUCESSO ════════════════════════════════════════════ -->
    <div class="pnl-modal-bg hidden" id="modal-saque-sucesso">
      <div class="pnl-modal" style="text-align:center">
        <div style="padding:30px 20px">
          <div style="width:80px;height:80px;border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#22c55e,#16a34a);box-shadow:0 0 40px rgba(34,197,94,.45);animation:iconPop .55s cubic-bezier(.34,1.56,.64,1) both">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="40" height="40"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div style="font-size:22px;font-weight:800;color:#22c55e;margin-bottom:8px">Saque Realizado com Sucesso!</div>
          <div style="font-size:14px;color:#5a4a6e;line-height:1.6;margin-bottom:20px">
            Seu saque foi processado e sera enviado para sua chave PIX em ate <strong style="color:#2d0040">24 horas uteis</strong>.
          </div>
          <div id="saque-sucesso-valor" style="font-size:32px;font-weight:800;color:#22c55e;margin-bottom:20px">R$ 0,00</div>
          <button class="pnl-play-btn" id="saque-sucesso-fechar" style="background:linear-gradient(135deg,#22c55e,#16a34a);font-size:16px;padding:14px 24px">
            Fechar
          </button>
        </div>
      </div>
    </div>

    <!-- ══ MODAL SAQUE AFILIADO ════════════════════════════════════════════ -->
    <div class="pnl-modal-bg hidden" id="modal-saque-afiliado">
      <div class="pnl-modal">
        <div class="pnl-modal-header">
          <span class="pnl-modal-title">Sacar Comissão</span>
          <button class="pnl-modal-close" id="close-saque-afiliado">✕</button>
        </div>
        <div class="pnl-saldo-modal-info">Saldo de comissão: <strong id="saldo-afil-disp">...</strong></div>
        <div class="pnl-input-wrap" style="margin-bottom:14px">
          <span class="pnl-input-prefix">R$</span>
          <input id="saq-afil-valor" class="pnl-input" type="number" placeholder="Mínimo R$1,00" min="1" step="0.01" inputmode="decimal" />
        </div>
        <div class="pnl-input-wrap" style="margin-bottom:14px;background:#f8f8f8">
          <span class="pnl-input-prefix" style="font-size:11px;white-space:nowrap">PIX</span>
          <input id="saq-afil-pix" class="pnl-input" type="text" placeholder="CPF, e-mail, telefone..." style="background:transparent" />
        </div>
        <div class="pnl-info-box pnl-info-orange">⏱ Saques processados em até 24h úteis.</div>
        <button class="pnl-play-btn" id="saq-afil-confirmar" style="margin-top:16px;background:linear-gradient(135deg,#7c3aed,#a855f7)">Solicitar Saque de Comissão</button>
      </div>
    </div>

    <!-- Modal Indicação -->
    <!-- ══ MODAL SUPORTE ══════════════════════════════════════════════════ -->
    <div class="pnl-modal-bg hidden" id="modal-suporte">
      <div class="pnl-modal">
        <div class="pnl-modal-header">
          <span class="pnl-modal-title">Suporte</span>
          <button class="pnl-modal-close" id="close-suporte">✕</button>
        </div>
        <div id="suporte-loading" style="text-align:center;padding:30px 0;color:#9980aa;font-size:14px">Carregando...</div>
        <div id="suporte-links-wrap"></div>
      </div>
    </div>

    <!-- ══ MODAL PERFIL ═══════════════════════════════════════════════════ -->
    <div class="pnl-modal-bg hidden" id="modal-perfil">
      <div class="pnl-modal">
        <div class="pnl-modal-header">
          <span class="pnl-modal-title">Meu Perfil</span>
          <button class="pnl-modal-close" id="close-perfil">✕</button>
        </div>

        <!-- Avatar e nome -->
        <div style="display:flex;flex-direction:column;align-items:center;padding:10px 0 20px;gap:8px">
          <div class="prf-avatar-lg" id="prf-avatar-lg">${inicial}</div>
          <div style="font-size:18px;font-weight:800;color:#2d0040" id="prf-nome">${user.nome || ''}</div>
          <div style="font-size:12px;color:#9980aa" id="prf-email">${user.email || ''}</div>
        </div>

        <!-- Stats do perfil -->
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:20px">
          <div class="prf-stat">
            <div class="prf-stat-val" id="prf-saldo">R$ 0,00</div>
            <div class="prf-stat-lbl">Saldo</div>
          </div>
          <div class="prf-stat">
            <div class="prf-stat-val" id="prf-partidas">0</div>
            <div class="prf-stat-lbl">Partidas</div>
          </div>
          <div class="prf-stat">
            <div class="prf-stat-val" id="prf-afil">R$ 0,00</div>
            <div class="prf-stat-lbl">Afiliado</div>
          </div>
        </div>

        <!-- Alterar senha -->
        <div class="prf-section">
          <div class="prf-section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Alterar Senha
          </div>
          <input class="pnl-input-modal" id="prf-senha-atual" type="password" placeholder="Senha atual"/>
          <input class="pnl-input-modal" id="prf-senha-nova" type="password" placeholder="Nova senha"/>
          <input class="pnl-input-modal" id="prf-senha-conf" type="password" placeholder="Confirmar nova senha"/>
          <button class="prf-btn-salvar" id="prf-btn-senha">Alterar Senha</button>
        </div>
      </div>
    </div>

    <div class="pnl-modal-bg hidden" id="modal-indicacao">
      <div class="pnl-modal" style="max-width:500px">
        <div class="pnl-modal-header">
          <span class="pnl-modal-title">Programa de Afiliados</span>
          <button class="pnl-modal-close" id="close-indicacao">✕</button>
        </div>

        <!-- Tabs -->
        <div id="ind-tabs" style="display:flex;gap:4px;margin-bottom:14px;background:rgba(0,0,0,.2);border-radius:10px;padding:4px">
          <button class="ind-tab ind-tab-active" data-tab="resumo" style="flex:1;padding:10px 8px;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;transition:all .2s">Resumo</button>
          <button class="ind-tab" data-tab="rede" style="flex:1;padding:10px 8px;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;transition:all .2s">Minha Rede</button>
          <button class="ind-tab" data-tab="historico" style="flex:1;padding:10px 8px;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;transition:all .2s">Histórico</button>
        </div>

        <!-- Tab: Resumo -->
        <div id="ind-tab-resumo">
          <details style="background:rgba(168,85,247,.08);border:1px solid rgba(168,85,247,.22);border-radius:10px;padding:11px 15px;margin-bottom:14px">
            <summary style="cursor:pointer;font-size:12px;font-weight:700;color:#c4b5fd;list-style:none;display:flex;align-items:center;gap:6px;user-select:none">
              📖 Como ganhar com afiliados? (clique para ver)
              <span style="margin-left:auto;font-size:9px;opacity:.7">▼</span>
            </summary>
            <div style="margin-top:10px;font-size:12px;color:rgba(255,255,255,.75);line-height:1.8;padding-top:9px;border-top:1px solid rgba(168,85,247,.15)">
              <strong>1. Copie seu link exclusivo</strong> abaixo e compartilhe com amigos, grupos de WhatsApp e redes sociais.<br>
              <strong>2. Quando alguém se cadastrar</strong> pelo seu link, fica vinculado a você para sempre.<br>
              <strong>3. A cada depósito</strong> que seu indicado fizer, você recebe automaticamente uma % de comissão no seu saldo de afiliado.<br>
              <strong>4. Saque quando quiser</strong> — clique em "Sacar Comissão" e o dinheiro vai para o seu PIX.<br>
              <span style="display:block;margin-top:8px;background:rgba(168,85,247,.12);border-radius:7px;padding:8px 10px;font-size:11px;color:#c4b5fd">
                💡 Quanto mais pessoas você indicar e quanto mais elas depositarem, maior é a sua renda passiva!
              </span>
            </div>
          </details>
          <div class="pnl-info-box pnl-info-pink" style="text-align:center;margin-bottom:16px">
            Ganhe <strong id="ind-comissao-perc">...</strong> no nível 1 e <strong id="ind-comissao-n2">...</strong> no nível 2 sobre cada depósito dos seus indicados!
          </div>

          <div id="ind-saldo-box" style="background:linear-gradient(135deg,#4a1080,#2d0a50);border-radius:14px;padding:18px 20px;margin-bottom:14px">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px">
              <div>
                <div style="font-size:11px;color:#c084fc;text-transform:uppercase;letter-spacing:.6px;margin-bottom:4px">Saldo de Afiliado</div>
                <div id="ind-saldo-afil" style="font-size:24px;font-weight:700;color:#fff">R$ 0,00</div>
                <div style="font-size:11px;color:#9d74c5;margin-top:2px">disponível para saque</div>
              </div>
              <div style="text-align:right">
                <div style="font-size:11px;color:#c084fc;text-transform:uppercase;letter-spacing:.6px;margin-bottom:4px">Total Recebido</div>
                <div id="ind-total-comissao" style="font-size:18px;font-weight:600;color:#e9d5ff">R$ 0,00</div>
                <div style="font-size:11px;color:#9d74c5;margin-top:2px">em comissões</div>
              </div>
            </div>
            <button id="btn-sacar-afil" style="width:100%;padding:12px;border-radius:10px;border:none;cursor:pointer;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center;gap:8px;transition:opacity .2s">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
              Sacar Comissão
            </button>
          </div>

          <div class="pnl-link-box">
            <div class="pnl-link-label">Seu link exclusivo</div>
            <div class="pnl-link-val" id="ind-link">...</div>
            <button class="pnl-btn-copy" onclick="copyToClipboard(document.getElementById('ind-link').textContent)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Copiar
            </button>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px">
            <div class="pnl-mini-stat">
              <div class="pnl-mini-val" id="ind-total">0</div>
              <div class="pnl-mini-lbl">Nível 1</div>
            </div>
            <div class="pnl-mini-stat">
              <div class="pnl-mini-val" id="ind-total-n2">0</div>
              <div class="pnl-mini-lbl">Nível 2</div>
            </div>
            <div class="pnl-mini-stat">
              <div class="pnl-mini-val" id="ind-bonus">0</div>
              <div class="pnl-mini-lbl">Com depósito</div>
            </div>
          </div>
          <div id="ind-lista"></div>
        </div>

        <!-- Tab: Rede -->
        <div id="ind-tab-rede" style="display:none">
          <details style="background:rgba(168,85,247,.08);border:1px solid rgba(168,85,247,.22);border-radius:10px;padding:11px 15px;margin-bottom:14px">
            <summary style="cursor:pointer;font-size:12px;font-weight:700;color:#c4b5fd;list-style:none;display:flex;align-items:center;gap:6px;user-select:none">
              📖 O que é "Minha Rede"? (clique para ver)
              <span style="margin-left:auto;font-size:9px;opacity:.7">▼</span>
            </summary>
            <div style="margin-top:10px;font-size:12px;color:rgba(255,255,255,.75);line-height:1.8;padding-top:9px;border-top:1px solid rgba(168,85,247,.15)">
              Aqui você vê <strong>todos os seus indicados organizados em níveis</strong>:<br>
              • <strong>Nível 1</strong> — pessoas que se cadastraram diretamente pelo seu link. Você recebe a maior comissão delas.<br>
              • <strong>Nível 2</strong> — indicados dos seus indicados. Você recebe uma comissão menor, mas automática.<br>
              <span style="display:block;margin-top:8px;background:rgba(168,85,247,.12);border-radius:7px;padding:8px 10px;font-size:11px;color:#c4b5fd">
                💡 Quanto mais ativa sua rede, mais você ganha — mesmo sem fazer nada extra!
              </span>
            </div>
          </details>
          <div id="ind-rede-loading" style="text-align:center;padding:24px;color:#9980aa">Carregando rede...</div>
          <div id="ind-rede-content"></div>
        </div>

        <!-- Tab: Histórico -->
        <div id="ind-tab-historico" style="display:none">
          <details style="background:rgba(168,85,247,.08);border:1px solid rgba(168,85,247,.22);border-radius:10px;padding:11px 15px;margin-bottom:14px">
            <summary style="cursor:pointer;font-size:12px;font-weight:700;color:#c4b5fd;list-style:none;display:flex;align-items:center;gap:6px;user-select:none">
              📖 Como ler o histórico? (clique para ver)
              <span style="margin-left:auto;font-size:9px;opacity:.7">▼</span>
            </summary>
            <div style="margin-top:10px;font-size:12px;color:rgba(255,255,255,.75);line-height:1.8;padding-top:9px;border-top:1px solid rgba(168,85,247,.15)">
              O histórico mostra <strong>todas as comissões que você ganhou</strong> com seus indicados:<br>
              • Cada linha representa um depósito de alguém da sua rede.<br>
              • A coluna <strong>Valor</strong> mostra quanto você recebeu naquela ocasião.<br>
              • O <strong>nome</strong> é o indicado que gerou a comissão.<br>
              <span style="display:block;margin-top:8px;background:rgba(168,85,247,.12);border-radius:7px;padding:8px 10px;font-size:11px;color:#c4b5fd">
                💡 Sem entradas? Compartilhe seu link (aba Resumo) para começar a ganhar!
              </span>
            </div>
          </details>
          <div id="ind-hist-loading" style="text-align:center;padding:24px;color:#9980aa">Carregando...</div>
          <div id="ind-hist-content"></div>
        </div>
      </div>
    </div>

    <!-- ══ MODAL GATEWAY CONFIG (Admin) — Multi-Gateway ═════════════════ -->
    ${user.admin ? `
    <div class="pnl-modal-bg hidden" id="modal-gateway">
      <div class="pnl-modal" style="max-width:480px">
        <div class="pnl-modal-header">
          <span class="pnl-modal-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Multi-Gateway
          </span>
          <button class="pnl-modal-close" id="close-gateway">✕</button>
        </div>

        <!-- Gateway Selector -->
        <div class="gw-section-title" style="margin-bottom:8px">Gateway Ativo</div>
        <div class="gw-selector" style="display:flex;gap:8px;margin-bottom:16px">
          <button class="gw-sel-btn" data-gw="amplopay" id="gw-sel-amplopay" style="flex:1;padding:10px 12px;border-radius:10px;border:2px solid rgba(0,0,0,0.15);background:rgba(0,0,0,0.04);color:#222;cursor:pointer;font-size:13px;font-weight:600;transition:all .2s">
            AmploPay
          </button>
          <button class="gw-sel-btn" data-gw="paradisepags" id="gw-sel-paradisepags" style="flex:1;padding:10px 12px;border-radius:10px;border:2px solid rgba(0,0,0,0.15);background:rgba(0,0,0,0.04);color:#222;cursor:pointer;font-size:13px;font-weight:600;transition:all .2s">
            ParadisePags
          </button>
        </div>

        <!-- ── AmploPay Config Panel ── -->
        <div id="gw-panel-amplopay" class="gw-panel">
          <div class="gw-status-row" id="gw-status-row-amp">
            <div class="gw-status-item" id="gw-st-amp-pk"><span class="gw-dot gw-dot-off"></span><span>Public Key</span></div>
            <div class="gw-status-item" id="gw-st-amp-sk"><span class="gw-dot gw-dot-off"></span><span>Secret Key</span></div>
            <div class="gw-status-item" id="gw-st-amp-wt"><span class="gw-dot gw-dot-off"></span><span>Webhook</span></div>
          </div>
          <div class="gw-field">
            <label class="gw-label">Webhook URL (configure na AmploPay)</label>
            <div class="gw-readonly-wrap">
              <input id="gw-amp-webhook-url" class="pnl-input-modal gw-readonly" readonly value="..." />
              <button class="gw-copy-btn" data-copy="gw-amp-webhook-url" title="Copiar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </button>
            </div>
          </div>
          <div class="gw-current">
            <div class="gw-current-item"><span class="gw-current-lbl">Public Key:</span> <code id="gw-amp-cur-pk">...</code></div>
            <div class="gw-current-item"><span class="gw-current-lbl">Secret Key:</span> <code id="gw-amp-cur-sk">...</code></div>
            <div class="gw-current-item"><span class="gw-current-lbl">Webhook Token:</span> <code id="gw-amp-cur-wt">...</code></div>
          </div>
          <div class="gw-divider"></div>
          <div class="gw-hint">Deixe em branco para manter o valor atual.</div>
          <div class="gw-field"><label class="gw-label">Public Key</label><input id="gw-amp-pk" class="pnl-input-modal" type="password" placeholder="Public key da AmploPay" autocomplete="off" /></div>
          <div class="gw-field"><label class="gw-label">Secret Key</label><input id="gw-amp-sk" class="pnl-input-modal" type="password" placeholder="Secret key da AmploPay" autocomplete="off" /></div>
          <div class="gw-field"><label class="gw-label">Webhook Token</label><input id="gw-amp-wt" class="pnl-input-modal" type="password" placeholder="Token de validacao do webhook" autocomplete="off" /></div>
          <button class="pnl-play-btn gw-save-cred" data-gw="amplopay" style="margin-top:12px;background:linear-gradient(135deg,#f59e0b,#d97706)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Salvar AmploPay
          </button>
        </div>

        <!-- ── ParadisePags Config Panel ── -->
        <div id="gw-panel-paradisepags" class="gw-panel" style="display:none">
          <div class="gw-status-row" id="gw-status-row-par">
            <div class="gw-status-item" id="gw-st-par-sk"><span class="gw-dot gw-dot-off"></span><span>Secret Key (X-API-Key)</span></div>
          </div>
          <div class="gw-field">
            <label class="gw-label">Webhook URL (configure no painel ParadisePags)</label>
            <div class="gw-readonly-wrap">
              <input id="gw-par-webhook-url" class="pnl-input-modal gw-readonly" readonly value="..." />
              <button class="gw-copy-btn" data-copy="gw-par-webhook-url" title="Copiar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </button>
            </div>
          </div>
          <div class="gw-current">
            <div class="gw-current-item"><span class="gw-current-lbl">Secret Key:</span> <code id="gw-par-cur-sk">...</code></div>
            <div class="gw-current-item"><span class="gw-current-lbl">Base URL:</span> <code id="gw-par-cur-url">...</code></div>
          </div>
          <div class="gw-divider"></div>
          <div class="gw-hint">Deixe em branco para manter o valor atual.</div>
          <div class="gw-field"><label class="gw-label">Secret Key (X-API-Key)</label><input id="gw-par-sk" class="pnl-input-modal" type="password" placeholder="sk_sua_chave_secreta" autocomplete="off" /></div>
          <div class="gw-field"><label class="gw-label">Base URL</label><input id="gw-par-url" class="pnl-input-modal" type="text" placeholder="https://multi.paradisepags.com" autocomplete="off" /></div>
          <button class="pnl-play-btn gw-save-cred" data-gw="paradisepags" style="margin-top:12px;background:linear-gradient(135deg,#8b5cf6,#7c3aed)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Salvar ParadisePags
          </button>
        </div>

        <div class="pnl-info-box pnl-info-orange" style="margin-top:14px">
          Selecione o gateway ativo acima. Configure as credenciais de cada gateway individualmente.
        </div>
      </div>
    </div>

    <!-- ══ MODAL: CONFIG DO SITE ═════════════════════════════════════════ -->
    <div class="pnl-modal-bg hidden" id="modal-siteconfig">
      <div class="pnl-modal" style="max-width:480px">
        <div class="pnl-modal-header">
          <span class="pnl-modal-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" width="20" height="20"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Config do Site
          </span>
          <button class="pnl-modal-close" id="close-siteconfig">✕</button>
        </div>

        <div class="gw-field"><label class="gw-label">Nome do Site</label><input id="sc-site-nome" class="pnl-input-modal" type="text" placeholder="HelixWins" autocomplete="off" /></div>
        <div class="gw-field"><label class="gw-label">Link de Suporte</label><input id="sc-site-suporte" class="pnl-input-modal" type="text" placeholder="https://wa.me/..." autocomplete="off" /></div>
        <div class="gw-field"><label class="gw-label">Texto Promocional</label><input id="sc-site-promo" class="pnl-input-modal" type="text" placeholder="Promoção especial..." autocomplete="off" /></div>
        <div class="gw-field"><label class="gw-label">URL do Logo</label><input id="sc-site-logo" class="pnl-input-modal" type="text" placeholder="https://..." autocomplete="off" /></div>
        <div class="gw-field"><label class="gw-label">URL do Favicon</label><input id="sc-site-favicon" class="pnl-input-modal" type="text" placeholder="https://..." autocomplete="off" /></div>
        <div class="gw-divider"></div>
        <div class="gw-section-title" style="margin-bottom:8px">Tracking / Pixels</div>
        <div class="gw-field"><label class="gw-label">Kwai Pixel ID</label><input id="sc-kwai-pixel" class="pnl-input-modal" type="text" placeholder="306679595293311" autocomplete="off" /></div>
        <div class="gw-hint">Deixe em branco para desativar o pixel do Kwai.</div>

        <button class="pnl-play-btn" id="sc-save-btn" style="margin-top:14px;background:linear-gradient(135deg,#3b82f6,#2563eb)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          Salvar Configurações
        </button>
      </div>
    </div>

    <!-- ══ MODAL AJUSTE DE SALDO (Admin) ═══════════════════════════════ -->
    <div class="pnl-modal-bg hidden" id="modal-ajuste">
      <div class="pnl-modal" style="max-width:420px">
        <div class="pnl-modal-header">
          <span class="pnl-modal-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" width="20" height="20"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Ajustar Saldo
          </span>
          <button class="pnl-modal-close" id="close-ajuste">✕</button>
        </div>

        <div class="gw-field">
          <label class="gw-label">Buscar usuário</label>
          <input id="aj-busca" class="pnl-input-modal" type="text" placeholder="Telefone ou nome..." autocomplete="off" />
        </div>
        <div id="aj-results" style="max-height:150px;overflow-y:auto;margin-bottom:12px"></div>

        <div id="aj-form" style="display:none">
          <div style="padding:10px 14px;background:rgba(34,197,94,0.08);border-radius:10px;margin-bottom:14px">
            <div style="font-size:13px;font-weight:600;color:#2d0040" id="aj-sel-nome">—</div>
            <div style="font-size:12px;color:#999" id="aj-sel-tel">—</div>
            <div style="font-size:13px;color:#22c55e;font-weight:700;margin-top:4px">Saldo: <span id="aj-sel-saldo">R$ 0,00</span></div>
            <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">
              <button id="aj-toggle-demo" style="font-size:11px;padding:4px 12px;border-radius:6px;border:1px solid rgba(251,191,36,.4);background:rgba(251,191,36,.1);color:#fbbf24;cursor:pointer;font-family:inherit;transition:.15s">
                Demo: OFF
              </button>
              <button id="aj-toggle-isento" style="font-size:11px;padding:4px 12px;border-radius:6px;border:1px solid rgba(34,197,94,.4);background:rgba(34,197,94,.1);color:#22c55e;cursor:pointer;font-family:inherit;transition:.15s">
                Isento Taxa: OFF
              </button>
            </div>
            <!-- Config Jogo Normal -->
            <div id="aj-normal-config" style="display:none;margin-top:8px;padding:8px 12px;background:rgba(99,102,241,.08);border:1px solid rgba(99,102,241,.2);border-radius:8px">
              <div style="font-size:11px;font-weight:700;color:#4f46e5;margin-bottom:6px">Config Jogo Normal</div>
              <label style="font-size:11px;color:#6366f1;display:block;margin-bottom:3px">Dificuldade</label>
              <select id="aj-normal-dificuldade" style="width:100%;padding:6px 10px;border-radius:6px;border:1px solid rgba(99,102,241,.3);background:#f0eeff;color:#3730a3;font-size:12px;font-family:inherit;cursor:pointer">
                <option value="">Padrao (facil)</option>
                <option value="demo">Muito Facil</option>
                <option value="super_facil">Facil</option>
                <option value="facil">Normal</option>
                <option value="normal">Dificil</option>
              </select>
              <div style="margin-top:6px">
                <label style="font-size:11px;color:#6366f1;display:block;margin-bottom:3px">Multiplicador Meta</label>
                <select id="aj-normal-multiplicador" style="width:100%;padding:6px 10px;border-radius:6px;border:1px solid rgba(99,102,241,.3);background:#f0eeff;color:#3730a3;font-size:12px;font-family:inherit;cursor:pointer">
                  <option value="">Padrao (4x)</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                  <option value="3">3x</option>
                  <option value="4">4x</option>
                </select>
              </div>
              <button id="aj-normal-salvar" style="margin-top:8px;width:100%;padding:6px;border-radius:6px;border:none;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit">
                Salvar Config Normal
              </button>
            </div>
            <!-- Config Jogo Demo -->
            <div id="aj-demo-config" style="display:none;margin-top:8px;padding:8px 12px;background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.2);border-radius:8px">
              <div style="font-size:11px;font-weight:700;color:#b45309;margin-bottom:6px">Config Jogo Demo</div>
              <label style="font-size:11px;color:#92400e;display:block;margin-bottom:3px">Dificuldade</label>
              <select id="aj-demo-dificuldade" style="width:100%;padding:6px 10px;border-radius:6px;border:1px solid rgba(251,191,36,.3);background:#fef9ee;color:#78350f;font-size:12px;font-family:inherit;cursor:pointer">
                <option value="demo">Muito Facil (quase impossivel perder)</option>
                <option value="super_facil">Facil (poucas mortes)</option>
                <option value="facil">Normal</option>
                <option value="normal">Dificil</option>
              </select>
              <div style="margin-top:6px">
                <label style="font-size:11px;color:#92400e;display:block;margin-bottom:3px">Multiplicador Meta</label>
                <select id="aj-demo-multiplicador" style="width:100%;padding:6px 10px;border-radius:6px;border:1px solid rgba(251,191,36,.3);background:#fef9ee;color:#78350f;font-size:12px;font-family:inherit;cursor:pointer">
                  <option value="1.2">1.2x (super facil)</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                  <option value="3">3x</option>
                  <option value="4">4x</option>
                </select>
              </div>
              <button id="aj-demo-salvar" style="margin-top:8px;width:100%;padding:6px;border-radius:6px;border:none;background:linear-gradient(135deg,#f59e0b,#d97706);color:#000;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit">
                Salvar Config Demo
              </button>
            </div>
          </div>
          <div class="gw-field">
            <label class="gw-label">Valor (positivo = crédito, negativo = débito)</label>
            <input id="aj-valor" class="pnl-input-modal" type="number" step="0.01" placeholder="100.00" />
          </div>
          <div class="gw-field">
            <label class="gw-label">Descrição (opcional)</label>
            <input id="aj-desc" class="pnl-input-modal" type="text" placeholder="Bônus, estorno, etc." autocomplete="off" />
          </div>
          <button class="pnl-play-btn" id="aj-save-btn" style="margin-top:8px;background:linear-gradient(135deg,#22c55e,#16a34a)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>
            Aplicar Ajuste
          </button>
        </div>
      </div>
    </div>
    ` : ''}

    <!-- ══ MODAL RANKING (todos os usuários) ═══════════════════════════ -->
    <div class="pnl-modal-bg hidden" id="modal-ranking">
      <div class="pnl-modal-card" style="max-width:400px">
        <div class="pnl-modal-head">
          <div class="pnl-modal-title">🏅 Ranking Semanal</div>
          <button class="pnl-modal-close" id="close-ranking">✕</button>
        </div>
        <div class="pnl-modal-body" id="ranking-lista" style="padding:16px">
          <div class="pnl-loading">Carregando...</div>
        </div>
      </div>
    </div>

    <!-- ══ MODAL PRESENTE (todos os usuários) ══════════════════════════ -->
    <div class="pnl-modal-bg hidden" id="modal-presente">
      <div class="pnl-modal-card" style="max-width:380px">
        <div class="pnl-modal-head">
          <div class="pnl-modal-title">🎁 Enviar Presente</div>
          <button class="pnl-modal-close" id="close-presente">✕</button>
        </div>
        <div class="pnl-modal-body" style="padding:16px">
          <p style="font-size:13px;color:rgba(255,255,255,.6);margin-bottom:16px">Envie saldo para um amigo. Ele precisa ter conta na plataforma.</p>
          <div style="margin-bottom:12px">
            <label style="font-size:12px;color:rgba(255,255,255,.5)">Telefone do amigo</label>
            <input id="presente-tel" class="pnl-input" type="tel" placeholder="(00) 00000-0000" style="width:100%;margin-top:4px"/>
          </div>
          <div style="margin-bottom:16px">
            <label style="font-size:12px;color:rgba(255,255,255,.5)">Valor</label>
            <div id="presente-valores" style="display:flex;gap:8px;margin-top:6px"></div>
          </div>
          <button id="btn-enviar-presente" class="pnl-play-btn" style="width:100%;font-size:14px;padding:12px" disabled>ENVIAR PRESENTE</button>
        </div>
      </div>
    </div>

    <style>
      /* ── Root & layout ─────────────────────────────────────────── */
      .pnl-root {
        display: flex; flex-direction: column;
        height: 100vh; height: 100dvh;
        min-height: 100vh;
        font-family: 'Poppins', system-ui, sans-serif;
        overflow: hidden;
        position: relative;
        background-color: #0d0020;
      }
      /* Imagem real do jogo cobrindo todo o painel */
      .pnl-root::before {
        content: '';
        position: absolute; inset: 0; z-index: 0;
        background: url('/img/game-bg.png') center center / cover no-repeat;
        opacity: 0.28;
        pointer-events: none;
      }
      /* Overlay escuro sobre a imagem para manter legibilidade */
      .pnl-root::after {
        content: '';
        position: absolute; inset: 0; z-index: 0;
        background: linear-gradient(160deg, rgba(13,0,32,0.58) 0%, rgba(30,0,66,0.52) 50%, rgba(13,0,32,0.62) 100%);
        pointer-events: none;
      }
      /* Todo conteúdo acima dos pseudo-elementos */
      .pnl-header, .pnl-scroll, .pnl-bottom-nav {
        position: relative; z-index: 1;
      }

      /* ── Header ────────────────────────────────────────────────── */
      .pnl-header {
        background: rgba(13,0,32,0.85); border-bottom: 1px solid rgba(255,255,255,.07);
        padding: 0 16px; flex-shrink: 0; position: sticky; top: 0; z-index: 100;
        box-shadow: 0 2px 20px rgba(0,0,0,.3); backdrop-filter: blur(12px);
      }
      .pnl-header-inner {
        display: flex; align-items: center; justify-content: space-between;
        height: 56px;
      }
      .pnl-logo { display: flex; align-items: center; gap: 8px; }
      .pnl-logo-icon { font-size: 22px; }
      .pnl-logo span { font-size: 18px; font-weight: 800; color: #FF6B9D; }
      .pnl-header-inner { color: #fff; }
      .pnl-header-right { display: flex; align-items: center; gap: 10px; }
      .pnl-saldo-wrap { position: relative; }
      .pnl-saldo-chip {
        display: flex; flex-direction: row; align-items: center; gap: 6px;
        background: linear-gradient(135deg,#00C97A,#00a864);
        border-radius: 20px; padding: 5px 12px; cursor: pointer;
        transition: filter .15s, transform .15s;
        user-select: none;
      }
      .pnl-saldo-chip:hover { filter: brightness(1.08); transform: translateY(-1px); }
      .pnl-saldo-chip:active { transform: scale(.97); }
      .pnl-saldo-chip-inner { display: flex; flex-direction: column; align-items: flex-end; }
      .pnl-saldo-chip-lbl { font-size: 9px; color: rgba(255,255,255,.8); text-transform: uppercase; letter-spacing: .5px; line-height: 1; }
      .pnl-saldo-chip-val { font-size: 14px; font-weight: 800; color: #fff; line-height: 1.3; }
      .saldo-chip-caret { color: rgba(255,255,255,.75); flex-shrink: 0; transition: transform .2s; }
      .pnl-saldo-chip.open .saldo-chip-caret { transform: rotate(180deg); }

      /* ── Saldo Dropdown ─────────────────────────────────────────── */
      .pnl-saldo-drop {
        position: absolute; top: calc(100% + 10px); right: 0;
        width: 210px;
        background: #1a0035;
        border: 1px solid rgba(255,255,255,.12);
        border-radius: 14px;
        box-shadow: 0 20px 60px rgba(0,0,0,.65), 0 0 0 1px rgba(0,201,122,.12);
        z-index: 9999;
        animation: dropIn .18s ease both;
      }
      .psd-arrow {
        position: absolute; top: -7px; right: 18px;
        width: 13px; height: 13px;
        background: #1a0035; border-left: 1px solid rgba(255,255,255,.12);
        border-top: 1px solid rgba(255,255,255,.12);
        transform: rotate(45deg); border-radius: 2px;
      }
      .psd-item {
        display: flex; align-items: center; gap: 12px;
        width: 100%; padding: 12px 14px;
        background: none; border: none; color: #fff;
        font-size: 13px; font-family: inherit; cursor: pointer;
        text-align: left; transition: background .15s;
        border-radius: 14px;
      }
      .psd-item:hover { background: rgba(255,255,255,.07); }
      .psd-item:first-of-type { border-radius: 14px 14px 0 0; }
      .psd-item:last-of-type  { border-radius: 0 0 14px 14px; }
      .psd-icon {
        width: 32px; height: 32px; border-radius: 10px;
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      }
      .psd-icon-green { background: rgba(0,201,122,.18); color: #00C97A; }
      .psd-icon-red   { background: rgba(239,68,68,.18);  color: #f87171; }
      .psd-text { display: flex; flex-direction: column; gap: 1px; }
      .psd-label { font-weight: 700; font-size: 13px; color: #fff; }
      .psd-sub   { font-size: 11px; color: rgba(255,255,255,.45); }
      .psd-divider { height: 1px; background: rgba(255,255,255,.07); margin: 0 10px; }
      .pnl-avatar {
        width: 36px; height: 36px; border-radius: 50%;
        background: linear-gradient(135deg,#FF6B9D,#9333EA);
        color: #fff; font-weight: 800; font-size: 15px;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; flex-shrink: 0;
        transition: transform .15s, box-shadow .15s;
      }
      .pnl-avatar:hover { transform: scale(1.08); box-shadow: 0 0 0 3px rgba(255,107,157,.35); }
      .pnl-avatar-wrap { position: relative; }

      /* ── Profile Dropdown ──────────────────────────────────────── */
      .pnl-profile-drop {
        position: absolute; top: calc(100% + 10px); right: 0;
        width: 240px;
        background: #1a0035;
        border: 1px solid rgba(255,255,255,.12);
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(255,107,157,.1);
        z-index: 9999;
        overflow: hidden;
        animation: dropIn .2s cubic-bezier(.34,1.56,.64,1);
      }
      @keyframes dropIn {
        from { opacity: 0; transform: translateY(-8px) scale(.95); }
        to   { opacity: 1; transform: translateY(0)    scale(1); }
      }
      .ppd-arrow {
        position: absolute; top: -6px; right: 14px;
        width: 12px; height: 12px; background: #1a0035;
        border-left: 1px solid rgba(255,255,255,.12);
        border-top:  1px solid rgba(255,255,255,.12);
        transform: rotate(45deg);
      }
      .ppd-header {
        display: flex; align-items: center; gap: 10px;
        padding: 14px 16px 12px;
      }
      .ppd-avatar {
        width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
        background: linear-gradient(135deg,#FF6B9D,#9333EA);
        color: #fff; font-weight: 800; font-size: 15px;
        display: flex; align-items: center; justify-content: center;
      }
      .ppd-name  { font-size: 13px; font-weight: 700; color: #fff; }
      .ppd-email { font-size: 11px; color: rgba(255,255,255,.45); margin-top: 1px; }
      .ppd-divider { height: 1px; background: rgba(255,255,255,.08); margin: 2px 0; }
      .ppd-item {
        display: flex; align-items: center; gap: 10px;
        width: 100%; padding: 11px 16px; background: transparent;
        border: none; color: rgba(255,255,255,.82); font-size: 13px;
        font-weight: 500; cursor: pointer; font-family: inherit;
        transition: background .15s, color .15s; text-align: left;
      }
      .ppd-item:hover { background: rgba(255,255,255,.07); color: #fff; }
      .ppd-icon { display: flex; align-items: center; opacity: .7; flex-shrink: 0; }
      .ppd-item:hover .ppd-icon { opacity: 1; }
      .ppd-badge {
        margin-left: auto; font-size: 10px; font-weight: 700;
        background: rgba(0,201,122,.18); color: #00e887;
        border: 1px solid rgba(0,201,122,.3); border-radius: 20px;
        padding: 2px 7px; white-space: nowrap;
      }
      .ppd-item-danger { color: rgba(255,100,100,.8); }
      .ppd-item-danger:hover { background: rgba(255,80,80,.08); color: #ff6464; }
      .ppd-item-danger .ppd-icon { opacity: .7; }

      /* ── Modal Perfil ──────────────────────────────────────────── */
      .prf-avatar-lg {
        width: 72px; height: 72px; border-radius: 50%;
        background: linear-gradient(135deg,#FF6B9D,#9333EA);
        color: #fff; font-weight: 800; font-size: 28px;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 20px rgba(147,51,234,.35), 0 0 0 4px rgba(255,107,157,.15);
      }
      .prf-stat {
        background: #f5f0ff; border: 1px solid #e8d5ff;
        border-radius: 12px; padding: 12px 8px; text-align: center;
      }
      .prf-stat-val { font-size: 14px; font-weight: 800; color: #4A0020; }
      .prf-stat-lbl { font-size: 10px; color: #9980aa; text-transform: uppercase; letter-spacing: .4px; margin-top: 3px; }
      .prf-section { margin-bottom: 12px; }
      .prf-section-title {
        display: flex; align-items: center; gap: 6px;
        font-size: 11px; font-weight: 700; color: #9980aa;
        text-transform: uppercase; letter-spacing: .5px; margin-bottom: 10px;
      }
      .pnl-input-modal {
        width: 100%; background: #f5f0ff; border: 1px solid #e0d0f0;
        border-radius: 10px; color: #2d0040; font-size: 14px; padding: 11px 14px;
        font-family: inherit; outline: none; box-sizing: border-box; margin-bottom: 8px;
        transition: border-color .15s;
      }
      .pnl-input-modal:focus { border-color: #c084fc; box-shadow: 0 0 0 3px rgba(192,132,252,.12); }
      .pnl-input-modal::placeholder { color: #c4a8d4; }
      .prf-btn-salvar {
        width: 100%; margin-top: 4px;
        background: linear-gradient(135deg,#9333EA,#FF6B9D);
        border: none; border-radius: 12px; color: #fff;
        font-size: 14px; font-weight: 700; padding: 13px;
        cursor: pointer; font-family: inherit;
        transition: opacity .15s, transform .15s;
      }
      .prf-btn-salvar:hover { opacity: .92; transform: translateY(-1px); }
      .prf-btn-salvar:disabled { opacity: .5; cursor: not-allowed; transform: none; }

      /* ── Modal Suporte ─────────────────────────────────────────── */
      .sup-link-item {
        display: flex; align-items: center; gap: 12px;
        padding: 13px 16px; border-radius: 14px;
        background: #f5f0ff; border: 1px solid #e8d5ff;
        margin-bottom: 10px; cursor: pointer;
        text-decoration: none; color: inherit;
        transition: background .15s, transform .12s, box-shadow .15s;
      }
      .sup-link-item:hover {
        background: #ede4ff; transform: translateY(-1px);
        box-shadow: 0 4px 16px rgba(147,51,234,.12);
      }
      .sup-link-icon {
        width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
        background: linear-gradient(135deg,#9333EA,#FF6B9D);
        display: flex; align-items: center; justify-content: center;
        color: #fff;
      }
      .sup-link-name { font-size: 14px; font-weight: 700; color: #2d0040; }
      .sup-link-url  { font-size: 11px; color: #9980aa; margin-top: 2px; }
      .sup-link-arrow { margin-left: auto; color: #c4a8d4; flex-shrink: 0; }
      .sup-empty { text-align:center; padding: 30px 0; color: #9980aa; font-size: 13px; }

      /* ── Gateway Config Modal ──────────────────────────────────── */
      .gw-status-row {
        display: flex; gap: 10px; margin-bottom: 18px; flex-wrap: wrap;
      }
      .gw-status-item {
        display: flex; align-items: center; gap: 6px;
        padding: 6px 12px; border-radius: 50px;
        background: rgba(0,0,0,.04); border: 1px solid rgba(0,0,0,.15);
        font-size: 12px; font-weight: 600; color: #222;
      }
      .gw-dot {
        width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
      }
      .gw-dot-on  { background: #22c55e; box-shadow: 0 0 6px rgba(34,197,94,.5); }
      .gw-dot-off { background: #ef4444; box-shadow: 0 0 6px rgba(239,68,68,.4); }
      .gw-field { margin-bottom: 14px; }
      .gw-label {
        font-size: 12px; font-weight: 700; color: #333;
        text-transform: uppercase; letter-spacing: .05em; margin-bottom: 6px; display: block;
      }
      .gw-readonly-wrap {
        display: flex; gap: 6px; align-items: center;
      }
      .gw-readonly {
        flex: 1; background: rgba(0,0,0,.04) !important;
        color: #555 !important; cursor: default;
        font-family: 'Courier New', monospace; font-size: 12px;
      }
      .gw-copy-btn {
        flex-shrink: 0; background: rgba(0,0,0,.06); border: 1px solid rgba(0,0,0,.15);
        border-radius: 8px; padding: 8px 10px; cursor: pointer; color: #444;
        transition: background .15s, color .15s;
      }
      .gw-copy-btn:hover { background: rgba(0,0,0,.12); color: #000; }
      .gw-current {
        background: rgba(0,0,0,.03); border: 1px solid rgba(0,0,0,.1);
        border-radius: 12px; padding: 14px 16px; margin-bottom: 16px;
      }
      .gw-current-title {
        font-size: 11px; font-weight: 700; color: #666;
        text-transform: uppercase; letter-spacing: .08em; margin-bottom: 10px;
      }
      .gw-current-item {
        font-size: 12px; color: #444; margin-bottom: 6px;
        display: flex; align-items: center; gap: 8px;
      }
      .gw-current-item:last-child { margin-bottom: 0; }
      .gw-current-lbl { font-weight: 600; color: #222; min-width: 100px; }
      .gw-current-item code {
        font-family: 'Courier New', monospace; font-size: 12px;
        background: rgba(0,0,0,.06); padding: 2px 8px; border-radius: 4px;
        letter-spacing: 1px; color: #333;
      }
      .gw-divider { height: 1px; background: rgba(0,0,0,.1); margin: 16px 0; }
      .gw-section-title {
        font-size: 15px; font-weight: 700; color: #111; margin-bottom: 4px;
      }
      .gw-hint {
        font-size: 12px; color: #666; margin-bottom: 16px;
      }
      .gw-input-wrap {
        position: relative; display: flex; align-items: center;
      }
      .gw-input-wrap .pnl-input-modal {
        flex: 1; padding-right: 40px;
      }
      .gw-toggle-eye {
        position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
        background: none; border: none; cursor: pointer; padding: 4px;
        color: #666; transition: color .15s;
      }
      .gw-toggle-eye:hover { color: #000; }
      .gw-toggle-eye .hidden { display: none; }

      /* ── Scroll area ───────────────────────────────────────────── */
      .pnl-scroll { flex: 1; min-height: 0; overflow-y: auto; -webkit-overflow-scrolling: touch; padding-bottom: 56px; background: transparent; }

      /* ── Hero ──────────────────────────────────────────────────── */
      .pnl-hero {
        background: linear-gradient(135deg,rgba(74,0,32,0.62) 0%,rgba(123,31,162,0.55) 60%,rgba(255,107,157,0.45) 100%);
        padding: 28px 20px 24px; text-align: center; position: relative;
        overflow: hidden;
      }
      .pnl-hero::before {
        content: ''; position: absolute; inset: 0;
        background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      }
      .pnl-hero-label {
        font-size: 11px; color: rgba(255,255,255,.65); text-transform: uppercase;
        letter-spacing: 1px; margin-bottom: 4px; position: relative;
      }
      .pnl-hero-value {
        font-size: 42px; font-weight: 800; color: #fff; line-height: 1.1;
        margin-bottom: 20px; position: relative;
        text-shadow: 0 2px 12px rgba(0,0,0,.2);
      }
      .pnl-hero-actions { display: flex; gap: 10px; justify-content: center; position: relative; flex-wrap: wrap; }
      .pnl-action-btn {
        display: flex; align-items: center; gap: 6px; padding: 10px 18px;
        border-radius: 50px; font-size: 13px; font-weight: 700; cursor: pointer;
        border: none; font-family: inherit; transition: all .2s;
      }
      .pnl-action-btn svg { width: 15px; height: 15px; flex-shrink: 0; }
      .pnl-action-green { background: #00C97A; color: #fff; box-shadow: 0 4px 14px rgba(0,201,122,.4); }
      .pnl-action-green:hover { filter: brightness(1.1); transform: translateY(-1px); }
      .pnl-action-outline { background: rgba(255,255,255,.15); color: #fff; border: 1px solid rgba(255,255,255,.3); }
      .pnl-action-outline:hover { background: rgba(255,255,255,.25); }

      /* ── Dicas rotativas ────────────────────────────────────────── */
      .pnl-tips-wrap {
        display: flex; align-items: center; gap: 12px;
        margin: 18px 14px 16px;
        padding: 14px 18px;
        background: linear-gradient(135deg, rgba(255,255,255,.07) 0%, rgba(255,255,255,.03) 100%);
        border: 1px solid rgba(255,255,255,.13);
        border-left: 3px solid var(--green, #00c97a);
        border-radius: 14px;
        box-shadow: 0 4px 20px rgba(0,0,0,.18);
        min-height: 48px;
        overflow: hidden;
      }
      .pnl-tips-icon {
        flex-shrink: 0;
        color: var(--green, #00c97a);
        opacity: .9;
        display: flex; align-items: center;
      }
      .pnl-tips-text {
        font-size: 13px;
        font-weight: 500;
        color: rgba(255,255,255,.82);
        line-height: 1.5;
        letter-spacing: .15px;
        flex: 1;
        opacity: 1;
        transition: opacity .45s ease;
      }
      .pnl-tips-text.fade-out { opacity: 0; }

      /* ── Guia boas-vindas ──────────────────────────────────────── */
      .pnl-guia-card {
        margin: 0 14px 16px;
        background: linear-gradient(135deg, rgba(34,197,94,.12) 0%, rgba(16,185,129,.06) 100%);
        border: 1.5px solid rgba(34,197,94,.35);
        border-radius: 18px;
        padding: 18px 16px 16px;
        position: relative;
      }
      .pnl-guia-header {
        display: flex; align-items: flex-start; gap: 10px; margin-bottom: 14px;
      }
      .pnl-guia-title {
        font-size: 15px; font-weight: 800; color: #86efac; margin-bottom: 3px;
      }
      .pnl-guia-sub {
        font-size: 11px; color: rgba(255,255,255,.55);
      }
      .pnl-guia-close {
        margin-left: auto; flex-shrink: 0;
        background: rgba(255,255,255,.1); border: none; color: rgba(255,255,255,.6);
        width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
        font-size: 13px; display: flex; align-items: center; justify-content: center;
      }
      .pnl-guia-steps { display: flex; flex-direction: column; gap: 12px; margin-bottom: 14px; }
      .pnl-guia-step {
        display: flex; gap: 12px; align-items: flex-start;
      }
      .pnl-guia-step-num {
        min-width: 28px; height: 28px;
        background: linear-gradient(135deg,#22c55e,#16a34a);
        color: #fff; font-weight: 800; font-size: 13px;
        border-radius: 50%; display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }
      .pnl-guia-step-title { font-size: 13px; font-weight: 700; color: #d1fae5; margin-bottom: 2px; }
      .pnl-guia-step-desc { font-size: 12px; color: rgba(255,255,255,.65); line-height: 1.5; }
      .pnl-guia-cta {
        width: 100%; padding: 13px;
        background: linear-gradient(135deg,#22c55e,#16a34a);
        border: none; border-radius: 12px; color: #fff;
        font-size: 14px; font-weight: 800; cursor: pointer; font-family: inherit;
      }
      .pnl-guia-cta:hover { filter: brightness(1.08); }

      /* ── Game card ─────────────────────────────────────────────── */
      .pnl-game-card {
        background: linear-gradient(160deg, rgba(74,0,32,0.92) 0%, rgba(45,0,64,0.95) 100%);
        margin: 0 12px 16px; border-radius: 24px; padding: 22px 20px 20px;
        box-shadow: 0 12px 48px rgba(0,0,0,.5), 0 0 0 1px rgba(255,107,157,.15);
        position: relative; overflow: hidden;
      }
      .pnl-game-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; gap: 8px; }
      .pnl-game-title { font-size: 18px; font-weight: 800; color: #fff; letter-spacing: .5px; }
      .pnl-game-sub { font-size: 12px; color: rgba(255,255,255,.55); margin-top: 3px; line-height: 1.4; }
      @keyframes badgePulse {
        0%   { box-shadow: 0 0 0 0 rgba(0,201,122,.55); }
        70%  { box-shadow: 0 0 0 7px rgba(0,201,122,0); }
        100% { box-shadow: 0 0 0 0 rgba(0,201,122,0); }
      }
      @keyframes dotPing {
        0%, 100% { transform: scale(1); opacity: 1; }
        50%       { transform: scale(1.5); opacity: .5; }
      }
      @keyframes countUp {
        from { transform: translateY(6px); opacity: 0; }
        to   { transform: translateY(0);   opacity: 1; }
      }
      .pnl-game-badge {
        display: flex; align-items: center; gap: 5px; flex-shrink: 0;
        background: linear-gradient(135deg, rgba(0,201,122,.18) 0%, rgba(0,160,90,.12) 100%);
        border: 1px solid rgba(0,201,122,.35);
        border-radius: 20px; padding: 5px 11px;
        font-size: 11px; font-weight: 700;
        color: #00e887; white-space: nowrap;
        animation: badgePulse 2.4s ease-out infinite;
      }
      .badge-dot {
        width: 7px; height: 7px; border-radius: 50%;
        background: #00e887;
        animation: dotPing 2s ease-in-out infinite;
        flex-shrink: 0;
      }
      .badge-icon { display: flex; align-items: center; opacity: .75; }
      .badge-label { color: rgba(255,255,255,.55); font-weight: 500; }
      #n-jogando { animation: countUp .4s ease; }
      /* Seção centralizada de aposta */
      .pnl-bet-center {
        display: flex; flex-direction: column; align-items: center;
        padding: 16px 0 4px;
        border-top: 1px solid rgba(255,255,255,.08);
        margin-top: 4px;
      }
      .pnl-bet-center .pnl-quick-label { text-align: center; }
      .pnl-bet-center .pnl-quick-row { justify-content: center; }
      .pnl-bet-center .pnl-input-wrap {
        max-width: 260px; width: 100%;
        font-size: 22px;
      }
      .pnl-bet-center .pnl-input { font-size: 26px; text-align: center; }
      .pnl-bet-center .pnl-meta-row { width: 100%; }

      /* ── Chips ─────────────────────────────────────────────────── */
      .pnl-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
      .pnl-chip {
        display: flex; align-items: center; gap: 6px;
        font-size: 12px; font-weight: 700; padding: 7px 14px;
        border-radius: 50px; white-space: nowrap; letter-spacing: .2px;
        box-shadow: 0 2px 10px rgba(0,0,0,.25);
        transition: transform .15s, box-shadow .15s;
      }
      .pnl-chip:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,.35); }
      .chip-icon { font-size: 13px; line-height: 1; }
      .pnl-chip-gold  {
        background: linear-gradient(135deg, rgba(255,193,7,.22) 0%, rgba(255,152,0,.16) 100%);
        color: #FFD600; border: 1px solid rgba(255,215,0,.32);
      }
      .pnl-chip-blue  {
        background: linear-gradient(135deg, rgba(77,158,255,.22) 0%, rgba(120,90,255,.16) 100%);
        color: #a5c8ff; border: 1px solid rgba(130,180,255,.32);
      }
      .pnl-chip-green { background: rgba(0,201,122,.15); color: #00e887; border: 1px solid rgba(0,201,122,.25); }

      /* ── Quick amounts ─────────────────────────────────────────── */
      .pnl-quick-label { font-size: 11px; color: rgba(255,255,255,.5); text-transform: uppercase; letter-spacing: .5px; margin-bottom: 8px; }
      .pnl-quick-row { display: flex; gap: 7px; flex-wrap: wrap; margin-bottom: 14px; }
      .pnl-quick {
        position: relative;
        padding: 8px 14px; border-radius: 50px; font-size: 13px; font-weight: 700;
        background: rgba(255,255,255,.08); color: rgba(255,255,255,.75);
        border: 1px solid rgba(255,255,255,.15); cursor: pointer; font-family: inherit;
        transition: all .15s; display: inline-flex; flex-direction: column;
        align-items: center; line-height: 1.2;
      }
      .pnl-quick:hover, .pnl-quick.active {
        background: #FF6B9D; color: #fff; border-color: #FF6B9D;
        transform: scale(1.05);
      }
      .dep-quick-badge {
        font-size: 9px; font-weight: 800; color: #22c55e; letter-spacing: .2px;
        line-height: 1; margin-top: 1px;
      }
      .pnl-quick.active .dep-quick-badge { color: #fff; }
      /* Quick amounts dentro de modal (fundo branco) */
      .pnl-modal .pnl-quick {
        background: #f5f0ff; color: #4A0020; border-color: #e0d0f0;
      }
      .pnl-modal .pnl-quick:hover, .pnl-modal .pnl-quick.active {
        background: #FF6B9D; color: #fff; border-color: #FF6B9D;
      }

      /* ── Input ─────────────────────────────────────────────────── */
      .pnl-input-wrap {
        display: flex; align-items: center; gap: 8px;
        background: rgba(255,255,255,.08); border: 1.5px solid rgba(255,255,255,.15);
        border-radius: 14px; padding: 0 14px; margin-bottom: 14px;
        transition: border-color .2s;
      }
      .pnl-input-wrap:focus-within { border-color: #FF6B9D; }
      .pnl-input-prefix { font-size: 14px; font-weight: 700; color: rgba(255,255,255,.5); flex-shrink: 0; }
      .pnl-input {
        flex: 1; background: rgba(255,255,255,.08); border: none; outline: none;
        color: #fff; font-size: 20px; font-weight: 700; font-family: inherit;
        padding: 14px 0;
      }
      .pnl-input::placeholder { color: rgba(255,255,255,.25); }
      /* Evita input branco no Chrome (padrão e autofill) */
      .pnl-input:-webkit-autofill,
      .pnl-input:-webkit-autofill:hover,
      .pnl-input:-webkit-autofill:focus {
        -webkit-text-fill-color: #fff;
        -webkit-box-shadow: 0 0 0 1000px rgba(255,255,255,.08) inset;
        box-shadow: 0 0 0 1000px rgba(255,255,255,.08) inset;
      }

      /* ── Meta preview ──────────────────────────────────────────── */
      .pnl-meta-row {
        display: grid; grid-template-columns: repeat(3,1fr);
        background: rgba(255,255,255,.06); border-radius: 12px;
        padding: 12px; margin-bottom: 14px; gap: 8px;
      }
      .pnl-meta-item { text-align: center; }
      .pnl-meta-lbl { font-size: 10px; color: rgba(255,255,255,.45); text-transform: uppercase; letter-spacing: .4px; margin-bottom: 3px; }
      .pnl-meta-val { font-size: 14px; font-weight: 800; color: #fff; }
      .pnl-meta-gold { color: #FFD700; }

      /* ── Warn ──────────────────────────────────────────────────── */
      .pnl-warn {
        background: rgba(255,77,109,.15); border: 1px solid rgba(255,77,109,.3);
        border-radius: 10px; padding: 10px 14px; font-size: 13px; font-weight: 700;
        color: #ff8099; display: flex; align-items: center; justify-content: space-between;
        gap: 8px; margin-bottom: 12px;
      }
      .pnl-warn-btn {
        background: #FF4D6D; color: #fff; border: none; border-radius: 20px;
        padding: 5px 12px; font-size: 11px; font-weight: 700; cursor: pointer;
        font-family: inherit; white-space: nowrap;
      }

      /* ── Play button ───────────────────────────────────────────── */
      .pnl-play-btn {
        width: 100%; padding: 16px; border-radius: 50px; border: none;
        background: linear-gradient(135deg,#00C97A,#00a864);
        color: #fff; font-size: 16px; font-weight: 800; cursor: pointer;
        font-family: inherit; display: flex; align-items: center; justify-content: center;
        gap: 10px; box-shadow: 0 6px 24px rgba(0,201,122,.4);
        transition: all .2s; letter-spacing: .5px;
      }
      .pnl-play-btn:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,201,122,.5); }
      .pnl-play-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; animation: none; }
      @keyframes jogarPulse {
        0%, 100% { box-shadow: 0 6px 24px rgba(0,201,122,.4); transform: scale(1); }
        50%       { box-shadow: 0 6px 32px rgba(0,201,122,.72), 0 0 18px rgba(0,201,122,.30); transform: scale(1.018); }
      }
      #btn-jogar:not(:disabled) { animation: jogarPulse 2s ease-in-out infinite; }
      #btn-jogar:not(:disabled):hover { animation: none; }

      /* ── Card genérico ─────────────────────────────────────────── */
      .pnl-card {
        background: #fff; margin: 0 16px 12px; border-radius: 16px;
        overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,.06);
      }
      .pnl-card-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 14px 16px; border-bottom: 1px solid #f0e8ff;
      }
      .pnl-card-title { font-size: 14px; font-weight: 700; color: #2d0040; }
      .pnl-card-action { background: none; border: none; cursor: pointer; color: #FF6B9D; font-size: 13px; font-weight: 600; font-family: inherit; }
      .pnl-loading { text-align: center; padding: 24px; color: #9980aa; font-size: 14px; }

      /* ── Transações ────────────────────────────────────────────── */
      .pnl-tx-list { display: flex; flex-direction: column; }
      .pnl-tx-item {
        display: flex; align-items: center; gap: 12px;
        padding: 12px 16px; border-bottom: 1px solid #faf5ff; transition: background .15s;
      }
      .pnl-tx-item:last-child { border-bottom: none; }
      .pnl-tx-item:active { background: #faf5ff; }
      .pnl-tx-ico {
        width: 38px; height: 38px; border-radius: 12px; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center; font-size: 17px;
      }
      .pnl-tx-ico-win    { background: #e6fff4; }
      .pnl-tx-ico-loss   { background: #fff0f3; }
      .pnl-tx-ico-dep    { background: #e8f4ff; }
      .pnl-tx-ico-saq    { background: #fff8e6; }
      .pnl-tx-ico-bonus  { background: #ffedf4; }
      .pnl-tx-body { flex: 1; min-width: 0; }
      .pnl-tx-desc { font-size: 13px; font-weight: 600; color: #2d0040; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .pnl-tx-date { font-size: 11px; color: #9980aa; margin-top: 1px; }
      .pnl-tx-right { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; flex-shrink: 0; }
      .pnl-tx-val { font-size: 14px; font-weight: 800; }
      .pnl-tx-pos { color: #00C97A; }
      .pnl-tx-neg { color: #FF4D6D; }
      .pnl-badge {
        font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 20px;
      }
      .pnl-badge-green  { background: #e6fff4; color: #00C97A; }
      .pnl-badge-orange { background: #fff8e6; color: #FF8C42; }
      .pnl-badge-red    { background: #fff0f3; color: #FF4D6D; }

      /* ── Bottom nav ────────────────────────────────────────────── */
      .pnl-bottom-nav {
        position: fixed; bottom: 0; left: 0; right: 0;
        min-height: 40px;
        padding-bottom: max(env(safe-area-inset-bottom), 28px);
        background: rgba(13,0,32,0.92);
        border-top: 1px solid rgba(255,255,255,.08);
        display: flex; align-items: stretch; z-index: 200;
        box-shadow: 0 -4px 24px rgba(0,0,0,.4);
        backdrop-filter: blur(12px);
      }
      .pnl-nav-item {
        flex: 1; display: flex; flex-direction: column; align-items: center;
        justify-content: center; gap: 1px; background: none; border: none;
        cursor: pointer; color: rgba(255,255,255,.3); font-size: 8px; font-weight: 600;
        font-family: inherit; transition: color .2s; padding: 4px 0 2px;
      }
      .pnl-nav-item svg { width: 16px; height: 16px; stroke: currentColor; }
      .pnl-nav-item:hover { color: #FF6B9D; }
      .pnl-nav-active { color: #FF6B9D !important; }
      .pnl-nav-item:last-child { color: rgba(255,128,153,.6); }

      /* ── Modais ────────────────────────────────────────────────── */
      .pnl-modal-bg {
        position: fixed; inset: 0; z-index: 500;
        background: rgba(0,0,0,.55); display: flex;
        align-items: flex-end; backdrop-filter: blur(4px);
      }
      .pnl-modal-bg.hidden { display: none; }
      .pnl-modal {
        background: #fff; width: 100%; border-radius: 24px 24px 0 0;
        padding: 20px 20px 40px; max-height: 90vh; overflow-y: auto;
        animation: slideUp .28s ease;
      }
      @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      /* Modal de confirmação de depósito — centralizado */
      #modal-dep-confirmado {
        align-items: center; justify-content: center; padding: 20px;
      }
      #modal-dep-confirmado .pnl-modal {
        border-radius: 24px; width: auto; max-width: 360px;
        padding: 32px 28px 28px; animation: popIn .35s cubic-bezier(.34,1.56,.64,1) both;
      }
      .pnl-modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
      .pnl-modal-title { font-size: 17px; font-weight: 800; color: #2d0040; }
      .pnl-modal-close {
        width: 32px; height: 32px; border-radius: 50%; background: #f5f0ff;
        border: none; cursor: pointer; font-size: 14px; color: #9980aa;
        display: flex; align-items: center; justify-content: center;
      }
      .pnl-modal .pnl-input-wrap { background: #f5f0ff; border-color: #e0d0f0; }
      .pnl-modal .pnl-input-prefix { color: #9980aa; }
      .pnl-modal .pnl-input { color: #2d0040; }
      .pnl-modal .pnl-input::placeholder { color: #c4a8d4; }

      /* ── Copy box ──────────────────────────────────────────────── */
      .pnl-copy-box {
        background: #f5f0ff; border-radius: 8px; padding: 10px;
        font-size: 11px; font-family: monospace; color: #4A0020;
        word-break: break-all; cursor: pointer; line-height: 1.4;
      }
      .pnl-copy-box:active { background: #e8d8ff; }

      /* ── Info boxes ────────────────────────────────────────────── */
      .pnl-info-box { border-radius: 10px; padding: 12px 14px; font-size: 13px; line-height: 1.5; }
      .pnl-info-green  { background: #e6fff4; color: #2d6a4f; }
      .pnl-info-orange { background: #fff8e6; color: #c85c00; }
      .pnl-info-pink   { background: #ffedf4; color: #c2185b; }

      /* ── Timer ─────────────────────────────────────────────────── */
      .pnl-timer { font-size: 12px; color: #FF4D6D; font-weight: 700; text-align: center; margin-top: 8px; }

      /* ── Link box ──────────────────────────────────────────────── */
      .pnl-link-box {
        background: linear-gradient(135deg,#4A0020,#7b1fa2);
        border-radius: 14px; padding: 16px; margin-bottom: 16px; position: relative;
      }
      .pnl-link-label { font-size: 11px; color: rgba(255,255,255,.6); margin-bottom: 4px; }
      .pnl-link-val { font-size: 13px; color: #fff; font-weight: 600; word-break: break-all; margin-bottom: 12px; }
      .pnl-btn-copy {
        display: flex; align-items: center; gap: 6px;
        background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.25);
        color: #fff; border-radius: 20px; padding: 8px 16px; font-size: 12px;
        font-weight: 700; cursor: pointer; font-family: inherit;
      }
      .pnl-btn-copy:active { background: rgba(255,255,255,.25); }

      /* ── Mini stats (indicação) ────────────────────────────────── */
      .pnl-mini-stat {
        background: #f5f0ff; border-radius: 12px; padding: 14px;
        text-align: center;
      }
      .pnl-mini-val { font-size: 18px; font-weight: 800; color: #4A0020; margin-bottom: 2px; }
      .pnl-mini-lbl { font-size: 11px; color: #9980aa; text-transform: uppercase; letter-spacing: .4px; }

      /* ── Saldo info modal ──────────────────────────────────────── */
      .pnl-saldo-modal-info {
        font-size: 13px; color: #9980aa; background: #f5f0ff;
        border-radius: 10px; padding: 10px 14px; margin-bottom: 14px;
      }
      .pnl-saldo-modal-info strong { color: #00C97A; font-size: 15px; }

      /* ── Botão outline ─────────────────────────────────────────── */
      .pnl-btn-outline {
        width: 100%; padding: 13px; border-radius: 50px; border: 2px solid #e0d0f0;
        background: transparent; color: #9980aa; font-size: 14px; font-weight: 700;
        cursor: pointer; font-family: inherit;
      }

      /* ── Spin loader ───────────────────────────────────────────── */
      @keyframes spin { to { transform: rotate(360deg); } }
      .spin-icon { animation: spin .7s linear infinite; }
      @keyframes depConfirmPop {
        0%   { transform: scale(0); opacity: 0; }
        80%  { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); }
      }

      /* ── Utilitários ───────────────────────────────────────────── */
      .hidden { display: none !important; }

      /* ── Responsive ─────────────────────────────────────────────── */
      @media (max-width: 480px) {
        .pnl-hero-value { font-size: 32px; }
        .pnl-hero { padding: 20px 14px 18px; }
        .pnl-hero-actions { gap: 8px; }
        .pnl-action-btn { padding: 9px 14px; font-size: 12px; }
        .pnl-game-card { margin: 0 8px 12px; padding: 18px 16px 16px; border-radius: 20px; }
        .pnl-game-title { font-size: 16px; }
        .pnl-modal { width: 94vw !important; max-width: 94vw !important; padding: 20px 16px !important; border-radius: 18px !important; }
        .pnl-modal-card { width: 94vw !important; max-width: 94vw !important; border-radius: 18px !important; }
        .pnl-modal-header { padding: 16px 16px 12px; }
        .pnl-modal-title { font-size: 16px; }
        .pnl-tips-wrap { margin: 12px 8px; padding: 12px 14px; }
        .pnl-tips-text { font-size: 12px; }
        .pnl-saldo-chip-val { font-size: 13px; }
        .pnl-header-inner { height: 50px; }
        .pnl-header { padding: 0 12px; }
      }

      @media (max-width: 360px) {
        .pnl-hero-value { font-size: 28px; }
        .pnl-action-btn { padding: 8px 12px; font-size: 11px; }
        .pnl-game-card { margin: 0 6px 10px; padding: 16px 14px; }
        .pnl-logo span { font-size: 15px; }
        .pnl-avatar { width: 32px; height: 32px; font-size: 13px; }
      }

      /* ── Admin tables responsive ────────────────────────────────── */
      @media (max-width: 640px) {
        .pnl-admin-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .pnl-admin-table-wrap table { min-width: 600px; }
      }
    </style>
  `;

  let currentSaldo    = 0;
  let taxaGlobal      = 0.10;
  let multGlobal      = 7;

  // ── Carregar configs do jogo (multiplicador, taxa por plataforma) ────────
  async function loadGameConfigs() {
    try {
      const cfg = await API.gameConfigs();
      taxaGlobal = parseFloat(cfg.taxa_por_plataforma) || taxaGlobal;
      multGlobal = parseFloat(cfg.multiplicador)       || multGlobal;

      // Atualiza chips informativos
      const chipMultVal = document.getElementById('chip-mult-val');
      if (chipMultVal) chipMultVal.textContent = `${multGlobal}×`;

      // Reconstrói botões de entrada com valores do admin
      const entRow = document.getElementById('quick-amounts');
      if (entRow && cfg.entrada_valores_rapidos && cfg.entrada_valores_rapidos.length) {
        entRow.innerHTML = cfg.entrada_valores_rapidos.map(v => {
          const label = Number.isInteger(v) ? `R$${v}` : `R$${v.toFixed(2).replace('.', ',')}`;
          return `<button class="pnl-quick" data-v="${v}">${label}</button>`;
        }).join('');
        // Re-bind eventos
        entRow.querySelectorAll('[data-v]').forEach(btn => {
          btn.addEventListener('click', () => {
            entradaEl.value = btn.dataset.v;
            entradaEl.dispatchEvent(new Event('input'));
            entRow.querySelectorAll('[data-v]').forEach(x => x.classList.remove('active'));
            btn.classList.add('active');
            updateMetaPreview();
          });
        });
      }

      // Atualiza o preview com o valor atual digitado
      updateMetaPreview();
    } catch { /* usa valores padrão */ }
  }

  // ── Guia boas-vindas ─────────────────────────────────────────────────────
  function initGuiaBem() {
    const guia = document.getElementById('guia-boas-vindas');
    if (!guia) return;
    const user = API.getUser() || {};
    const dispensado = localStorage.getItem('guia_bv_ok_' + (user.id || ''));
    if (dispensado) return;
    guia.style.display = '';
    document.getElementById('guia-close-btn').addEventListener('click', () => {
      guia.style.display = 'none';
      localStorage.setItem('guia_bv_ok_' + (user.id || ''), '1');
    });
    document.getElementById('guia-cta-dep').addEventListener('click', () => {
      guia.style.display = 'none';
      localStorage.setItem('guia_bv_ok_' + (user.id || ''), '1');
      document.getElementById('modal-deposito')?.classList.remove('hidden');
    });
  }

  // ── Carregar dashboard ───────────────────────────────────────────────────
  async function loadDashboard() {
    try {
      // Limpar partidas órfãs ao carregar o painel
      try { await API.abandonarPartida(); } catch {}

      const data = await API.dashboard();
      currentSaldo = parseFloat(data.saldo) || 0;

      document.getElementById('saldo-badge').textContent  = formatMoney(currentSaldo);
      document.getElementById('st-saldo').textContent     = formatMoney(currentSaldo);
      document.getElementById('saldo-saque-disp').textContent = formatMoney(currentSaldo);

      // Mostrar guia apenas se saldo zerado (novo usuário)
      if (currentSaldo === 0) initGuiaBem();

      checkSaldo();
    } catch (err) {
      showToast('Erro ao carregar dados.', 'error');
    }
  }

  async function loadHistorico() {
    try {
      const data = await API.historico(1, 8);
      renderTransacoes(data.transacoes || []);
    } catch {}
  }

  function renderTransacoes(list) {
    const wrap = document.getElementById('tx-list-wrap');
    if (!list.length) {
      wrap.innerHTML = '<div class="pnl-loading">Nenhuma transação ainda. Comece jogando! 🎮</div>';
      return;
    }
    const ico   = { ganho_partida:'🏆', perda_partida:'💸', deposito:'💳', saque:'⬆️', bonus_indicacao:'🎁', ajuste_admin:'⚙️', bonus_cashback:'💜', bonus_streak:'🔥', bonus_meta_diaria:'🎯', reembolso_seguro:'🛡️', saque_afiliado:'💰', compra_vidas:'❤️', presente_enviado:'🎁', presente_recebido:'🎁' };
    const lbl   = { ganho_partida:'Resgate', perda_partida:'Derrota', deposito:'Depósito', saque:'Saque', bonus_indicacao:'Bônus indicação', ajuste_admin:'Ajuste admin', bonus_cashback:'Cashback', bonus_streak:'Streak bonus', bonus_meta_diaria:'Meta diária', reembolso_seguro:'Reembolso seguro', saque_afiliado:'Saque comissão', compra_vidas:'Pacote de vidas', presente_enviado:'Presente enviado', presente_recebido:'Presente recebido' };
    const icoC  = { ganho_partida:'win', perda_partida:'loss', deposito:'dep', saque:'saq', bonus_indicacao:'bonus', ajuste_admin:'dep', bonus_cashback:'bonus', bonus_streak:'bonus', bonus_meta_diaria:'bonus', reembolso_seguro:'bonus', saque_afiliado:'saq', compra_vidas:'loss', presente_enviado:'saq', presente_recebido:'bonus' };
    const isPos = { ganho_partida:true, deposito:true, bonus_indicacao:true, bonus_cashback:true, bonus_streak:true, bonus_meta_diaria:true, reembolso_seguro:true, presente_recebido:true };

    wrap.innerHTML = `<div class="pnl-tx-list">${list.map(tx => `
      <div class="pnl-tx-item">
        <div class="pnl-tx-ico pnl-tx-ico-${icoC[tx.tipo]||'dep'}">${ico[tx.tipo]||'💰'}</div>
        <div class="pnl-tx-body">
          <div class="pnl-tx-desc">${lbl[tx.tipo]||tx.tipo}</div>
          <div class="pnl-tx-date">${formatDate(tx.created_at)}</div>
        </div>
        <div class="pnl-tx-right">
          <div class="pnl-tx-val ${isPos[tx.tipo]?'pnl-tx-pos':'pnl-tx-neg'}">
            ${isPos[tx.tipo]?'+':'-'}${formatMoney(tx.valor)}
          </div>
          <span class="pnl-badge pnl-badge-${tx.status==='aprovado'?'green':tx.status==='pendente'?'orange':'red'}">
            ${tx.status}
          </span>
        </div>
      </div>`).join('')}</div>`;
  }

  // ── Input de valor ───────────────────────────────────────────────────────
  const entradaEl = document.getElementById('entrada-val');

  function updateMetaPreview() {
    const v    = parseFloat(entradaEl.value) || 0;
    const meta = v * multGlobal;
    // valor por plataforma = taxa × aposta (proporcional à aposta)
    const vpp  = v * taxaGlobal;
    const plat = vpp > 0 ? Math.ceil(meta / vpp) : '—';
    document.getElementById('meta-val').textContent  = formatMoney(meta);
    document.getElementById('meta-vpp').textContent  = vpp > 0 ? formatMoney(vpp) : '—';
    document.getElementById('meta-plat').textContent = plat !== '—' ? '~' + plat : '—';

    checkSaldo();
  }

  function checkSaldo() {
    const v = parseFloat(entradaEl.value) || 0;
    const insuf = v > currentSaldo && v > 0;
    document.getElementById('saldo-warn').classList.toggle('hidden', !insuf);
    document.getElementById('btn-jogar').disabled = insuf || v < 1;
  }

  // Seguro de partida: atualizar custo ao mudar entrada
  const chkSeguro = document.getElementById('chk-seguro');
  function updateSeguroCusto() {
    const v = parseFloat(entradaEl.value) || 0;
    const custo = Math.round(v * 0.30 * 100) / 100;
    document.getElementById('seguro-custo').textContent = `+R$ ${custo.toFixed(2).replace('.', ',')}`;
  }

  entradaEl.addEventListener('input', () => {
    const v = parseFloat(entradaEl.value) || 0;
    updateMetaPreview();
    updateSeguroCusto();
    $$('.pnl-quick[data-v]').forEach(b => b.classList.toggle('active', parseFloat(b.dataset.v) === v));
  });
  chkSeguro.addEventListener('change', updateSeguroCusto);

  $$('.pnl-quick[data-v]').forEach(btn => {
    btn.addEventListener('click', () => {
      entradaEl.value = btn.dataset.v;
      entradaEl.dispatchEvent(new Event('input'));
    });
  });

  document.getElementById('dep-from-warn').addEventListener('click', openDepositModal);

  // ── Botão JOGAR ──────────────────────────────────────────────────────────
  // Flag de revanche (setado pela tela de derrota)
  let _pendingRevanche = false;

  document.getElementById('btn-jogar').addEventListener('click', async () => {
    const v = parseFloat(entradaEl.value);
    if (!v || v < 1) { showToast('Informe um valor de entrada válido.', 'warning'); return; }
    const comSeguro = chkSeguro.checked;
    const totalNecessario = comSeguro ? Math.round((v + v * 0.30) * 100) / 100 : v;
    if (totalNecessario > currentSaldo) { showToast('Saldo insuficiente! Deposite para continuar.', 'error'); return; }

    const btn = document.getElementById('btn-jogar');
    btn.disabled  = true;
    btn.innerHTML = '<svg class="spin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Iniciando...';

    const opts = {};
    if (comSeguro) opts.com_seguro = true;
    if (chkTurbo.checked) opts.modo_turbo = true;
    if (_pendingRevanche) { opts.revanche = true; _pendingRevanche = false; }

    try {
      showLoading();
      const partida = await API.iniciarPartida(v, opts);
      hideLoading();
      taxaGlobal = parseFloat(partida.taxa_por_plataforma)  || taxaGlobal;
      multGlobal = parseFloat(partida.multiplicador_meta)  || 7;
      sessionStorage.setItem('partida_atual', JSON.stringify({
        partida_id:             partida.partida_id,
        valor_entrada:          partida.valor_entrada,
        valor_meta:             partida.valor_meta,
        valor_por_plataforma:   partida.valor_por_plataforma,
        plataformas_referencia: partida.plataformas_referencia,
        multiplicador_meta:     partida.multiplicador_meta,
        dificuldade:            partida.dificuldade || 'normal',
        is_demo:                !!partida.is_demo,
      }));
      navigate('#jogo');
    } catch (err) {
      hideLoading();
      showToast(err.message, 'error');
      btn.disabled  = false;
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><polygon points="5,3 19,12 5,21"/></svg> JOGAR AGORA';
    }
  });

  // ── Jogadores online simulado ────────────────────────────────────────────
  (function initOnlineBadge() {
    const nEl = document.getElementById('n-jogando');
    if (!nEl) return;
    let current = 0;
    const target = 80 + Math.floor(Math.random() * 300);

    // Conta de 0 até o alvo em ~800ms
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      nEl.textContent = current.toLocaleString('pt-BR');
      if (current >= target) clearInterval(timer);
    }, 20);

    // A cada 8–15s varia +/- alguns jogadores simulando atividade
    setInterval(() => {
      const delta = Math.floor(Math.random() * 11) - 5;
      current = Math.max(50, current + delta);
      nEl.style.animation = 'none';
      requestAnimationFrame(() => {
        nEl.style.animation = '';
        nEl.textContent = current.toLocaleString('pt-BR');
      });
    }, 8000 + Math.random() * 7000);
  })();

  // ── Modais helper ────────────────────────────────────────────────────────
  function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
  }
  function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
  }

  ['modal-deposito','modal-dep-confirmado','modal-saque','modal-desbloqueio','modal-taxa-saque','modal-saque-sucesso','modal-saque-afiliado','modal-indicacao','modal-perfil','modal-suporte','modal-ajuste','modal-ranking','modal-presente'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', e => {
      if (e.target.id === id) {
        closeModal(id);
        if (id === 'modal-deposito') { pararPollingDeposito(); _depositoUpsellMotivo = null; }
      }
    });
  });

  // ── Sair ─────────────────────────────────────────────────────────────────
  async function doLogout() {
    await API.logout();
    navigate('#landing');
    showToast('Até logo!', 'info');
  }
  document.getElementById('nav-sair').addEventListener('click', doLogout);

  // ── Saldo Chip Dropdown ───────────────────────────────────────────────────
  const saldoDrop = document.getElementById('saldo-drop');
  const saldoChip = document.getElementById('saldo-chip');

  function toggleSaldoDrop(e) {
    e.stopPropagation();
    const isOpen = !saldoDrop.classList.contains('hidden');
    saldoDrop.classList.toggle('hidden');
    saldoChip.classList.toggle('open', !isOpen);
  }
  function closeSaldoDrop() {
    saldoDrop.classList.add('hidden');
    saldoChip.classList.remove('open');
  }

  saldoChip.addEventListener('click', toggleSaldoDrop);

  document.getElementById('psd-btn-depositar').addEventListener('click', () => {
    closeSaldoDrop();
    openDepositModal();
  });

  document.getElementById('psd-btn-sacar').addEventListener('click', () => {
    closeSaldoDrop();
    openModal('modal-saque');
    carregarMeusSaques();
  });

  // Fecha ao clicar fora
  document.addEventListener('click', (e) => {
    if (!document.getElementById('saldo-chip-wrap').contains(e.target)) closeSaldoDrop();
  }, { capture: false });

  // ── Profile Dropdown ──────────────────────────────────────────────────────
  const profileDrop = document.getElementById('profile-drop');

  function toggleProfileDrop(e) {
    e.stopPropagation();
    profileDrop.classList.toggle('hidden');
  }
  function closeProfileDrop() { profileDrop.classList.add('hidden'); }

  document.getElementById('btn-perfil').addEventListener('click', toggleProfileDrop);

  // Fecha ao clicar fora
  document.addEventListener('click', (e) => {
    if (!profileDrop.contains(e.target)) closeProfileDrop();
  });

  // Botão Perfil no dropdown → abre modal de perfil
  document.getElementById('ppd-btn-perfil').addEventListener('click', () => {
    closeProfileDrop();
    openModal('modal-perfil');
    // Preenche stats do perfil com dados já carregados
    const u = API.getUser() || {};
    document.getElementById('prf-nome').textContent  = u.nome  || 'Usuário';
    document.getElementById('prf-email').textContent = u.email || '';
    document.getElementById('prf-avatar-lg').textContent = (u.nome || 'U').charAt(0).toUpperCase();
    // Carrega dados atualizados do dashboard
    API.dashboard().then(d => {
      document.getElementById('prf-saldo').textContent    = formatMoney(d.saldo || 0);
      document.getElementById('prf-partidas').textContent = d.total_partidas || 0;
      document.getElementById('prf-afil').textContent     = formatMoney(d.saldo_afiliado || 0);
    }).catch(() => {});
  });

  // Botão Indique no dropdown → abre modal de indicação
  document.getElementById('ppd-btn-indique').addEventListener('click', () => {
    closeProfileDrop();
    loadIndicacao();
  });

  // Botão Suporte no dropdown
  document.getElementById('ppd-btn-suporte').addEventListener('click', () => {
    closeProfileDrop();
    openModal('modal-suporte');
    _carregarSuporte();
  });

  // Fechar modal suporte
  document.getElementById('close-suporte').addEventListener('click', () => closeModal('modal-suporte'));
  document.getElementById('modal-suporte').addEventListener('click', e => {
    if (e.target.id === 'modal-suporte') closeModal('modal-suporte');
  });

  async function _carregarSuporte() {
    const loading = document.getElementById('suporte-loading');
    const wrap    = document.getElementById('suporte-links-wrap');
    loading.style.display = 'block';
    wrap.innerHTML = '';
    try {
      const data = await API.suporteLinks();
      loading.style.display = 'none';
      const links = data.links || [];
      if (!links.length) {
        wrap.innerHTML = '<div class="sup-empty">Nenhum link de suporte configurado.</div>';
        return;
      }
      wrap.innerHTML = links.map(l => `
        <a class="sup-link-item" href="${l.url}" target="_blank" rel="noopener noreferrer">
          <div class="sup-link-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div>
            <div class="sup-link-name">${l.nome}</div>
            <div class="sup-link-url">${l.url}</div>
          </div>
          <div class="sup-link-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </a>
      `).join('');
    } catch {
      loading.style.display = 'none';
      wrap.innerHTML = '<div class="sup-empty">Erro ao carregar links de suporte.</div>';
    }
  }

  // ── Gateway Config (Admin) — Multi-Gateway ──────────────────────────────
  if (user.admin && document.getElementById('ppd-btn-gateway')) {
    let _gwData = null;

    document.getElementById('ppd-btn-gateway').addEventListener('click', () => {
      closeProfileDrop();
      openModal('modal-gateway');
      _carregarGatewayConfig();
    });

    document.getElementById('close-gateway').addEventListener('click', () => closeModal('modal-gateway'));
    document.getElementById('modal-gateway').addEventListener('click', e => {
      if (e.target.id === 'modal-gateway') closeModal('modal-gateway');
    });

    // Copy buttons
    document.querySelectorAll('.gw-copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.copy);
        if (input) copyToClipboard(input.value);
      });
    });

    // Gateway selector buttons
    document.querySelectorAll('.gw-sel-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const gw = btn.dataset.gw;
        try {
          await API.setActiveGateway(gw);
          showToast(`Gateway ativo: ${gw === 'amplopay' ? 'AmploPay' : 'ParadisePags'}`, 'success');
          _carregarGatewayConfig();
        } catch (err) {
          showToast(err.message || 'Erro ao trocar gateway.', 'error');
        }
      });
    });

    // Save credential buttons
    document.querySelectorAll('.gw-save-cred').forEach(btn => {
      btn.addEventListener('click', async () => {
        const gw = btn.dataset.gw;
        btn.disabled = true;
        try {
          let config = {};
          if (gw === 'amplopay') {
            const pk = document.getElementById('gw-amp-pk').value.trim();
            const sk = document.getElementById('gw-amp-sk').value.trim();
            const wt = document.getElementById('gw-amp-wt').value.trim();
            if (pk) config.public_key = pk;
            if (sk) config.secret_key = sk;
            if (wt) config.webhook_token = wt;
          } else {
            const sk = document.getElementById('gw-par-sk').value.trim();
            const url = document.getElementById('gw-par-url').value.trim();
            if (sk) config.secret_key = sk;
            if (url) config.base_url = url;
          }
          if (!Object.keys(config).length) {
            showToast('Preencha pelo menos um campo.', 'warning');
            return;
          }
          await API.updateGatewayCredentials(gw, config);
          showToast('Credenciais salvas!', 'success');
          // Clear inputs
          if (gw === 'amplopay') {
            document.getElementById('gw-amp-pk').value = '';
            document.getElementById('gw-amp-sk').value = '';
            document.getElementById('gw-amp-wt').value = '';
          } else {
            document.getElementById('gw-par-sk').value = '';
            document.getElementById('gw-par-url').value = '';
          }
          _carregarGatewayConfig();
        } catch (err) {
          showToast(err.message || 'Erro ao salvar.', 'error');
        } finally {
          btn.disabled = false;
        }
      });
    });

    async function _carregarGatewayConfig() {
      try {
        const data = await API.getGatewayConfig();
        _gwData = data;

        const active = data.active || 'amplopay';

        // Highlight active selector
        document.querySelectorAll('.gw-sel-btn').forEach(b => {
          const isActive = b.dataset.gw === active;
          b.style.borderColor = isActive ? '#f59e0b' : 'rgba(0,0,0,0.15)';
          b.style.background = isActive ? 'rgba(245,158,11,0.15)' : 'rgba(0,0,0,0.04)';
          b.style.color = isActive ? '#b45309' : '#222';
        });

        // Show/hide panels
        document.getElementById('gw-panel-amplopay').style.display = active === 'amplopay' ? '' : 'none';
        document.getElementById('gw-panel-paradisepags').style.display = active === 'paradisepags' ? '' : 'none';

        // AmploPay data
        const amp = data.amplopay || {};
        _setGwDot('gw-st-amp-pk', amp.has_public_key);
        _setGwDot('gw-st-amp-sk', amp.has_secret_key);
        _setGwDot('gw-st-amp-wt', amp.has_webhook_token);
        document.getElementById('gw-amp-webhook-url').value = amp.webhook_url || '';
        document.getElementById('gw-amp-cur-pk').textContent = amp.public_key || '(vazio)';
        document.getElementById('gw-amp-cur-sk').textContent = amp.secret_key || '(vazio)';
        document.getElementById('gw-amp-cur-wt').textContent = amp.webhook_token || '(vazio)';

        // ParadisePags data
        const par = data.paradisepags || {};
        _setGwDot('gw-st-par-sk', par.has_secret_key);
        document.getElementById('gw-par-webhook-url').value = par.webhook_url || '';
        document.getElementById('gw-par-cur-sk').textContent = par.secret_key || '(vazio)';
        document.getElementById('gw-par-cur-url').textContent = par.base_url || '(padrao)';
      } catch (err) {
        showToast('Erro ao carregar configuracao do gateway.', 'error');
      }
    }

    function _setGwDot(itemId, active) {
      const item = document.getElementById(itemId);
      if (!item) return;
      const dot = item.querySelector('.gw-dot');
      if (dot) {
        dot.classList.toggle('gw-dot-on', active);
        dot.classList.toggle('gw-dot-off', !active);
      }
    }
  }

  // ── Site Config (Admin) ─────────────────────────────────────────────────
  if (user.admin && document.getElementById('ppd-btn-siteconfig')) {
    document.getElementById('ppd-btn-siteconfig').addEventListener('click', () => {
      closeProfileDrop();
      openModal('modal-siteconfig');
      _carregarSiteConfig();
    });

    document.getElementById('close-siteconfig').addEventListener('click', () => closeModal('modal-siteconfig'));
    document.getElementById('modal-siteconfig').addEventListener('click', e => {
      if (e.target.id === 'modal-siteconfig') closeModal('modal-siteconfig');
    });

    document.getElementById('sc-save-btn').addEventListener('click', async () => {
      const btn = document.getElementById('sc-save-btn');
      btn.disabled = true;
      try {
        const payload = {
          site_nome: document.getElementById('sc-site-nome').value.trim(),
          site_suporte: document.getElementById('sc-site-suporte').value.trim(),
          site_promo: document.getElementById('sc-site-promo').value.trim(),
          site_logo_url: document.getElementById('sc-site-logo').value.trim() || null,
          site_favicon_url: document.getElementById('sc-site-favicon').value.trim() || null,
          kwai_pixel_id: document.getElementById('sc-kwai-pixel').value.trim(),
        };
        await API.updateSiteConfig(payload);
        showToast('Configurações salvas!', 'success');
        if (typeof applyBranding === 'function') applyBranding(true);
        if (typeof window.invalidatePublicCfgCache === 'function') window.invalidatePublicCfgCache();
      } catch (err) {
        showToast(err.message || 'Erro ao salvar configurações.', 'error');
      } finally {
        btn.disabled = false;
      }
    });

    async function _carregarSiteConfig() {
      try {
        const cfg = await API.getSiteConfig();
        document.getElementById('sc-site-nome').value = cfg.site_nome || '';
        document.getElementById('sc-site-suporte').value = cfg.site_suporte || '';
        document.getElementById('sc-site-promo').value = cfg.site_promo || '';
        document.getElementById('sc-site-logo').value = cfg.site_logo_url || '';
        document.getElementById('sc-site-favicon').value = cfg.site_favicon_url || '';
        document.getElementById('sc-kwai-pixel').value = cfg.kwai_pixel_id || '';
      } catch (err) {
        showToast('Erro ao carregar config do site.', 'error');
      }
    }
  }

  // ── Ajuste de Saldo (Admin) ──────────────────────────────────────────────
  if (user.admin && document.getElementById('ppd-btn-ajuste')) {
    let _ajUsers = [];
    let _ajSelId = null;

    document.getElementById('ppd-btn-ajuste').addEventListener('click', () => {
      closeProfileDrop();
      openModal('modal-ajuste');
      _carregarUsuarios();
    });

    document.getElementById('close-ajuste').addEventListener('click', () => closeModal('modal-ajuste'));
    document.getElementById('modal-ajuste').addEventListener('click', e => {
      if (e.target.id === 'modal-ajuste') closeModal('modal-ajuste');
    });

    async function _carregarUsuarios() {
      try { _ajUsers = await API.listarUsuarios(); } catch { _ajUsers = []; }
      document.getElementById('aj-busca').value = '';
      document.getElementById('aj-results').innerHTML = '';
      document.getElementById('aj-form').style.display = 'none';
      _ajSelId = null;
    }

    document.getElementById('aj-busca').addEventListener('input', () => {
      const q = document.getElementById('aj-busca').value.trim().toLowerCase();
      const box = document.getElementById('aj-results');
      if (q.length < 2) { box.innerHTML = ''; return; }
      const filtered = _ajUsers.filter(u => u.nome.toLowerCase().includes(q) || u.telefone.includes(q)).slice(0, 10);
      box.innerHTML = filtered.map(u => `
        <div class="aj-user-row" data-id="${u.id}" style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;margin-bottom:4px;background:rgba(255,255,255,0.04);border-radius:8px;cursor:pointer;transition:.15s">
          <div><div style="font-size:13px;font-weight:600;color:#2d0040">${u.nome}</div><div style="font-size:11px;color:#888">${u.telefone}</div></div>
          <div style="font-size:13px;font-weight:700;color:#22c55e">R$ ${u.saldo.toFixed(2)}</div>
        </div>
      `).join('');
      box.querySelectorAll('.aj-user-row').forEach(row => {
        row.addEventListener('click', () => _selecionarUser(parseInt(row.dataset.id)));
        row.addEventListener('mouseenter', () => { row.style.background = 'rgba(99,102,241,0.15)'; });
        row.addEventListener('mouseleave', () => { row.style.background = 'rgba(255,255,255,0.04)'; });
      });
    });

    function _atualizarBtnDemo(isDemo) {
      const btn = document.getElementById('aj-toggle-demo');
      if (!btn) return;
      if (isDemo) {
        btn.textContent = 'Demo: ON';
        btn.style.background = 'rgba(251,191,36,.25)';
        btn.style.borderColor = '#fbbf24';
      } else {
        btn.textContent = 'Demo: OFF';
        btn.style.background = 'rgba(251,191,36,.1)';
        btn.style.borderColor = 'rgba(251,191,36,.4)';
      }
      // Config normal sempre visível, config demo só quando demo ON
      const cfgNormal = document.getElementById('aj-normal-config');
      const cfgDemo = document.getElementById('aj-demo-config');
      if (cfgNormal) cfgNormal.style.display = 'block';
      if (cfgDemo) cfgDemo.style.display = isDemo ? 'block' : 'none';
    }

    function _carregarDemoConfig(u) {
      // Config normal
      const nDif = document.getElementById('aj-normal-dificuldade');
      const nMult = document.getElementById('aj-normal-multiplicador');
      if (nDif) nDif.value = u.normal_dificuldade || '';
      if (nMult) nMult.value = u.normal_multiplicador ? String(u.normal_multiplicador) : '';
      // Config demo
      const dDif = document.getElementById('aj-demo-dificuldade');
      const dMult = document.getElementById('aj-demo-multiplicador');
      if (dDif) dDif.value = u.demo_dificuldade || 'demo';
      if (dMult) dMult.value = String(u.demo_multiplicador || '1.5');
    }

    function _atualizarBtnIsento(isIsento) {
      const btn = document.getElementById('aj-toggle-isento');
      if (!btn) return;
      if (isIsento) {
        btn.textContent = 'Isento Taxa: ON';
        btn.style.background = 'rgba(34,197,94,.25)';
        btn.style.borderColor = '#22c55e';
      } else {
        btn.textContent = 'Isento Taxa: OFF';
        btn.style.background = 'rgba(34,197,94,.1)';
        btn.style.borderColor = 'rgba(34,197,94,.4)';
      }
    }

    function _selecionarUser(id) {
      const u = _ajUsers.find(x => x.id === id);
      if (!u) return;
      _ajSelId = id;
      document.getElementById('aj-sel-nome').textContent = u.nome;
      document.getElementById('aj-sel-tel').textContent = u.telefone;
      document.getElementById('aj-sel-saldo').textContent = `R$ ${u.saldo.toFixed(2)}`;
      _atualizarBtnDemo(!!u.demo);
      _atualizarBtnIsento(!!u.isento_taxa_saque);
      _carregarDemoConfig(u);
      document.getElementById('aj-valor').value = '';
      document.getElementById('aj-desc').value = '';
      document.getElementById('aj-results').innerHTML = '';
      document.getElementById('aj-form').style.display = '';
    }

    document.getElementById('aj-save-btn').addEventListener('click', async () => {
      if (!_ajSelId) return;
      const valor = parseFloat(document.getElementById('aj-valor').value);
      if (isNaN(valor) || valor === 0) { showToast('Informe um valor válido.', 'warning'); return; }
      const desc = document.getElementById('aj-desc').value.trim();
      const btn = document.getElementById('aj-save-btn');
      btn.disabled = true;
      try {
        const r = await API.ajustarSaldo(_ajSelId, valor, desc);
        showToast(`Saldo ajustado! Novo saldo: R$ ${r.saldo_novo.toFixed(2)}`, 'success');
        document.getElementById('aj-sel-saldo').textContent = `R$ ${r.saldo_novo.toFixed(2)}`;
        const u = _ajUsers.find(x => x.id === _ajSelId);
        if (u) u.saldo = r.saldo_novo;
        document.getElementById('aj-valor').value = '';
        document.getElementById('aj-desc').value = '';
      } catch (err) {
        showToast(err.message || 'Erro ao ajustar saldo.', 'error');
      } finally { btn.disabled = false; }
    });

    document.getElementById('aj-toggle-demo')?.addEventListener('click', async () => {
      if (!_ajSelId) return;
      const btn = document.getElementById('aj-toggle-demo');
      btn.disabled = true;
      try {
        const r = await API.toggleDemo(_ajSelId);
        const u = _ajUsers.find(x => x.id === _ajSelId);
        if (u) u.demo = r.demo ? 1 : 0;
        _atualizarBtnDemo(!!r.demo);
        showToast(r.demo ? 'Conta demo ATIVADA! Jogo facilitado.' : 'Conta demo DESATIVADA.', 'success');
      } catch (err) {
        showToast(err.message || 'Erro ao alterar modo demo.', 'error');
      } finally { btn.disabled = false; }
    });

    document.getElementById('aj-normal-salvar')?.addEventListener('click', async () => {
      if (!_ajSelId) return;
      const btn = document.getElementById('aj-normal-salvar');
      const dif = document.getElementById('aj-normal-dificuldade').value || null;
      const mult = document.getElementById('aj-normal-multiplicador').value ? parseFloat(document.getElementById('aj-normal-multiplicador').value) : null;
      btn.disabled = true;
      try {
        const r = await API.updateGameConfig(_ajSelId, 'normal', dif, mult);
        const u = _ajUsers.find(x => x.id === _ajSelId);
        if (u) { u.normal_dificuldade = dif; u.normal_multiplicador = mult; }
        showToast(dif || mult ? `Config normal salva!` : 'Config normal resetada para padrao.', 'success');
      } catch (err) {
        showToast(err.message || 'Erro ao salvar config.', 'error');
      } finally { btn.disabled = false; }
    });

    document.getElementById('aj-demo-salvar')?.addEventListener('click', async () => {
      if (!_ajSelId) return;
      const btn = document.getElementById('aj-demo-salvar');
      const dif = document.getElementById('aj-demo-dificuldade').value;
      const mult = parseFloat(document.getElementById('aj-demo-multiplicador').value);
      btn.disabled = true;
      try {
        const r = await API.updateGameConfig(_ajSelId, 'demo', dif, mult);
        const u = _ajUsers.find(x => x.id === _ajSelId);
        if (u) { u.demo_dificuldade = dif; u.demo_multiplicador = mult; }
        showToast(`Config demo salva! Dificuldade: ${dif}, Meta: ${mult}x`, 'success');
      } catch (err) {
        showToast(err.message || 'Erro ao salvar config demo.', 'error');
      } finally { btn.disabled = false; }
    });

    document.getElementById('aj-toggle-isento')?.addEventListener('click', async () => {
      if (!_ajSelId) return;
      const btn = document.getElementById('aj-toggle-isento');
      btn.disabled = true;
      try {
        const r = await API.toggleIsentoTaxa(_ajSelId);
        const u = _ajUsers.find(x => x.id === _ajSelId);
        if (u) u.isento_taxa_saque = r.isento_taxa_saque ? 1 : 0;
        _atualizarBtnIsento(!!r.isento_taxa_saque);
        showToast(r.isento_taxa_saque ? 'Isento de taxa de saque ATIVADO.' : 'Isento de taxa DESATIVADO.', 'success');
      } catch (err) {
        showToast(err.message || 'Erro ao alterar isenção.', 'error');
      } finally { btn.disabled = false; }
    });
  }

  // Botão Sair no dropdown
  document.getElementById('ppd-btn-sair').addEventListener('click', () => {
    closeProfileDrop();
    doLogout();
  });

  // Fechar modal perfil
  document.getElementById('close-perfil').addEventListener('click', () => closeModal('modal-perfil'));
  document.getElementById('modal-perfil').addEventListener('click', e => {
    if (e.target.id === 'modal-perfil') closeModal('modal-perfil');
  });

  // Alterar senha no perfil
  document.getElementById('prf-btn-senha').addEventListener('click', async () => {
    const atual = document.getElementById('prf-senha-atual').value.trim();
    const nova  = document.getElementById('prf-senha-nova').value.trim();
    const conf  = document.getElementById('prf-senha-conf').value.trim();
    if (!atual || !nova) { showToast('Preencha todos os campos.', 'warning'); return; }
    if (nova !== conf)   { showToast('As senhas não coincidem.', 'warning'); return; }
    if (nova.length < 6) { showToast('Mínimo 6 caracteres.', 'warning'); return; }
    const btn = document.getElementById('prf-btn-senha');
    btn.disabled = true; btn.textContent = 'Salvando…';
    try {
      await API.alterarSenha(atual, nova);
      showToast('Senha alterada com sucesso!', 'success');
      document.getElementById('prf-senha-atual').value = '';
      document.getElementById('prf-senha-nova').value  = '';
      document.getElementById('prf-senha-conf').value  = '';
    } catch (err) {
      showToast(err.message || 'Erro ao alterar senha.', 'error');
    } finally {
      btn.disabled = false; btn.textContent = 'Alterar Senha';
    }
  });

  // Atualiza badge de saldo afiliado no dropdown quando loadIndicacao for chamado
  function _atualizarBadgeAfil(saldo) {
    const el = document.getElementById('ppd-saldo-afil');
    if (el) el.textContent = formatMoney(saldo || 0);
  }

  // ── Nav bottom → ações ───────────────────────────────────────────────────
  // Config de bônus de depósito (carregada ao abrir o modal)
  let _depBonus = null;

  function _atualizarCardBonus() {
    const b = _depBonus;
    const card = document.getElementById('dep-bonus-card');
    const v = parseFloat(document.getElementById('dep-valor').value) || 0;

    // Verifica bônus VIP por faixa (upsell depósito)
    const bonus2x = b && b.deposit_bonus ? b.deposit_bonus : null;
    const faixas = bonus2x?.faixas_vip;
    const faixaMatch = faixas ? faixas.find(f => v >= f.min && v <= f.max) : null;
    // Fallback: eligible_amounts antigo
    const multMatch = faixaMatch ? faixaMatch.multiplicador
      : (bonus2x?.eligible_amounts?.includes(v) ? bonus2x.multiplier : null);
    if (multMatch && multMatch > 1) {
      const bonusVal = v * (multMatch - 1);
      const total = v * multMatch;
      document.getElementById('dep-bonus-label').textContent = `BONUS ${multMatch}x`;
      document.getElementById('dep-bonus-valor').textContent = `+ ${formatMoney(bonusVal)}`;
      document.getElementById('dep-bonus-total').textContent = formatMoney(total);
      card.style.background = 'linear-gradient(135deg,#d97706,#f59e0b)';
      card.classList.remove('hidden');
      return;
    }

    // Bônus percentual padrão
    card.style.background = 'linear-gradient(135deg,#1a7a3a,#22a850)';
    if (!b || !b.temDireito) { card.classList.add('hidden'); return; }

    const elegivel = v >= b.minimo && (b.maximo <= 0 || v <= b.maximo);
    if (!elegivel || v <= 0) { card.classList.add('hidden'); return; }

    const bonusVal = v * (b.perc / 100);
    const total    = v + bonusVal;
    document.getElementById('dep-bonus-label').textContent = `BÔNUS DE ${b.perc}%`;
    document.getElementById('dep-bonus-valor').textContent = `+ ${formatMoney(bonusVal)}`;
    document.getElementById('dep-bonus-total').textContent = formatMoney(total);
    card.classList.remove('hidden');
  }

  function _gerarBotoesBonus(b) {
    const row = document.getElementById('dep-quick-row');
    const valores = (b && b.valores_rapidos && b.valores_rapidos.length) ? b.valores_rapidos : [10, 20, 50, 100];
    const bonus2x = b && b.deposit_bonus ? b.deposit_bonus : null;
    row.innerHTML = valores.map(v => {
      const label = Number.isInteger(v) ? `R$${v}` : `R$${parseFloat(v).toLocaleString('pt-BR')}`;
      let badge = '';
      // Badge de bônus percentual existente
      if (b && b.temDireito && v >= b.minimo && (b.maximo <= 0 || v <= b.maximo) && b.perc > 0) {
        badge = `<span class="dep-quick-badge">+${b.perc}%</span>`;
      }
      // Badge de bônus VIP por faixa
      const _faixas = bonus2x?.faixas_vip;
      const _fm = _faixas ? _faixas.find(f => v >= f.min && v <= f.max) : null;
      const _mult = _fm ? _fm.multiplicador : (bonus2x?.eligible_amounts?.includes(v) ? bonus2x.multiplier : null);
      if (_mult && _mult > 1) {
        badge = `<span class="dep-quick-badge" style="color:#fbbf24;font-size:10px;font-weight:900">${_mult}x</span>`;
      }
      return `<button class="pnl-quick dep-quick-btn" data-dep="${v}">${label}${badge}</button>`;
    }).join('');
    // Não adicionar listeners individuais — o handler delegado no container já cobre tudo
  }

  // Flag para identificar depósitos motivados por upsell (sempre vão pro split/SK)
  let _depositoUpsellMotivo = null;

  function openDepositModal() {
    document.getElementById('dep-step1').classList.remove('hidden');
    document.getElementById('dep-step2').classList.add('hidden');
    document.getElementById('dep-loading').classList.remove('hidden');
    document.getElementById('dep-content').classList.add('hidden');
    document.getElementById('dep-confirmar').disabled = false;
    document.getElementById('dep-valor').value = '';
    document.getElementById('dep-bonus-card').classList.add('hidden');
    // Reset cupom
    document.getElementById('dep-cupom-field').style.display = 'none';
    document.getElementById('dep-cupom-input').value = '';
    document.getElementById('dep-cupom-input').disabled = false;
    document.getElementById('dep-cupom-status').textContent = '';
    document.getElementById('dep-cupom-status').style.color = '';
    document.getElementById('dep-cupom-alterar-wrap').style.display = 'none';
    const _btn = document.getElementById('dep-cupom-btn');
    _btn.disabled = false; _btn.textContent = 'Aplicar'; _btn.style.background = '#2d6a4f';
    window._cupomAplicado = null;
    // CPF: preenche se já tem e esconde o campo
    const _u = API.getUser();
    const depCpfEl = document.getElementById('dep-cpf');
    const depCpfWrap = document.getElementById('dep-cpf-wrap');
    if (_u?.cpf && _u.cpf.length >= 11) {
      depCpfEl.value = _u.cpf;
      depCpfWrap.style.display = 'none';
    } else {
      depCpfEl.value = '';
      depCpfWrap.style.display = '';
    }
    _depositoUpsellMotivo = null; // Depósito normal, sem upsell
    openModal('modal-deposito');

    // Busca config de bônus + limites em segundo plano
    API.depositoInfo().then(b => {
      _depBonus = b;
      _gerarBotoesBonus(b);
      _atualizarCardBonus();

      // Aplica limites de depósito vindos do admin
      if (b.limites) {
        const depEl  = document.getElementById('dep-valor');
        const depMin = b.limites.deposito_minimo || 10;
        const depMax = b.limites.deposito_maximo || 0;
        depEl.dataset.min   = depMin;
        depEl.dataset.max   = depMax;
        depEl.min           = depMin;
        depEl.placeholder   = `Mínimo ${formatMoney(depMin)}`;

        // Aplica limites de saque também
        const saqEl  = document.getElementById('saq-valor');
        const saqMin = b.limites.saque_minimo || 20;
        const saqMax = b.limites.saque_maximo || 0;
        saqEl.dataset.min   = saqMin;
        saqEl.dataset.max   = saqMax;
        saqEl.min           = saqMin;
        saqEl.placeholder   = `Mínimo ${formatMoney(saqMin)}`;
      }
    }).catch(() => { _depBonus = null; });
  }
  document.getElementById('btn-depositar').addEventListener('click', openDepositModal);
  document.getElementById('nav-dep').addEventListener('click', openDepositModal);
  async function abrirModalSaque() {
    openModal('modal-saque');
    carregarMeusSaques();
  }
  document.getElementById('btn-sacar').addEventListener('click', abrirModalSaque);
  document.getElementById('nav-sac').addEventListener('click', abrirModalSaque);
  document.getElementById('btn-indicar').addEventListener('click', () => loadIndicacao());
  document.getElementById('nav-ind').addEventListener('click', () => loadIndicacao());

  // ── Navegação para paineis por role ─────────────────────────────────────
  const _painelUrl = user.role === 'super_admin' ? '/super-admin' : user.role === 'gerente' ? '/gerente' : user.role === 'influencer' ? '/influencer' : null;
  if (_painelUrl) {
    const btnPainelDrop = document.getElementById('ppd-btn-meu-painel');
    if (btnPainelDrop) btnPainelDrop.addEventListener('click', () => { closeProfileDrop(); window.location.href = _painelUrl; });
    const btnPainelNav = document.getElementById('nav-meu-painel');
    if (btnPainelNav) btnPainelNav.addEventListener('click', () => { window.location.href = _painelUrl; });
  }

  document.getElementById('close-deposito').addEventListener('click',  () => { closeModal('modal-deposito'); pararPollingDeposito(); _depositoUpsellMotivo = null; });
  document.getElementById('close-saque').addEventListener('click',     () => closeModal('modal-saque'));
  document.getElementById('close-indicacao').addEventListener('click', () => closeModal('modal-indicacao'));

  // ── Depositar ────────────────────────────────────────────────────────────
  // Handler delegado único — cobre botões estáticos e os gerados dinamicamente pelo admin
  document.getElementById('dep-quick-row').addEventListener('click', e => {
    const btn = e.target.closest('[data-dep]');
    if (!btn) return;
    const depEl = document.getElementById('dep-valor');
    depEl.value = btn.dataset.dep;
    document.querySelectorAll('#dep-quick-row [data-dep]').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    // Dispara 'input' para garantir que todos os listeners de validação sejam notificados
    depEl.dispatchEvent(new Event('input'));
  });

  // Atualiza card de bônus ao digitar valor manualmente
  document.getElementById('dep-valor').addEventListener('input', _atualizarCardBonus);

  // CPF é obtido do cadastro do usuário (enviado pelo backend para a AmploPay)

  // Máscara de CPF no depósito
  document.getElementById('dep-cpf').addEventListener('input', function() {
    let v = this.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    this.value = v;
  });

  document.getElementById('dep-confirmar').addEventListener('click', async () => {
    const depEl  = document.getElementById('dep-valor');
    const v      = parseFloat(depEl.value);
    const depMin = parseFloat(depEl.dataset.min) || 10;
    const depMax = parseFloat(depEl.dataset.max) || 0;
    if (!v || v < depMin) { showToast(`Valor mínimo: ${formatMoney(depMin)}`, 'warning'); return; }
    if (depMax > 0 && v > depMax) { showToast(`Valor máximo: ${formatMoney(depMax)}`, 'warning'); return; }

    // Validar CPF
    const cpfRaw = document.getElementById('dep-cpf').value.replace(/\D/g, '');
    const u = API.getUser();
    if (!u?.cpf && cpfRaw.length !== 11) {
      showToast('Informe um CPF válido (11 dígitos).', 'warning');
      return;
    }

    const btn = document.getElementById('dep-confirmar');
    btn.disabled = true;

    // Vai para step 2 imediatamente, mostrando spinner
    document.getElementById('dep-step1').classList.add('hidden');
    document.getElementById('dep-step2').classList.remove('hidden');
    document.getElementById('dep-loading').classList.remove('hidden');
    document.getElementById('dep-content').classList.add('hidden');

    try {
      const data = await API.deposito(v, cpfRaw || undefined, _depositoUpsellMotivo);

      // Esconde spinner, mostra conteúdo
      document.getElementById('dep-loading').classList.add('hidden');
      document.getElementById('dep-content').classList.remove('hidden');

      const qrImg = document.getElementById('dep-qr-img');
      const qrSrc = data.qrcode_imagem || data.qrcode_base64 || '';
      if (qrSrc) {
        qrImg.src = qrSrc;
        document.getElementById('dep-qr-wrap').style.display = 'block';
      } else {
        document.getElementById('dep-qr-wrap').style.display = 'none';
      }

      // Guarda texto completo no dataset, exibe truncado
      const pixTxt = document.getElementById('dep-pix-txt');
      const copiaCola = data.qrcode_texto || '';
      pixTxt.dataset.full = copiaCola;
      pixTxt.textContent  = copiaCola;

      const copyBtn = document.getElementById('dep-copy-btn');
      if (copiaCola) {
        copyBtn.style.display = 'block';
        copyBtn.onclick = () => {
          copyToClipboard(copiaCola);
          copyBtn.textContent = '✓';
          setTimeout(() => { copyBtn.textContent = 'Copiar'; }, 1500);
        };
      } else {
        copyBtn.style.display = 'none';
      }

      startCountdown(document.getElementById('dep-timer'), data.expiracao_minutos || 30);

      // Polling: verifica confirmação do gateway a cada 4s
      iniciarPollingDeposito(data.txid, data.expiracao_minutos || 30);

    } catch (err) {
      // Volta para step 1 em caso de erro
      document.getElementById('dep-step1').classList.remove('hidden');
      document.getElementById('dep-step2').classList.add('hidden');
      showToast(err.message, 'error');
    }
    finally { btn.disabled = false; }
  });

  // ── Polling de confirmação de depósito ───────────────────────────────────
  let _pollTimer = null;

  function iniciarPollingDeposito(txid, expiracaoMinutos) {
    pararPollingDeposito();
    if (!txid) return;

    const expiracao = Date.now() + expiracaoMinutos * 60 * 1000;

    async function checar() {
      // Para se o modal foi fechado ou expirou
      if (document.getElementById('modal-deposito').classList.contains('hidden')) return;
      if (Date.now() > expiracao) return;

      try {
        const res = await API.depositoStatus(txid);
        if (res.status === 'aprovado') {
          pararPollingDeposito();
          mostrarDepositoConfirmado(res.valor, res.saldo_novo);
          return;
        }
      } catch { /* ignora erros de rede no polling */ }

      _pollTimer = setTimeout(checar, 4000);
    }

    _pollTimer = setTimeout(checar, 4000);
  }

  function pararPollingDeposito() {
    if (_pollTimer) { clearTimeout(_pollTimer); _pollTimer = null; }
  }

  function mostrarDepositoConfirmado(valor, saldoNovo) {
    // Fecha modal de depósito
    closeModal('modal-deposito');
    pararPollingDeposito();
    const _motivoAnterior = _depositoUpsellMotivo;
    _depositoUpsellMotivo = null;

    // Atualiza saldo na UI
    if (saldoNovo !== undefined && saldoNovo !== null) {
      currentSaldo = parseFloat(saldoNovo);
      document.getElementById('saldo-badge').textContent       = formatMoney(currentSaldo);
      document.getElementById('st-saldo').textContent          = formatMoney(currentSaldo);
      document.getElementById('saldo-saque-disp').textContent  = formatMoney(currentSaldo);
    }

    // Preenche modal de confirmação
    const v = parseFloat(valor) || 0;
    document.getElementById('dep-confirmado-valor').textContent = formatMoney(v);
    document.getElementById('dep-confirmado-saldo').textContent = formatMoney(currentSaldo);

    // Reabrindo a animação (remove e readiciona o elemento)
    const circulo = document.querySelector('#modal-dep-confirmado svg').parentElement;
    circulo.style.animation = 'none';
    requestAnimationFrame(() => {
      circulo.style.animation = '';
    });

    openModal('modal-dep-confirmado');

    // Se era depósito de taxa de saque, orientar usuário
    if (_motivoAnterior === 'taxa_saque') {
      setTimeout(() => showToast('Taxa paga! Agora solicite seu saque novamente.', 'success'), 1500);
    }
  }


  // ── Saque ────────────────────────────────────────────────────────────────
  document.getElementById('btn-sacar').addEventListener('click', () => {
    const u = API.getUser();
    document.getElementById('saq-pix').value            = u?.chave_pix || '';
    document.getElementById('saq-cpf').value              = '';
    document.getElementById('saldo-saque-disp').textContent = formatMoney(currentSaldo);
  }, { capture: true });

  async function carregarMeusSaques() {
    const section = document.getElementById('meus-saques-section');
    const lista   = document.getElementById('meus-saques-lista');
    try {
      const data = await API.meusSaques();
      const saques = data.saques || [];
      if (!saques.length) { section.style.display = 'none'; return; }
      const statusCor = { pendente: '#f59e0b', aprovado: '#22c55e', rejeitado: '#ef4444' };
      const statusLabel = { pendente: 'Pendente', aprovado: 'Aprovado', rejeitado: 'Reprovado' };
      lista.innerHTML = saques.map(s => {
        const cor  = statusCor[s.status]  || '#9980aa';
        const lbl  = statusLabel[s.status] || s.status;
        const tipo = s.tipo === 'saque_afiliado' ? 'Comissão' : 'Saque';
        const data = new Date(s.created_at).toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'2-digit', hour:'2-digit', minute:'2-digit' });
        return `<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:rgba(255,255,255,.04);border-radius:10px;margin-bottom:6px;gap:8px">
          <div style="display:flex;flex-direction:column;gap:2px;min-width:0">
            <span style="font-size:12px;font-weight:700;color:#c4aed8">${tipo}</span>
            <span style="font-size:11px;color:#7a6a8a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:160px" title="${s.pix_chave||''}">${s.pix_chave || '—'}</span>
            <span style="font-size:10px;color:#5a4a6a">${data}</span>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0">
            <span style="font-size:14px;font-weight:700;color:#FF6B9D">${formatMoney(s.valor)}</span>
            <span style="font-size:11px;font-weight:600;color:${cor};background:${cor}22;border-radius:6px;padding:2px 8px">${lbl}</span>
          </div>
        </div>`;
      }).join('');
      section.style.display = 'block';
    } catch { section.style.display = 'none'; }
  }

  document.getElementById('saq-confirmar').addEventListener('click', async () => {
    const saqEl  = document.getElementById('saq-valor');
    const v      = parseFloat(saqEl.value);
    const saqMin = parseFloat(saqEl.dataset.min) || 20;
    const saqMax = parseFloat(saqEl.dataset.max) || 0;
    const pix    = document.getElementById('saq-pix').value.trim();
    const cpfRaw = document.getElementById('saq-cpf').value.replace(/\D/g, '');
    if (!v || v < saqMin) { showToast(`Saque mínimo: ${formatMoney(saqMin)}`, 'warning'); return; }
    if (saqMax > 0 && v > saqMax) { showToast(`Saque máximo: ${formatMoney(saqMax)}`, 'warning'); return; }
    if (v > currentSaldo) { showToast('Saldo insuficiente.', 'error'); return; }
    if (!pix) { showToast('Informe a chave PIX.', 'warning'); return; }
    if (cpfRaw.length !== 11) { showToast('CPF do titular é obrigatório (11 dígitos).', 'warning'); return; }
    const btn = document.getElementById('saq-confirmar');
    btn.disabled = true; btn.textContent = 'Solicitando...';
    try {
      const data = await API.saque(v, pix, cpfRaw);
      carregarMeusSaques();
      closeModal('modal-saque');
      currentSaldo = parseFloat(data.saldo_novo) || currentSaldo - v;
      document.getElementById('saldo-badge').textContent = formatMoney(currentSaldo);
      document.getElementById('st-saldo').textContent    = formatMoney(currentSaldo);
      // Mostrar modal de sucesso
      document.getElementById('saque-sucesso-valor').textContent = formatMoney(v);
      openModal('modal-saque-sucesso');
    } catch (err) {
      // Upsell 1: desbloqueio de saque
      if (err.code === 'SAQUE_BLOQUEADO' || (err.message && err.message.includes('desbloquear'))) {
        closeModal('modal-saque');
        _mostrarUpsellDesbloqueio();
      }
      // Upsell 2: taxa de saque
      else if (err.code === 'TAXA_SAQUE') {
        closeModal('modal-saque');
        _mostrarTaxaSaque(v, err.data);
      } else {
        showToast(err.message, 'error');
      }
    }
    finally { btn.disabled = false; btn.textContent = 'Solicitar Saque'; }
  });

  // ── Desbloqueio de Saque (Upsell) ────────────────────────────────────────
  document.getElementById('close-desbloqueio').addEventListener('click', () => closeModal('modal-desbloqueio'));
  document.getElementById('modal-desbloqueio').addEventListener('click', e => {
    if (e.target.id === 'modal-desbloqueio') closeModal('modal-desbloqueio');
  });

  document.getElementById('desbl-depositar-btn').addEventListener('click', () => {
    closeModal('modal-desbloqueio');
    _depositoUpsellMotivo = 'desbloqueio_saque';
    openModal('modal-deposito');
    const depInput = document.getElementById('dep-valor');
    if (depInput) depInput.value = '20';
  });

  function _mostrarUpsellDesbloqueio() {
    openModal('modal-desbloqueio');
  }

  // ── Taxa de Saque (Upsell 2) ─────────────────────────────────────────────
  let _taxaSaquePendente = { valorSaque: 0, valorTaxa: 0 };

  document.getElementById('close-taxa-saque').addEventListener('click', () => closeModal('modal-taxa-saque'));
  document.getElementById('modal-taxa-saque').addEventListener('click', e => {
    if (e.target.id === 'modal-taxa-saque') closeModal('modal-taxa-saque');
  });

  function _mostrarTaxaSaque(valorSaque, errData) {
    // Calcular taxa: 10% com minimo de R$15
    const taxaCalc = Math.max(valorSaque * 0.10, 15);
    const valorTaxa = errData?.valor_taxa || taxaCalc;
    _taxaSaquePendente = { valorSaque, valorTaxa };
    document.getElementById('taxa-saque-valor-saque').textContent = formatMoney(valorSaque);
    document.getElementById('taxa-saque-valor-taxa').textContent = formatMoney(valorTaxa);
    openModal('modal-taxa-saque');
  }

  document.getElementById('taxa-saque-pagar-btn').addEventListener('click', () => {
    closeModal('modal-taxa-saque');
    // Abre modal de depósito com valor da taxa → vai pro split via _upsell
    _depositoUpsellMotivo = 'taxa_saque';
    openModal('modal-deposito');
    const depInput = document.getElementById('dep-valor');
    if (depInput) depInput.value = String(_taxaSaquePendente.valorTaxa);
  });

  // ── Modal Saque Sucesso ──────────────────────────────────────────────────
  document.getElementById('saque-sucesso-fechar').addEventListener('click', () => closeModal('modal-saque-sucesso'));
  document.getElementById('modal-saque-sucesso').addEventListener('click', e => {
    if (e.target.id === 'modal-saque-sucesso') closeModal('modal-saque-sucesso');
  });

  // ── Saque de Comissão (Afiliado) ─────────────────────────────────────────
  let currentSaldoAfil = 0;

  document.getElementById('btn-sacar-afil').addEventListener('click', () => {
    const u = API.getUser();
    document.getElementById('saq-afil-pix').value = u?.chave_pix || '';
    document.getElementById('saldo-afil-disp').textContent = formatMoney(currentSaldoAfil);
    document.getElementById('saq-afil-valor').value = '';
    closeModal('modal-indicacao');
    openModal('modal-saque-afiliado');
  });

  function closeSaqueAfiliado() {
    closeModal('modal-saque-afiliado');
    openModal('modal-indicacao');
  }
  document.getElementById('close-saque-afiliado').addEventListener('click', closeSaqueAfiliado);
  document.getElementById('modal-saque-afiliado').addEventListener('click', e => {
    if (e.target.id === 'modal-saque-afiliado') closeSaqueAfiliado();
  });

  document.getElementById('saq-afil-confirmar').addEventListener('click', async () => {
    const v   = parseFloat(document.getElementById('saq-afil-valor').value);
    const pix = document.getElementById('saq-afil-pix').value.trim();
    if (!v || v < 1) { showToast('Saque mínimo: R$ 1,00', 'warning'); return; }
    if (v > currentSaldoAfil) { showToast('Saldo de comissão insuficiente.', 'error'); return; }
    const btn = document.getElementById('saq-afil-confirmar');
    btn.disabled = true; btn.textContent = 'Solicitando...';
    try {
      const data = await API.saqueAfiliado(v, pix || undefined);
      showToast('Saque de comissão solicitado! Processado em até 24h.', 'success');
      closeModal('modal-saque-afiliado');
      closeModal('modal-indicacao');
      currentSaldoAfil = parseFloat(data.saldo_afiliado_novo) || Math.max(0, currentSaldoAfil - v);
      document.getElementById('ind-saldo-afil').textContent = formatMoney(currentSaldoAfil);
      _atualizarBadgeAfil(currentSaldoAfil);
    } catch (err) { showToast(err.message, 'error'); }
    finally { btn.disabled = false; btn.textContent = 'Solicitar Saque de Comissão'; }
  });

  // ── Indicação ────────────────────────────────────────────────────────────
  // ── Tab switching para modal indicação ──
  let _indTabLoaded = { rede: false, historico: false };

  function _initIndTabs() {
    document.querySelectorAll('.ind-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.ind-tab').forEach(b => {
          b.classList.remove('ind-tab-active');
          b.style.background = 'transparent';
          b.style.color = '#9980aa';
        });
        btn.classList.add('ind-tab-active');
        btn.style.background = 'linear-gradient(135deg,#7c3aed,#a855f7)';
        btn.style.color = '#fff';

        const tab = btn.dataset.tab;
        ['resumo', 'rede', 'historico'].forEach(t => {
          const el = document.getElementById('ind-tab-' + t);
          if (el) el.style.display = t === tab ? '' : 'none';
        });

        if (tab === 'rede' && !_indTabLoaded.rede) loadIndicacaoRede();
        if (tab === 'historico' && !_indTabLoaded.historico) loadIndicacaoRede();
      });
    });
    // Estilizar tab ativa inicialmente
    const activeTab = document.querySelector('.ind-tab-active');
    if (activeTab) { activeTab.style.background = 'linear-gradient(135deg,#7c3aed,#a855f7)'; activeTab.style.color = '#fff'; }
    document.querySelectorAll('.ind-tab:not(.ind-tab-active)').forEach(b => { b.style.background = 'transparent'; b.style.color = '#9980aa'; });
  }

  async function loadIndicacao() {
    openModal('modal-indicacao');
    _indTabLoaded = { rede: false, historico: false };
    _initIndTabs();
    // Reset para tab resumo
    document.querySelectorAll('.ind-tab').forEach(b => {
      b.classList.remove('ind-tab-active');
      b.style.background = 'transparent'; b.style.color = '#9980aa';
    });
    const firstTab = document.querySelector('.ind-tab[data-tab="resumo"]');
    if (firstTab) { firstTab.classList.add('ind-tab-active'); firstTab.style.background = 'linear-gradient(135deg,#7c3aed,#a855f7)'; firstTab.style.color = '#fff'; }
    ['resumo','rede','historico'].forEach(t => {
      const el = document.getElementById('ind-tab-' + t);
      if (el) el.style.display = t === 'resumo' ? '' : 'none';
    });

    try {
      const data = await API.indicacaoInfo();
      const percN1 = data.comissao_nivel1_perc ?? 10;
      const percN2 = data.comissao_nivel2_perc ?? 3;
      document.getElementById('ind-comissao-perc').textContent = percN1 + '%';
      const n2El = document.getElementById('ind-comissao-n2');
      if (n2El) n2El.textContent = percN2 + '%';

      // Afiliado inativo
      if (data.afiliado_ativo === false) {
        const tabsEl = document.getElementById('ind-tabs');
        const resumoEl = document.getElementById('ind-tab-resumo');
        if (tabsEl) tabsEl.style.display = 'none';
        if (resumoEl) resumoEl.innerHTML = `
          <div style="text-align:center;padding:32px 16px;">
            <div style="font-size:48px;margin-bottom:16px">🔒</div>
            <h3 style="color:#e9d5ff;font-size:18px;margin-bottom:12px">Programa de Afiliados</h3>
            <p style="color:rgba(255,255,255,.6);font-size:14px;margin-bottom:20px;line-height:1.6">
              Para ativar, faca um deposito de pelo menos <strong style="color:#c084fc">R$ 20,00</strong>.<br>
              Apos o deposito, voce ganha:
            </p>
            <div style="display:flex;gap:12px;justify-content:center;margin-bottom:20px;flex-wrap:wrap">
              <div style="background:rgba(168,85,247,.12);border:1px solid rgba(168,85,247,.3);border-radius:10px;padding:12px 16px;flex:1;min-width:120px">
                <div style="font-size:24px;font-weight:800;color:#c084fc">${percN1}%</div>
                <div style="font-size:11px;color:#9d74c5">Nível 1</div>
              </div>
              <div style="background:rgba(168,85,247,.08);border:1px solid rgba(168,85,247,.2);border-radius:10px;padding:12px 16px;flex:1;min-width:120px">
                <div style="font-size:24px;font-weight:800;color:#a78bfa">${percN2}%</div>
                <div style="font-size:11px;color:#9d74c5">Nível 2</div>
              </div>
              <div style="background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.25);border-radius:10px;padding:12px 16px;flex:1;min-width:120px">
                <div style="font-size:24px;font-weight:800;color:#4ade80">R$ ${data.bonus_primeiro_deposito || 2}</div>
                <div style="font-size:11px;color:#86efac">1º depósito</div>
              </div>
            </div>
            <button onclick="document.getElementById('close-indicacao').click();document.getElementById('btn-depositar').click();" style="background:linear-gradient(135deg,#a855f7,#7c3aed);color:#fff;border:none;border-radius:10px;padding:12px 24px;font-size:14px;font-weight:600;cursor:pointer;width:100%">DEPOSITAR R$ 20,00</button>
          </div>`;
        return;
      }

      // Afiliado ativo — preencher dados
      const tabsEl = document.getElementById('ind-tabs');
      if (tabsEl) tabsEl.style.display = '';

      document.getElementById('ind-link').textContent = data.link || '';
      document.getElementById('ind-total').textContent = data.total_indicados || 0;
      document.getElementById('ind-total-n2').textContent = data.total_indicados_n2 || 0;
      document.getElementById('ind-bonus').textContent = data.total_com_deposito || 0;
      currentSaldoAfil = parseFloat(data.saldo_afiliado || 0);
      document.getElementById('ind-saldo-afil').textContent = formatMoney(currentSaldoAfil);
      document.getElementById('ind-total-comissao').textContent = formatMoney(data.total_comissao || 0);
      _atualizarBadgeAfil(currentSaldoAfil);

      if (data.indicados_recentes?.length) {
        document.getElementById('ind-lista').innerHTML = `
          <div style="font-size:12px;color:#9980aa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">Indicados recentes</div>
          <div class="pnl-tx-list">${data.indicados_recentes.map(i => `
            <div class="pnl-tx-item" style="padding:10px 0">
              <div class="pnl-tx-ico pnl-tx-ico-bonus">👤</div>
              <div class="pnl-tx-body">
                <div class="pnl-tx-desc">${i.nome}</div>
                <div class="pnl-tx-date">${formatDate(i.data_cadastro)}${i.total_comissao_indicado > 0 ? ' · R$ ' + i.total_comissao_indicado.toFixed(2) : ''}</div>
              </div>
              <span class="pnl-badge ${i.has_deposited ? 'pnl-badge-green' : 'pnl-badge-orange'}">
                ${i.has_deposited ? 'Depositou' : 'Aguardando'}
              </span>
            </div>`).join('')}</div>`;
      } else {
        document.getElementById('ind-lista').innerHTML = '<div style="text-align:center;color:#9980aa;padding:16px;font-size:13px">Nenhum indicado ainda. Compartilhe seu link!</div>';
      }
    } catch {}
  }

  async function loadIndicacaoRede() {
    try {
      const data = await API.indicacaoRede();
      _indTabLoaded.rede = true;
      _indTabLoaded.historico = true;

      // ── Aba Rede ──
      const redeEl = document.getElementById('ind-rede-content');
      const redeLoad = document.getElementById('ind-rede-loading');
      if (redeLoad) redeLoad.style.display = 'none';

      let redeHTML = '';

      // Resumo da rede
      redeHTML += `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
          <div style="background:rgba(168,85,247,.1);border:1px solid rgba(168,85,247,.2);border-radius:10px;padding:14px;text-align:center">
            <div style="font-size:20px;font-weight:700;color:#c084fc">${formatMoney(data.total_nivel1)}</div>
            <div style="font-size:11px;color:#9d74c5;margin-top:4px">Comissão Nível 1 (${data.config.nivel1_perc}%)</div>
          </div>
          <div style="background:rgba(168,85,247,.06);border:1px solid rgba(168,85,247,.15);border-radius:10px;padding:14px;text-align:center">
            <div style="font-size:20px;font-weight:700;color:#a78bfa">${formatMoney(data.total_nivel2)}</div>
            <div style="font-size:11px;color:#9d74c5;margin-top:4px">Comissão Nível 2 (${data.config.nivel2_perc}%)</div>
          </div>
        </div>`;

      // Nível 1
      if (data.nivel1.length) {
        redeHTML += '<div style="font-size:12px;color:#c084fc;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;font-weight:600">Nível 1 — Indicados diretos</div>';
        redeHTML += '<div class="pnl-tx-list" style="margin-bottom:16px">';
        for (const u of data.nivel1) {
          redeHTML += `
            <div class="pnl-tx-item" style="padding:10px 0">
              <div class="pnl-tx-ico" style="background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:14px;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center">1</div>
              <div class="pnl-tx-body" style="flex:1">
                <div class="pnl-tx-desc">${u.nome}${u.sub_indicados > 0 ? ' <span style="color:#9d74c5;font-size:11px">(+' + u.sub_indicados + ' sub)</span>' : ''}</div>
                <div class="pnl-tx-date">${formatDate(u.data_cadastro)} · Comissão: R$ ${u.comissao_gerada.toFixed(2)}</div>
              </div>
              <span class="pnl-badge ${u.has_deposited ? 'pnl-badge-green' : 'pnl-badge-orange'}" style="font-size:11px">
                ${u.has_deposited ? 'Ativo' : 'Pendente'}
              </span>
            </div>`;
        }
        redeHTML += '</div>';
      }

      // Nível 2
      if (data.nivel2.length) {
        redeHTML += '<div style="font-size:12px;color:#a78bfa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;font-weight:600">Nível 2 — Sub-indicados</div>';
        redeHTML += '<div class="pnl-tx-list" style="margin-bottom:16px">';
        for (const u of data.nivel2) {
          redeHTML += `
            <div class="pnl-tx-item" style="padding:10px 0">
              <div class="pnl-tx-ico" style="background:linear-gradient(135deg,#6d28d9,#8b5cf6);color:#fff;font-size:14px;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center">2</div>
              <div class="pnl-tx-body" style="flex:1">
                <div class="pnl-tx-desc">${u.nome} <span style="color:#9d74c5;font-size:11px">via ${u.via_nome}</span></div>
                <div class="pnl-tx-date">${formatDate(u.data_cadastro)} · Comissão: R$ ${u.comissao_gerada.toFixed(2)}</div>
              </div>
              <span class="pnl-badge ${u.has_deposited ? 'pnl-badge-green' : 'pnl-badge-orange'}" style="font-size:11px">
                ${u.has_deposited ? 'Ativo' : 'Pendente'}
              </span>
            </div>`;
        }
        redeHTML += '</div>';
      }

      if (!data.nivel1.length && !data.nivel2.length) {
        redeHTML += '<div style="text-align:center;color:#9980aa;padding:32px 16px;font-size:13px">Sua rede ainda está vazia.<br>Compartilhe seu link para começar a ganhar!</div>';
      }

      if (redeEl) redeEl.innerHTML = redeHTML;

      // ── Aba Histórico ──
      const histEl = document.getElementById('ind-hist-content');
      const histLoad = document.getElementById('ind-hist-loading');
      if (histLoad) histLoad.style.display = 'none';

      if (data.historico?.length) {
        let histHTML = '<div class="pnl-tx-list">';
        for (const h of data.historico) {
          histHTML += `
            <div class="pnl-tx-item" style="padding:10px 0">
              <div class="pnl-tx-ico" style="background:${h.nivel === 1 ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : 'linear-gradient(135deg,#6d28d9,#8b5cf6)'};color:#fff;font-size:12px;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center">N${h.nivel}</div>
              <div class="pnl-tx-body" style="flex:1">
                <div class="pnl-tx-desc" style="font-size:13px">${h.descricao}</div>
                <div class="pnl-tx-date">${formatDate(h.data)}</div>
              </div>
              <div style="color:#4ade80;font-weight:700;font-size:14px">+R$ ${h.valor.toFixed(2)}</div>
            </div>`;
        }
        histHTML += '</div>';
        if (histEl) histEl.innerHTML = histHTML;
      } else {
        if (histEl) histEl.innerHTML = '<div style="text-align:center;color:#9980aa;padding:32px 16px;font-size:13px">Nenhuma comissão recebida ainda.</div>';
      }
    } catch {
      const redeLoad = document.getElementById('ind-rede-loading');
      const histLoad = document.getElementById('ind-hist-loading');
      if (redeLoad) redeLoad.textContent = 'Erro ao carregar rede.';
      if (histLoad) histLoad.textContent = 'Erro ao carregar histórico.';
    }
  }

  // ── Dicas rotativas ──────────────────────────────────────────────────────
  (function initTips() {
    const tips = [
      'Quanto maior a meta de plataformas, maior o seu prêmio!',
      'Resgate no momento certo — esperar demais pode custar caro.',
      'Aposte com responsabilidade. Defina um limite antes de jogar.',
      'Plataformas infinitas: jogue quantas rodadas quiser sem parar.',
      'Acompanhe seu saldo em tempo real no topo da tela.',
      'Indique amigos e ganhe comissão em cada depósito deles!',
      'Quanto mais você joga, mais familiarizado com o ritmo você fica.',
      'Use os valores rápidos para agilizar suas apostas.',
      'Suas transações são 100% seguras e processadas via Pix.',
      'Cada rodada é independente — mantenha o foco e boa sorte!',
    ];
    let idx = 0;
    const el = document.getElementById('pnl-tips-text');
    if (!el) return;
    function showTip() {
      el.classList.add('fade-out');
      setTimeout(() => {
        el.textContent = tips[idx];
        idx = (idx + 1) % tips.length;
        el.classList.remove('fade-out');
      }, 400);
    }
    showTip();
    setInterval(showTip, 10000);
  })();

  // ── Cupom no depósito ─────────────────────────────────────────────────────
  window._cupomAplicado = null;

  window.toggleDepCupom = function() {
    const field  = document.getElementById('dep-cupom-field');
    const toggle = document.getElementById('dep-cupom-toggle');
    const visible = field.style.display !== 'none';
    field.style.display  = visible ? 'none' : 'block';
    toggle.style.opacity = visible ? '.6' : '1';
    if (!visible) document.getElementById('dep-cupom-input').focus();
  };

  window.aplicarCupomDep = async function() {
    const codigo = document.getElementById('dep-cupom-input').value.trim().toUpperCase();
    const stEl   = document.getElementById('dep-cupom-status');
    const btn    = document.getElementById('dep-cupom-btn');
    if (!codigo) { stEl.textContent = 'Informe o código.'; stEl.style.color = '#ef4444'; return; }

    btn.disabled = true;
    btn.textContent = '...';
    stEl.textContent = '';

    try {
      const res = await API.validarCupom(codigo);
      window._cupomAplicado = res;

      let msgHtml = '';
      if (res.tipo === 'saldo') {
        msgHtml = `✅ <strong style="color:#22c55e">+${formatMoney(res.valor)}</strong> de saldo será creditado imediatamente.`;
      } else if (res.tipo === 'bonus_deposito_valor') {
        msgHtml = `✅ Bônus de <strong style="color:#f59e0b">+${formatMoney(res.valor)}</strong> fixo será adicionado ao seu depósito.`;
      } else {
        msgHtml = `✅ Bônus de <strong style="color:#22c55e">+${res.valor.toFixed(0)}%</strong> sobre o valor do seu depósito.`;
      }
      stEl.innerHTML = msgHtml;
      stEl.style.color = '';
      btn.textContent = '✓ Aplicado';
      btn.style.background = '#16a34a';
      document.getElementById('dep-cupom-input').disabled = true;
      document.getElementById('dep-cupom-alterar-wrap').style.display = 'block';
    } catch (e) {
      window._cupomAplicado = null;
      stEl.textContent = '❌ ' + (e.message || 'Erro');
      stEl.style.color = '#ef4444';
      btn.disabled = false;
      btn.textContent = 'Aplicar';
      btn.style.background = '#2d6a4f';
      document.getElementById('dep-cupom-alterar-wrap').style.display = 'none';
    }
  };

  window.alterarCupomDep = function() {
    window._cupomAplicado = null;
    const input = document.getElementById('dep-cupom-input');
    const btn   = document.getElementById('dep-cupom-btn');
    const stEl  = document.getElementById('dep-cupom-status');
    input.disabled = false;
    input.value = '';
    btn.disabled = false;
    btn.textContent = 'Aplicar';
    btn.style.background = '#2d6a4f';
    stEl.innerHTML = '';
    document.getElementById('dep-cupom-alterar-wrap').style.display = 'none';
    input.focus();
  };

  // Hook no botão de confirmar depósito para resgatar cupom junto
  const _depConfBtn = document.getElementById('dep-confirmar');
  const _depConfOrigHandler = _depConfBtn.onclick;

  document.getElementById('dep-confirmar').addEventListener('click', async () => {
    if (window._cupomAplicado) {
      try {
        const r = await API.resgatarCupom(window._cupomAplicado.codigo);
        if (r.tipo === 'saldo') {
          showToast(`Cupom aplicado! ${formatMoney(r.valor)} adicionado ao seu saldo.`, 'success');
        } else {
          showToast(`Bônus de depósito de ${formatMoney(r.valor)} registrado!`, 'success');
        }
        window._cupomAplicado = null;
      } catch (e) {
        // Não bloqueia o depósito se o cupom falhar
        showToast('Cupom não pôde ser aplicado: ' + e.message, 'warning');
        window._cupomAplicado = null;
      }
    }
  }, true); // capture=true para rodar antes do handler de depósito

  // ── Turbo custo ──────────────────────────────────────────────────────────
  const chkTurbo = document.getElementById('chk-turbo');
  function updateTurboCusto() {
    const v = parseFloat(entradaEl.value) || 0;
    const custo = Math.round(v * 0.50 * 100) / 100;
    document.getElementById('turbo-custo').textContent = `+R$ ${custo.toFixed(2).replace('.', ',')}`;
  }
  entradaEl.addEventListener('input', updateTurboCusto);
  chkTurbo.addEventListener('change', updateTurboCusto);

  // ── Comprar Vidas ───────────────────────────────────────────────────────
  let _vidasCount = 0;
  document.getElementById('btn-comprar-vidas').addEventListener('click', async () => {
    try {
      const data = await API.comprarVidas();
      _vidasCount = data.vidas;
      document.getElementById('vidas-count').textContent = _vidasCount;
      showToast(`+3 vidas! Total: ${_vidasCount}`, 'success');
      loadDashboard();
    } catch (err) { showToast(err.message, 'error'); }
  });

  // ── Ranking ─────────────────────────────────────────────────────────────
  document.getElementById('close-ranking').addEventListener('click', () => closeModal('modal-ranking'));
  async function loadRanking() {
    openModal('modal-ranking');
    try {
      const data = await API.ranking();
      const lista = document.getElementById('ranking-lista');
      if (!data.ranking.length) { lista.innerHTML = '<div style="text-align:center;color:rgba(255,255,255,.5);padding:20px">Nenhum jogador esta semana.</div>'; return; }
      const medals = ['🥇','🥈','🥉'];
      lista.innerHTML = `
        <div style="font-size:11px;color:rgba(255,255,255,.4);margin-bottom:8px">Top plataformas passadas na semana. Premios creditados automaticamente.</div>
        ${data.ranking.map((r, i) => `
          <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06)">
            <div style="width:28px;text-align:center;font-size:${i<3?'18px':'13px'};font-weight:800;color:${i<3?'#fbbf24':'rgba(255,255,255,.4)'}">${medals[i] || (i+1)}</div>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:600;color:#fff">${r.nome}</div>
              <div style="font-size:11px;color:rgba(255,255,255,.4)">${r.plataformas} plats · ${r.partidas} partidas</div>
            </div>
            ${data.premios[i] ? `<div style="font-size:12px;font-weight:800;color:#4ade80">R$ ${data.premios[i].toFixed(2)}</div>` : ''}
          </div>`).join('')}`;
    } catch { document.getElementById('ranking-lista').innerHTML = '<div class="pnl-loading">Erro ao carregar ranking.</div>'; }
  }

  // ── Presente ────────────────────────────────────────────────────────────
  document.getElementById('close-presente').addEventListener('click', () => closeModal('modal-presente'));
  let _presenteValor = 0;
  function loadPresente() {
    openModal('modal-presente');
    const row = document.getElementById('presente-valores');
    row.innerHTML = [5, 10, 20].map(v => `<button class="pnl-quick presente-val-btn" data-pv="${v}" style="flex:1">R$${v}</button>`).join('');
    row.querySelectorAll('.presente-val-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        row.querySelectorAll('.presente-val-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        _presenteValor = parseInt(btn.dataset.pv);
        document.getElementById('btn-enviar-presente').disabled = false;
      });
    });
  }
  document.getElementById('btn-enviar-presente').addEventListener('click', async () => {
    const tel = document.getElementById('presente-tel').value;
    if (!tel || tel.replace(/\D/g, '').length < 10) { showToast('Informe um telefone valido.', 'warning'); return; }
    if (!_presenteValor) { showToast('Selecione um valor.', 'warning'); return; }
    try {
      const data = await API.enviarPresente(_presenteValor, tel);
      showToast(`Presente de R$${_presenteValor} enviado para ${data.destino_nome}!`, 'success');
      closeModal('modal-presente');
      loadDashboard();
    } catch (err) { showToast(err.message, 'error'); }
  });

  // ── Missões Diárias & Upsells ────────────────────────────────────────────
  async function loadMissoes() {
    try {
      const data = await API.upsellInfo();
      const card = document.getElementById('missoes-card');
      const lista = document.getElementById('missoes-lista');
      const items = [];

      // Meta diária
      if (data.meta_diaria) {
        const md = data.meta_diaria;
        const progresso = Math.min(md.partidas_hoje, md.partidas_necessarias);
        const pct = Math.round((progresso / md.partidas_necessarias) * 100);
        items.push(`
          <div style="background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.2);border-radius:10px;padding:12px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <span style="font-size:13px;font-weight:600;color:#86efac">🎮 Meta Diaria: Jogue ${md.partidas_necessarias} partidas</span>
              <span style="font-size:12px;color:rgba(255,255,255,.5)">${progresso}/${md.partidas_necessarias}</span>
            </div>
            <div style="background:rgba(0,0,0,.3);border-radius:6px;height:6px;overflow:hidden;margin-bottom:8px">
              <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#22c55e,#4ade80);border-radius:6px;transition:width .3s"></div>
            </div>
            ${md.completa && !md.resgatada
              ? `<button onclick="(async()=>{try{const r=await API.resgatarMetaDiaria();showToast('R$ ${md.bonus.toFixed(2)} creditados!','success');loadMissoes();loadDashboard()}catch(e){showToast(e.message,'error')}})()" style="background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;border:none;border-radius:8px;padding:8px 16px;font-size:12px;font-weight:700;cursor:pointer;width:100%">RESGATAR R$ ${md.bonus.toFixed(2)}</button>`
              : md.resgatada
                ? `<div style="text-align:center;font-size:12px;color:#4ade80">✅ Resgatado hoje!</div>`
                : `<div style="text-align:center;font-size:11px;color:rgba(255,255,255,.4)">Jogue mais ${md.partidas_necessarias - progresso} partida${md.partidas_necessarias - progresso !== 1 ? 's' : ''} para ganhar R$ ${md.bonus.toFixed(2)}</div>`
            }
          </div>`);
      }

      // Streak
      if (data.streak) {
        data.streak.bonuses.forEach((s, i) => {
          items.push(`
            <div style="background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.2);border-radius:10px;padding:12px;display:flex;align-items:center;gap:12px">
              <div style="font-size:24px">🔥</div>
              <div style="flex:1">
                <div style="font-size:13px;font-weight:600;color:#fde68a">${s.partidas} partidas = R$ ${s.bonus.toFixed(2)}</div>
                <div style="font-size:11px;color:rgba(255,255,255,.4)">${data.streak.partidas_hoje}/${s.partidas} hoje</div>
              </div>
              ${s.atingida && !s.resgatada
                ? `<button onclick="(async()=>{try{const r=await API.resgatarStreak(${i});showToast('R$ ${s.bonus.toFixed(2)} creditados!','success');loadMissoes();loadDashboard()}catch(e){showToast(e.message,'error')}})()" style="background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;border:none;border-radius:8px;padding:6px 14px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap">RESGATAR</button>`
                : s.resgatada
                  ? `<span style="font-size:11px;color:#fbbf24">✅</span>`
                  : `<span style="font-size:11px;color:rgba(255,255,255,.3)">🔒</span>`
              }
            </div>`);
        });
      }

      // Cashback semanal
      if (data.cashback && data.cashback.valor > 0 && !data.cashback.ja_resgatou) {
        items.push(`
          <div style="background:rgba(168,85,247,.08);border:1px solid rgba(168,85,247,.2);border-radius:10px;padding:12px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <span style="font-size:13px;font-weight:600;color:#e9d5ff">💜 Cashback Semanal</span>
              <span style="font-size:14px;font-weight:800;color:#c084fc">R$ ${data.cashback.valor.toFixed(2)}</span>
            </div>
            <div style="font-size:11px;color:rgba(255,255,255,.4);margin-bottom:8px">5% das suas perdas liquidas da semana (R$ ${data.cashback.perda_liquida.toFixed(2)})</div>
            <button onclick="(async()=>{try{const r=await API.resgatarCashback();showToast('Cashback creditado!','success');loadMissoes();loadDashboard()}catch(e){showToast(e.message,'error')}})()" style="background:linear-gradient(135deg,#a855f7,#7c3aed);color:#fff;border:none;border-radius:8px;padding:8px 16px;font-size:12px;font-weight:700;cursor:pointer;width:100%">RESGATAR CASHBACK</button>
          </div>`);
      }

      // Ranking e Presente (links)
      items.push(`
        <div style="display:flex;gap:8px">
          <button onclick="loadRanking()" style="flex:1;background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.2);border-radius:10px;padding:10px;font-size:12px;font-weight:700;color:#fde68a;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px">🏅 Ranking</button>
          <button onclick="loadPresente()" style="flex:1;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.2);border-radius:10px;padding:10px;font-size:12px;font-weight:700;color:#86efac;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px">🎁 Presente</button>
        </div>`);

      // Atualizar vidas count
      if (data.pacote_vidas) {
        _vidasCount = data.pacote_vidas.vidas_atuais;
        document.getElementById('vidas-count').textContent = _vidasCount;
      }

      if (items.length > 0) {
        card.style.display = '';
        lista.innerHTML = items.join('');
      } else {
        card.style.display = 'none';
      }
    } catch {}
  }

  // ── Boot ─────────────────────────────────────────────────────────────────
  updateMetaPreview();
  loadDashboard();
  loadGameConfigs();
  loadMissoes();

  // Revanche: se veio da tela de derrota com flag
  const revFlag = sessionStorage.getItem('_revanche');
  if (revFlag) {
    sessionStorage.removeItem('_revanche');
    const revValor = sessionStorage.getItem('_revanche_valor');
    sessionStorage.removeItem('_revanche_valor');
    if (revValor) {
      entradaEl.value = revValor;
      entradaEl.dispatchEvent(new Event('input'));
      _pendingRevanche = true;
      showToast('Revanche ativada! +20% de bonus na entrada.', 'success');
    }
  }

  // ── Notificações de saque aleatórias ─────────────────────────────────────
  iniciarNotificacoesSaque();
}

// ─────────────────────────────────────────────────────────────────────────────
// Notificações de saque — apenas na tower.bdsapi.online
// ─────────────────────────────────────────────────────────────────────────────
(function injetarEstilosNotifSaque() {
  if (document.getElementById('notif-saque-styles')) return;
  const s = document.createElement('style');
  s.id = 'notif-saque-styles';
  s.textContent = `
    #notif-saque-container {
      position: fixed;
      bottom: 80px;
      left: 16px;
      z-index: 199;
      display: flex;
      flex-direction: column-reverse;
      gap: 10px;
      pointer-events: none;
    }
    .notif-saque {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(18, 6, 36, 0.96);
      border: 1px solid rgba(0, 201, 122, 0.35);
      border-left: 3px solid #00C97A;
      border-radius: 14px;
      padding: 11px 16px 11px 13px;
      box-shadow: 0 8px 28px rgba(0,0,0,0.45), 0 0 12px rgba(0,201,122,0.10);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      min-width: 230px;
      max-width: 290px;
      animation: notifEntrar 0.45s cubic-bezier(.22,1,.36,1) both;
      pointer-events: auto;
    }
    .notif-saque.notif-saindo {
      animation: notifSair 0.4s ease forwards;
    }
    .notif-saque-icone {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, #00C97A, #00e68a);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 0 10px rgba(0,201,122,0.4);
    }
    .notif-saque-icone svg {
      width: 18px;
      height: 18px;
    }
    .notif-saque-texto {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
    }
    .notif-saque-nome {
      font-size: 13px;
      font-weight: 700;
      color: #fff;
      line-height: 1.2;
    }
    .notif-saque-acao {
      font-size: 11.5px;
      color: rgba(255,255,255,0.55);
      font-weight: 400;
    }
    .notif-saque-valor {
      font-size: 14px;
      font-weight: 800;
      color: #00C97A;
      white-space: nowrap;
      flex-shrink: 0;
    }
    @keyframes notifEntrar {
      from { opacity: 0; transform: translateX(-40px) scale(0.92); }
      to   { opacity: 1; transform: translateX(0)    scale(1); }
    }
    @keyframes notifSair {
      from { opacity: 1; transform: translateX(0)    scale(1); }
      to   { opacity: 0; transform: translateX(-30px) scale(0.92); }
    }
  `;
  document.head.appendChild(s);
})();

function iniciarNotificacoesSaque() {
  const NOMES = [
    'Lucas','Gabriela','Rafael','Isabela','Matheus','Fernanda','Rodrigo','Camila',
    'Felipe','Juliana','Thiago','Amanda','Leonardo','Larissa','Bruno','Mariana',
    'André','Beatriz','Gustavo','Natália','Diego','Priscila','Marcelo','Letícia',
    'Pedro','Vanessa','Ricardo','Patrícia','Eduardo','Renata','Vinícius','Aline',
    'Caio','Carolina','Fábio','Michele','Leandro','Simone','Henrique','Bruna',
    'Carlos','Daniela','João','Luana','Alexandre','Tatiana','Igor','Sabrina',
    'Wesley','Jéssica','Anderson','Raquel','Willian','Karina','Douglas','Viviane',
  ];

  const VALORES = [50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,299];

  let container = document.getElementById('notif-saque-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notif-saque-container';
    document.body.appendChild(container);
  }

  function formatValor(v) {
    return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }

  function mostrarNotif() {
    // Só exibe se o painel estiver ativo
    const paginaPainel = document.getElementById('page-painel');
    if (!paginaPainel || !paginaPainel.classList.contains('active')) return;

    const nome  = NOMES[Math.floor(Math.random() * NOMES.length)];
    const valor = VALORES[Math.floor(Math.random() * VALORES.length)];

    const el = document.createElement('div');
    el.className = 'notif-saque';
    el.innerHTML = `
      <div class="notif-saque-icone">
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <div class="notif-saque-texto">
        <span class="notif-saque-nome">${nome}</span>
        <span class="notif-saque-acao">acabou de sacar</span>
      </div>
      <span class="notif-saque-valor">${formatValor(valor)}</span>
    `;
    container.appendChild(el);

    // Remove após 5s com animação de saída
    setTimeout(() => {
      el.classList.add('notif-saindo');
      el.addEventListener('animationend', () => el.remove(), { once: true });
    }, 4500);

    // Limita a 3 notificações simultâneas
    const todas = container.querySelectorAll('.notif-saque');
    if (todas.length > 3) todas[0].remove();
  }

  // Primeira notificação após 4s, depois a cada 10s
  function proximoIntervalo() { return 8000 + Math.floor(Math.random() * 7001); }

  let timer = setTimeout(function loop() {
    mostrarNotif();
    timer = setTimeout(loop, proximoIntervalo());
  }, proximoIntervalo());

  // Para o timer ao navegar para outra página
  function pararSeNecessario() {
    const paginaPainel = document.getElementById('page-painel');
    if (!paginaPainel || !paginaPainel.classList.contains('active')) {
      clearTimeout(timer);
      window.removeEventListener('hashchange', pararSeNecessario);
    }
  }
  window.addEventListener('hashchange', pararSeNecessario);
}
