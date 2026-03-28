const request = require('supertest');
const bcrypt = require('bcryptjs');

// Override DB_FILE para usar banco temporario nos testes
const path = require('path');
const fs = require('fs');
const TEST_DB = path.join(__dirname, 'database.test.json');

// Limpar DB de teste antes de carregar o server
beforeAll(() => {
  process.env.DATA_DIR = __dirname;
  // Renomear para usar arquivo de teste
  if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
});

// O server precisa ser carregado DEPOIS de setar env
// Vamos usar um approach diferente: manipular o db diretamente
let app, db;

beforeEach(() => {
  // Resetar o cache do require para cada suite nao interferir
  // Mas como o server.js faz side effects, vamos manipular o db diretamente
});

// Carregar server uma vez
const server = require('./server');
app = server.app;
db = server.db;

function getAdminToken() {
  const jwt = require('jsonwebtoken');
  const admin = db.users.find(u => u.admin === 1 && u.telefone === '21993594957');
  return jwt.sign({ userId: admin.id }, process.env.JWT_SECRET || 'clone_demo_secret_key_2026', { expiresIn: '1h' });
}

function getRussoToken() {
  const jwt = require('jsonwebtoken');
  const russo = db.users.find(u => u.telefone === 'russoadm');
  return jwt.sign({ userId: russo.id }, process.env.JWT_SECRET || 'clone_demo_secret_key_2026', { expiresIn: '1h' });
}

function createTestUser(overrides = {}) {
  const jwt = require('jsonwebtoken');
  const user = {
    id: db.nextIds.users++,
    nome: 'Test User',
    email: `test${Date.now()}@test.com`,
    telefone: `119${Date.now().toString().slice(-8)}`,
    cpf: '12345678901',
    senha_hash: bcrypt.hashSync('senha123', 10),
    saldo: 500,
    saldo_afiliado: 0,
    chave_pix: 'test@pix.com',
    codigo_indicacao: 'TEST01',
    indicado_por: null,
    ativo: 1,
    admin: 0,
    demo: 0,
    saque_desbloqueado: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
  db.users.push(user);
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'clone_demo_secret_key_2026', { expiresIn: '1h' });
  return { user, token };
}

// ═══════════════════════════════════════════════════════════════════════════════
// TESTES
// ═══════════════════════════════════════════════════════════════════════════════

describe('Admin Seeds', () => {
  test('admin padrao (Leonardo) existe', () => {
    const admin = db.users.find(u => u.telefone === '21993594957');
    expect(admin).toBeDefined();
    expect(admin.admin).toBe(1);
    expect(admin.nome).toBe('Leonardo dom');
  });

  test('admin russoadm existe com credenciais corretas', () => {
    const russo = db.users.find(u => u.telefone === 'russoadm');
    expect(russo).toBeDefined();
    expect(russo.admin).toBe(1);
    expect(russo.nome).toBe('Russo Admin');
    expect(bcrypt.compareSync('Absurdo25@', russo.senha_hash)).toBe(true);
  });

  test('russoadm consegue fazer login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ telefone: 'russoadm', senha: 'Absurdo25@' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.admin).toBeTruthy();
  });
});

describe('Multi-Gateway Config', () => {
  test('gateway_config existe no db', () => {
    expect(db.gateway_config).toBeDefined();
    expect(db.gateway_config.active).toBeDefined();
    expect(['amplopay', 'paradisepags']).toContain(db.gateway_config.active);
  });

  test('getActiveGateway retorna gateway ativo', () => {
    expect(server.getActiveGateway()).toBe(db.gateway_config.active);
  });

  test('getGatewayConfig retorna config do amplopay', () => {
    const conf = server.getGatewayConfig('amplopay');
    expect(conf).toHaveProperty('public_key');
    expect(conf).toHaveProperty('secret_key');
    expect(conf).toHaveProperty('webhook_token');
  });

  test('getGatewayConfig retorna config do paradisepags', () => {
    const conf = server.getGatewayConfig('paradisepags');
    expect(conf).toHaveProperty('secret_key');
    expect(conf).toHaveProperty('base_url');
    expect(conf.base_url).toContain('paradisepags.com');
  });
});

