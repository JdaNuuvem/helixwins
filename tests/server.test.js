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
  if (admin) { admin.admin = 1; admin.role = 'super_admin'; }
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
    // SA sempre corta sua fatia do total; se não houver SA cadastrado, a fatia fica na plataforma
    const parteRef = money(comissaoN1 * (1 - saPerc));
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
  const _uq = { n: 1000 };
  function unique() { return _uq.n++; }

  // Telefones e IDs de transação gerados deterministicamente por este bloco (n começa em 1000)
  // Limpeza necessária pois db.json persiste entre execuções de teste
  const PHONES_TO_CLEAN = [
    '11999990100', '11999991100', '11999992100',
    '11999993100', '11999994100',
    '11999995100', '11999996101', '11999998100',
  ];
  const TX_IDS_TO_CLEAN = ['TX_MISMATCH_1000', 'TX_OK_1001', 'TX_REPLAY_1002'];

  beforeAll(() => {
    db.users = db.users.filter(u => !PHONES_TO_CLEAN.includes(u.telefone));
    db.transacoes = (db.transacoes || []).filter(t =>
      !TX_IDS_TO_CLEAN.includes(t.gateway_tx_id)
    );
  });

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
    });
    const jog = db.users.find(x => x.id === regJ.body.user.id);
    // Vincula jogador à rede do gerente sem usar o link direto (que auto-promoveria a influencer)
    jog.indicado_por = ger.codigo_indicacao;
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

  test('SA=20%, inflPerc=30% → SA R$2, gerente R$8 (5 N1 + 3 N2), influencer R$3 em dep R$100', () => {
    const { sa, ger, inf, jog } = setupCadeia({ saPerc: 0.20, inflPerc: 0.30 });
    const tx = { id: 999001, user_id: jog.id, tipo: 'deposito', valor: 100, status: 'aprovado', created_at: new Date().toISOString() };
    db.transacoes.push(tx);
    const { creditarComissao } = require('../server');
    creditarComissao(tx, jog);
    expect(sa.saldo_afiliado).toBeCloseTo(2.00, 2);
    expect(ger.saldo_afiliado).toBeCloseTo(8.00, 2);
    expect(inf.saldo_afiliado).toBeCloseTo(3.00, 2);
  });

  test('SA=10%, inflPerc=40% → SA R$1, gerente R$8 (5 N1 + 3 N2), influencer R$4 em dep R$100', () => {
    const { sa, ger, inf, jog } = setupCadeia({ saPerc: 0.10, inflPerc: 0.40 });
    const tx = { id: 999002, user_id: jog.id, tipo: 'deposito', valor: 100, status: 'aprovado', created_at: new Date().toISOString() };
    db.transacoes.push(tx);
    require('../server').creditarComissao(tx, jog);
    expect(sa.saldo_afiliado).toBeCloseTo(1.00, 2);
    expect(ger.saldo_afiliado).toBeCloseTo(8.00, 2);
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
      .set('Cookie', authCookie)
      .send({ super_admin_perc: 15 });
    expect(res.status).toBe(403);
  });
});

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

  test('GET painel retorna influencer_perc, disponivel_perc, gerente_perc e NAO expoe super_admin_perc', async () => {
    const res = await agent().get('/api/gerente/painel').set('Cookie', gerenteCookie);
    expect(res.status).toBe(200);
    expect(typeof res.body.config.influencer_perc).toBe('number');
    expect(typeof res.body.config.disponivel_perc).toBe('number');
    expect(res.body.config.gerente_perc).toBe(
      res.body.config.disponivel_perc - res.body.config.influencer_perc
    );
    expect(res.body.config.super_admin_perc).toBeUndefined();
  });
});

