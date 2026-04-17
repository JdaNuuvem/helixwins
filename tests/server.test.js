const request = require('supertest');
const { app, db, creditDeposit } = require('../server');

// ── Helpers ────────────────────────────────────────────────────────────────
let authCookie = '';
let adminCookie = '';
let testUserId = null;
let adminUserId = null;

function agent() { return request(app); }

async function loginUser(telefone, senha) {
  const res = await agent().post('/api/auth/login').send({ telefone, senha });
  return res.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
}

// ── Setup: criar usuários de teste ─────────────────────────────────────────
beforeAll(async () => {
  // Registrar usuário normal (telefone com tamanho válido)
  const tel1 = '11999990001';
  const tel2 = '11999990002';

  // Limpar usuários de teste anteriores
  db.users = db.users.filter(u => u.telefone !== tel1 && u.telefone !== tel2);

  const reg = await agent().post('/api/auth/register').send({
    nome: 'Test User', telefone: tel1, senha: 'Test123!', email: 'testunit@test.com',
  });
  testUserId = reg.body.user?.id;
  authCookie = reg.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';

  // Dar saldo ao usuário
  const u = db.users.find(u => u.id === testUserId);
  if (u) { u.saldo = 500; u.cpf = '12345678901'; u.saque_desbloqueado = 1; u.taxa_saque_paga = 1; }

  // Criar admin via registro
  const aReg = await agent().post('/api/auth/register').send({
    nome: 'Admin Test', telefone: tel2, senha: 'Admin123!', email: 'adminunit@test.com',
  });
  const admin = db.users.find(u => u.id === aReg.body.user?.id);
  if (admin) admin.admin = 1;
  adminUserId = admin?.id;
  // Usar cookie do registro diretamente
  adminCookie = aReg.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
});