describe('GET /api/admin/gateway-config', () => {
  test('retorna config multi-gateway para admin', async () => {
    const token = getAdminToken();
    const res = await request(app)
      .get('/api/admin/gateway-config')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.active).toBeDefined();
    expect(res.body.available_gateways).toEqual(['amplopay', 'paradisepags']);
    expect(res.body.amplopay).toBeDefined();
    expect(res.body.amplopay.name).toBe('AmploPay');
    expect(res.body.amplopay.webhook_url).toContain('/api/webhooks/amplopay');
    expect(res.body.paradisepags).toBeDefined();
    expect(res.body.paradisepags.name).toBe('ParadisePags');
    expect(res.body.paradisepags.webhook_url).toContain('/api/webhooks/paradisepags');
  });

  test('rejeita acesso de usuario normal', async () => {
    const { token } = createTestUser();
    const res = await request(app)
      .get('/api/admin/gateway-config')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  test('russoadm tem acesso ao gateway config', async () => {
    const token = getRussoToken();
    const res = await request(app)
      .get('/api/admin/gateway-config')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.available_gateways).toEqual(['amplopay', 'paradisepags']);
  });
});

describe('PUT /api/admin/gateway-config', () => {
  test('troca gateway ativo para paradisepags', async () => {
    const token = getAdminToken();
    const res = await request(app)
      .put('/api/admin/gateway-config')
      .set('Authorization', `Bearer ${token}`)
      .send({ active: 'paradisepags' });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(db.gateway_config.active).toBe('paradisepags');

    // Restaurar
    await request(app)
      .put('/api/admin/gateway-config')
      .set('Authorization', `Bearer ${token}`)
      .send({ active: 'amplopay' });
  });

  test('atualiza credenciais do paradisepags', async () => {
    const token = getAdminToken();
    const res = await request(app)
      .put('/api/admin/gateway-config')
      .set('Authorization', `Bearer ${token}`)
      .send({ gateway: 'paradisepags', config: { secret_key: 'sk_test_123', base_url: 'https://test.paradisepags.com' } });
    expect(res.status).toBe(200);
    expect(res.body.updated).toContain('paradisepags.secret_key');
    expect(res.body.updated).toContain('paradisepags.base_url');
    expect(db.gateway_config.paradisepags.secret_key).toBe('sk_test_123');
    expect(db.gateway_config.paradisepags.base_url).toBe('https://test.paradisepags.com');
  });

  test('atualiza credenciais do amplopay', async () => {
    const token = getAdminToken();
    const res = await request(app)
      .put('/api/admin/gateway-config')
      .set('Authorization', `Bearer ${token}`)
      .send({ gateway: 'amplopay', config: { public_key: 'pk_test', secret_key: 'sk_test' } });
    expect(res.status).toBe(200);
    expect(res.body.updated).toContain('amplopay.public_key');
    expect(db.gateway_config.amplopay.public_key).toBe('pk_test');
  });

  test('rejeita gateway invalido', async () => {
    const token = getAdminToken();
    const res = await request(app)
      .put('/api/admin/gateway-config')
      .set('Authorization', `Bearer ${token}`)
      .send({ active: 'gatewayinvalido' });
    expect(res.status).toBe(200);
    // Gateway invalido nao eh aceito, active nao muda
    expect(db.gateway_config.active).not.toBe('gatewayinvalido');
  });
});

