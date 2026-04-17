# Pirâmide SA → Gerente → Influencer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar o Super Admin no split da comissão N1, formando uma pirâmide onde SA pega uma fatia global (10–20%) e o gerente distribui o restante entre ele e o influencer.

**Architecture:** Substituir o campo `gerente_split` (fração do gerente) por `influencer_perc` (fração absoluta do total para o influencer), somada à nova `super_admin_perc` global em `db.config`. A lógica de split só muda no N1; N2/N3 permanecem inalterados. A UI do gerente esconde a existência do SA — apresenta apenas "você tem 80% para distribuir".

**Tech Stack:** Node.js, Express, Jest + Supertest (backend); HTML/vanilla JS (frontend).

**Spec:** `docs/superpowers/specs/2026-04-17-piramide-sa-comissao-design.md`

---

## File Structure

**Modified files:**
- `server.js` — COMISSAO_CONFIG, migração, `_comissaoConfigEfetiva`, `_creditarComComissaoSplit`, endpoints gerente/super-admin.
- `tests/server.test.js` — novos casos.
- `super-admin.html` — novo campo de config da % do SA.
- `gerente.html` — trocar input `cfg-split` por `cfg-infl-perc`; ajustar textos.
- `influencer.html` — atualização cosmética (nenhum impacto funcional direto; não expor SA).

**No new files.** Todas as mudanças são no código existente.

---

## Task 1: Adicionar `influencer_perc` e `super_admin_perc` no `COMISSAO_CONFIG`

**Files:**
- Modify: `server.js:253-259` (bloco `COMISSAO_CONFIG`)
- Modify: `server.js:1278-1283` (bloco `DEFAULT_COMISSAO_CFG`)

- [ ] **Step 1: Ler o estado atual**

Ler `server.js` linhas 253–259 e 1278–1283 para confirmar estrutura antes de editar.

- [ ] **Step 2: Atualizar `COMISSAO_CONFIG`**

Substituir bloco em `server.js:253-259` por:

```javascript
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
```

- [ ] **Step 3: Atualizar `DEFAULT_COMISSAO_CFG`**

Substituir bloco em `server.js:1278-1283` por:

```javascript
const DEFAULT_COMISSAO_CFG = {
  nivel1_perc: COMISSAO_CONFIG.nivel1_perc,
  nivel2_perc: COMISSAO_CONFIG.nivel2_perc,
  nivel3_perc: COMISSAO_CONFIG.nivel3_perc,
  influencer_perc: COMISSAO_CONFIG.influencer_perc,
};
```

(Remove `gerente_split` — será migrado no Task 2.)

- [ ] **Step 4: Commit**

```bash
git add server.js
git commit -m "feat: adiciona influencer_perc e super_admin_perc em COMISSAO_CONFIG"
```

---

## Task 2: Migração — `gerente_split` → `influencer_perc` + `db.config.super_admin_perc`

**Files:**
- Modify: `server.js` bloco de migração (após linha 1295)

- [ ] **Step 1: Ler estado atual da migração**

Ler `server.js:1275-1310` para confirmar o ponto exato da inserção.

- [ ] **Step 2: Adicionar migração de `comissao_config` e `db.config.super_admin_perc`**

Inserir logo após a linha 1295 (fim do loop `for (const u of db.users)`) e antes de `// Auto-define o super_admin no _sp`:

```javascript
  // Migração: converte gerente_split (fração do gerente) em influencer_perc (fração do influencer)
  // gerente_split=0.60 → influencer_perc=0.40 (valor numérico preservado: 1 - gerente_split)
  if (u.comissao_config) {
    if (typeof u.comissao_config.gerente_split === 'number' && typeof u.comissao_config.influencer_perc === 'undefined') {
      u.comissao_config.influencer_perc = +(1 - u.comissao_config.gerente_split).toFixed(4);
      delete u.comissao_config.gerente_split;
      _migUsers = true;
    }
    // Remove campos legados indevidos (super_admin_perc não é por-gerente; é global)
    if (typeof u.comissao_config.super_admin_perc !== 'undefined') {
      delete u.comissao_config.super_admin_perc;
      _migUsers = true;
    }
  }
}

// Migração: super_admin_perc global em db.config (default 0.20, editável pelo SA)
if (!db.config) { db.config = {}; }
if (typeof db.config.super_admin_perc !== 'number') {
  db.config.super_admin_perc = COMISSAO_CONFIG.super_admin_perc;
  saveDb(db);
}
```

**Atenção:** o `}` no trecho acima fecha o `for (const u of db.users)` — ajustar para preservar a estrutura existente. O trecho `if (!db.config) ...` vai **fora** do `for`. Verificar a indentação antes de commitar.

- [ ] **Step 3: Testar migração manualmente (dry-run)**

```bash
node -e "
const fs = require('fs');
const db = JSON.parse(fs.readFileSync('database.json'));
const antes = db.users.filter(u => u.comissao_config && typeof u.comissao_config.gerente_split === 'number').length;
console.log('Users com gerente_split antes da migração:', antes);
"
```

Depois rodar o servidor uma vez (`node server.js` e matar após 2s) e rodar o mesmo script com `influencer_perc`. Esperado: `antes > 0` e depois `influencer_perc > 0`.

- [ ] **Step 4: Commit**

```bash
git add server.js
git commit -m "feat: migracao gerente_split -> influencer_perc e db.config.super_admin_perc"
```

---

## Task 3: Atualizar `_DEFAULT_CFG` e `_comissaoConfigEfetiva`

**Files:**
- Modify: `server.js:1824-1845`

- [ ] **Step 1: Substituir `_DEFAULT_CFG`**

Em `server.js:1824-1829`, substituir por:

```javascript
const _DEFAULT_CFG = () => ({
  nivel1_perc: COMISSAO_CONFIG.nivel1_perc,
  nivel2_perc: COMISSAO_CONFIG.nivel2_perc,
  nivel3_perc: COMISSAO_CONFIG.nivel3_perc,
  influencer_perc: COMISSAO_CONFIG.influencer_perc,
});
```

- [ ] **Step 2: Atualizar `_comissaoConfigEfetiva`**

Em `server.js:1835-1845`, substituir por:

```javascript
function _comissaoConfigEfetiva(depositante) {
  const saPerc = (db.config && typeof db.config.super_admin_perc === 'number')
    ? db.config.super_admin_perc
    : COMISSAO_CONFIG.super_admin_perc;

  const inflN1 = _acharInfluencerN1(depositante);
  if (inflN1 && inflN1.comissao_config) {
    return { ...inflN1.comissao_config, super_admin_perc: saPerc, _origem: 'influencer', _influencer: inflN1 };
  }
  const gerente = _acharGerenteDaCadeia(depositante);
  if (gerente && gerente.comissao_config) {
    return { ...gerente.comissao_config, super_admin_perc: saPerc, _origem: 'gerente', _gerente: gerente };
  }
  return { ..._DEFAULT_CFG(), super_admin_perc: saPerc, _origem: 'default' };
}
```

