#!/usr/bin/env node
// Minifica e obfusca todos os JS do frontend
const { minify } = require('terser');
const fs = require('fs');
const path = require('path');

const FILES = [
  'js/utils.js',
  'js/api.js',
  'js/app.js',
  'js/pages/landing.js',
  'js/pages/login.js',
  'js/pages/cadastro.js',
  'js/pages/painel.js',
  'js/pages/jogo.js',
];

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'js-dist');

const TERSER_OPTS = {
  compress: {
    drop_console: false, // manter console.log para debug em prod se necessário
    passes: 2,
    dead_code: true,
    collapse_vars: true,
    reduce_vars: true,
    toplevel: false,
  },
  mangle: {
    toplevel: false, // não renomear funções globais (renderLanding, etc.)
    reserved: [
      // Funções globais chamadas via onclick/window
      'renderLanding', 'renderLogin', 'renderCadastro', 'renderPainel', 'renderJogo',
      'navigate', 'showToast', 'showLoading', 'hideLoading', 'formatMoney', 'formatDate',
      'copyToClipboard', 'animateNumber', 'launchConfetti', 'startCountdown',
      'isValidEmail', 'isStrongPassword', 'debounce',
      'voltarPainel', 'jogarNovamente', 'executarResgate',
      'API', 'getPublicConfig', 'applyBranding', 'gameEvents',
    ],
  },
  output: {
    comments: false,
    beautify: false,
  },
};

async function build() {
  // Criar diretório dist
  if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });
  const pagesDir = path.join(DIST, 'pages');
  if (!fs.existsSync(pagesDir)) fs.mkdirSync(pagesDir, { recursive: true });

  let totalOriginal = 0;
  let totalMinified = 0;

  for (const file of FILES) {
    const src = path.join(ROOT, file);
    const dst = path.join(DIST, file.replace('js/', ''));

    const code = fs.readFileSync(src, 'utf8');
    totalOriginal += code.length;

    try {
      const result = await minify(code, TERSER_OPTS);
      if (result.error) throw result.error;
      fs.writeFileSync(dst, result.code, 'utf8');
      totalMinified += result.code.length;
      const pct = ((1 - result.code.length / code.length) * 100).toFixed(1);
      console.log(`  ${file} → ${(code.length / 1024).toFixed(1)}KB → ${(result.code.length / 1024).toFixed(1)}KB (-${pct}%)`);
    } catch (err) {
      console.error(`  ERRO em ${file}:`, err.message);
      // Fallback: copia sem minificar
      fs.writeFileSync(dst, code, 'utf8');
      totalMinified += code.length;
    }
  }

  const totalPct = ((1 - totalMinified / totalOriginal) * 100).toFixed(1);
  console.log(`\n  Total: ${(totalOriginal / 1024).toFixed(1)}KB → ${(totalMinified / 1024).toFixed(1)}KB (-${totalPct}%)`);
  console.log('  Build completo em js-dist/');
}

build().catch(console.error);