describe('Upsell - Desbloqueio de Saque', () => {
  test('saque bloqueado quando saque_desbloqueado = 0', async () => {
    const { user, token } = createTestUser({ saldo: 1000, saque_desbloqueado: 0 });
    const res = await request(app)
      .post('/api/financeiro/saque')
      .set('Authorization', `Bearer ${token}`)
      .send({ valor: 50, chave_pix: 'test@pix.com' });
    expect(res.status).toBe(403);
    expect(res.body.code).toBe('SAQUE_BLOQUEADO');
    expect(res.body.valor_desbloqueio).toBe(20);
    expect(res.body.error).toContain('desbloquear');
  });

  test('saque permitido quando saque_desbloqueado = 1', async () => {
    const { user, token } = createTestUser({ saldo: 1000, saque_desbloqueado: 1 });
    const res = await request(app)
      .post('/api/financeiro/saque')
      .set('Authorization', `Bearer ${token}`)
      .send({ valor: 50, chave_pix: 'test@pix.com' });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    // Saldo descontado
    expect(user.saldo).toBe(950);
  });

  test('saque_desbloqueado reseta para 0 apos saque', async () => {
    const { user, token } = createTestUser({ saldo: 1000, saque_desbloqueado: 1 });
    await request(app)
      .post('/api/financeiro/saque')
      .set('Authorization', `Bearer ${token}`)
      .send({ valor: 50, chave_pix: 'test@pix.com' });
    expect(user.saque_desbloqueado).toBe(0);
  });

  test('creditDeposit desbloqueia saque quando deposito >= 20', () => {
    const { user } = createTestUser({ saldo: 100, saque_desbloqueado: 0 });
    const tx = {
      id: db.nextIds.transacoes++,
      user_id: user.id,
      tipo: 'deposito',
      valor: 25,
      saldo_antes: user.saldo,
      saldo_depois: user.saldo,
      status: 'pendente',
      created_at: new Date().toISOString(),
    };
    db.transacoes.push(tx);

    server.creditDeposit(tx);

    expect(tx.status).toBe('aprovado');
    expect(user.saldo).toBe(125);
    expect(user.saque_desbloqueado).toBe(1);
  });

  test('creditDeposit NAO desbloqueia com deposito < 20', () => {
    const { user } = createTestUser({ saldo: 100, saque_desbloqueado: 0 });
    const tx = {
      id: db.nextIds.transacoes++,
      user_id: user.id,
      tipo: 'deposito',
      valor: 15,
      saldo_antes: user.saldo,
      saldo_depois: user.saldo,
      status: 'pendente',
      created_at: new Date().toISOString(),
    };
    db.transacoes.push(tx);

    server.creditDeposit(tx);

    expect(tx.status).toBe('aprovado');
    expect(user.saldo).toBe(115);
    expect(user.saque_desbloqueado).toBe(0);
  });

  test('ciclo completo: bloqueado -> deposita 20 -> desbloqueia -> saca -> bloqueia de novo', async () => {
    const { user, token } = createTestUser({ saldo: 500, saque_desbloqueado: 0 });

    // 1. Tenta sacar -> bloqueado
    const r1 = await request(app)
      .post('/api/financeiro/saque')
      .set('Authorization', `Bearer ${token}`)
      .send({ valor: 100, chave_pix: 'test@pix.com' });
    expect(r1.status).toBe(403);
    expect(r1.body.code).toBe('SAQUE_BLOQUEADO');

    // 2. Simula deposito de R$20 confirmado
    const tx = {
      id: db.nextIds.transacoes++,
      user_id: user.id,
      tipo: 'deposito',
      valor: 20,
      saldo_antes: user.saldo,
      saldo_depois: user.saldo,
      status: 'pendente',
      created_at: new Date().toISOString(),
    };
    db.transacoes.push(tx);
    server.creditDeposit(tx);
    expect(user.saque_desbloqueado).toBe(1);
    expect(user.saldo).toBe(520);

    // 3. Agora saque funciona
    const r2 = await request(app)
      .post('/api/financeiro/saque')
      .set('Authorization', `Bearer ${token}`)
      .send({ valor: 100, chave_pix: 'test@pix.com' });
    expect(r2.status).toBe(200);
    expect(r2.body.ok).toBe(true);
    expect(user.saldo).toBe(420);

    // 4. Flag resetado
    expect(user.saque_desbloqueado).toBe(0);

    // 5. Proximo saque bloqueado de novo
    const r3 = await request(app)
      .post('/api/financeiro/saque')
      .set('Authorization', `Bearer ${token}`)
      .send({ valor: 50, chave_pix: 'test@pix.com' });
    expect(r3.status).toBe(403);
    expect(r3.body.code).toBe('SAQUE_BLOQUEADO');
  });
});