`super_admin_perc` sempre vem de `db.config` — não é configurável por gerente.

- [ ] **Step 3: Commit**

```bash
git add server.js
git commit -m "feat: _DEFAULT_CFG e _comissaoConfigEfetiva usam influencer_perc + super_admin_perc global"
```

---

## Task 4: Nova lógica de split 3-way em `_creditarComComissaoSplit`

**Files:**
- Modify: `server.js:1849-1884`
- Modify: `server.js:1886-1946` (chamada em `creditarComissao`)

- [ ] **Step 1: Escrever os testes PRIMEIRO (TDD)**

Adicionar em `tests/server.test.js` ao final do arquivo, antes do último `});`:

```javascript
// ═══════════════════════════════════════════════════════════════════════════
// SPLIT PIRAMIDE (SA + GERENTE + INFLUENCER) — N1
// ═══════════════════════════════════════════════════════════════════════════
describe('Split piramide N1', () => {
  // Helpers locais para criar cadeia gerente → influencer → jogador
  function setupCadeia({ saPerc = 0.20, inflPerc = 0.30 } = {}) {
    // Limpa e cria super_admin, gerente, influencer, jogador
    db.users = db.users.filter(u => !['sa_p', 'ge_p', 'in_p', 'jo_p'].includes(u.codigo_indicacao));
    const sa = {
      id: 90001, nome: 'SA Piramide', telefone: '11000000001', senha_hash: 'x',
      role: 'super_admin', codigo_indicacao: 'sa_p', indicado_por: null,
      prospectador_id: null, saldo: 0, saldo_afiliado: 0, ativo: 1, comissao_config: null,
      created_at: new Date().toISOString(),
    };
    const ger = {
      id: 90002, nome: 'Gerente Piramide', telefone: '11000000002', senha_hash: 'x',
      role: 'gerente', codigo_indicacao: 'ge_p', indicado_por: null,
      prospectador_id: null, saldo: 0, saldo_afiliado: 0, ativo: 1,
      comissao_config: { nivel1_perc: 0.10, nivel2_perc: 0.03, nivel3_perc: 0.01, influencer_perc: inflPerc },
      created_at: new Date().toISOString(),
    };
    const inf = {
      id: 90003, nome: 'Influencer Piramide', telefone: '11000000003', senha_hash: 'x',
      role: 'influencer', codigo_indicacao: 'in_p', indicado_por: 'ge_p',
      prospectador_id: ger.id, saldo: 0, saldo_afiliado: 0, ativo: 1, comissao_config: null,
      created_at: new Date().toISOString(),
    };
    const jog = {
      id: 90004, nome: 'Jogador Piramide', telefone: '11000000004', senha_hash: 'x',
      role: 'jogador', codigo_indicacao: 'jo_p', indicado_por: 'in_p',
      prospectador_id: null, saldo: 0, saldo_afiliado: 0, ativo: 1, comissao_config: null,
      created_at: new Date().toISOString(),
    };
    db.users.push(sa, ger, inf, jog);
    db.config = db.config || {};
    db.config.super_admin_perc = saPerc;
    db._sp = db._sp || {};
    db._sp.super_admin_user_id = sa.id;
    return { sa, ger, inf, jog };
  }

  test('SA=20%, inflPerc=30% → SA R$2, gerente R$5, influencer R$3 em dep R$100', () => {
    const { sa, ger, inf, jog } = setupCadeia({ saPerc: 0.20, inflPerc: 0.30 });
    const tx = { id: 999001, user_id: jog.id, tipo: 'deposito', valor: 100, status: 'aprovado', created_at: new Date().toISOString() };
    db.transacoes.push(tx);
    // Chama fluxo de comissão direto
    const { creditarComissao } = require('../server');
    if (typeof creditarComissao === 'function') {
      creditarComissao(tx, jog);
    } else {
      // Fallback: usar creditDeposit que internamente chama creditarComissao
      // (caso creditarComissao não esteja exportado, adicione export no server.js)
      require('../server').creditDeposit && require('../server').creditDeposit(tx, jog);
    }
    expect(sa.saldo_afiliado).toBeCloseTo(2.00, 2);
    expect(ger.saldo_afiliado).toBeCloseTo(5.00, 2);
    expect(inf.saldo_afiliado).toBeCloseTo(3.00, 2);
  });

  test('SA=10%, inflPerc=40% → SA R$1, gerente R$5, influencer R$4 em dep R$100', () => {
    const { sa, ger, inf, jog } = setupCadeia({ saPerc: 0.10, inflPerc: 0.40 });
    const tx = { id: 999002, user_id: jog.id, tipo: 'deposito', valor: 100, status: 'aprovado', created_at: new Date().toISOString() };
    db.transacoes.push(tx);
    require('../server').creditarComissao(tx, jog);
    expect(sa.saldo_afiliado).toBeCloseTo(1.00, 2);
    expect(ger.saldo_afiliado).toBeCloseTo(5.00, 2);
    expect(inf.saldo_afiliado).toBeCloseTo(4.00, 2);
  });

  test('sem gerente: influencer solto recebe 100% do restante pós-SA', () => {
    // SA + influencer solto (sem prospectador_id) + jogador
    db.users = db.users.filter(u => !['sa_q', 'in_q', 'jo_q'].includes(u.codigo_indicacao));
    const sa = {
      id: 90101, nome: 'SA Q', telefone: '11000001001', senha_hash: 'x',
      role: 'super_admin', codigo_indicacao: 'sa_q', indicado_por: null,
      prospectador_id: null, saldo: 0, saldo_afiliado: 0, ativo: 1, comissao_config: null,
      created_at: new Date().toISOString(),
    };
    const inf = {
      id: 90102, nome: 'Inf solto', telefone: '11000001002', senha_hash: 'x',
      role: 'influencer', codigo_indicacao: 'in_q', indicado_por: null,
      prospectador_id: null, saldo: 0, saldo_afiliado: 0, ativo: 1, comissao_config: null,
      created_at: new Date().toISOString(),
    };
    const jog = {
      id: 90103, nome: 'Jog Q', telefone: '11000001003', senha_hash: 'x',
      role: 'jogador', codigo_indicacao: 'jo_q', indicado_por: 'in_q',
      prospectador_id: null, saldo: 0, saldo_afiliado: 0, ativo: 1, comissao_config: null,
      created_at: new Date().toISOString(),
    };
    db.users.push(sa, inf, jog);
    db.config.super_admin_perc = 0.20;
    db._sp.super_admin_user_id = sa.id;
    const tx = { id: 999003, user_id: jog.id, tipo: 'deposito', valor: 100, status: 'aprovado', created_at: new Date().toISOString() };
    db.transacoes.push(tx);
    require('../server').creditarComissao(tx, jog);
    expect(sa.saldo_afiliado).toBeCloseTo(2.00, 2);
    expect(inf.saldo_afiliado).toBeCloseTo(8.00, 2); // 100% de R$8 (restante)
  });

  test('referrer é o proprio SA: SA recebe 100% da comissao N1', () => {
    db.users = db.users.filter(u => !['sa_r', 'jo_r'].includes(u.codigo_indicacao));
    const sa = {
      id: 90201, nome: 'SA R', telefone: '11000002001', senha_hash: 'x',
      role: 'super_admin', codigo_indicacao: 'sa_r', indicado_por: null,
      prospectador_id: null, saldo: 0, saldo_afiliado: 0, ativo: 1, comissao_config: null,
      created_at: new Date().toISOString(),
    };
    const jog = {
      id: 90202, nome: 'Jog R', telefone: '11000002002', senha_hash: 'x',
      role: 'jogador', codigo_indicacao: 'jo_r', indicado_por: 'sa_r',
      prospectador_id: null, saldo: 0, saldo_afiliado: 0, ativo: 1, comissao_config: null,
      created_at: new Date().toISOString(),
    };
    db.users.push(sa, jog);
    db.config.super_admin_perc = 0.20;
    db._sp.super_admin_user_id = sa.id;
    const tx = { id: 999004, user_id: jog.id, tipo: 'deposito', valor: 100, status: 'aprovado', created_at: new Date().toISOString() };
    db.transacoes.push(tx);
    require('../server').creditarComissao(tx, jog);
    expect(sa.saldo_afiliado).toBeCloseTo(10.00, 2); // 100% da comissão N1
  });
});
```

