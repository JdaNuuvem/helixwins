# Pirâmide de Comissões: Super Admin → Gerente → Influencer

**Data:** 2026-04-17
**Branch:** plataforma
**Escopo:** Adicionar o Super Admin no split de comissão N1, formando uma pirâmide de 3 níveis.

---

## 1. Contexto

Hoje o split de comissão N1 é binário — só divide entre gerente e influencer (`gerente_split`, default 60/40). O Super Admin não recebe nada do N1 no fluxo normal (só existe o "modo split" especial `tx._split=true` onde SA leva 100% de tudo).

A hierarquia da plataforma é Super Admin → Gerente → Influencer → Jogador, mas o modelo de comissão não reflete isso. Esta mudança corrige o alinhamento.

## 2. Nova regra de split (N1)

Os três percentuais são **absolutos sobre o total da comissão N1** e sempre somam 100%:

| Config | Quem define | Base | Range | Default |
|--------|-------------|------|-------|---------|
| `super_admin_perc` | Super Admin (global) | % do total da comissão N1 | 10%–20% | 20% |
| `influencer_perc` | Gerente (por influencer ou default) | % do total da comissão N1 | 0% até (100% − SA%) | 30% |
| `gerente_perc` | **derivado** = 100% − SA% − Infl% | % do total | 0%+ | 50% |

**Invariante:** `super_admin_perc + influencer_perc + gerente_perc = 1.0`.

### 2.1 Exemplos (depósito R$100 → comissão N1 = R$10)

| SA% | Infl% (absoluto) | Gerente% (derivado) | SA recebe | Gerente recebe | Influencer recebe |
|-----|------------------|---------------------|-----------|----------------|-------------------|
| 20% | 30% | 50% | R$2,00 | R$5,00 | R$3,00 |
| 20% | 40% | 40% | R$2,00 | R$4,00 | R$4,00 |
| 10% | 30% | 60% | R$1,00 | R$6,00 | R$3,00 |
| 15% | 25% | 60% | R$1,50 | R$6,00 | R$2,50 |

### 2.2 UI do painel do gerente

O painel do gerente **não menciona o Super Admin**. O gerente vê apenas o bolo disponível para ele distribuir. A UI mostra:

- "Você tem **80%** (R$8 de cada R$10 de comissão) para distribuir entre você e seu influencer"
- Input: "Quanto % vai para o influencer?" → gerente digita 30 (limite: 0 a 80)
- Display derivado em tempo real: "Você fica com **50%** (R$5)"

O valor salvo em `influencer_perc` é **absoluto sobre o total** (0.30 no exemplo). O slider do influencer tem `max = 100 − SA%` dinâmico (mas a UI apresenta esse teto como "80% disponíveis", sem expor que há uma fatia do SA).

### 2.3 Efeito quando SA muda

Se o SA reduzir `super_admin_perc` de 20% para 10%, o gerente **ganha o aumento automaticamente** (vai de 50% para 60% do total) sem reconfigurar nada. A fatia do influencer permanece 30% absolutos. Isso é intencional — o gerente fica protegido de reduções do SA e premiado quando o SA abre mão de parte.

## 3. Pseudocódigo

```
comissao_n1 = deposito * nivel1_perc              // 10% do depósito (inalterado)

parte_sa = comissao_n1 * super_admin_perc         // absoluto sobre o total

if cadeia_tem_gerente(referrer):
    parte_infl    = comissao_n1 * influencer_perc         // absoluto
    parte_gerente = comissao_n1 - parte_sa - parte_infl   // derivado (pega arredondamento)
    credita(super_admin, parte_sa)
    credita(gerente,     parte_gerente)
    credita(influencer,  parte_infl)
else:
    // Sem gerente: SA leva sua fatia, referrer direto leva todo o resto
    credita(super_admin, parte_sa)
    credita(referrer,    comissao_n1 - parte_sa)
```

## 4. Casos de borda