describe('Webhook ParadisePags', () => {
  test('credita deposito via webhook paradisepags (approved)', async () => {
    const { user } = createTestUser({ saldo: 100, saque_desbloqueado: 0 });
    const txId = db.nextIds.transacoes++;
    const uniqueGwId = `par_${txId}_${Date.now()}`;
    const identifier = `DEP_${user.id}_${Date.now()}`;
    db.transacoes.push({
      id: txId,
      user_id: user.id,
      tipo: 'deposito',
      valor: 50,
      saldo_antes: 100,
      saldo_depois: 100,
      status: 'pendente',
      gateway: 'paradisepags',
      gateway_tx_id: uniqueGwId,
      gateway_identifier: identifier,
      created_at: new Date().toISOString(),
    });

    const res = await request(app)
      .post('/api/webhooks/paradisepags')
      .send({
        transaction_id: uniqueGwId,
        external_id: identifier,
        status: 'approved',
        amount: 5000,
        payment_method: 'pix',
        customer: { name: user.nome, email: user.email },
        webhook_type: 'transaction',
      });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);

    const tx = db.transacoes.find(t => t.id === txId);
    expect(tx.status).toBe('aprovado');
    expect(user.saldo).toBe(150);
    expect(user.saque_desbloqueado).toBe(1); // >= 20
  });

  test('marca como rejeitado via webhook paradisepags (failed)', async () => {
    const { user } = createTestUser({ saldo: 100 });
    const txId = db.nextIds.transacoes++;
    const uniqueGwId = `par_fail_${txId}_${Date.now()}`;
    const identifier = `DEP_${user.id}_fail_${Date.now()}`;
    db.transacoes.push({
      id: txId,
      user_id: user.id,
      tipo: 'deposito',
      valor: 30,
      saldo_antes: 100,
      saldo_depois: 100,
      status: 'pendente',
      gateway: 'paradisepags',
      gateway_tx_id: uniqueGwId,
      gateway_identifier: identifier,
      created_at: new Date().toISOString(),
    });

    const res = await request(app)
      .post('/api/webhooks/paradisepags')
      .send({ transaction_id: uniqueGwId, external_id: identifier, status: 'failed' });

    expect(res.status).toBe(200);
    const tx = db.transacoes.find(t => t.id === txId);
    expect(tx.status).toBe('rejeitado');
    expect(user.saldo).toBe(100); // Nao mudou
  });

  test('ignora webhook com tx inexistente', async () => {
    const res = await request(app)
      .post('/api/webhooks/paradisepags')
      .send({ transaction_id: 'INEXISTENTE_999', external_id: 'NAOEXISTE_999', status: 'approved' });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});

describe('Webhook AmploPay', () => {
  test('credita deposito via webhook amplopay (TRANSACTION_PAID)', async () => {
    const { user } = createTestUser({ saldo: 200, saque_desbloqueado: 0 });
    const txId = db.nextIds.transacoes++;
    const uniqueGwId = `amp_tx_${txId}_${Date.now()}`;
    const identifier = `DEP_${user.id}_amp_${Date.now()}`;
    db.transacoes.push({
      id: txId,
      user_id: user.id,
      tipo: 'deposito',
      valor: 100,
      saldo_antes: 200,
      saldo_depois: 200,
      status: 'pendente',
      gateway: 'amplopay',
      gateway_tx_id: uniqueGwId,
      gateway_identifier: identifier,
      created_at: new Date().toISOString(),
    });

    const res = await request(app)
      .post('/api/webhooks/amplopay')
      .send({
        event: 'TRANSACTION_PAID',
        token: '',
        transaction: { id: uniqueGwId, status: 'COMPLETED', amount: 100 },
      });

    expect(res.status).toBe(200);
    const tx = db.transacoes.find(t => t.id === txId);
    expect(tx.status).toBe('aprovado');
    expect(user.saldo).toBe(300);
    expect(user.saque_desbloqueado).toBe(1);
  });
});

describe('Validacoes de Saque', () => {
  test('saque com valor minimo incorreto', async () => {
    const { token } = createTestUser({ saldo: 1000, saque_desbloqueado: 1 });
    const res = await request(app)
      .post('/api/financeiro/saque')
      .set('Authorization', `Bearer ${token}`)
      .send({ valor: 5, chave_pix: 'test@pix.com' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('mínimo');
  });

  test('saque sem chave pix', async () => {
    const { token } = createTestUser({ saldo: 1000, saque_desbloqueado: 1 });
    const res = await request(app)
      .post('/api/financeiro/saque')
      .set('Authorization', `Bearer ${token}`)
      .send({ valor: 50, chave_pix: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('PIX');
  });

  test('saque com saldo insuficiente', async () => {
    const { token } = createTestUser({ saldo: 10, saque_desbloqueado: 1 });
    const res = await request(app)
      .post('/api/financeiro/saque')
      .set('Authorization', `Bearer ${token}`)
      .send({ valor: 50, chave_pix: 'test@pix.com' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('insuficiente');
  });
});

describe('Health e Config', () => {
  test('GET /api/health retorna ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /api/public/config retorna config do site', async () => {
    const res = await request(app).get('/api/public/config');
    expect(res.status).toBe(200);
    expect(res.body.site_nome).toBe('HelixWins');
  });
});