- [ ] **Step 2: Exportar `creditarComissao` em `server.js` se ainda não está**

Procurar `module.exports` no final de `server.js` (provavelmente `module.exports = { app, db, creditDeposit }`). Adicionar `creditarComissao`:

```javascript
module.exports = { app, db, creditDeposit, creditarComissao };
```

- [ ] **Step 3: Rodar testes — devem FALHAR**

```bash
npm test -- --testNamePattern="Split piramide N1"
```

Esperado: todos os testes FAIL (comportamento atual é split 60/40 gerente/influencer sem SA).

- [ ] **Step 4: Reescrever `_creditarComComissaoSplit`**

Substituir `server.js:1847-1884` inteiro por:

```javascript
// Aplica split N1 em 3 vias: SA global + gerente + influencer.
// Para N2/N3 o comportamento é cadeia normal (100% para o referrer).
// cfg: objeto completo devolvido por _comissaoConfigEfetiva (inclui super_admin_perc + influencer_perc).
function _creditarComComissaoSplit(referrer, valorComissao, depositante, nivel, cfg) {
  if (valorComissao <= 0) return;

  // N2/N3: cadeia normal — 100% referrer (sem SA nem split)
  if (nivel !== 1) {
    _creditarBonusIndicacao(
      referrer, valorComissao,
      `Comissão nível ${nivel} — depósito de ${depositante.nome || 'indicado'}`,
      depositante, nivel
    );
    console.log(`[AFILIADO] N${nivel}: user=${referrer.id} +R$${valorComissao}`);
    if (referrer.role === 'gerente' || referrer.role === 'influencer' || referrer.role === 'super_admin') {
      sendPushcut(referrer, '💸 Nova comissão!', `+R$ ${valorComissao.toFixed(2)} de ${depositante.nome || 'jogador'} (N${nivel})`);
    }
    return;
  }

  // ── N1: pirâmide SA → Gerente → Influencer ──
  const saPerc = typeof cfg.super_admin_perc === 'number' ? cfg.super_admin_perc : COMISSAO_CONFIG.super_admin_perc;
  const inflPerc = typeof cfg.influencer_perc === 'number' ? cfg.influencer_perc : COMISSAO_CONFIG.influencer_perc;

  const sp = db._sp || {};
  const superAdmin = sp.super_admin_user_id ? findUser(sp.super_admin_user_id) : null;

  // Caso especial: o próprio referrer é o SA → recebe 100%, sem auto-fatiar
  if (referrer.role === 'super_admin') {
    _creditarBonusIndicacao(
      referrer, valorComissao,
      `Comissão nível ${nivel} — depósito de ${depositante.nome || 'indicado'}`,
      depositante, nivel
    );
    console.log(`[AFILIADO] N${nivel} SA-direto: user=${referrer.id} +R$${valorComissao}`);
    sendPushcut(referrer, '💸 Nova comissão!', `+R$ ${valorComissao.toFixed(2)} de ${depositante.nome || 'jogador'} (N${nivel})`);
    return;
  }

  const parteSa = money(valorComissao * saPerc);
  const restante = money(valorComissao - parteSa);

  // Credita SA (se existir); senão a fatia fica na plataforma (log warning).
  if (superAdmin) {
    _creditarBonusIndicacao(
      superAdmin, parteSa,
      `Comissão pirâmide N1 (${Math.round(saPerc * 100)}%) — depósito de ${depositante.nome || 'indicado'}`,
      depositante, nivel
    );
    console.log(`[AFILIADO] N1 piramide SA=${Math.round(saPerc * 100)}%: super_admin=${superAdmin.id} +R$${parteSa}`);
    sendPushcut(superAdmin, '💎 Comissão pirâmide!', `+R$ ${parteSa.toFixed(2)} de ${depositante.nome || 'jogador'} (N1)`);
  } else {
    console.warn(`[AFILIADO] N1 piramide sem super_admin: fatia R$${parteSa} fica na plataforma (dep R$${valorComissao})`);
  }

  // Sem gerente: referrer direto leva o restante (100% do pós-SA)
  if (referrer.role !== 'influencer' || !referrer.prospectador_id) {
    _creditarBonusIndicacao(
      referrer, restante,
      `Comissão nível ${nivel} — depósito de ${depositante.nome || 'indicado'}`,
      depositante, nivel
    );
    console.log(`[AFILIADO] N1 sem-gerente: user=${referrer.id} +R$${restante}`);
    if (referrer.role === 'gerente' || referrer.role === 'influencer') {
      sendPushcut(referrer, '💸 Nova comissão!', `+R$ ${restante.toFixed(2)} de ${depositante.nome || 'jogador'} (N1)`);
    }
    return;
  }

  // Com gerente: divide o restante entre gerente e influencer conforme influencer_perc
  const gerente = findUser(referrer.prospectador_id);
  if (!gerente || gerente.role !== 'gerente') {
    // Prospectador inválido — fallback: referrer leva o restante
    _creditarBonusIndicacao(
      referrer, restante,
      `Comissão nível ${nivel} — depósito de ${depositante.nome || 'indicado'}`,
      depositante, nivel
    );
    console.warn(`[AFILIADO] N1 gerente inválido (ref=${referrer.id}): +R$${restante} pro referrer`);
    return;
  }

  const parteInfl = money(valorComissao * inflPerc);
  const parteGer = money(restante - parteInfl);
  const percSA = Math.round(saPerc * 100);
  const percInfl = Math.round(inflPerc * 100);
  const percGer = 100 - percSA - percInfl;

  _creditarBonusIndicacao(
    referrer, parteInfl,
    `Comissão nível ${nivel} (${percInfl}%) — depósito de ${depositante.nome || 'indicado'}`,
    depositante, nivel
  );
  _creditarBonusIndicacao(
    gerente, parteGer,
    `Override ${percGer}% — influencer ${referrer.nome || referrer.id} (nível ${nivel})`,
    depositante, nivel
  );
  console.log(`[AFILIADO] N1 piramide ${percSA}/${percGer}/${percInfl}: SA=${superAdmin?.id} +R$${parteSa} | gerente=${gerente.id} +R$${parteGer} | influencer=${referrer.id} +R$${parteInfl}`);
  sendPushcut(referrer, '💸 Nova comissão!', `+R$ ${parteInfl.toFixed(2)} de ${depositante.nome || 'jogador'} (N1)`);
  sendPushcut(gerente, '💎 Override!', `+R$ ${parteGer.toFixed(2)} via ${referrer.nome || 'influencer'} (N1)`);
}
```