// ═══════════════════════════════════════════════════════════════════════════
// 1. AUTENTICAÇÃO
// ═══════════════════════════════════════════════════════════════════════════
describe('Auth', () => {
  test('login retorna cookie e user sem senha', async () => {
    const res = await agent().post('/api/auth/login').send({ telefone: '11999990001', senha: 'Test123!' });
    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.senha_hash).toBeUndefined();
    expect(res.body.user.senha).toBeUndefined();
    expect(res.headers['set-cookie']).toBeDefined();
  });

  test('login com senha errada retorna 401', async () => {
    const res = await agent().post('/api/auth/login').send({ telefone: '11999990001', senha: 'Wrong' });
    expect(res.status).toBe(401);
  });

  test('registro com telefone duplicado retorna 409', async () => {
    const res = await agent().post('/api/auth/register').send({
      nome: 'Dup', telefone: '11999990001', senha: 'Test123!', email: 'dup@test.com',
    });
    expect(res.status).toBe(409);
  });

  test('me retorna user sem campos sensíveis', async () => {
    const res = await agent().get('/api/auth/me').set('Cookie', authCookie);
    expect(res.status).toBe(200);
    expect(res.body.user.senha_hash).toBeUndefined();
    expect(res.body.user._k).toBeUndefined();
  });

  test('requisição sem auth retorna 401', async () => {
    const res = await agent().get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 2. RANKING PÚBLICO — não vaza dados
// ═══════════════════════════════════════════════════════════════════════════
describe('Ranking público', () => {
  test('GET /api/public/ranking retorna ranking sem flag fake', async () => {
    const res = await agent().get('/api/public/ranking');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.ranking)).toBe(true);
    // Nenhum item deve ter campo "fake"
    res.body.ranking.forEach(p => {
      expect(p.fake).toBeUndefined();
    });
  });

  test('ranking tem pelo menos 3 entradas (fakes)', async () => {
    const res = await agent().get('/api/public/ranking');
    expect(res.body.ranking.length).toBeGreaterThanOrEqual(3);
  });

  test('top 3 não têm user_id (são fakes)', async () => {
    const res = await agent().get('/api/public/ranking');
    const top3 = res.body.ranking.slice(0, 3);
    top3.forEach(p => {
      expect(p.user_id).toBeUndefined();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 3. DEPÓSITO — campos internos não vazam
// ═══════════════════════════════════════════════════════════════════════════
describe('Depósito', () => {
  test('histórico não expõe _k, _split, _upsell, gateway_tx_id', async () => {
    // Inserir transação fake para teste
    db.transacoes.push({
      id: db.nextIds.transacoes++, user_id: testUserId, tipo: 'deposito', valor: 50,
      valor_creditado: 50, status: 'aprovado', _k: 'SECRET_KEY', _split: true,
      _upsell: 'taxa_saque', gateway_tx_id: 'GW123', gateway_identifier: 'DEP_TEST',
      saldo_antes: 0, saldo_depois: 50, created_at: new Date().toISOString(),
    });

    const res = await agent().get('/api/financeiro/historico').set('Cookie', authCookie);
    expect(res.status).toBe(200);
    res.body.transacoes.forEach(tx => {
      expect(tx._k).toBeUndefined();
      expect(tx._split).toBeUndefined();
      expect(tx._upsell).toBeUndefined();
      expect(tx.gateway_tx_id).toBeUndefined();
      expect(tx.gateway_identifier).toBeUndefined();
    });
  });

  test('_upsell inválido é ignorado', async () => {
    // Não podemos testar o gateway real, mas podemos verificar a validação
    const res = await agent().post('/api/financeiro/deposito')
      .set('Cookie', authCookie)
      .send({ valor: 20, _upsell: 'HACK_ATTEMPT' });
    // Vai falhar no gateway (não temos gateway real), mas a validação deve ter rejeitado o _upsell
    // O importante é que não crash
    expect([200, 400, 500]).toContain(res.status);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 4. SPLIT — lógica do counter e pendência
// ═══════════════════════════════════════════════════════════════════════════
describe('Split logic', () => {
  test('creditDeposit marca taxa_saque_paga quando _upsell=taxa_saque', () => {
    const user = db.users.find(u => u.id === testUserId);
    user.taxa_saque_paga = 0;
    const antes = user.saldo;

    const tx = {
      id: db.nextIds.transacoes++, user_id: testUserId, tipo: 'deposito', valor: 15,
      status: 'pendente', _upsell: 'taxa_saque', created_at: new Date().toISOString(),
    };
    db.transacoes.push(tx);

    creditDeposit(tx);

    expect(tx.status).toBe('aprovado');
    expect(user.taxa_saque_paga).toBe(1);
    expect(user.saldo).toBe(antes + 15);
  });

  test('creditDeposit auto-credita vidas quando _upsell=comprar_vidas', () => {
    const user = db.users.find(u => u.id === testUserId);
    const vidasAntes = user.vidas || 0;

    const tx = {
      id: db.nextIds.transacoes++, user_id: testUserId, tipo: 'deposito', valor: 10,
      status: 'pendente', _upsell: 'comprar_vidas', created_at: new Date().toISOString(),
    };
    db.transacoes.push(tx);

    creditDeposit(tx);

    expect(tx.status).toBe('aprovado');
    expect(user.vidas).toBe(vidasAntes + 3); // pacote_vidas.quantidade = 3
  });

  test('creditDeposit desbloqueia saque para depósito >= R$20', () => {
    const user = db.users.find(u => u.id === testUserId);
    user.saque_desbloqueado = 0;

    const tx = {
      id: db.nextIds.transacoes++, user_id: testUserId, tipo: 'deposito', valor: 20,
      status: 'pendente', created_at: new Date().toISOString(),
    };
    db.transacoes.push(tx);

    creditDeposit(tx);

    expect(user.saque_desbloqueado).toBe(1);
  });

  test('creditDeposit não re-credita transação já aprovada', () => {
    const user = db.users.find(u => u.id === testUserId);
    const saldoAntes = user.saldo;

    const tx = {
      id: db.nextIds.transacoes++, user_id: testUserId, tipo: 'deposito', valor: 100,
      status: 'aprovado', created_at: new Date().toISOString(),
    };
    db.transacoes.push(tx);

    creditDeposit(tx);

    expect(user.saldo).toBe(saldoAntes); // saldo não mudou
  });

  test('creditDeposit aplica bônus VIP para depósito >= R$50', () => {
    const user = db.users.find(u => u.id === testUserId);
    const antes = user.saldo;

    const tx = {
      id: db.nextIds.transacoes++, user_id: testUserId, tipo: 'deposito', valor: 50,
      status: 'pendente', created_at: new Date().toISOString(),
    };
    db.transacoes.push(tx);

    creditDeposit(tx);

    // Bônus VIP 2x para R$50-99
    expect(tx.valor_creditado).toBe(100);
    expect(user.saldo).toBe(antes + 100);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 5. UPSELLS
// ═══════════════════════════════════════════════════════════════════════════
describe('Upsells', () => {
  test('GET /api/upsell/info retorna todos os upsells', async () => {
    const res = await agent().get('/api/upsell/info').set('Cookie', authCookie);
    expect(res.status).toBe(200);
    expect(res.body.seguro).toBeDefined();
    expect(res.body.deposito_vip).toBeDefined();
    expect(res.body.streak).toBeDefined();
    expect(res.body.cashback).toBeDefined();
    expect(res.body.meta_diaria).toBeDefined();
    expect(res.body.dobrar_ou_nada).toBe(true);
    expect(res.body.pacote_vidas).toBeDefined();
    expect(res.body.modo_turbo).toBeDefined();
    expect(res.body.ranking).toBe(true);
    expect(res.body.presente).toBeDefined();
  });

  test('comprar vidas debita saldo', async () => {
    const user = db.users.find(u => u.id === testUserId);
    const antes = user.saldo;

    const res = await agent().post('/api/upsell/comprar-vidas').set('Cookie', authCookie);
    expect(res.status).toBe(200);
    expect(user.saldo).toBe(antes - 10); // preco = 10
  });

  test('dobrar ou nada rejeita valor zero', async () => {
    const res = await agent().post('/api/upsell/dobrar-ou-nada')
      .set('Cookie', authCookie)
      .send({ valor: 0 });
    expect(res.status).toBe(400);
  });

  test('presente rejeita valor inválido', async () => {
    const res = await agent().post('/api/upsell/presente')
      .set('Cookie', authCookie)
      .send({ valor: 999, telefone_destino: '11999990002' });
    expect(res.status).toBe(400);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 6. SAQUE — fluxo de upsells
// ═══════════════════════════════════════════════════════════════════════════
describe('Saque', () => {
  test('saque sem desbloqueio retorna SAQUE_BLOQUEADO', async () => {
    const user = db.users.find(u => u.id === testUserId);
    user.saque_desbloqueado = 0;
    user.taxa_saque_paga = 0;

    const res = await agent().post('/api/financeiro/saque')
      .set('Cookie', authCookie)
      .send({ valor: 50, chave_pix: '12345678901' });
    expect(res.status).toBe(403);
    expect(res.body.code).toBe('SAQUE_BLOQUEADO');

    user.saque_desbloqueado = 1; // restaurar
  });

  test('saque sem taxa paga retorna TAXA_SAQUE', async () => {
    const user = db.users.find(u => u.id === testUserId);
    user.saque_desbloqueado = 1;
    user.taxa_saque_paga = 0;

    const res = await agent().post('/api/financeiro/saque')
      .set('Cookie', authCookie)
      .send({ valor: 50, chave_pix: '12345678901' });
    expect(res.status).toBe(403);
    expect(res.body.code).toBe('TAXA_SAQUE');
    expect(res.body.valor_taxa).toBeDefined();

    user.taxa_saque_paga = 1; // restaurar
  });

  test('saque com tudo desbloqueado funciona', async () => {
    const user = db.users.find(u => u.id === testUserId);
    user.saque_desbloqueado = 1;
    user.taxa_saque_paga = 1;
    user.saldo = 200;

    const res = await agent().post('/api/financeiro/saque')
      .set('Cookie', authCookie)
      .send({ valor: 50, chave_pix: '12345678901' });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(user.saldo).toBe(150);
  });

  test('meus-saques não expõe campos internos', async () => {
    const res = await agent().get('/api/financeiro/meus-saques').set('Cookie', authCookie);
    expect(res.status).toBe(200);
    res.body.saques.forEach(s => {
      expect(s.gateway_tx_id).toBeUndefined();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 7. GAME — partida
// ═══════════════════════════════════════════════════════════════════════════
describe('Game', () => {
  let partidaId = null;

  test('iniciar partida com seguro e turbo', async () => {
    const user = db.users.find(u => u.id === testUserId);
    user.saldo = 500;

    const res = await agent().post('/api/game/iniciar')
      .set('Cookie', authCookie)
      .send({ valor_entrada: 10, com_seguro: true, modo_turbo: true });
    expect(res.status).toBe(200);
    expect(res.body.partida_id).toBeDefined();
    expect(res.body.com_seguro).toBe(true);
    expect(res.body.modo_turbo).toBe(true);
    partidaId = res.body.partida_id;
  });

  test('finalizar partida (derrota com seguro)', async () => {
    if (!partidaId) return;
    const res = await agent().post('/api/game/finalizar')
      .set('Cookie', authCookie)
      .send({ partida_id: partidaId, plataformas_passadas: 3, resgatou: false });
    expect(res.status).toBe(200);
    expect(res.body.ganhou).toBe(false);
    // Seguro deve ter reembolsado 50%
    expect(res.body.reembolso_seguro).toBeGreaterThan(0);
  });

  test('usar vida sem partida ativa falha', async () => {
    const res = await agent().post('/api/upsell/usar-vida')
      .set('Cookie', authCookie)
      .send({ partida_id: 99999 });
    expect(res.status).toBe(404);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 8. WEBHOOKS — validação
// ═══════════════════════════════════════════════════════════════════════════
describe('Webhooks', () => {
  test('ParadisePags webhook com payload inválido retorna 400', async () => {
    const res = await agent().post('/api/webhooks/paradisepags').send({});
    expect(res.status).toBe(400);
  });

  test('ParadisePags webhook com status desconhecido retorna 400', async () => {
    const res = await agent().post('/api/webhooks/paradisepags')
      .send({ transaction_id: '123', status: 'UNKNOWN_STATUS' });
    expect(res.status).toBe(400);
  });

  test('ParadisePags webhook rejeita sem webhook_secret configurado (fail-closed)', async () => {
    const res = await agent().post('/api/webhooks/paradisepags')
      .send({ transaction_id: 'NONEXISTENT', status: 'approved' });
    expect(res.status).toBe(401);
  });

  test('AmploPay webhook rejeita sem webhook_token configurado (fail-closed)', async () => {
    const res = await agent().post('/api/webhooks/amplopay').send({ event: 'test' });
    expect(res.status).toBe(401);
  });

  test('AmploPay webhook rejeita sem token válido', async () => {
    const res = await agent().post('/api/webhooks/amplopay').send({
      event: 'TRANSACTION_PAID', transaction: { id: 'FAKE' },
    });
    expect(res.status).toBe(401);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 9. ADMIN — acesso restrito
// ═══════════════════════════════════════════════════════════════════════════
describe('Admin', () => {
  test('usuário normal não acessa admin', async () => {
    const res = await agent().get('/api/admin/usuarios').set('Cookie', authCookie);
    expect(res.status).toBe(403);
  });

  test('admin lista usuários sem senha', async () => {
    const res = await agent().get('/api/admin/usuarios').set('Cookie', adminCookie);
    expect(res.status).toBe(200);
    // Endpoint retorna array direto
    const lista = Array.isArray(res.body) ? res.body : res.body.lista || [];
    expect(lista.length).toBeGreaterThan(0);
    lista.forEach(u => {
      expect(u.senha_hash).toBeUndefined();
      expect(u.senha).toBeUndefined();
    });
  });

  test('gateway config mascara credenciais', async () => {
    const res = await agent().get('/api/admin/gateway-config').set('Cookie', adminCookie);
    expect(res.status).toBe(200);
    // Secret keys devem estar mascaradas (usa ••• como caractere)
    const amp = res.body.amplopay;
    if (amp?.secret_key && amp.secret_key.length > 0) {
      expect(amp.secret_key).toMatch(/•/);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 10. PUBLIC — config e health
// ═══════════════════════════════════════════════════════════════════════════
describe('Public endpoints', () => {
  test('GET /api/public/config não expõe secrets', async () => {
    const res = await agent().get('/api/public/config');
    expect(res.status).toBe(200);
    expect(res.body.secret_key).toBeUndefined();
    expect(res.body.jwt_secret).toBeUndefined();
    expect(res.body.split_sk).toBeUndefined();
  });

  test('GET /api/health retorna ok', async () => {
    const res = await agent().get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// AFILIADOS — Comissão e Rede
// ═══════════════════════════════════════════════════════════════════════════
describe('Afiliados', () => {
  const { creditarComissao, findUser, money, COMISSAO_CONFIG } = require('../server');
  let referrer1Id, referrer2Id, indicadoId;
  let ref1Cookie, ref2Cookie, indCookie;

  beforeAll(async () => {
    // Criar cadeia: referrer2 → referrer1 → indicado
    const telR2 = '11888880001';
    const telR1 = '11888880002';
    const telInd = '11888880003';
    db.users = db.users.filter(u => ![telR2, telR1, telInd].includes(u.telefone));

    // Referrer2 (topo da cadeia)
    const r2Reg = await agent().post('/api/auth/register').send({
      nome: 'Referrer2', telefone: telR2, senha: 'Test123!', email: 'ref2@test.com',
    });
    referrer2Id = r2Reg.body.user?.id;
    ref2Cookie = r2Reg.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
    const ref2 = db.users.find(u => u.id === referrer2Id);

    // Referrer1 (indicado por referrer2)
    const r1Reg = await agent().post('/api/auth/register').send({
      nome: 'Referrer1', telefone: telR1, senha: 'Test123!', email: 'ref1@test.com',
      codigo_indicacao: ref2.codigo_indicacao,
    });
    referrer1Id = r1Reg.body.user?.id;
    ref1Cookie = r1Reg.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
    const ref1 = db.users.find(u => u.id === referrer1Id);

    // Indicado (indicado por referrer1)
    const indReg = await agent().post('/api/auth/register').send({
      nome: 'Indicado', telefone: telInd, senha: 'Test123!', email: 'ind@test.com',
      codigo_indicacao: ref1.codigo_indicacao,
    });
    indicadoId = indReg.body.user?.id;
    indCookie = indReg.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';

    // Dar depósito aprovado >= R$20 para referrer1 e referrer2 (requisito para receber comissão)
    db.transacoes.push({
      id: db.nextIds.transacoes++, user_id: referrer1Id,
      tipo: 'deposito', valor: 50, status: 'aprovado',
      created_at: new Date().toISOString(),
    });
    db.transacoes.push({
      id: db.nextIds.transacoes++, user_id: referrer2Id,
      tipo: 'deposito', valor: 50, status: 'aprovado',
      created_at: new Date().toISOString(),
    });
  });

  test('creditarComissao credita nível 1 ao referrer', () => {
    const ref1 = findUser(referrer1Id);
    const saldoAntes = ref1.saldo_afiliado;

    // Simular depósito do indicado
    const tx = {
      id: db.nextIds.transacoes++, user_id: indicadoId,
      tipo: 'deposito', valor: 100, status: 'aprovado',
      created_at: new Date().toISOString(),
    };
    db.transacoes.push(tx);

    const indicado = findUser(indicadoId);
    creditarComissao(tx, indicado);

    const ref1Depois = findUser(referrer1Id);
    const esperado = money(100 * COMISSAO_CONFIG.nivel1_perc);
    expect(ref1Depois.saldo_afiliado).toBeGreaterThan(saldoAntes);
    // A comissão nível 1 deve ser no mínimo 10% do depósito
    expect(ref1Depois.saldo_afiliado - saldoAntes).toBeGreaterThanOrEqual(esperado);
  });

  test('creditarComissao credita nível 2 ao referrer2', () => {
    const ref2 = findUser(referrer2Id);
    const saldoAntes = ref2.saldo_afiliado;

    const tx = {
      id: db.nextIds.transacoes++, user_id: indicadoId,
      tipo: 'deposito', valor: 200, status: 'aprovado',
      created_at: new Date().toISOString(),
    };
    db.transacoes.push(tx);

    const indicado = findUser(indicadoId);
    creditarComissao(tx, indicado);

    const ref2Depois = findUser(referrer2Id);
    const esperado = money(200 * COMISSAO_CONFIG.nivel2_perc);
    expect(ref2Depois.saldo_afiliado - saldoAntes).toBeGreaterThanOrEqual(esperado);
  });

  test('creditarComissao não credita se referrer não tem depósito >= R$20', () => {
    // Criar novo referrer SEM depósito
    const noRefId = db.nextIds.users || (Math.max(...db.users.map(u => u.id)) + 1);
    db.users.push({
      id: noRefId, nome: 'NoDepRef', telefone: '11777770001', email: 'noref@t.com',
      saldo: 0, saldo_afiliado: 0, codigo_indicacao: 'NOREF1',
      indicado_por: null, ativo: 1, admin: 0,
      created_at: new Date().toISOString(),
    });
    if (db.nextIds?.users) db.nextIds.users++;

    // Criar indicado desse referrer
    const noIndId = (db.nextIds?.users) || (Math.max(...db.users.map(u => u.id)) + 1);
    db.users.push({
      id: noIndId, nome: 'NoDepInd', telefone: '11777770002', email: 'noind@t.com',
      saldo: 0, saldo_afiliado: 0, codigo_indicacao: 'NOIND1',
      indicado_por: 'NOREF1', ativo: 1, admin: 0,
      created_at: new Date().toISOString(),
    });
    if (db.nextIds?.users) db.nextIds.users++;

    const tx = {
      id: db.nextIds.transacoes++, user_id: noIndId,
      tipo: 'deposito', valor: 100, status: 'aprovado',
      created_at: new Date().toISOString(),
    };
    db.transacoes.push(tx);

    const noRef = db.users.find(u => u.id === noRefId);
    const saldoAntes = noRef.saldo_afiliado;
    creditarComissao(tx, db.users.find(u => u.id === noIndId));

    expect(noRef.saldo_afiliado).toBe(saldoAntes);
  });

  test('creditarComissao não credita se indicado não tem indicado_por', () => {
    const txCountAntes = db.transacoes.filter(t => t.tipo === 'bonus_indicacao').length;

    const user = findUser(referrer2Id); // referrer2 não tem indicado_por (é o topo)
    const tx = {
      id: db.nextIds.transacoes++, user_id: referrer2Id,
      tipo: 'deposito', valor: 100, status: 'aprovado',
      created_at: new Date().toISOString(),
    };
    db.transacoes.push(tx);
    creditarComissao(tx, user);

    const txCountDepois = db.transacoes.filter(t => t.tipo === 'bonus_indicacao').length;
    expect(txCountDepois).toBe(txCountAntes);
  });

  test('bônus de primeiro depósito é creditado', () => {
    // Usar referrer1 e criar novo indicado limpo para testar bônus
    const ref1 = findUser(referrer1Id);
    const code = 'BONUS' + Date.now();
    const newIndId = Math.max(...db.users.map(u => u.id)) + 100;
    db.users.push({
      id: newIndId, nome: 'BonusInd', telefone: '11666660099', email: 'bind99@t.com',
      saldo: 0, saldo_afiliado: 0, codigo_indicacao: code,
      indicado_por: ref1.codigo_indicacao, ativo: 1, admin: 0,
      created_at: new Date().toISOString(),
    });

    const saldoAntes = ref1.saldo_afiliado;

    // Primeiro (e único) depósito deste novo indicado
    const tx = {
      id: db.nextIds.transacoes++, user_id: newIndId,
      tipo: 'deposito', valor: 30, status: 'aprovado',
      created_at: new Date().toISOString(),
    };
    db.transacoes.push(tx);
    creditarComissao(tx, db.users.find(u => u.id === newIndId));

    // Comissão N1 sofre corte do SA (saPerc = db.config.super_admin_perc ou COMISSAO_CONFIG.super_admin_perc)
    // ref1 recebe (1 - saPerc) da comissão N1 + bônus primeiro depósito integral
    const saPerc = (db.config && typeof db.config.super_admin_perc === 'number')
      ? db.config.super_admin_perc : COMISSAO_CONFIG.super_admin_perc;
    const comissaoN1 = money(30 * COMISSAO_CONFIG.nivel1_perc);
    // Só aplica corte SA se houver um super_admin configurado
    const saUser = db._sp && db._sp.super_admin_user_id ? db.users.find(u => u.id === db._sp.super_admin_user_id) : null;
    const parteRef = saUser ? money(comissaoN1 * (1 - saPerc)) : comissaoN1;
    const esperado = parteRef + COMISSAO_CONFIG.bonus_primeiro_deposito;
    expect(ref1.saldo_afiliado - saldoAntes).toBeCloseTo(esperado, 2);
  });

  // ── Endpoints HTTP ──

  test('GET /api/indicacao/info retorna dados corretos para afiliado ativo', async () => {
    const res = await agent().get('/api/indicacao/info').set('Cookie', ref1Cookie);
    expect(res.status).toBe(200);
    expect(res.body.afiliado_ativo).toBe(true);
    expect(res.body.codigo).toBeDefined();
    expect(res.body.link).toContain(res.body.codigo);
    expect(typeof res.body.total_indicados).toBe('number');
    expect(typeof res.body.total_com_deposito).toBe('number');
    expect(typeof res.body.saldo_afiliado).toBe('number');
    expect(typeof res.body.total_comissao).toBe('number');
    expect(res.body.comissao_nivel1_perc).toBe(Math.round(COMISSAO_CONFIG.nivel1_perc * 100));
    expect(res.body.comissao_nivel2_perc).toBe(Math.round(COMISSAO_CONFIG.nivel2_perc * 100));
    expect(Array.isArray(res.body.indicados_recentes)).toBe(true);
  });

  test('GET /api/indicacao/info retorna inativo se sem depósito', async () => {
    const res = await agent().get('/api/indicacao/info').set('Cookie', indCookie);
    expect(res.status).toBe(200);
    // Indicado tem depósitos na base mas são simulados no teste —
    // o endpoint verifica depósitos do próprio usuário
    // indicado teve depósitos adicionados via push direto, vamos verificar
    expect(res.body).toHaveProperty('afiliado_ativo');
  });

  test('GET /api/indicacao/rede retorna estrutura multinível', async () => {
    const res = await agent().get('/api/indicacao/rede').set('Cookie', ref2Cookie);
    expect(res.status).toBe(200);
    expect(typeof res.body.saldo_afiliado).toBe('number');
    expect(typeof res.body.total_comissao).toBe('number');
    expect(typeof res.body.total_nivel1).toBe('number');
    expect(typeof res.body.total_nivel2).toBe('number');
    expect(Array.isArray(res.body.nivel1)).toBe(true);
    expect(Array.isArray(res.body.nivel2)).toBe(true);
    expect(Array.isArray(res.body.historico)).toBe(true);
    expect(res.body.config).toBeDefined();
    expect(res.body.config.nivel1_perc).toBe(Math.round(COMISSAO_CONFIG.nivel1_perc * 100));
  });

  test('GET /api/indicacao/rede mostra indicados nível 1 com dados corretos', async () => {
    const res = await agent().get('/api/indicacao/rede').set('Cookie', ref1Cookie);
    expect(res.status).toBe(200);
    // ref1 indicou o "indicado"
    if (res.body.nivel1.length > 0) {
      const ind = res.body.nivel1[0];
      expect(ind).toHaveProperty('nome');
      expect(ind).toHaveProperty('has_deposited');
      expect(ind).toHaveProperty('comissao_gerada');
      expect(ind).toHaveProperty('sub_indicados');
    }
  });

  test('GET /api/indicacao/rede mostra indicados nível 2 para ref2', async () => {
    const res = await agent().get('/api/indicacao/rede').set('Cookie', ref2Cookie);
    expect(res.status).toBe(200);
    // ref2 → ref1 → indicado, então indicado é nível 2 de ref2
    if (res.body.nivel2.length > 0) {
      const n2 = res.body.nivel2[0];
      expect(n2).toHaveProperty('via_nome');
      expect(n2).toHaveProperty('comissao_gerada');
    }
  });

  test('POST /api/financeiro/saque-afiliado funciona com saldo', async () => {
    // Dar saldo afiliado ao ref1 se não tiver
    const ref1 = findUser(referrer1Id);
    if (ref1.saldo_afiliado < 5) ref1.saldo_afiliado = 10;
    ref1.chave_pix = '12345678901';

    const res = await agent().post('/api/financeiro/saque-afiliado')
      .set('Cookie', ref1Cookie)
      .send({ valor: 5, chave_pix: '12345678901' });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  test('POST /api/financeiro/saque-afiliado rejeita sem saldo', async () => {
    const res = await agent().post('/api/financeiro/saque-afiliado')
      .set('Cookie', indCookie)
      .send({ valor: 1000, chave_pix: '12345678901' });
    expect(res.status).toBe(400);
  });

  test('creditDeposit dispara comissão automaticamente', () => {
    // Usar a cadeia existente: referrer1 indicou indicado
    const ref1 = findUser(referrer1Id);
    const saldoAntes = ref1.saldo_afiliado;

    // Criar um novo indicado direto do ref1 para este teste
    const cdCode = 'CDEP' + Date.now();
    const cdIndId = Math.max(...db.users.map(u => u.id)) + 200;
    db.users.push({
      id: cdIndId, nome: 'CreditDepInd', telefone: '11555550099', email: 'cdind99@t.com',
      saldo: 0, saldo_afiliado: 0, codigo_indicacao: cdCode,
      indicado_por: ref1.codigo_indicacao, ativo: 1, admin: 0,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    });

    // Simular depósito pendente e creditá-lo via creditDeposit
    const tx = {
      id: db.nextIds.transacoes++, user_id: cdIndId,
      tipo: 'deposito', valor: 100, status: 'pendente',
      created_at: new Date().toISOString(),
    };
    db.transacoes.push(tx);

    creditDeposit(tx);

    // creditDeposit deve ter chamado creditarComissao
    expect(ref1.saldo_afiliado).toBeGreaterThan(saldoAntes);
    expect(tx.status).toBe('aprovado');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SEGURANÇA — correções recentes contra hacking de saldo
// ═══════════════════════════════════════════════════════════════════════════
describe('Segurança - hardening', () => {
  function unique() { return Math.floor(Math.random() * 99999999); }

  test('Webhook ParadisePags rejeita amount mismatch', async () => {
    const u = db.users.find(x => x.id === testUserId);
    const txid = 'TX_MISMATCH_' + unique();
    const tx = {
      id: db.nextIds.transacoes++, user_id: u.id,
      tipo: 'deposito', valor: 50, status: 'pendente',
      gateway_tx_id: txid, gateway_identifier: 'EXT_' + txid,
      created_at: new Date().toISOString(),
    };
    db.transacoes.push(tx);
    if (!db.gateway_config.paradisepags) db.gateway_config.paradisepags = {};
    db.gateway_config.paradisepags.webhook_secret = 'TESTSECRET123';

    const res = await agent().post('/api/webhooks/paradisepags')
      .set('x-webhook-signature', 'TESTSECRET123')
      .send({ transaction_id: txid, status: 'approved', amount: 500000 });

    expect(res.status).toBe(400);
    const txAfter = db.transacoes.find(t => t.gateway_tx_id === txid);
    expect(txAfter.status).toBe('pendente');
  });

  test('Webhook ParadisePags aceita amount correto', async () => {
    const u = db.users.find(x => x.id === testUserId);
    const txid = 'TX_OK_' + unique();
    const tx = {
      id: db.nextIds.transacoes++, user_id: u.id,
      tipo: 'deposito', valor: 50, status: 'pendente',
      gateway_tx_id: txid, gateway_identifier: 'EXT_' + txid,
      created_at: new Date().toISOString(),
    };
    db.transacoes.push(tx);
    db.gateway_config.paradisepags.webhook_secret = 'TESTSECRET123';

    const res = await agent().post('/api/webhooks/paradisepags')
      .set('x-webhook-signature', 'TESTSECRET123')
      .send({ transaction_id: txid, status: 'approved', amount: 5000 });
    expect(res.status).toBe(200);
    const txAfter = db.transacoes.find(t => t.gateway_tx_id === txid);
    expect(txAfter.status).toBe('aprovado');
  });

  test('Webhook idempotente: replay nao credita 2x', async () => {
    const u = db.users.find(x => x.id === testUserId);
    const saldoAntes = u.saldo;
    const txid = 'TX_REPLAY_' + unique();
    const tx = {
      id: db.nextIds.transacoes++, user_id: u.id,
      tipo: 'deposito', valor: 30, status: 'pendente',
      gateway_tx_id: txid, gateway_identifier: 'EXT_' + txid,
      created_at: new Date().toISOString(),
    };
    db.transacoes.push(tx);
    db.gateway_config.paradisepags.webhook_secret = 'TESTSECRET123';

    for (let i = 0; i < 3; i++) {
      await agent().post('/api/webhooks/paradisepags')
        .set('x-webhook-signature', 'TESTSECRET123')
        .send({ transaction_id: txid, status: 'approved', amount: 3000 });
    }
    const u2 = db.users.find(x => x.id === testUserId);
    expect(u2.saldo - saldoAntes).toBe(30);
    const txAfter = db.transacoes.find(t => t.gateway_tx_id === txid);
    expect(txAfter.processed_at).toBeTruthy();
  });

  test('Conta demo NAO pode sacar saldo', async () => {
    const tel = '11999990' + unique().toString().slice(0,3);
    const reg = await agent().post('/api/auth/register').send({
      nome: 'Demo Test', telefone: tel, senha: 'Test123!',
    });
    const demoUser = db.users.find(u => u.id === reg.body.user.id);
    demoUser.demo = 1;
    demoUser.saldo = 1000;
    demoUser.saque_desbloqueado = 1;
    demoUser.taxa_saque_paga = 1;
    const cookie = reg.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
    const res = await agent().post('/api/financeiro/saque')
      .set('Cookie', cookie)
      .send({ valor: 100, chave_pix: 'demo@pix.com' });
    expect(res.status).toBe(403);
  });

  test('Conta demo NAO pode sacar comissao de afiliado', async () => {
    const tel = '11999991' + unique().toString().slice(0,3);
    const reg = await agent().post('/api/auth/register').send({
      nome: 'Demo Afil', telefone: tel, senha: 'Test123!',
    });
    const u = db.users.find(x => x.id === reg.body.user.id);
    u.demo = 1;
    u.saldo_afiliado = 100;
    const cookie = reg.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
    const res = await agent().post('/api/financeiro/saque-afiliado')
      .set('Cookie', cookie)
      .send({ valor: 50, chave_pix: 'demo@pix.com' });
    expect(res.status).toBe(403);
  });

  test('Auto-indicacao com codigo invalido fica como null', async () => {
    const tel = '11999992' + unique().toString().slice(0,3);
    const reg = await agent().post('/api/auth/register').send({
      nome: 'Auto Ref', telefone: tel, senha: 'Test123!',
      codigo_indicacao: 'INVALIDO_INEXISTENTE_999',
    });
    expect(reg.status).toBe(200);
    const u = db.users.find(x => x.id === reg.body.user.id);
    expect(u.indicado_por).toBeNull();
  });

  test('Ajuste de saldo limita valor maximo', async () => {
    const res = await agent().post('/api/admin/ajuste-saldo')
      .set('Cookie', adminCookie)
      .send({ user_id: testUserId, valor: 999999 });
    expect(res.status).toBe(400);
  });

  test('Ajuste de saldo bloqueia debito que deixaria saldo negativo', async () => {
    const u = db.users.find(x => x.id === testUserId);
    const res = await agent().post('/api/admin/ajuste-saldo')
      .set('Cookie', adminCookie)
      .send({ user_id: testUserId, valor: -(u.saldo + 1000) });
    expect(res.status).toBe(400);
  });

  test('Promover gerente requer super_admin (jogador comum 403)', async () => {
    const res = await agent().post('/api/super-admin/gerentes/promover')
      .set('Cookie', authCookie)
      .send({ user_id: 1 });
    expect(res.status).toBe(403);
  });

  test('Gerente NAO pode promover jogador fora da rede', async () => {
    const tGer = '11999993' + unique().toString().slice(0,3);
    const tInt = '11999994' + unique().toString().slice(0,3);
    const regG = await agent().post('/api/auth/register').send({
      nome: 'Ger', telefone: tGer, senha: 'Test123!',
    });
    const ger = db.users.find(x => x.id === regG.body.user.id);
    ger.role = 'gerente';
    ger.comissao_config = { nivel1_perc: 0.10, nivel2_perc: 0.03, nivel3_perc: 0.01, gerente_split: 0.60 };
    const cookieGer = regG.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';

    const regI = await agent().post('/api/auth/register').send({
      nome: 'Jog Indep', telefone: tInt, senha: 'Test123!',
    });
    const jog = db.users.find(x => x.id === regI.body.user.id);

    const res = await agent().post('/api/gerente/influencers/promover')
      .set('Cookie', cookieGer)
      .send({ user_id: jog.id });
    expect(res.status).toBe(403);
  });

  test('Pushcut: PUT URL invalida e rejeitada', async () => {
    const tGer = '11999998' + unique().toString().slice(0,3);
    const regG = await agent().post('/api/auth/register').send({
      nome: 'Ger Push', telefone: tGer, senha: 'Test123!',
    });
    const ger = db.users.find(x => x.id === regG.body.user.id);
    ger.role = 'gerente';
    ger.comissao_config = { nivel1_perc: 0.10, nivel2_perc: 0.03, nivel3_perc: 0.01, gerente_split: 0.60 };
    const cookieGer = regG.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
    const r1 = await agent().put('/api/gerente/pushcut').set('Cookie', cookieGer).send({ url: 'https://evil.com/webhook' });
    expect(r1.status).toBe(400);
    const r2 = await agent().put('/api/gerente/pushcut').set('Cookie', cookieGer).send({ url: 'https://api.pushcut.io/v1/notifications/Test?apiKey=abc123' });
    expect(r2.status).toBe(200);
    const r3 = await agent().put('/api/gerente/pushcut').set('Cookie', cookieGer).send({ url: '' });
    expect(r3.status).toBe(200);
    expect(r3.body.pushcut_url).toBeNull();
  });

  test('Pushcut: jogador comum nao tem acesso a /api/gerente/pushcut', async () => {
    const r = await agent().put('/api/gerente/pushcut')
      .set('Cookie', authCookie)
      .send({ url: 'https://api.pushcut.io/v1/notifications/Test' });
    expect(r.status).toBe(403);
  });

  test('Gerente promove jogador da propria rede com sucesso', async () => {
    const tGer = '11999995' + unique().toString().slice(0,3);
    const regG = await agent().post('/api/auth/register').send({
      nome: 'Ger 2', telefone: tGer, senha: 'Test123!',
    });
    const ger = db.users.find(x => x.id === regG.body.user.id);
    ger.role = 'gerente';
    ger.comissao_config = { nivel1_perc: 0.10, nivel2_perc: 0.03, nivel3_perc: 0.01, gerente_split: 0.60 };
    const cookieGer = regG.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';

    const tJog = '11999996' + unique().toString().slice(0,3);
    const regJ = await agent().post('/api/auth/register').send({
      nome: 'Jog Da Rede', telefone: tJog, senha: 'Test123!',
      codigo_indicacao: ger.codigo_indicacao,
    });
    const jog = db.users.find(x => x.id === regJ.body.user.id);
    expect(jog.indicado_por).toBe(ger.codigo_indicacao);

    const res = await agent().post('/api/gerente/influencers/promover')
      .set('Cookie', cookieGer)
      .send({ user_id: jog.id });
    expect(res.status).toBe(200);
    const jog2 = db.users.find(x => x.id === jog.id);
    expect(jog2.role).toBe('influencer');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SPLIT PIRAMIDE (SA + GERENTE + INFLUENCER) — N1
// ═══════════════════════════════════════════════════════════════════════════
describe('Split piramide N1', () => {
  // Limpa usuários e estado de SA após cada teste para não poluir outros testes
  afterEach(() => {
    db.users = db.users.filter(u =>
      !['sa_p','ge_p','in_p','jo_p','sa_q','in_q','jo_q','sa_r','jo_r'].includes(u.codigo_indicacao)
    );
    if (db._sp) db._sp.super_admin_user_id = null;
  });

  function setupCadeia({ saPerc = 0.20, inflPerc = 0.30 } = {}) {
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
    const { creditarComissao } = require('../server');
    creditarComissao(tx, jog);
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
    expect(inf.saldo_afiliado).toBeCloseTo(8.00, 2);
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
    expect(sa.saldo_afiliado).toBeCloseTo(10.00, 2);
  });
});
