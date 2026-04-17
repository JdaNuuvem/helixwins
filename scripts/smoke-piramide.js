// Smoke test end-to-end da pirâmide SA → Gerente → Influencer
// Executa direto contra a API do servidor rodando em http://localhost:8888
// Cria usuários de teste via DB in-memory + API e valida o fluxo todo.

const path = require('path');
process.chdir(path.join(__dirname, '..'));

const request = require('supertest');
const { app, db, creditarComissao } = require('../server');

async function agent() { return request(app); }

function now() { return new Date().toISOString(); }

// Extrai cookies e token CSRF do Set-Cookie
function parseCookies(setCookieHeaders) {
  const cookieStr = (setCookieHeaders || []).map(c => c.split(';')[0]).join('; ');
  const csrfMatch = cookieStr.match(/_csrf=([^;]+)/);
  return {
    cookie: cookieStr,
    csrf: csrfMatch ? decodeURIComponent(csrfMatch[1]) : '',
  };
}

function fmtMoney(n) { return 'R$ ' + Number(n).toFixed(2); }

(async () => {
  const results = [];
  const pass = (msg) => { console.log('  ✅', msg); results.push({ pass: true, msg }); };
  const fail = (msg, detail) => { console.error('  ❌', msg, detail ?? ''); results.push({ pass: false, msg, detail }); };

  try {
    // ─────────────────────────────────────────────────────────────────────
    console.log('\n▸ Setup: criando cadeia de teste in-memory');
    // ─────────────────────────────────────────────────────────────────────
    const codes = ['sm_sa', 'sm_ge', 'sm_in', 'sm_jo'];
    db.users = db.users.filter(u => !codes.includes(u.codigo_indicacao));
    const sa = {
      id: 880001, nome: 'SA Smoke', telefone: '11900000001', senha_hash: 'x',
      role: 'super_admin', codigo_indicacao: 'sm_sa', indicado_por: null,
      prospectador_id: null, saldo: 0, saldo_afiliado: 0, ativo: 1, comissao_config: null,
      created_at: now(),
    };
    const ger = {
      id: 880002, nome: 'Gerente Smoke', telefone: '11900000002', senha_hash: 'x',
      role: 'gerente', codigo_indicacao: 'sm_ge', indicado_por: null,
      prospectador_id: null, saldo: 0, saldo_afiliado: 0, ativo: 1,
      comissao_config: { nivel1_perc: 0.10, nivel2_perc: 0.03, nivel3_perc: 0.01, influencer_perc: 0.30 },
      created_at: now(),
    };
    const inf = {
      id: 880003, nome: 'Influencer Smoke', telefone: '11900000003', senha_hash: 'x',
      role: 'influencer', codigo_indicacao: 'sm_in', indicado_por: 'sm_ge',
      prospectador_id: ger.id, saldo: 0, saldo_afiliado: 0, ativo: 1, comissao_config: null,
      created_at: now(),
    };
    const jog = {
      id: 880004, nome: 'Jogador Smoke', telefone: '11900000004', senha_hash: 'x',
      role: 'jogador', codigo_indicacao: 'sm_jo', indicado_por: 'sm_in',
      prospectador_id: null, saldo: 0, saldo_afiliado: 0, ativo: 1, comissao_config: null,
      created_at: now(),
    };
    db.users.push(sa, ger, inf, jog);
    db.config = db.config || {};
    db.config.super_admin_perc = 0.20;
    db._sp = db._sp || {};
    db._sp.super_admin_user_id = sa.id;
    pass(`Cadeia criada: SA(${sa.id}) → Gerente(${ger.id}) → Influencer(${inf.id}) → Jogador(${jog.id})`);
    pass(`Config inicial: super_admin_perc=${db.config.super_admin_perc}, influencer_perc=${ger.comissao_config.influencer_perc}`);

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n▸ Cenário 1: Depósito R$100 com SA=20%, influencer_perc=30%');
    // ─────────────────────────────────────────────────────────────────────
    const sa0 = sa.saldo_afiliado, ger0 = ger.saldo_afiliado, inf0 = inf.saldo_afiliado;
    const tx1 = { id: 999801, user_id: jog.id, tipo: 'deposito', valor: 100, status: 'aprovado', created_at: now() };
    db.transacoes.push(tx1);
    creditarComissao(tx1, jog);
    const saΔ = +(sa.saldo_afiliado - sa0).toFixed(2);
    const gerΔ = +(ger.saldo_afiliado - ger0).toFixed(2);
    const infΔ = +(inf.saldo_afiliado - inf0).toFixed(2);
    console.log(`  → SA recebeu ${fmtMoney(saΔ)}, Gerente ${fmtMoney(gerΔ)}, Influencer ${fmtMoney(infΔ)}`);
    if (Math.abs(saΔ - 2.00) < 0.01) pass('SA recebeu R$2,00 (20% da comissão N1 de R$10)');
    else fail('SA deveria ter recebido R$2,00', `recebeu ${saΔ}`);
    if (Math.abs(gerΔ - 8.00) < 0.01) pass('Gerente recebeu R$8,00 (R$5 N1 split + R$3 N2 direto)');
    else fail('Gerente deveria ter recebido R$8,00', `recebeu ${gerΔ}`);
    // Influencer: R$3 (N1 split) + R$2 (bônus 1º depósito, sempre integral pro N1) = R$5
    if (Math.abs(infΔ - 5.00) < 0.01) pass('Influencer recebeu R$5,00 (R$3 split + R$2 bônus 1º depósito)');
    else fail('Influencer deveria ter recebido R$5,00 (split + bônus)', `recebeu ${infΔ}`);

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n▸ Cenário 2: API PUT /api/super-admin/comissao-config (SA muda para 15%)');
    // ─────────────────────────────────────────────────────────────────────
    // Criar token super admin via API requer senha; como estamos in-memory,
    // simulamos um login usando direct JWT sign — ou testamos middleware.
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || (global.__JWT_SECRET__ || require('crypto').randomBytes(32).toString('hex'));
    // O server.js usa um JWT_SECRET gerado aleatoriamente se não houver env.
    // Para este smoke test, vamos setar db.users e usar supertest.
    // Vamos pegar o JWT_SECRET real da env do process atual do servidor (já carregado).
    // Workaround: criar uma nova conta via registro com telefone/senha e promover via DB direto.
    const regRes = await (await agent()).post('/api/auth/register').send({
      nome: 'SA Smoke Login', telefone: '11900000099', senha: 'Smoke123!', email: 'smokesa@test.com',
    });
    if (regRes.status !== 200 && regRes.status !== 201) {
      fail('Falha ao registrar SA de login', regRes.body?.error);
    }
    const saLoginUser = db.users.find(u => u.telefone === '11900000099');
    if (saLoginUser) {
      saLoginUser.role = 'super_admin';
      db._sp.super_admin_user_id = saLoginUser.id; // usa esse como SA ativo
      pass(`SA de login criado (id=${saLoginUser.id}) e promovido`);
    }
    const { cookie, csrf } = parseCookies(regRes.headers['set-cookie']);

    // PUT super_admin_perc = 15
    const putSa = await (await agent())
      .put('/api/super-admin/comissao-config')
      .set('Cookie', cookie)
      .set('X-CSRF-Token', csrf)
      .send({ super_admin_perc: 15 });
    if (putSa.status === 200 && putSa.body.super_admin_perc === 15) {
      pass(`PUT aceitou super_admin_perc=15 (db.config=${db.config.super_admin_perc})`);
    } else {
      fail('PUT super_admin_perc=15 falhou', `status=${putSa.status} body=${JSON.stringify(putSa.body)}`);
    }

    // PUT super_admin_perc = 5 (deve rejeitar)
    const putBad = await (await agent())
      .put('/api/super-admin/comissao-config')
      .set('Cookie', cookie)
      .set('X-CSRF-Token', csrf)
      .send({ super_admin_perc: 5 });
    if (putBad.status === 400) pass('PUT super_admin_perc=5 rejeitado (fora do range 10-20)');
    else fail('Deveria rejeitar 5%', `status=${putBad.status}`);

    // GET painel retorna super_admin_perc
    const getPainel = await (await agent()).get('/api/super-admin/painel').set('Cookie', cookie);
    if (getPainel.status === 200 && getPainel.body.super_admin_perc === 15) {
      pass(`GET /api/super-admin/painel retorna super_admin_perc=15`);
    } else {
      fail('GET painel não retornou super_admin_perc corretamente', JSON.stringify(getPainel.body));
    }

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n▸ Cenário 3: Depósito R$100 com SA=15% (valor novo)');
    // ─────────────────────────────────────────────────────────────────────
    // Volta super_admin_user_id para o `sa` original (que tinha saldo_afiliado zerado no começo)
    db._sp.super_admin_user_id = sa.id;
    db.config.super_admin_perc = 0.15; // já foi setado via API
    const sa1 = sa.saldo_afiliado, ger1 = ger.saldo_afiliado, inf1 = inf.saldo_afiliado;
    const tx2 = { id: 999802, user_id: jog.id, tipo: 'deposito', valor: 100, status: 'aprovado', created_at: now() };
    db.transacoes.push(tx2);
    creditarComissao(tx2, jog);
    const saΔ2 = +(sa.saldo_afiliado - sa1).toFixed(2);
    const gerΔ2 = +(ger.saldo_afiliado - ger1).toFixed(2);
    const infΔ2 = +(inf.saldo_afiliado - inf1).toFixed(2);
    console.log(`  → SA=${fmtMoney(saΔ2)}, Gerente=${fmtMoney(gerΔ2)}, Influencer=${fmtMoney(infΔ2)}`);
    if (Math.abs(saΔ2 - 1.50) < 0.01) pass('SA recebeu R$1,50 (15% de R$10)');
    else fail('SA deveria ter recebido R$1,50', `recebeu ${saΔ2}`);
    // Gerente: comissão N1 = R$10, influencer leva 30% = R$3, SA leva R$1,50, gerente = R$10 - 1,50 - 3 = R$5,50 + N2 R$3 = R$8,50
    if (Math.abs(gerΔ2 - 8.50) < 0.01) pass('Gerente recebeu R$8,50 (R$5,50 N1 + R$3 N2)');
    else fail('Gerente deveria ter recebido R$8,50', `recebeu ${gerΔ2}`);
    if (Math.abs(infΔ2 - 3.00) < 0.01) pass('Influencer recebeu R$3,00 (30% mesmo com SA mudando)');
    else fail('Influencer deveria ter recebido R$3,00', `recebeu ${infΔ2}`);

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n▸ Cenário 4: Gerente muda influencer_perc via API');
    // ─────────────────────────────────────────────────────────────────────
    const regGer = await (await agent()).post('/api/auth/register').send({
      nome: 'Gerente Login Smoke', telefone: '11900000098', senha: 'Smoke123!', email: 'smokeger@test.com',
    });
    const gerLoginUser = db.users.find(u => u.telefone === '11900000098');
    if (gerLoginUser) {
      gerLoginUser.role = 'gerente';
      gerLoginUser.comissao_config = { nivel1_perc: 0.10, nivel2_perc: 0.03, nivel3_perc: 0.01, influencer_perc: 0.30 };
    }
    const { cookie: gerCookie, csrf: gerCsrf } = parseCookies(regGer.headers['set-cookie']);

    const putGer = await (await agent())
      .put('/api/gerente/config')
      .set('Cookie', gerCookie)
      .set('X-CSRF-Token', gerCsrf)
      .send({ influencer_perc: 40 });
    if (putGer.status === 200 && putGer.body.config.influencer_perc === 40) {
      pass(`PUT /api/gerente/config influencer_perc=40 aceito; gerente_perc derivado=${putGer.body.config.gerente_perc}`);
    } else {
      fail('PUT gerente config falhou', JSON.stringify(putGer.body));
    }

    // Com SA=15%, teto é 85. Tentar 90 deve rejeitar.
    const putGerBad = await (await agent())
      .put('/api/gerente/config')
      .set('Cookie', gerCookie)
      .set('X-CSRF-Token', gerCsrf)
      .send({ influencer_perc: 90 });
    if (putGerBad.status === 400) pass('PUT influencer_perc=90 rejeitado (teto=85 com SA=15%)');
    else fail('Deveria rejeitar 90%', `status=${putGerBad.status}`);

    // GET painel do gerente NÃO expõe super_admin_perc
    const getGerPainel = await (await agent()).get('/api/gerente/painel').set('Cookie', gerCookie);
    if (getGerPainel.status === 200) {
      const c = getGerPainel.body.config;
      if (c.super_admin_perc === undefined) pass('Painel do gerente NÃO expõe super_admin_perc (ok, ele não deve saber do SA)');
      else fail('Painel do gerente expõe super_admin_perc', `c.super_admin_perc=${c.super_admin_perc}`);
      if (typeof c.disponivel_perc === 'number' && typeof c.influencer_perc === 'number' && typeof c.gerente_perc === 'number') {
        pass(`Painel do gerente: disponivel=${c.disponivel_perc}%, influencer=${c.influencer_perc}%, gerente=${c.gerente_perc}%`);
      } else {
        fail('Painel do gerente sem campos esperados', JSON.stringify(c));
      }
      if (c.disponivel_perc + c.super_admin_perc === undefined || c.disponivel_perc === 85) {
        pass(`disponivel_perc=85 bate com SA=15% (100-15=85)`);
      }
    }

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n▸ Cenário 5: Sem SA cadastrado — fatia fica na plataforma');
    // ─────────────────────────────────────────────────────────────────────
    const oldSaId = db._sp.super_admin_user_id;
    db._sp.super_admin_user_id = null;
    db.config.super_admin_perc = 0.20;
    const sa2 = sa.saldo_afiliado, ger3 = ger.saldo_afiliado, inf3 = inf.saldo_afiliado;
    const tx3 = { id: 999803, user_id: jog.id, tipo: 'deposito', valor: 100, status: 'aprovado', created_at: now() };
    db.transacoes.push(tx3);
    creditarComissao(tx3, jog);
    const saΔ3 = +(sa.saldo_afiliado - sa2).toFixed(2);
    const gerΔ3 = +(ger.saldo_afiliado - ger3).toFixed(2);
    const infΔ3 = +(inf.saldo_afiliado - inf3).toFixed(2);
    if (saΔ3 === 0) pass('SA não recebeu nada (não cadastrado)');
    else fail('SA não deveria ter recebido nada', `recebeu ${saΔ3}`);
    // Gerente: R$5 N1 split (R$10 - R$2 SA cortado - R$3 infl) + R$3 N2 = R$8
    if (Math.abs(gerΔ3 - 8.00) < 0.01) pass('Gerente recebeu R$8,00 (SA orfão fica na plataforma)');
    else fail('Gerente deveria ter recebido R$8', `recebeu ${gerΔ3}`);
    if (Math.abs(infΔ3 - 3.00) < 0.01) pass('Influencer recebeu R$3,00 normalmente');
    else fail('Influencer deveria ter recebido R$3', `recebeu ${infΔ3}`);
    db._sp.super_admin_user_id = oldSaId;

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n▸ Limpeza: remover usuários de teste');
    // ─────────────────────────────────────────────────────────────────────
    const cleanupCodes = [...codes];
    db.users = db.users.filter(u => !cleanupCodes.includes(u.codigo_indicacao));
    db.users = db.users.filter(u => !['11900000099', '11900000098'].includes(u.telefone));
    db.transacoes = db.transacoes.filter(t => ![999801, 999802, 999803].includes(t.id));
    // Não salva o DB — só limpa em memória para não poluir database.json (vai ser restaurado no próximo start)
    pass('Usuários de teste removidos da memória');

    // ─────────────────────────────────────────────────────────────────────
    console.log('\n══════════════════════════════════════════════════════════');
    const total = results.length;
    const passed = results.filter(r => r.pass).length;
    const failed = total - passed;
    console.log(`RESULTADO: ${passed}/${total} passaram`);
    if (failed > 0) {
      console.log(`\n${failed} falhas:`);
      results.filter(r => !r.pass).forEach(r => console.log(`  - ${r.msg}: ${r.detail ?? ''}`));
      process.exit(1);
    } else {
      console.log('✅ TODOS OS CENÁRIOS PASSARAM');
      process.exit(0);
    }
  } catch (err) {
    console.error('ERRO INESPERADO:', err);
    process.exit(2);
  }
})();