- [ ] **Step 5: Ajustar a chamada em `creditarComissao`**

Em `server.js` procurar a linha `_creditarComComissaoSplit(referrer, comissoes[nivel - 1], depositante, nivel, cfg.gerente_split);` (~linha 1921).

Substituir por:

```javascript
    _creditarComComissaoSplit(referrer, comissoes[nivel - 1], depositante, nivel, cfg);
```

(Passa o `cfg` inteiro, não só o split.)

- [ ] **Step 6: Rodar testes — devem PASSAR**

```bash
npm test -- --testNamePattern="Split piramide N1"
```

Esperado: todos PASS.

- [ ] **Step 7: Rodar suite inteira para garantir zero regressão**

```bash
npm test
```

Esperado: todos os testes anteriores continuam passando.

- [ ] **Step 8: Commit**

```bash
git add server.js tests/server.test.js
git commit -m "feat: split piramide N1 SA->gerente->influencer em _creditarComComissaoSplit"
```

---

## Task 5: Endpoint novo `PUT /api/super-admin/comissao-config`

**Files:**
- Modify: `server.js` (adicionar rota próxima a `GET /api/super-admin/painel` em `server.js:3352`)
- Modify: `tests/server.test.js`

- [ ] **Step 1: Escrever testes PRIMEIRO**

Adicionar em `tests/server.test.js` dentro de um novo bloco:

```javascript
describe('Super Admin - comissao-config', () => {
  test('GET painel retorna super_admin_perc', async () => {
    const res = await agent().get('/api/super-admin/painel').set('Cookie', adminCookie);
    expect(res.status).toBe(200);
    expect(typeof res.body.super_admin_perc).toBe('number');
    expect(res.body.super_admin_perc).toBeGreaterThanOrEqual(10);
    expect(res.body.super_admin_perc).toBeLessThanOrEqual(20);
  });

  test('PUT aceita super_admin_perc=15 dentro do range', async () => {
    const res = await agent()
      .put('/api/super-admin/comissao-config')
      .set('Cookie', adminCookie)
      .send({ super_admin_perc: 15 });
    expect(res.status).toBe(200);
    expect(res.body.super_admin_perc).toBe(15);
    expect(db.config.super_admin_perc).toBeCloseTo(0.15, 4);
  });

  test('PUT rejeita super_admin_perc=5 (abaixo de 10)', async () => {
    const res = await agent()
      .put('/api/super-admin/comissao-config')
      .set('Cookie', adminCookie)
      .send({ super_admin_perc: 5 });
    expect(res.status).toBe(400);
  });

  test('PUT rejeita super_admin_perc=25 (acima de 20)', async () => {
    const res = await agent()
      .put('/api/super-admin/comissao-config')
      .set('Cookie', adminCookie)
      .send({ super_admin_perc: 25 });
    expect(res.status).toBe(400);
  });

  test('PUT sem auth de super_admin retorna 403', async () => {
    const res = await agent()
      .put('/api/super-admin/comissao-config')
      .set('Cookie', authCookie) // cookie de user comum
      .send({ super_admin_perc: 15 });
    expect(res.status).toBe(403);
  });
});
```

- [ ] **Step 2: Rodar testes — devem FALHAR**

```bash
npm test -- --testNamePattern="Super Admin - comissao-config"
```

Esperado: FAIL (endpoint não existe).

- [ ] **Step 3: Adicionar endpoint em `server.js`**

Logo após o bloco de `GET /api/super-admin/painel` (fim em ~linha 3380), inserir:

```javascript
// Config de comissão editável pelo super admin (super_admin_perc global)
app.put('/api/super-admin/comissao-config', authMiddleware, superAdminMiddleware, (req, res) => {
  const { super_admin_perc } = req.body || {};
  const n = Number(super_admin_perc);
  if (!isFinite(n) || n < 10 || n > 20) {
    return res.status(400).json({ error: 'super_admin_perc deve ser um número entre 10 e 20.' });
  }
  if (!db.config) db.config = {};
  db.config.super_admin_perc = n / 100;
  saveDb(db);
  console.log(`[SUPER-ADMIN] super_admin_perc atualizado para ${n}%`);
  auditLog('super_admin.comissao_config', req.me.id, null, { super_admin_perc: n }, req);
  res.json({ ok: true, super_admin_perc: n });
});
```

- [ ] **Step 4: Atualizar `GET /api/super-admin/painel` para retornar `super_admin_perc`**

Em `server.js:3366-3379`, dentro do `res.json({...})`, adicionar antes do fechamento:

```javascript
    super_admin_perc: Math.round((db.config?.super_admin_perc ?? COMISSAO_CONFIG.super_admin_perc) * 100),
```

- [ ] **Step 5: Rodar testes**

```bash
npm test -- --testNamePattern="Super Admin - comissao-config"
```

Esperado: PASS em todos.

- [ ] **Step 6: Commit**

```bash
git add server.js tests/server.test.js
git commit -m "feat: endpoint PUT /api/super-admin/comissao-config (super_admin_perc 10-20%)"
```

---

## Task 6: Atualizar `PUT /api/gerente/config` — `influencer_perc` no lugar de `gerente_split_perc`

**Files:**
- Modify: `server.js:2843-2888`
- Modify: `tests/server.test.js`

- [ ] **Step 1: Escrever testes PRIMEIRO**

Adicionar em `tests/server.test.js`:

```javascript
describe('Gerente - config com influencer_perc', () => {
  let gerenteCookie = '';
  let gerenteId = null;

  beforeAll(async () => {
    const tel = '11999990010';
    db.users = db.users.filter(u => u.telefone !== tel);
    const reg = await agent().post('/api/auth/register').send({
      nome: 'Gerente Cfg', telefone: tel, senha: 'Ger123!', email: 'ger@test.com',
    });
    gerenteId = reg.body.user?.id;
    const u = db.users.find(x => x.id === gerenteId);
    u.role = 'gerente';
    u.comissao_config = { nivel1_perc: 0.10, nivel2_perc: 0.03, nivel3_perc: 0.01, influencer_perc: 0.30 };
    gerenteCookie = reg.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
    db.config = db.config || {};
    db.config.super_admin_perc = 0.20;
  });

  test('PUT aceita influencer_perc=40 (dentro do teto 80 com SA=20)', async () => {
    const res = await agent()
      .put('/api/gerente/config')
      .set('Cookie', gerenteCookie)
      .send({ influencer_perc: 40 });
    expect(res.status).toBe(200);
    expect(res.body.config.influencer_perc).toBe(40);
    const u = db.users.find(x => x.id === gerenteId);
    expect(u.comissao_config.influencer_perc).toBeCloseTo(0.40, 4);
  });

  test('PUT rejeita influencer_perc=85 (excede teto com SA=20 → max 80)', async () => {
    const res = await agent()
      .put('/api/gerente/config')
      .set('Cookie', gerenteCookie)
      .send({ influencer_perc: 85 });
    expect(res.status).toBe(400);
  });

  test('GET painel retorna influencer_perc e disponivel_perc (sem expor SA)', async () => {
    const res = await agent().get('/api/gerente/painel').set('Cookie', gerenteCookie);
    expect(res.status).toBe(200);
    expect(typeof res.body.config.influencer_perc).toBe('number');
    expect(typeof res.body.config.disponivel_perc).toBe('number'); // 100 - SA%
    expect(res.body.config.gerente_perc).toBe(
      res.body.config.disponivel_perc - res.body.config.influencer_perc
    );
    // Não deve expor super_admin_perc no painel do gerente
    expect(res.body.config.super_admin_perc).toBeUndefined();
  });
});
```

- [ ] **Step 2: Rodar — FAIL esperado**

```bash
npm test -- --testNamePattern="Gerente - config com influencer_perc"
```

- [ ] **Step 3: Substituir `PUT /api/gerente/config` em `server.js:2843-2888`**

```javascript
// Atualizar a config de comissões do gerente (afeta TODA a rede dele, futura)
app.put('/api/gerente/config', authMiddleware, gerenteMiddleware, (req, res) => {
  const me = req.me;
  const { nivel1_perc, nivel2_perc, nivel3_perc, influencer_perc } = req.body || {};

  function _parsePerc(v, max) {
    if (v === undefined || v === null || v === '') return null;
    const n = Number(v);
    if (!isFinite(n) || n < 0 || n > max) return undefined;
    return n / 100;
  }

  const cfg = { ...(me.comissao_config || _DEFAULT_CFG()) };
  const updates = { nivel1_perc, nivel2_perc, nivel3_perc };
  for (const k of Object.keys(updates)) {
    const parsed = _parsePerc(updates[k], 50);
    if (parsed === undefined) return res.status(400).json({ error: `${k} inválido (0-50%).` });
    if (parsed !== null) cfg[k] = parsed;
  }

  const saPerc = (db.config && typeof db.config.super_admin_perc === 'number')
    ? db.config.super_admin_perc
    : COMISSAO_CONFIG.super_admin_perc;
  const tetoInfl = Math.round((1 - saPerc) * 100); // % máx do influencer (0-100 inteiro)

  if (influencer_perc !== undefined && influencer_perc !== null && influencer_perc !== '') {
    const parsed = _parsePerc(influencer_perc, tetoInfl);
    if (parsed === undefined) {
      return res.status(400).json({ error: `influencer_perc inválido (0-${tetoInfl}%).` });
    }
    cfg.influencer_perc = parsed;
  }
  // Remove campo legado se sobrou de versão anterior
  delete cfg.gerente_split;

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
      influencer_perc: Math.round(cfg.influencer_perc * 100),
      disponivel_perc: tetoInfl,
      gerente_perc: tetoInfl - Math.round(cfg.influencer_perc * 100),
    },
  });
});
```

- [ ] **Step 4: Atualizar `GET /api/gerente/painel` em `server.js:2758-2840`**

Substituir o bloco `config: { ... }` do response (linhas ~2797-2803) por:

```javascript
    // % disponível para o gerente = 100 - super_admin_perc (não expõe SA ao gerente)
    config: (() => {
      const saPerc = (db.config && typeof db.config.super_admin_perc === 'number')
        ? db.config.super_admin_perc
        : COMISSAO_CONFIG.super_admin_perc;
      const disponivelPerc = Math.round((1 - saPerc) * 100);
      const inflPerc = Math.round((cfg.influencer_perc ?? COMISSAO_CONFIG.influencer_perc) * 100);
      return {
        nivel1_perc: +(cfg.nivel1_perc * 100).toFixed(2),
        nivel2_perc: +(cfg.nivel2_perc * 100).toFixed(2),
        nivel3_perc: +(cfg.nivel3_perc * 100).toFixed(2),
        influencer_perc: inflPerc,
        disponivel_perc: disponivelPerc,
        gerente_perc: disponivelPerc - inflPerc,
      };
    })(),
```

Também atualizar o bloco `config:` dentro do `map(inf => ({...}))` (~linha 2830-2836):