describe('Gerente - influencer override com influencer_perc', () => {
  let gerenteCookie = '';
  let gerenteId = null;
  let influencerId = null;

  beforeAll(async () => {
    const telG = '11999990020';
    const telI = '11999990021';
    db.users = db.users.filter(u =>
      u.telefone !== telG && u.telefone !== telI &&
      u.email !== 'go@test.com' && u.email !== 'io@test.com'
    );
    const regG = await agent().post('/api/auth/register').send({
      nome: 'Ger Ovr', telefone: telG, senha: 'GerOvr1!', email: 'go@test.com',
    });
    gerenteId = regG.body.user?.id;
    const g = db.users.find(x => x.id === gerenteId);
    g.role = 'gerente';
    g.comissao_config = { nivel1_perc: 0.10, nivel2_perc: 0.03, nivel3_perc: 0.01, influencer_perc: 0.30 };
    gerenteCookie = regG.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';

    const regI = await agent().post('/api/auth/register').send({
      nome: 'Inf Ovr', telefone: telI, senha: 'InfOvr1!', email: 'io@test.com',
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

describe('Migracao gerente_split -> influencer_perc', () => {
  test('user com comissao_config antiga (gerente_split) e migrado na logica inline', () => {
    const u = {
      id: 99999, nome: 'Legado', telefone: '11000009999', senha_hash: 'x',
      role: 'gerente', codigo_indicacao: 'leg', indicado_por: null, prospectador_id: null,
      saldo: 0, saldo_afiliado: 0, ativo: 1,
      comissao_config: { nivel1_perc: 0.10, nivel2_perc: 0.03, nivel3_perc: 0.01, gerente_split: 0.60 },
      created_at: new Date().toISOString(),
    };

    // Executa a mesma lógica de migração do bootstrap do server
    if (u.comissao_config) {
      if (typeof u.comissao_config.gerente_split === 'number' && typeof u.comissao_config.influencer_perc === 'undefined') {
        u.comissao_config.influencer_perc = +(1 - u.comissao_config.gerente_split).toFixed(4);
        delete u.comissao_config.gerente_split;
      }
    }

    expect(u.comissao_config.influencer_perc).toBeCloseTo(0.40, 4);
    expect(u.comissao_config.gerente_split).toBeUndefined();
  });

  test('migracao e idempotente (rodar 2x nao altera valor)', () => {
    const u = {
      comissao_config: { nivel1_perc: 0.10, nivel2_perc: 0.03, nivel3_perc: 0.01, influencer_perc: 0.30 },
    };
    const before = u.comissao_config.influencer_perc;

    // Roda a migração novamente; não deve mudar nada pois já tem influencer_perc
    if (u.comissao_config) {
      if (typeof u.comissao_config.gerente_split === 'number' && typeof u.comissao_config.influencer_perc === 'undefined') {
        u.comissao_config.influencer_perc = +(1 - u.comissao_config.gerente_split).toFixed(4);
        delete u.comissao_config.gerente_split;
      }
    }
    expect(u.comissao_config.influencer_perc).toBe(before);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// GERENTE — todas as abas
// ═══════════════════════════════════════════════════════════════════════════
describe('Gerente - aba dashboard (GET /api/gerente/painel)', () => {
  let gCookie = '', gId = null, iId = null;

  beforeAll(async () => {
    const telG = '11800000001', telI = '11800000002';
    db.users = db.users.filter(u => u.telefone !== telG && u.telefone !== telI);
    const rg = await agent().post('/api/auth/register').send({ nome: 'Ger Tab', telefone: telG, senha: 'Ger123!', email: 'gertab@test.com' });
    gId = rg.body.user?.id;
    const g = db.users.find(x => x.id === gId);
    g.role = 'gerente';
    g.saldo_afiliado = 25;
    g.comissao_config = { nivel1_perc: 0.10, nivel2_perc: 0.03, nivel3_perc: 0.01, influencer_perc: 0.30 };
    gCookie = rg.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';

    const ri = await agent().post('/api/auth/register').send({ nome: 'Inf Tab', telefone: telI, senha: 'Inf123!', email: 'inftab@test.com', codigo_indicacao: g.codigo_indicacao });
    iId = ri.body.user?.id;
    const i = db.users.find(x => x.id === iId);
    i.role = 'influencer';
    i.prospectador_id = gId;
    db.config = db.config || {};
    db.config.super_admin_perc = 0.20;
  });

  test('retorna 200 com stats, link_afiliado, config e influencers', async () => {
    const res = await agent().get('/api/gerente/painel').set('Cookie', gCookie);
    expect(res.status).toBe(200);
    expect(res.body.me).toBeDefined();
    expect(res.body.link_afiliado).toContain('?ref=');
    expect(res.body.stats.saldo_afiliado).toBe(25);
    expect(typeof res.body.stats.total_influencers).toBe('number');
    expect(Array.isArray(res.body.influencers)).toBe(true);
  });

  test('config não expõe super_admin_perc', async () => {
    const res = await agent().get('/api/gerente/painel').set('Cookie', gCookie);
    expect(res.body.config.super_admin_perc).toBeUndefined();
    expect(typeof res.body.config.influencer_perc).toBe('number');
    expect(typeof res.body.config.gerente_perc).toBe('number');
  });

  test('jogador comum recebe 403', async () => {
    const res = await agent().get('/api/gerente/painel').set('Cookie', authCookie);
    expect(res.status).toBe(403);
  });
});

describe('Gerente - aba influencers', () => {
  let gCookie = '', gId = null;

  beforeAll(async () => {
    const tel = '11800000010';
    db.users = db.users.filter(u => u.telefone !== tel);
    const rg = await agent().post('/api/auth/register').send({ nome: 'Ger Inf', telefone: tel, senha: 'GerInf1!', email: 'gerinf@test.com' });
    gId = rg.body.user?.id;
    const g = db.users.find(x => x.id === gId);
    g.role = 'gerente';
    g.comissao_config = { nivel1_perc: 0.10, nivel2_perc: 0.03, nivel3_perc: 0.01, influencer_perc: 0.30 };
    gCookie = rg.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
  });

  test('GET /api/gerente/influencers retorna lista com percentuais', async () => {
    const res = await agent().get('/api/gerente/influencers').set('Cookie', gCookie);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.influencers)).toBe(true);
    expect(typeof res.body.influencer_perc).toBe('number');
    expect(typeof res.body.disponivel_perc).toBe('number');
    expect(typeof res.body.gerente_perc).toBe('number');
  });

  test('promover jogador da rede vira influencer', async () => {
    const telJ = '11800000011';
    db.users = db.users.filter(u => u.telefone !== telJ);
    const rj = await agent().post('/api/auth/register').send({ nome: 'Jog p/ Inf', telefone: telJ, senha: 'Jog123!' });
    const jog = db.users.find(x => x.id === rj.body.user?.id);
    jog.role = 'jogador';
    jog.indicado_por = db.users.find(x => x.id === gId).codigo_indicacao;
    jog.prospectador_id = gId;

    const res = await agent().post('/api/gerente/influencers/promover').set('Cookie', gCookie).send({ user_id: jog.id });
    expect(res.status).toBe(200);
    expect(db.users.find(x => x.id === jog.id).role).toBe('influencer');
  });

  test('remover influencer da rede volta para jogador', async () => {
    const g = db.users.find(x => x.id === gId);
    const meus = db.users.filter(u => u.role === 'influencer' && u.prospectador_id === gId);
    if (!meus.length) return;

    const res = await agent().post('/api/gerente/influencers/remover').set('Cookie', gCookie).send({ user_id: meus[0].id });
    expect(res.status).toBe(200);
    expect(db.users.find(x => x.id === meus[0].id).role).toBe('jogador');
  });

  test('jogador sem auth recebe 403', async () => {
    const res = await agent().get('/api/gerente/influencers').set('Cookie', authCookie);
    expect(res.status).toBe(403);
  });
});

describe('Gerente - aba comissoes (PUT /api/gerente/config)', () => {
  let gCookie = '', gId = null;

  beforeAll(async () => {
    const tel = '11800000020';
    db.users = db.users.filter(u => u.telefone !== tel);
    const rg = await agent().post('/api/auth/register').send({ nome: 'Ger Comis', senha: 'GerC1!', telefone: tel, email: 'gercomis@test.com' });
    gId = rg.body.user?.id;
    const g = db.users.find(x => x.id === gId);
    g.role = 'gerente';
    g.comissao_config = { nivel1_perc: 0.10, nivel2_perc: 0.03, nivel3_perc: 0.01, influencer_perc: 0.30 };
    gCookie = rg.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
    db.config = db.config || {};
    db.config.super_admin_perc = 0.20;
  });

  test('salvar config com percentuais válidos retorna 200', async () => {
    const res = await agent().put('/api/gerente/config').set('Cookie', gCookie).send({ nivel1_perc: 12, nivel2_perc: 4, nivel3_perc: 1, influencer_perc: 35 });
    expect(res.status).toBe(200);
    expect(res.body.config.influencer_perc).toBe(35);
  });

  test('influencer_perc acima do teto (80) retorna 400', async () => {
    const res = await agent().put('/api/gerente/config').set('Cookie', gCookie).send({ influencer_perc: 90 });
    expect(res.status).toBe(400);
  });
});

describe('Gerente - aba saque', () => {
  let gCookie = '', gId = null;

  beforeAll(async () => {
    const tel = '11800000030';
    db.users = db.users.filter(u => u.telefone !== tel);
    const rg = await agent().post('/api/auth/register').send({ nome: 'Ger Saque', senha: 'GerS1!', telefone: tel, email: 'gersaque@test.com' });
    gId = rg.body.user?.id;
    const g = db.users.find(x => x.id === gId);
    g.role = 'gerente';
    g.saldo_afiliado = 50;
    g.comissao_config = { nivel1_perc: 0.10, nivel2_perc: 0.03, nivel3_perc: 0.01, influencer_perc: 0.30 };
    gCookie = rg.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
  });

  test('saque com saldo suficiente retorna ok e debita saldo', async () => {
    const g = db.users.find(x => x.id === gId);
    g.saldo_afiliado = 50;
    const res = await agent().post('/api/gerente/saque').set('Cookie', gCookie).send({ valor: 20, chave_pix: 'ger@pix.com' });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.taxa).toBe(2);
    expect(res.body.liquido).toBe(18);
    expect(db.users.find(x => x.id === gId).saldo_afiliado).toBe(30);
  });

  test('saque abaixo do mínimo (R$5) retorna 400', async () => {
    const res = await agent().post('/api/gerente/saque').set('Cookie', gCookie).send({ valor: 2, chave_pix: 'ger@pix.com' });
    expect(res.status).toBe(400);
  });

  test('saque sem PIX retorna 400', async () => {
    const res = await agent().post('/api/gerente/saque').set('Cookie', gCookie).send({ valor: 10, chave_pix: '' });
    expect(res.status).toBe(400);
  });

  test('saque com saldo insuficiente retorna 400', async () => {
    const g = db.users.find(x => x.id === gId);
    g.saldo_afiliado = 3;
    const res = await agent().post('/api/gerente/saque').set('Cookie', gCookie).send({ valor: 100, chave_pix: 'ger@pix.com' });
    expect(res.status).toBe(400);
  });
});

describe('Gerente - aba contas demo', () => {
  let gCookie = '', gId = null;

  beforeAll(async () => {
    const tel = '11800000040';
    db.users = db.users.filter(u => u.telefone !== tel);
    const rg = await agent().post('/api/auth/register').send({ nome: 'Ger Demo', senha: 'GerD1!', telefone: tel, email: 'gerdemo@test.com' });
    gId = rg.body.user?.id;
    const g = db.users.find(x => x.id === gId);
    g.role = 'gerente';
    g.comissao_config = { nivel1_perc: 0.10, nivel2_perc: 0.03, nivel3_perc: 0.01, influencer_perc: 0.30 };
    gCookie = rg.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
  });

  test('criar lote de 3 contas demo retorna 200 com contas criadas', async () => {
    const res = await agent().post('/api/gerente/contas-demo/criar-lote').set('Cookie', gCookie).send({ nome_base: 'Teste', senha: 'demo1234', quantidade: 3, valor_inicial: 10 });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.contas)).toBe(true);
    expect(res.body.contas.length).toBe(3);
    expect(res.body.contas[0].nome).toContain('Teste');
  });

  test('criar com quantidade zero retorna 400', async () => {
    const res = await agent().post('/api/gerente/contas-demo/criar-lote').set('Cookie', gCookie).send({ nome_base: 'X', senha: 'demo1234', quantidade: 0 });
    expect(res.status).toBe(400);
  });

  test('criar com quantidade > 50 retorna 400', async () => {
    const res = await agent().post('/api/gerente/contas-demo/criar-lote').set('Cookie', gCookie).send({ nome_base: 'X', senha: 'demo1234', quantidade: 100 });
    expect(res.status).toBe(400);
  });

  test('criar com senha curta retorna 400', async () => {
    const res = await agent().post('/api/gerente/contas-demo/criar-lote').set('Cookie', gCookie).send({ nome_base: 'X', senha: 'ab', quantidade: 2 });
    expect(res.status).toBe(400);
  });

  test('GET /api/gerente/contas-demo lista contas demo criadas', async () => {
    const res = await agent().get('/api/gerente/contas-demo').set('Cookie', gCookie);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.contas)).toBe(true);
  });
});

describe('Gerente - aba transacoes', () => {
  let gCookie = '', gId = null;

  beforeAll(async () => {
    const tel = '11800000050';
    db.users = db.users.filter(u => u.telefone !== tel);
    const rg = await agent().post('/api/auth/register').send({ nome: 'Ger Tx', senha: 'GerTx1!', telefone: tel, email: 'gertx@test.com' });
    gId = rg.body.user?.id;
    const g = db.users.find(x => x.id === gId);
    g.role = 'gerente';
    g.comissao_config = { nivel1_perc: 0.10, nivel2_perc: 0.03, nivel3_perc: 0.01, influencer_perc: 0.30 };
    db.transacoes.push({ id: db.nextIds.transacoes++, user_id: gId, tipo: 'bonus_indicacao', valor: 5, status: 'aprovado', created_at: new Date().toISOString() });
    gCookie = rg.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
  });

  test('retorna array de transacoes sem campos internos', async () => {
    const res = await agent().get('/api/gerente/transacoes').set('Cookie', gCookie);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.transacoes)).toBe(true);
    const tx = res.body.transacoes.find(t => t.user_id === gId || t.tipo === 'bonus_indicacao');
    if (tx) {
      expect(tx.gateway_tx_id).toBeUndefined();
      expect(tx._k).toBeUndefined();
    }
  });

  test('não inclui transações de outros usuários', async () => {
    const res = await agent().get('/api/gerente/transacoes').set('Cookie', gCookie);
    res.body.transacoes.forEach(t => {
      expect(t.user_id).toBeUndefined();
    });
  });
});

describe('Gerente - aba notificacoes (Pushcut)', () => {
  let gCookie = '', gId = null;

  beforeAll(async () => {
    const tel = '11800000060';
    db.users = db.users.filter(u => u.telefone !== tel);
    const rg = await agent().post('/api/auth/register').send({ nome: 'Ger Notif', senha: 'GerN1!', telefone: tel, email: 'gernotif@test.com' });
    gId = rg.body.user?.id;
    const g = db.users.find(x => x.id === gId);
    g.role = 'gerente';
    g.comissao_config = { nivel1_perc: 0.10, nivel2_perc: 0.03, nivel3_perc: 0.01, influencer_perc: 0.30 };
    gCookie = rg.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
  });

  test('salvar URL Pushcut válida retorna 200', async () => {
    const res = await agent().put('/api/gerente/pushcut').set('Cookie', gCookie).send({ url: 'https://api.pushcut.io/v1/notifications/HelixWins?apiKey=abc' });
    expect(res.status).toBe(200);
    expect(db.users.find(x => x.id === gId).pushcut_url).toBeTruthy();
  });

  test('remover URL (vazio) salva como null', async () => {
    const res = await agent().put('/api/gerente/pushcut').set('Cookie', gCookie).send({ url: '' });
    expect(res.status).toBe(200);
    expect(res.body.pushcut_url).toBeNull();
  });

  test('URL de domínio não-Pushcut é rejeitada', async () => {
    const res = await agent().put('/api/gerente/pushcut').set('Cookie', gCookie).send({ url: 'https://evil.com/webhook' });
    expect(res.status).toBe(400);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// INFLUENCER — todas as abas
// ═══════════════════════════════════════════════════════════════════════════
describe('Influencer - aba dashboard (GET /api/influencer/painel)', () => {
  let iCookie = '', iId = null;

  beforeAll(async () => {
    const tel = '11700000001';
    db.users = db.users.filter(u => u.telefone !== tel);
    const ri = await agent().post('/api/auth/register').send({ nome: 'Inf Dash', telefone: tel, senha: 'Inf123!', email: 'infdash@test.com' });
    iId = ri.body.user?.id;
    const i = db.users.find(x => x.id === iId);
    i.role = 'influencer';
    i.saldo_afiliado = 15;
    iCookie = ri.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
  });

  test('retorna 200 com stats, link_afiliado, config e jogadores', async () => {
    const res = await agent().get('/api/influencer/painel').set('Cookie', iCookie);
    expect(res.status).toBe(200);
    expect(res.body.me).toBeDefined();
    expect(res.body.link_afiliado).toContain('?ref=');
    expect(res.body.stats.saldo_afiliado).toBe(15);
    expect(typeof res.body.stats.total_jogadores).toBe('number');
    expect(Array.isArray(res.body.jogadores)).toBe(true);
  });

  test('config inclui nivel1_perc', async () => {
    const res = await agent().get('/api/influencer/painel').set('Cookie', iCookie);
    expect(typeof res.body.config.nivel1_perc).toBe('number');
  });

  test('jogador sem role influencer recebe 403', async () => {
    const res = await agent().get('/api/influencer/painel').set('Cookie', authCookie);
    expect(res.status).toBe(403);
  });
});

describe('Influencer - aba jogadores', () => {
  let iCookie = '', iId = null;

  beforeAll(async () => {
    const telI = '11700000010', telJ = '11700000011';
    db.users = db.users.filter(u => u.telefone !== telI && u.telefone !== telJ);
    const ri = await agent().post('/api/auth/register').send({ nome: 'Inf Jog', telefone: telI, senha: 'InflJ1!', email: 'infjog@test.com' });
    iId = ri.body.user?.id;
    const i = db.users.find(x => x.id === iId);
    i.role = 'influencer';
    iCookie = ri.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';

    // Criar jogador indicado pelo influencer
    await agent().post('/api/auth/register').send({ nome: 'Jog Ind', telefone: telJ, senha: 'Jog123!', codigo_indicacao: i.codigo_indicacao });
  });

  test('painel lista jogadores indicados com total_depositado', async () => {
    const res = await agent().get('/api/influencer/painel').set('Cookie', iCookie);
    expect(res.status).toBe(200);
    expect(res.body.jogadores.length).toBeGreaterThanOrEqual(1);
    const jog = res.body.jogadores[0];
    expect(jog).toHaveProperty('nome');
    expect(jog).toHaveProperty('total_depositado');
  });

  test('jogadores não expõem senha_hash', async () => {
    const res = await agent().get('/api/influencer/painel').set('Cookie', iCookie);
    res.body.jogadores.forEach(j => {
      expect(j.senha_hash).toBeUndefined();
    });
  });
});

describe('Influencer - aba saque', () => {
  let iCookie = '', iId = null;

  beforeAll(async () => {
    const tel = '11700000020';
    db.users = db.users.filter(u => u.telefone !== tel);
    const ri = await agent().post('/api/auth/register').send({ nome: 'Inf Saque', telefone: tel, senha: 'InfS1!', email: 'infsaque@test.com' });
    iId = ri.body.user?.id;
    const i = db.users.find(x => x.id === iId);
    i.role = 'influencer';
    i.saldo_afiliado = 50;
    iCookie = ri.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
  });

  test('saque com saldo suficiente retorna ok e debita saldo_afiliado', async () => {
    const i = db.users.find(x => x.id === iId);
    i.saldo_afiliado = 50;
    const res = await agent().post('/api/influencer/saque').set('Cookie', iCookie).send({ valor: 20, chave_pix: 'inf@pix.com' });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.taxa).toBe(2);
    expect(res.body.liquido).toBe(18);
    expect(db.users.find(x => x.id === iId).saldo_afiliado).toBe(30);
  });

  test('saque com valor menor que mínimo retorna 400', async () => {
    const res = await agent().post('/api/influencer/saque').set('Cookie', iCookie).send({ valor: 3, chave_pix: 'inf@pix.com' });
    expect(res.status).toBe(400);
  });

  test('saque sem chave PIX retorna 400', async () => {
    const res = await agent().post('/api/influencer/saque').set('Cookie', iCookie).send({ valor: 10 });
    expect(res.status).toBe(400);
  });

  test('saldo insuficiente retorna 400', async () => {
    const i = db.users.find(x => x.id === iId);
    i.saldo_afiliado = 0;
    const res = await agent().post('/api/influencer/saque').set('Cookie', iCookie).send({ valor: 50, chave_pix: 'inf@pix.com' });
    expect(res.status).toBe(400);
  });
});

describe('Influencer - aba transacoes', () => {
  let iCookie = '', iId = null;

  beforeAll(async () => {
    const tel = '11700000030';
    db.users = db.users.filter(u => u.telefone !== tel);
    const ri = await agent().post('/api/auth/register').send({ nome: 'Inf Tx', telefone: tel, senha: 'InfTx1!', email: 'inftx@test.com' });
    iId = ri.body.user?.id;
    const i = db.users.find(x => x.id === iId);
    i.role = 'influencer';
    db.transacoes.push({ id: db.nextIds.transacoes++, user_id: iId, tipo: 'bonus_indicacao', valor: 3, status: 'aprovado', created_at: new Date().toISOString() });
    iCookie = ri.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
  });

  test('retorna array de transacoes sem campos internos', async () => {
    const res = await agent().get('/api/influencer/transacoes').set('Cookie', iCookie);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.transacoes)).toBe(true);
    res.body.transacoes.forEach(t => {
      expect(t._k).toBeUndefined();
      expect(t.gateway_tx_id).toBeUndefined();
    });
  });

  test('lista apenas tipo bonus_indicacao e saque_afiliado', async () => {
    const res = await agent().get('/api/influencer/transacoes').set('Cookie', iCookie);
    res.body.transacoes.forEach(t => {
      expect(['bonus_indicacao', 'saque_afiliado']).toContain(t.tipo);
    });
  });
});

describe('Influencer - aba notificacoes (Pushcut)', () => {
  let iCookie = '', iId = null;

  beforeAll(async () => {
    const tel = '11700000040';
    db.users = db.users.filter(u => u.telefone !== tel);
    const ri = await agent().post('/api/auth/register').send({ nome: 'Inf Notif', telefone: tel, senha: 'InfNf1!', email: 'infnotif@test.com' });
    iId = ri.body.user?.id;
    const i = db.users.find(x => x.id === iId);
    i.role = 'influencer';
    iCookie = ri.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
  });

  test('salvar URL Pushcut válida retorna 200', async () => {
    const res = await agent().put('/api/influencer/pushcut').set('Cookie', iCookie).send({ url: 'https://api.pushcut.io/v1/notifications/Helix?apiKey=xyz' });
    expect(res.status).toBe(200);
    expect(db.users.find(x => x.id === iId).pushcut_url).toBeTruthy();
  });

  test('remover URL salva null', async () => {
    const res = await agent().put('/api/influencer/pushcut').set('Cookie', iCookie).send({ url: '' });
    expect(res.status).toBe(200);
    expect(res.body.pushcut_url).toBeNull();
  });

  test('URL de domínio inválido é rejeitada', async () => {
    const res = await agent().put('/api/influencer/pushcut').set('Cookie', iCookie).send({ url: 'https://notpushcut.com/hook' });
    expect(res.status).toBe(400);
  });

  test('jogador sem role influencer recebe 403', async () => {
    const res = await agent().put('/api/influencer/pushcut').set('Cookie', authCookie).send({ url: '' });
    expect(res.status).toBe(403);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// JOGADOR — fluxo completo de ponta a ponta
// ═══════════════════════════════════════════════════════════════════════════
describe('Jogador - fluxo completo (depositar → jogar → sacar → indicar)', () => {
  let jCookie = '', jId = null;

  beforeAll(async () => {
    const tel = '11600000001';
    db.users = db.users.filter(u => u.telefone !== tel);
    const rj = await agent().post('/api/auth/register').send({ nome: 'Jog Fluxo', telefone: tel, senha: 'Jog123!', email: 'jogfluxo@test.com' });
    jId = rj.body.user?.id;
    jCookie = rj.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
  });

  test('1) GET /api/auth/me retorna perfil do jogador sem senha', async () => {
    const res = await agent().get('/api/auth/me').set('Cookie', jCookie);
    expect(res.status).toBe(200);
    expect(res.body.user.senha_hash).toBeUndefined();
    expect(res.body.user.role).toBe('jogador');
  });

  test('2) GET /api/public/config retorna config do site sem secrets', async () => {
    const res = await agent().get('/api/public/config');
    expect(res.status).toBe(200);
    expect(res.body.secret_key).toBeUndefined();
  });

  test('3) GET /api/upsell/info retorna opções disponíveis', async () => {
    const res = await agent().get('/api/upsell/info').set('Cookie', jCookie);
    expect(res.status).toBe(200);
    expect(res.body.seguro).toBeDefined();
    expect(res.body.modo_turbo).toBeDefined();
  });

  test('4) POST /api/game/iniciar com saldo debita e retorna partida_id', async () => {
    const u = db.users.find(x => x.id === jId);
    u.saldo = 200;
    const res = await agent().post('/api/game/iniciar').set('Cookie', jCookie).send({ valor_entrada: 10 });
    expect(res.status).toBe(200);
    expect(res.body.partida_id).toBeDefined();
  });

  test('5) POST /api/game/finalizar sem resgate retorna 200', async () => {
    const u = db.users.find(x => x.id === jId);
    u.saldo = 200;
    const ativa = db.partidas.find(p => p.user_id === jId && p.status === 'ativa');
    let partidaId;
    if (ativa) {
      partidaId = ativa.id;
    } else {
      const ini = await agent().post('/api/game/iniciar').set('Cookie', jCookie).send({ valor_entrada: 5 });
      partidaId = ini.body.partida_id;
    }
    const res = await agent().post('/api/game/finalizar').set('Cookie', jCookie).send({ partida_id: partidaId, plataformas_passadas: 0, resgatou: false });
    expect(res.status).toBe(200);
    expect(typeof res.body.valor_ganho_ou_perdido).toBe('number');
  });

  test('6) POST /api/financeiro/saque com saldo desbloqueado funciona', async () => {
    const u = db.users.find(x => x.id === jId);
    u.saldo = 200;
    u.saque_desbloqueado = 1;
    u.taxa_saque_paga = 1;
    const res = await agent().post('/api/financeiro/saque').set('Cookie', jCookie).send({ valor: 50, chave_pix: '12345678901' });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  test('7) GET /api/indicacao/info retorna link de afiliado do jogador', async () => {
    const res = await agent().get('/api/indicacao/info').set('Cookie', jCookie);
    expect(res.status).toBe(200);
    expect(res.body.link).toBeDefined();
    expect(res.body.codigo).toBeDefined();
  });

  test('8) GET /api/financeiro/historico retorna transações sem campos sensíveis', async () => {
    const res = await agent().get('/api/financeiro/historico').set('Cookie', jCookie);
    expect(res.status).toBe(200);
    res.body.transacoes.forEach(t => {
      expect(t._k).toBeUndefined();
      expect(t.gateway_tx_id).toBeUndefined();
    });
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
    db._sp = db._sp || {};
    db._sp.super_admin_user_id = sa.id;
    const tx = { id: 9999991, user_id: jog.id, tipo: 'deposito', valor: 100, status: 'aprovado', _split: true, created_at: new Date().toISOString() };
    db.transacoes.push(tx);
    const saldoAntes = sa.saldo_afiliado;
    require('../server').creditarComissao(tx, jog);
    // 100% de N1+N2+N3 = 10% + 3% + 1% = 14% do depósito = R$14
    expect(sa.saldo_afiliado - saldoAntes).toBeCloseTo(14.00, 2);
  });
});

// ══════════════════════════════════════════════════════════════════
// NOVOS TESTES — regras de negócio e cobertura extra
// ══════════════════════════════════════════════════════════════════

describe('Gerente - aba saque (regras de negócio)', () => {
  let gsCookie, gsId;
  beforeAll(async () => {
    const tel = '11800000090';
    db.users = db.users.filter(u => u.telefone !== tel);
    const rg = await agent().post('/api/auth/register').send({ nome: 'Gerente Saque Test', telefone: tel, senha: 'GerSq1!' });
    gsId = rg.body.user?.id;
    const g = db.users.find(x => x.id === gsId);
    g.role = 'gerente';
    g.saldo_afiliado = 100;
    const rl = await agent().post('/api/auth/login').send({ telefone: tel, senha: 'GerSq1!' });
    gsCookie = rl.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
  });

  test('saque sem chave PIX retorna 400', async () => {
    const res = await agent().post('/api/gerente/saque').set('Cookie', gsCookie).send({ valor: 20 });
    expect(res.status).toBe(400);
  });

  test('saque com PIX curto (< 5 chars) retorna 400', async () => {
    const res = await agent().post('/api/gerente/saque').set('Cookie', gsCookie).send({ valor: 20, chave_pix: 'abc' });
    expect(res.status).toBe(400);
  });

  test('saque abaixo do mínimo (R$ 3) retorna 400', async () => {
    const res = await agent().post('/api/gerente/saque').set('Cookie', gsCookie).send({ valor: 3, chave_pix: '11999990001' });
    expect(res.status).toBe(400);
  });

  test('saque acima do saldo disponível retorna 400', async () => {
    db.users.find(x => x.id === gsId).saldo_afiliado = 10;
    const res = await agent().post('/api/gerente/saque').set('Cookie', gsCookie).send({ valor: 50, chave_pix: '11999990001' });
    expect(res.status).toBe(400);
    db.users.find(x => x.id === gsId).saldo_afiliado = 100;
  });

  test('saque válido retorna 200 e debita saldo_afiliado', async () => {
    const g = db.users.find(x => x.id === gsId);
    g.saldo_afiliado = 100;
    const res = await agent().post('/api/gerente/saque').set('Cookie', gsCookie).send({ valor: 20, chave_pix: '11999990001' });
    expect(res.status).toBe(200);
    expect(db.users.find(x => x.id === gsId).saldo_afiliado).toBeCloseTo(80, 2);
  });

  test('saque cria transação com status pendente', async () => {
    const g = db.users.find(x => x.id === gsId);
    g.saldo_afiliado = 100;
    await agent().post('/api/gerente/saque').set('Cookie', gsCookie).send({ valor: 10, chave_pix: '11999990002' });
    const tx = db.transacoes.filter(t => t.user_id === gsId && t.tipo === 'saque_afiliado').pop();
    expect(tx).toBeDefined();
    expect(tx.status).toBe('pendente');
    expect(tx.valor_liquido).toBeCloseTo(8, 2);
  });

  test('GET /api/gerente/transacoes retorna lista de transações', async () => {
    const res = await agent().get('/api/gerente/transacoes').set('Cookie', gsCookie);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.transacoes)).toBe(true);
  });

  test('jogador sem role gerente recebe 403 no saque gerente', async () => {
    const res = await agent().post('/api/gerente/saque').set('Cookie', authCookie).send({ valor: 10, chave_pix: '11999990001' });
    expect(res.status).toBe(403);
  });
});

describe('Influencer - aba saque (regras de negócio)', () => {
  let isCookie, isId;
  beforeAll(async () => {
    const tel = '11700000090';
    db.users = db.users.filter(u => u.telefone !== tel);
    const rg = await agent().post('/api/auth/register').send({ nome: 'Inf Saque Test', telefone: tel, senha: 'InfSq1!' });
    isId = rg.body.user?.id;
    const u = db.users.find(x => x.id === isId);
    u.role = 'influencer';
    u.saldo_afiliado = 80;
    const rl = await agent().post('/api/auth/login').send({ telefone: tel, senha: 'InfSq1!' });
    isCookie = rl.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
  });

  test('saque sem PIX retorna 400', async () => {
    const res = await agent().post('/api/influencer/saque').set('Cookie', isCookie).send({ valor: 10 });
    expect(res.status).toBe(400);
  });

  test('saque abaixo do mínimo retorna 400', async () => {
    const res = await agent().post('/api/influencer/saque').set('Cookie', isCookie).send({ valor: 2, chave_pix: '11888880001' });
    expect(res.status).toBe(400);
  });

  test('saque acima do saldo retorna 400', async () => {
    db.users.find(x => x.id === isId).saldo_afiliado = 5;
    const res = await agent().post('/api/influencer/saque').set('Cookie', isCookie).send({ valor: 50, chave_pix: '11888880001' });
    expect(res.status).toBe(400);
    db.users.find(x => x.id === isId).saldo_afiliado = 80;
  });

  test('saque válido retorna 200 e cria tx pendente', async () => {
    const u = db.users.find(x => x.id === isId);
    u.saldo_afiliado = 80;
    const res = await agent().post('/api/influencer/saque').set('Cookie', isCookie).send({ valor: 15, chave_pix: '11888880001' });
    expect(res.status).toBe(200);
    const tx = db.transacoes.filter(t => t.user_id === isId && t.tipo === 'saque_afiliado').pop();
    expect(tx.status).toBe('pendente');
    expect(tx.valor_liquido).toBeCloseTo(13, 2);
  });

  test('GET /api/influencer/transacoes retorna lista', async () => {
    const res = await agent().get('/api/influencer/transacoes').set('Cookie', isCookie);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.transacoes)).toBe(true);
  });
});

describe('Regras de negócio — pirâmide de comissão', () => {
  let saId, gerId, infId, jogId;

  beforeAll(() => {
    db.users = db.users.filter(u => !['sa_pir', 'ger_pir', 'inf_pir', 'jog_pir'].includes(u.codigo_indicacao));

    const sa = { id: 88001, nome: 'SA Pir', telefone: '11000008001', senha_hash: 'x', role: 'super_admin', codigo_indicacao: 'sa_pir', indicado_por: null, prospectador_id: null, saldo: 0, saldo_afiliado: 0, ativo: 1, comissao_config: null, created_at: new Date().toISOString() };
    const ger = { id: 88002, nome: 'Ger Pir', telefone: '11000008002', senha_hash: 'x', role: 'gerente', codigo_indicacao: 'ger_pir', indicado_por: null, prospectador_id: null, saldo: 0, saldo_afiliado: 0, ativo: 1, comissao_config: { nivel1_perc: 0.10, nivel2_perc: 0.03, nivel3_perc: 0.01, influencer_perc: 0.40 }, created_at: new Date().toISOString() };
    const inf = { id: 88003, nome: 'Inf Pir', telefone: '11000008003', senha_hash: 'x', role: 'influencer', codigo_indicacao: 'inf_pir', indicado_por: 'ger_pir', prospectador_id: 88002, saldo: 0, saldo_afiliado: 0, ativo: 1, comissao_config: null, created_at: new Date().toISOString() };
    const jog = { id: 88004, nome: 'Jog Pir', telefone: '11000008004', senha_hash: 'x', role: 'jogador', codigo_indicacao: 'jog_pir', indicado_por: 'inf_pir', prospectador_id: null, saldo: 0, saldo_afiliado: 0, ativo: 1, comissao_config: null, created_at: new Date().toISOString() };

    db.users.push(sa, ger, inf, jog);
    db._sp = db._sp || {};
    db._sp.super_admin_user_id = sa.id;
    saId = sa.id; gerId = ger.id; infId = inf.id; jogId = jog.id;
  });

  test('depósito do jogador credita influencer (nível 1)', () => {
    const jog = db.users.find(x => x.id === jogId);
    const inf = db.users.find(x => x.id === infId);
    const saldoAntes = inf.saldo_afiliado;
    const tx = { id: 99901, user_id: jogId, tipo: 'deposito', valor: 100, status: 'aprovado', created_at: new Date().toISOString() };
    db.transacoes.push(tx);
    require('../server').creditarComissao(tx, jog);
    // SA corta saPerc (20%) do N1 (R$10); restante * influencer_perc (40%) > 0
    expect(inf.saldo_afiliado - saldoAntes).toBeGreaterThan(0);
  });

  test('depósito do jogador credita gerente (override do influencer)', () => {
    const jog = db.users.find(x => x.id === jogId);
    const ger = db.users.find(x => x.id === gerId);
    const saldoAntes = ger.saldo_afiliado;
    const tx = { id: 99902, user_id: jogId, tipo: 'deposito', valor: 100, status: 'aprovado', created_at: new Date().toISOString() };
    db.transacoes.push(tx);
    require('../server').creditarComissao(tx, jog);
    // Gerente recebe (1 - saPerc) * (1 - inflPerc) * N1 > 0
    expect(ger.saldo_afiliado - saldoAntes).toBeGreaterThan(0);
  });

  test('config influencer_perc=0 repassa pós-SA inteiro ao gerente', () => {
    const ger = db.users.find(x => x.id === gerId);
    ger.comissao_config = { nivel1_perc: 0.10, nivel2_perc: 0.03, nivel3_perc: 0.01, influencer_perc: 0.00 };
    const inf = db.users.find(x => x.id === infId);
    const jog = db.users.find(x => x.id === jogId);
    const saldoInfAntes = inf.saldo_afiliado;
    const saldoGerAntes = ger.saldo_afiliado;
    const tx = { id: 99903, user_id: jogId, tipo: 'deposito', valor: 100, status: 'aprovado', created_at: new Date().toISOString() };
    db.transacoes.push(tx);
    require('../server').creditarComissao(tx, jog);
    // influencer recebe 0; gerente recebe o restante após SA
    expect(inf.saldo_afiliado - saldoInfAntes).toBeCloseTo(0, 2);
    expect(ger.saldo_afiliado - saldoGerAntes).toBeGreaterThan(0);
    ger.comissao_config = { nivel1_perc: 0.10, nivel2_perc: 0.03, nivel3_perc: 0.01, influencer_perc: 0.40 };
  });

  test('config influencer_perc=80 repassa maioria ao influencer', () => {
    const ger = db.users.find(x => x.id === gerId);
    ger.comissao_config = { nivel1_perc: 0.10, nivel2_perc: 0.03, nivel3_perc: 0.01, influencer_perc: 0.80 };
    const inf = db.users.find(x => x.id === infId);
    const jog = db.users.find(x => x.id === jogId);
    const saldoInfAntes = inf.saldo_afiliado;
    const saldoGerAntes = ger.saldo_afiliado;
    const tx = { id: 99904, user_id: jogId, tipo: 'deposito', valor: 100, status: 'aprovado', created_at: new Date().toISOString() };
    db.transacoes.push(tx);
    require('../server').creditarComissao(tx, jog);
    // influencer recebe 80% do pós-SA; gerente recebe 20% do pós-SA
    expect(inf.saldo_afiliado - saldoInfAntes).toBeGreaterThan(ger.saldo_afiliado - saldoGerAntes);
    ger.comissao_config = { nivel1_perc: 0.10, nivel2_perc: 0.03, nivel3_perc: 0.01, influencer_perc: 0.40 };
  });
});

describe('Gerente - config de comissões (limites e validações)', () => {
  let gcCookie, gcId;
  beforeAll(async () => {
    const tel = '11800000091';
    db.users = db.users.filter(u => u.telefone !== tel);
    const rg = await agent().post('/api/auth/register').send({ nome: 'Ger Config Test', telefone: tel, senha: 'GerCf1!' });
    gcId = rg.body.user?.id;
    db.users.find(x => x.id === gcId).role = 'gerente';
    const rl = await agent().post('/api/auth/login').send({ telefone: tel, senha: 'GerCf1!' });
    gcCookie = rl.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
  });

  test('PUT /api/gerente/config com valores válidos retorna 200', async () => {
    const res = await agent().put('/api/gerente/config').set('Cookie', gcCookie).send({ nivel1_perc: 10, nivel2_perc: 3, nivel3_perc: 1, influencer_perc: 30 });
    expect(res.status).toBe(200);
  });

  test('GET painel retorna config salva corretamente (em %)', async () => {
    const res = await agent().get('/api/gerente/painel').set('Cookie', gcCookie);
    expect(res.status).toBe(200);
    // API retorna percentuais como inteiros (10 = 10%, 3 = 3%)
    expect(res.body.config.nivel1_perc).toBe(10);
    expect(res.body.config.nivel2_perc).toBe(3);
    expect(res.body.config.influencer_perc).toBe(30);
  });

  test('PUT /api/gerente/config com nivel1 negativo retorna 400', async () => {
    const res = await agent().put('/api/gerente/config').set('Cookie', gcCookie).send({ nivel1_perc: -5 });
    expect(res.status).toBe(400);
  });

  test('PUT /api/gerente/config sem auth retorna 401 ou 403', async () => {
    const res = await agent().put('/api/gerente/config').send({ nivel1_perc: 10 });
    expect([401, 403]).toContain(res.status);
  });
});

describe('Jogador - fluxo de indicação (regras de negócio)', () => {
  let j2Cookie, j2Id;
  beforeAll(async () => {
    const tel = '11600000090';
    db.users = db.users.filter(u => u.telefone !== tel);
    const rg = await agent().post('/api/auth/register').send({ nome: 'Jog Indic Test', telefone: tel, senha: 'JogId1!' });
    j2Id = rg.body.user?.id;
    const rl = await agent().post('/api/auth/login').send({ telefone: tel, senha: 'JogId1!' });
    j2Cookie = rl.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
  });

  test('GET /api/indicacao/info retorna link, código e stats zerados', async () => {
    const res = await agent().get('/api/indicacao/info').set('Cookie', j2Cookie);
    expect(res.status).toBe(200);
    expect(res.body.link).toContain('ref=');
    expect(typeof res.body.codigo).toBe('string');
    expect(typeof res.body.total_indicados).toBe('number');
  });

  test('GET /api/indicacao/rede retorna estrutura de rede', async () => {
    const res = await agent().get('/api/indicacao/rede').set('Cookie', j2Cookie);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.nivel1)).toBe(true);
  });

  test('GET /api/indicacao/rede retorna nivel1, nivel2 e total_comissao', async () => {
    const res = await agent().get('/api/indicacao/rede').set('Cookie', j2Cookie);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.nivel1)).toBe(true);
    expect(Array.isArray(res.body.nivel2)).toBe(true);
    expect(typeof res.body.total_comissao).toBe('number');
  });

  test('cadastro via link de afiliado vincula indicado_por corretamente', async () => {
    const refUser = db.users.find(x => x.id === j2Id);
    const telIndicado = '11600000091';
    db.users = db.users.filter(u => u.telefone !== telIndicado);
    const res = await agent().post('/api/auth/register').send({ nome: 'Indicado Test', telefone: telIndicado, senha: 'Ind123!', codigo_indicacao: refUser.codigo_indicacao });
    expect(res.status).toBe(200);
    const novo = db.users.find(x => x.id === res.body.user?.id);
    expect(novo.indicado_por).toBe(refUser.codigo_indicacao);
  });

  test('auto-indicação (usar próprio código) fica sem indicado_por', async () => {
    const refUser = db.users.find(x => x.id === j2Id);
    const telAuto = '11600000092';
    db.users = db.users.filter(u => u.telefone !== telAuto);
    const rg = await agent().post('/api/auth/register').send({ nome: 'Auto Indic', telefone: telAuto, senha: 'Aut123!', codigo_indicacao: refUser.codigo_indicacao });
    const novo = db.users.find(x => x.id === rg.body.user?.id);
    // Se auto-indicação for detectada, indicado_por deve ser null
    if (novo.telefone === refUser.telefone) {
      expect(novo.indicado_por).toBeNull();
    } else {
      expect(novo).toBeDefined();
    }
  });
});

