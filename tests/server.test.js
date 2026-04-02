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

  test('ParadisePags webhook com tx inexistente retorna 200 (aceita)', async () => {
    const res = await agent().post('/api/webhooks/paradisepags')
      .send({ transaction_id: 'NONEXISTENT', status: 'approved' });
    expect(res.status).toBe(200);
  });

  test('AmploPay webhook com payload incompleto retorna 400', async () => {
    const res = await agent().post('/api/webhooks/amplopay').send({ event: 'test' });
    expect(res.status).toBe(400);
  });

  test('AmploPay webhook credita depósito pendente', async () => {
    const user = db.users.find(u => u.id === testUserId);
    const antes = user.saldo;

    // Criar tx pendente
    const txId = 'AMPLO_TEST_' + Date.now();
    db.transacoes.push({
      id: db.nextIds.transacoes++, user_id: testUserId, tipo: 'deposito', valor: 30,
      status: 'pendente', gateway: 'amplopay', gateway_tx_id: txId,
      gateway_identifier: 'DEP_WH_TEST', _k: null, _split: false,
      saldo_antes: antes, saldo_depois: antes, created_at: new Date().toISOString(),
    });

    const res = await agent().post('/api/webhooks/amplopay').send({
      event: 'TRANSACTION_PAID', transaction: { id: txId },
    });
    expect(res.status).toBe(200);

    const tx = db.transacoes.find(t => t.gateway_tx_id === txId);
    expect(tx.status).toBe('aprovado');
    expect(user.saldo).toBe(antes + 30);
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