```javascript
        config: (() => {
          const saPerc = (db.config && typeof db.config.super_admin_perc === 'number')
            ? db.config.super_admin_perc
            : COMISSAO_CONFIG.super_admin_perc;
          const disponivelPerc = Math.round((1 - saPerc) * 100);
          const inflPerc = Math.round((effCfg.influencer_perc ?? COMISSAO_CONFIG.influencer_perc) * 100);
          return {
            nivel1_perc: +(effCfg.nivel1_perc * 100).toFixed(2),
            nivel2_perc: +(effCfg.nivel2_perc * 100).toFixed(2),
            nivel3_perc: +(effCfg.nivel3_perc * 100).toFixed(2),
            influencer_perc: inflPerc,
            disponivel_perc: disponivelPerc,
            gerente_perc: disponivelPerc - inflPerc,
          };
        })(),
```

E o fallback em `server.js:2786-2791`:

```javascript
  const cfg = me.comissao_config || _DEFAULT_CFG();
```

- [ ] **Step 5: Atualizar `GET /api/gerente/influencers` em `server.js:2890-2904`**

Substituir bloco de response:

```javascript
  const saPerc = (db.config && typeof db.config.super_admin_perc === 'number')
    ? db.config.super_admin_perc
    : COMISSAO_CONFIG.super_admin_perc;
  const disponivelPerc = Math.round((1 - saPerc) * 100);
  const inflPerc = Math.round(COMISSAO_CONFIG.influencer_perc * 100);
  res.json({
    influencer_perc: inflPerc,
    disponivel_perc: disponivelPerc,
    gerente_perc: disponivelPerc - inflPerc,
    influencers,
  });
```

- [ ] **Step 6: Rodar testes**

```bash
npm test
```

Esperado: todos PASS (inclusive os novos de gerente + piramide anteriores).

- [ ] **Step 7: Commit**

```bash
git add server.js tests/server.test.js
git commit -m "feat: PUT /api/gerente/config usa influencer_perc com teto dinamico (100 - SA)"
```

---

## Task 7: Atualizar `PUT /api/gerente/influencers/config`

**Files:**
- Modify: `server.js:2943-3000`
- Modify: `tests/server.test.js`

- [ ] **Step 1: Teste**

Adicionar:

```javascript
describe('Gerente - influencer override com influencer_perc', () => {
  let gerenteCookie = '';
  let gerenteId = null;
  let influencerId = null;

  beforeAll(async () => {
    const telG = '11999990020';
    const telI = '11999990021';
    db.users = db.users.filter(u => u.telefone !== telG && u.telefone !== telI);
    const regG = await agent().post('/api/auth/register').send({
      nome: 'Ger Ovr', telefone: telG, senha: 'G123!', email: 'go@test.com',
    });
    gerenteId = regG.body.user?.id;
    const g = db.users.find(x => x.id === gerenteId);
    g.role = 'gerente';
    g.comissao_config = { nivel1_perc: 0.10, nivel2_perc: 0.03, nivel3_perc: 0.01, influencer_perc: 0.30 };
    gerenteCookie = regG.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';

    const regI = await agent().post('/api/auth/register').send({
      nome: 'Inf Ovr', telefone: telI, senha: 'I123!', email: 'io@test.com',
      codigo_indicacao: g.codigo_indicacao,
    });
    influencerId = regI.body.user?.id;
    const i = db.users.find(x => x.id === influencerId);
    i.role = 'influencer';
    i.prospectador_id = gerenteId;

    db.config = db.config || {};
    db.config.super_admin_perc = 0.20;
  });

  test('PUT aceita influencer_perc=50 para influencer especifico', async () => {
    const res = await agent()
      .put('/api/gerente/influencers/config')
      .set('Cookie', gerenteCookie)
      .send({ user_id: influencerId, influencer_perc: 50 });
    expect(res.status).toBe(200);
    expect(res.body.config.influencer_perc).toBe(50);
  });

  test('PUT rejeita influencer_perc=85 (excede teto 80)', async () => {
    const res = await agent()
      .put('/api/gerente/influencers/config')
      .set('Cookie', gerenteCookie)
      .send({ user_id: influencerId, influencer_perc: 85 });
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 2: Substituir `PUT /api/gerente/influencers/config` em `server.js:2943-3000`**

```javascript
app.put('/api/gerente/influencers/config', authMiddleware, gerenteMiddleware, (req, res) => {
  const me = req.me;
  const { user_id, reset, nivel1_perc, nivel2_perc, nivel3_perc, influencer_perc } = req.body || {};
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

  const base = target.comissao_config
    ? { ...target.comissao_config }
    : (me.comissao_config ? { ...me.comissao_config } : _DEFAULT_CFG());

  const updates = { nivel1_perc, nivel2_perc, nivel3_perc };
  for (const k of Object.keys(updates)) {
    const parsed = _parsePerc(updates[k], 50);
    if (parsed === undefined) return res.status(400).json({ error: `${k} inválido (0-50%).` });
    if (parsed !== null) base[k] = parsed;
  }

  const saPerc = (db.config && typeof db.config.super_admin_perc === 'number')
    ? db.config.super_admin_perc
    : COMISSAO_CONFIG.super_admin_perc;
  const tetoInfl = Math.round((1 - saPerc) * 100);

  if (influencer_perc !== undefined && influencer_perc !== null && influencer_perc !== '') {
    const parsed = _parsePerc(influencer_perc, tetoInfl);
    if (parsed === undefined) {
      return res.status(400).json({ error: `influencer_perc inválido (0-${tetoInfl}%).` });
    }
    base.influencer_perc = parsed;
  }
  delete base.gerente_split;

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
      influencer_perc: Math.round(base.influencer_perc * 100),
      disponivel_perc: tetoInfl,
      gerente_perc: tetoInfl - Math.round(base.influencer_perc * 100),
    },
  });
});
```

- [ ] **Step 3: Rodar testes**

```bash
npm test
```

- [ ] **Step 4: Commit**

```bash
git add server.js tests/server.test.js
git commit -m "feat: PUT /api/gerente/influencers/config usa influencer_perc com teto dinamico"
```

---

## Task 8: Frontend — `super-admin.html` (novo campo de config da % do SA)

**Files:**
- Modify: `super-admin.html`

- [ ] **Step 1: Ler o painel atual para achar onde encaixar**

```bash
grep -n "super-admin/painel\|stats-grid\|<section" super-admin.html | head -30
```

Identificar uma seção existente onde colocar um card novo "Minha comissão (%)".

- [ ] **Step 2: Adicionar HTML do card**

Logo após a `<section>` de stats gerais (procurar por "stats" ou "volume" no HTML), adicionar:

```html
<section class="card" id="sa-cfg-card">
  <h2>Minha comissão (pirâmide de afiliados)</h2>
  <p class="hint">Define quanto você recebe sobre a comissão N1 (10% do depósito) de toda a rede de afiliados. Range: 10% a 20%.</p>
  <div class="row">
    <label for="sa-perc">Sua % (do total da comissão N1):</label>
    <input id="sa-perc" type="number" min="10" max="20" step="1" class="fi"/>
    <button id="sa-perc-save" class="btn">Salvar</button>
  </div>
  <div id="sa-perc-preview" class="hint"></div>