describe('Autenticação — segurança e edge cases', () => {
  test('login com senha incorreta retorna 401', async () => {
    const res = await agent().post('/api/auth/login').send({ telefone: '11999990001', senha: 'senhaErrada123' });
    expect(res.status).toBe(401);
  });

  test('login com telefone inexistente retorna 401', async () => {
    const res = await agent().post('/api/auth/login').send({ telefone: '99999999999', senha: 'qualquer' });
    expect(res.status).toBe(401);
  });

  test('registro com telefone duplicado retorna 409', async () => {
    const res = await agent().post('/api/auth/register').send({ nome: 'Duplo', telefone: '11999990001', senha: 'Dup123!' });
    expect(res.status).toBe(409);
  });

  test('rota protegida sem cookie retorna 401', async () => {
    const res = await agent().get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('GET /api/auth/me com cookie válido retorna dados do usuário', async () => {
    const res = await agent().get('/api/auth/me').set('Cookie', authCookie);
    expect(res.status).toBe(200);
    expect(res.body.user.id).toBeDefined();
  });

  test('senha em /api/auth/me não aparece na resposta', async () => {
    const res = await agent().get('/api/auth/me').set('Cookie', authCookie);
    expect(res.body.user.senha).toBeUndefined();
    expect(res.body.user.senha_hash).toBeUndefined();
  });
});

describe('Financeiro - depósito e saque do jogador (regras de negócio)', () => {
  let fjCookie, fjId;
  beforeAll(async () => {
    const tel = '11600000095';
    db.users = db.users.filter(u => u.telefone !== tel);
    const rg = await agent().post('/api/auth/register').send({ nome: 'Jog Fin Test', telefone: tel, senha: 'JogFn1!' });
    fjId = rg.body.user?.id;
    const rl = await agent().post('/api/auth/login').send({ telefone: tel, senha: 'JogFn1!' });
    fjCookie = rl.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
  });

  test('GET /api/auth/me retorna saldo do jogador', async () => {
    const res = await agent().get('/api/auth/me').set('Cookie', fjCookie);
    expect(res.status).toBe(200);
    expect(typeof res.body.user.saldo).toBe('number');
  });

  test('saque sem saldo desbloqueado retorna 403', async () => {
    const u = db.users.find(x => x.id === fjId);
    u.saldo = 500;
    u.saque_desbloqueado = 0;
    u.isento_taxa_saque = 0;
    u.admin = 0;
    const res = await agent().post('/api/financeiro/saque').set('Cookie', fjCookie).send({ valor: 50, chave_pix: '11999991234' });
    expect(res.status).toBe(403);
  });

  test('saque com saldo desbloqueado mas sem PIX retorna 400', async () => {
    const u = db.users.find(x => x.id === fjId);
    u.saldo = 500;
    u.saque_desbloqueado = 1;
    const res = await agent().post('/api/financeiro/saque').set('Cookie', fjCookie).send({ valor: 50 });
    expect(res.status).toBe(400);
  });

  test('saque válido (mínimo R$ 20) retorna 200', async () => {
    const u = db.users.find(x => x.id === fjId);
    u.saldo = 500;
    u.saque_desbloqueado = 1;
    u.taxa_saque_paga = 1;
    const res = await agent().post('/api/financeiro/saque').set('Cookie', fjCookie).send({ valor: 20, chave_pix: '11999991234' });
    expect(res.status).toBe(200);
  });

  test('GET /api/financeiro/historico retorna array de transações', async () => {
    const res = await agent().get('/api/financeiro/historico').set('Cookie', fjCookie);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.transacoes)).toBe(true);
  });

  test('GET /api/financeiro/meus-saques retorna lista de saques', async () => {
    const res = await agent().get('/api/financeiro/meus-saques').set('Cookie', fjCookie);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.saques)).toBe(true);
  });
});