| Caso | Comportamento |
|------|---------------|
| Nível N2 ou N3 | **Inalterado.** 100% para quem estiver na cadeia, sem split com SA. |
| Sem gerente na cadeia (influencer solto ou jogador→jogador) | SA leva `super_admin_perc`, referrer direto leva o restante (100% − SA%). |
| Sem Super Admin cadastrado no sistema | Fatia do SA **fica na plataforma** (não credita em ninguém). Log warning. |
| Referrer é o próprio Super Admin no N1 | SA leva **100%** da comissão (não se auto-fatiar). |
| Bônus 1º depósito (R$2 fixo) | **Inalterado.** 100% para o N1, sem split com SA. |
| Modo `tx._split === true` (SA leva 100% de tudo) | **Mantido.** Override especial, independente da pirâmide. |
| Gerente tenta configurar `influencer_perc > (1 − super_admin_perc)` | Requisição rejeitada com HTTP 400. |
| SA tenta configurar `super_admin_perc` fora de [0.10, 0.20] | Requisição rejeitada com HTTP 400. |

## 5. Mudanças no modelo de dados

### 5.1 `db.config` (novo campo)
```js
db.config.super_admin_perc = 0.20  // default, editável pelo SA
```

### 5.2 `COMISSAO_CONFIG` (global default)
```js
const COMISSAO_CONFIG = {
  nivel1_perc: 0.10,
  nivel2_perc: 0.03,
  nivel3_perc: 0.01,
  bonus_primeiro_deposito: 2,
  influencer_perc: 0.30,        // NOVO (substitui gerente_split)
  super_admin_perc: 0.20,       // NOVO (copiado de db.config.super_admin_perc na leitura)
};
```

### 5.3 `user.comissao_config` (por gerente/influencer)

**Antes:**
```js
{ nivel1_perc, nivel2_perc, nivel3_perc, gerente_split }
```

**Depois:**
```js
{ nivel1_perc, nivel2_perc, nivel3_perc, influencer_perc }
```

### 5.4 Migração automática na inicialização

Para cada `user` com `comissao_config`:
```js
if (typeof u.comissao_config.gerente_split === 'number' && typeof u.comissao_config.influencer_perc === 'undefined') {
  u.comissao_config.influencer_perc = 1 - u.comissao_config.gerente_split;
  delete u.comissao_config.gerente_split;
}
```

Para `db.config`:
```js
if (typeof db.config.super_admin_perc !== 'number') {
  db.config.super_admin_perc = 0.20;
}
```

## 6. Mudanças em `server.js`

### 6.1 Função `_comissaoConfigEfetiva(depositante)`
Adicionar `super_admin_perc` sempre lido de `db.config.super_admin_perc` (fonte única de verdade — SA é global, não por gerente).

### 6.2 Função `_creditarComComissaoSplit(referrer, valorComissao, depositante, nivel, cfg)`
Assinatura muda: recebe `cfg` completo ao invés de só `splitGerente`.

Lógica nova:
- Se `nivel !== 1`: comportamento **inalterado** (cadeia normal, 100% referrer).
- Se `nivel === 1`:
  1. Calcula `parte_sa = valorComissao * cfg.super_admin_perc`.
  2. Credita SA (se cadastrado e não for o próprio referrer).
  3. Calcula `restante = valorComissao - parte_sa`.
  4. Se referrer é influencer com gerente: calcula `parte_infl = valorComissao * cfg.influencer_perc` e `parte_gerente = restante - parte_infl`, credita ambos.
  5. Senão: credita `restante` 100% no referrer direto.

### 6.3 Endpoints

**Novo:** `PUT /api/super-admin/comissao-config`
```js
Body: { super_admin_perc: number }  // 0.10 a 0.20
Response 200: { super_admin_perc }
Response 400: valor fora do range
```

**Alterado:** `PUT /api/gerente/config`
- Aceita `influencer_perc` (0 a 1 − `super_admin_perc`) no lugar de `gerente_split`.
- Valida teto dinâmico contra `db.config.super_admin_perc`.