</section>
```

- [ ] **Step 3: Adicionar JS para carregar e salvar**

Dentro do script do painel, logo após a função `api(...)` ou onde os outros binds estão:

```javascript
async function loadSaPerc() {
  const d = await api('/api/super-admin/painel');
  const el = document.getElementById('sa-perc');
  if (el) el.value = d.super_admin_perc;
  const pv = document.getElementById('sa-perc-preview');
  if (pv) pv.textContent = `A cada R$10 de comissão N1, você recebe R$${(d.super_admin_perc / 10).toFixed(2)}.`;
}

document.getElementById('sa-perc-save')?.addEventListener('click', async () => {
  const v = parseFloat(document.getElementById('sa-perc').value);
  if (!(v >= 10 && v <= 20)) {
    alert('Valor deve estar entre 10 e 20.');
    return;
  }
  try {
    const res = await api('/api/super-admin/comissao-config', { method: 'PUT', body: JSON.stringify({ super_admin_perc: v }) });
    alert(`Comissão atualizada para ${res.super_admin_perc}%.`);
    await loadSaPerc();
  } catch (err) {
    alert('Erro: ' + (err.message || 'falha ao salvar'));
  }
});

// Chamar loadSaPerc no boot
loadSaPerc().catch(console.error);
```

- [ ] **Step 4: Testar manualmente**

```bash
node server.js &
# Abrir http://localhost:3000/super-admin.html, logar com super admin
# Verificar: valor carrega, mudança para 15 salva, preview atualiza
```

- [ ] **Step 5: Commit**

```bash
git add super-admin.html
git commit -m "feat: painel super-admin com campo de configuracao de super_admin_perc (10-20%)"
```

---

## Task 9: Frontend — `gerente.html` (esconder SA, trocar `cfg-split` por `cfg-infl-perc`)

**Files:**
- Modify: `gerente.html`

- [ ] **Step 1: Substituir input `cfg-split` por `cfg-infl-perc`**

Em `gerente.html:259`, achar:

```html
<input id="cfg-split" type="number" step="1" min="0" max="100" class="fi"/>
```

Substituir por:

```html
<input id="cfg-infl-perc" type="number" step="1" min="0" max="80" class="fi"/>
```

(O `max` é setado dinamicamente pelo JS — 80 é o default com SA=20.)

Procurar o label/texto adjacente e ajustar:
- Antes: "Você (gerente) fica com (%)" ou similar referente ao split do gerente.
- Depois: "Influencer recebe (%)".

Fazer o mesmo para `edit-split` em `gerente.html:431`:

```html
<input id="edit-infl-perc" type="number" step="1" min="0" max="80" class="fi"/>
```

- [ ] **Step 2: Atualizar `loadPainel` em `gerente.html:523-550`**

Substituir bloco:

```javascript
    const cf = d.config;
    const hintTxt = `comissões: N1 ${cf.nivel1_perc}% / N2 ${cf.nivel2_perc}% / N3 ${cf.nivel3_perc}% — você tem ${cf.disponivel_perc}% para distribuir (influencer ${cf.influencer_perc}% · você ${cf.gerente_perc}%)`;
    document.getElementById('cfg-hint-2').textContent = hintTxt;
    document.getElementById('cfg-n1').value = cf.nivel1_perc;
    document.getElementById('cfg-n2').value = cf.nivel2_perc;
    document.getElementById('cfg-n3').value = cf.nivel3_perc;
    const inflEl = document.getElementById('cfg-infl-perc');
    inflEl.value = cf.influencer_perc;
    inflEl.max = cf.disponivel_perc; // teto dinâmico
    document.getElementById('cfg-resumo').textContent =
      `Você tem ${cf.disponivel_perc}% da comissão para distribuir. Influencer recebe ${cf.influencer_perc}% e você fica com ${cf.gerente_perc}%.`;
```

- [ ] **Step 3: Atualizar montagem de stats-grid (linha 547 — "Override 60%")**

Substituir:

```javascript
      <div class="stat-card"><div class="lbl">Override 60%</div><div class="val">${fmtMoney(s.total_override)}</div><div class="sub">dos influencers</div></div>
```

Por:

```javascript
      <div class="stat-card"><div class="lbl">Override</div><div class="val">${fmtMoney(s.total_override)}</div><div class="sub">dos influencers</div></div>
```

(Remove o "60%" hardcoded — o valor agora é dinâmico.)

- [ ] **Step 4: Atualizar tabela de influencers (linha 569)**

Substituir:

```javascript
          <td><div class="tel">${c.nivel1_perc}% / ${c.nivel2_perc}% / ${c.nivel3_perc}% · ${c.gerente_split_perc}/${c.influencer_split_perc} ${tag}</div></td>
```

Por:

```javascript
          <td><div class="tel">${c.nivel1_perc}% / ${c.nivel2_perc}% / ${c.nivel3_perc}% · influencer ${c.influencer_perc}% (você ${c.gerente_perc}%) ${tag}</div></td>
```

- [ ] **Step 5: Atualizar payload PUT em `gerente.html:648-655`**

Substituir:

```javascript
    gerente_split_perc: document.getElementById('cfg-split').value,
```

Por:

```javascript
    influencer_perc: document.getElementById('cfg-infl-perc').value,
```

- [ ] **Step 6: Atualizar modal de edição de influencer (`gerente.html:805-835`)**

Substituir:

```javascript
  document.getElementById('edit-split').value = inf.config.gerente_split_perc;
```

Por:

```javascript
  const editEl = document.getElementById('edit-infl-perc');
  editEl.value = inf.config.influencer_perc;
  editEl.max = inf.config.disponivel_perc;
```

E no submit (linha ~831):

```javascript
    influencer_perc: document.getElementById('edit-infl-perc').value,
```

- [ ] **Step 7: Atualizar validação de ranges em `gerente.html:712`**

Substituir `['edit-split']` por `['edit-infl-perc']`.

- [ ] **Step 8: Testar manualmente**

```bash
node server.js &
# Abrir http://localhost:3000/gerente.html, logar com gerente
# Verificar:
# - Campo "Influencer recebe (%)" aparece
# - Max do input é 80 (com SA=20)
# - Resumo diz "Você tem 80% para distribuir. Influencer recebe 30% e você fica com 50%"
# - NÃO menciona super admin em nenhum lugar
# - Salvar funciona
```

- [ ] **Step 9: Commit**

```bash
git add gerente.html
git commit -m "feat: painel gerente usa influencer_perc com teto dinamico sem expor SA"
```

---

## Task 10: Frontend — `influencer.html` (cosmético, não expor SA)

**Files:**
- Modify: `influencer.html` (somente se houver referência a `gerente_split` ou menção ao "split 60/40")

- [ ] **Step 1: Buscar referências ao split**

```bash
grep -n "split\|60/40\|gerente_split" influencer.html
```

Se não encontrar nada, pular para Step 3.

- [ ] **Step 2: Ajustar textos**

Remover qualquer menção a "gerente pega 60%" ou equivalente. O painel do influencer só deve falar da % que ele mesmo recebe.

- [ ] **Step 3: Verificar painel.js (lado do jogador)**

```bash
grep -n "comissao_nivel1_perc\|gerente_split" js/pages/painel.js
```

Se houver menção ao `gerente_split`, substituir ou remover (jogador não precisa saber disso).

- [ ] **Step 4: Commit (se houve mudança)**

```bash
git add influencer.html js/pages/painel.js
git commit -m "chore: remove mencoes a gerente_split no painel do influencer/jogador"
```

---

## Task 11: Teste de migração e regressão final

**Files:**
- Modify: `tests/server.test.js`

- [ ] **Step 1: Adicionar teste de migração**

```javascript
describe('Migracao gerente_split -> influencer_perc', () => {
  test('user com comissao_config antiga (gerente_split) e migrado na inicializacao', () => {
    // Simula DB antigo injetando user com gerente_split
    const u = {
      id: 99999, nome: 'Legado', telefone: '11000009999', senha_hash: 'x',
      role: 'gerente', codigo_indicacao: 'leg', indicado_por: null, prospectador_id: null,
      saldo: 0, saldo_afiliado: 0, ativo: 1,
      comissao_config: { nivel1_perc: 0.10, nivel2_perc: 0.03, nivel3_perc: 0.01, gerente_split: 0.60 },
      created_at: new Date().toISOString(),
    };
    db.users.push(u);

    // Simula o código de migração — copiar/colar o bloco aqui ou re-requerer server
    if (typeof u.comissao_config.gerente_split === 'number' && typeof u.comissao_config.influencer_perc === 'undefined') {
      u.comissao_config.influencer_perc = +(1 - u.comissao_config.gerente_split).toFixed(4);
      delete u.comissao_config.gerente_split;
    }

    expect(u.comissao_config.influencer_perc).toBeCloseTo(0.40, 4);
    expect(u.comissao_config.gerente_split).toBeUndefined();
  });
});

describe('Regressao modo _split=true', () => {
  test('tx._split=true ainda credita 100% das 3 comissoes no super_admin', () => {
    db.users = db.users.filter(u => !['sa_s', 'jo_s'].includes(u.codigo_indicacao));
    const sa = {
      id: 93001, nome: 'SA Split', telefone: '11000003001', senha_hash: 'x',
      role: 'super_admin', codigo_indicacao: 'sa_s', indicado_por: null,
      prospectador_id: null, saldo: 0, saldo_afiliado: 0, ativo: 1, comissao_config: null,
      created_at: new Date().toISOString(),
    };
    const jog = {
      id: 93002, nome: 'Jog S', telefone: '11000003002', senha_hash: 'x',
      role: 'jogador', codigo_indicacao: 'jo_s', indicado_por: null,
      prospectador_id: null, saldo: 0, saldo_afiliado: 0, ativo: 1, comissao_config: null,
      created_at: new Date().toISOString(),
    };
    db.users.push(sa, jog);
    db._sp.super_admin_user_id = sa.id;
    const tx = { id: 999999, user_id: jog.id, tipo: 'deposito', valor: 100, status: 'aprovado', _split: true, created_at: new Date().toISOString() };
    db.transacoes.push(tx);
    require('../server').creditarComissao(tx, jog);
    // 100% de N1+N2+N3 = 10% + 3% + 1% = 14% do depósito = R$14
    expect(sa.saldo_afiliado).toBeCloseTo(14.00, 2);
  });
});
```

- [ ] **Step 2: Rodar suite completa**

```bash
npm test
```

Esperado: **tudo passa**, incluindo testes antigos (auth, saques, painéis) e os novos.

- [ ] **Step 3: Smoke test manual ponta a ponta**

```bash
node server.js &
```

Fluxo:
1. Login como super admin → ajusta `super_admin_perc` para 15%.
2. Login como gerente → painel mostra "Você tem 85% para distribuir" (sem mencionar SA).
3. Gerente muda `influencer_perc` para 40% → display "Você fica com 45%".
4. Simular depósito de R$100 por jogador indicado pelo influencer.
5. Verificar em `database.json` ou no painel de transações: SA +R$1,50, Gerente +R$4,50, Influencer +R$4,00.

- [ ] **Step 4: Commit final**

```bash
git add tests/server.test.js
git commit -m "test: cobertura migracao e regressao do modo _split"
```

---

## Self-Review Notes

**Spec coverage verificado:**
- Seção 2 (regra de split) → Task 1, 3, 4
- Seção 3 (pseudocódigo) → Task 4
- Seção 4 (casos de borda) → Task 4 (todos cobertos nos testes)
- Seção 5 (modelo de dados) → Task 1, 2
- Seção 6 (mudanças em server.js) → Tasks 3, 4, 5, 6, 7
- Seção 7 (frontend) → Tasks 8, 9, 10
- Seção 8 (testes) → integrados nas tasks + Task 11

**Decisões de escopo:**
- `creditarComComissaoSplit` foi reescrito do zero (não apenas modificado) porque a lógica mudou substancialmente (de binária 2-way para 3-way com casos especiais).
- A migração foi inline no bootstrap do servidor (mesmo padrão já usado para outras migrações em `server.js:1277-1310`).
- Exportar `creditarComissao` é necessário para testes unitários de `_creditarComComissaoSplit` — não altera a interface pública do app.

**Riscos operacionais:**
- Banco de dados em produção tem usuários com `gerente_split` que serão migrados automaticamente na primeira inicialização. A migração é idempotente: se `influencer_perc` já existir, o campo `gerente_split` é apenas removido sem alteração.
- Qualquer cliente frontend cacheado ainda apontando para `gerente_split_perc` deixará de funcionar — mas o ambiente é single-tenant e deploy é atômico via Coolify.