**Alterado:** `PUT /api/gerente/influencers/config`
- Mesma validação acima para o override individual.

**Alterado:** `GET /api/super-admin/painel`
- Retorna `super_admin_perc` atual.

**Alterado:** `GET /api/gerente/painel`
- Retorna `super_admin_perc` (só leitura, para exibir no funil).
- Retorna `influencer_perc` no lugar de `gerente_split_perc`.

## 7. Mudanças em frontend

### 7.1 `super-admin.html`
- Novo campo "Sua comissão (% do N1 de afiliados)", input number 10–20.
- Botão "Salvar" chama `PUT /api/super-admin/comissao-config`.
- Exibir preview: "A cada R$10 de comissão N1, você recebe R$X".

### 7.2 `gerente.html`
**Importante:** O painel do gerente **nunca menciona a existência do Super Admin** nem expõe a `super_admin_perc`. O gerente só vê "seu bolo disponível" e o split interno dele.

- Trocar label "Gerente fica com (%)" por **"Influencer recebe (%)"**.
- Exibição principal: "Você tem **Z%** (R$ W de cada R$10 de comissão) para distribuir entre você e seu influencer", onde `Z = 100 − super_admin_perc` (lido internamente, não exposto como "SA leva X%").
- Slider/input do influencer com `max = Z` (dinâmico).
- Display derivado em tempo real: "Você fica com **Y%** (R$ V)" onde `Y = Z − influencer_perc`.
- Atualizar o visual do funil para mostrar apenas **Gerente → Influencer** (sem SA visível no funil do painel do gerente).

### 7.3 `influencer.html`
- Atualizar a exibição do percentual de comissão do influencer para refletir `influencer_perc` (substitui o cálculo antigo baseado em `gerente_split`).
- O painel do influencer também **não menciona o Super Admin** — ele vê só "sua % de comissão" e os valores recebidos nas transações.

## 8. Testes (`tests/server.test.js`)

Adicionar casos:

1. **Split básico N1 com pirâmide completa**: depósito R$100, SA=20%, influencer_perc=30% → SA R$2, gerente R$5, influencer R$3.
2. **Sem gerente na cadeia**: jogador indicado direto por influencer solto → SA R$2, influencer R$8.
3. **Sem SA cadastrado**: SA% fica "órfão" (não credita), gerente/influencer recebem suas partes normalmente.
4. **Referrer é o próprio SA**: SA recebe 100% da comissão.
5. **N2 e N3**: sem split com SA, comportamento inalterado.
6. **Validação SA fora do range**: `PUT super_admin_perc=0.05` → 400.
7. **Validação influencer_perc excede teto**: SA=20%, gerente tenta `influencer_perc=0.85` → 400.
8. **Migração**: user com `gerente_split=0.60` antigo → vira `influencer_perc=0.40` após init.
9. **Modo `_split=true`**: mantém comportamento antigo (SA 100% de N1+N2+N3).
10. **Bônus 1º depósito**: R$2 vai 100% para referrer, não split com SA.

## 9. O que não muda

- Cálculo de `nivel1_perc`, `nivel2_perc`, `nivel3_perc` (10%, 3%, 1% do depósito).
- Fluxo N2 e N3 (cadeia normal).
- Bônus de 1º depósito.
- Modo `_split=true`.
- Rotas de saque, promoção, aprovação.
- Schema de transações.

## 10. Riscos

| Risco | Mitigação |
|-------|-----------|
| Dados existentes com `gerente_split` quebram | Migração idempotente na inicialização, testada. |
| SA muda `super_admin_perc` no meio de um fluxo | Config lida uma vez por depósito (snapshot). Depósitos já aprovados não são reprocessados. |
| Gerente não entende a mudança de UI | Label clara "Influencer recebe (%)" + display do "Você fica com". |
| Arredondamento causa soma ≠ comissão total | `parte_gerente` é derivada por subtração (`restante - parte_infl`) para absorver qualquer centavo de arredondamento. |

---

**Status:** aguardando revisão do usuário antes de gerar plano de implementação.
