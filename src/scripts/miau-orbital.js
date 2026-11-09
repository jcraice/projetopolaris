/* Miau Orbital, o jogo da autora, feito no claude.ai e trazido para o site
   quase como veio — ver src/pages/miau-orbital.astro. É por isso que este
   arquivo é JavaScript e não TypeScript, e que os nomes estão em inglês: cada
   versão nova do jogo chega como um index.html inteiro, e manter o código
   igual ao original é o que deixa comparar uma versão com a outra.

   O que mudou em relação ao original (docs/miau-orbital/original.html):
   - os três gatos, as chaves do mural e a raiz das cores vêm de atributos
     data-* do contêiner .miau, montados pela página no build;
   - as cores se leem do contêiner, não de :root, onde moram as do site;
   - o texto desenhado no tabuleiro usa as letras servidas pelo site (FD e FB),
     porque o build dá a elas um nome com código e "Lilita One" não existe. */
(() => {
const raiz = document.querySelector('.miau');
if (!(raiz instanceof HTMLElement)) return;
const cv = document.getElementById('game'), ctx = cv.getContext('2d');
const W = 1200, H = 800, PR = 13, BR = 13, G = 900, SPEED = 700, E = 0.78, STEP = 1 / 240;
const PACE = .71;     // slows the whole flight (launch 700 × .71 ≈ the old on-screen speed), same path
const FAR = 300;      // min distance between two consecutive targets for the constellation bonus
const BLAST = 160;    // alien catnip explosion radius
const L = { x: W / 2, y: 102 };   // launch pivot = turret hub on the cat's pod
const css = getComputedStyle(raiz);
const FD = css.getPropertyValue('--font-display').trim(), FB = css.getPropertyValue('--font-body').trim();
const C = {}; ['void','nebula','hull','star','dust','sun','catnip','plasma','ice','eye','yarn','yarndark','box','boxdark','fur','rim','moon','wool','wooldark','shell','shelldark'].forEach(k => C[k] = css.getPropertyValue('--' + k).trim());
const PEG = { blue: C.moon, orange: C.sun, green: C.catnip, purple: C.plasma };
const BASE = { blue: 10, orange: 100, green: 10, purple: 500 };
const $ = id => document.getElementById(id);
const fmt = n => n.toLocaleString('pt-BR');

const CATS = [
  { id: 'neon', name: 'Neon', power: 'Mira longa', desc: 'O visor calcula a trajetória do novelo nos próximos 3 lançamentos.' },
  { id: 'astro', name: 'Major Ronrom', power: 'Novelo duplo', desc: 'O novelo se divide em dois, que seguem para lados opostos.' },
  { id: 'zorp', name: 'Zorp', power: 'Explosão', desc: 'A erva explode e acende os pinos em volta dela.' },
];
let catId = 'neon';
// Cat portraits (the player's own artwork), embedded so the page works offline.
const ART = JSON.parse(raiz.dataset.arte);
const IMG = {}; Object.keys(ART).forEach(k => { IMG[k] = new Image(); IMG[k].src = ART[k]; });
try { const s = localStorage.getItem('mo-cat'); if (CATS.some(c => c.id === s)) catId = s; } catch (e) {}

// Level shapes are sampled into candidate points, then pack() keeps only those inside the play area
// and at least MINGAP from every kept peg, so the yarn ball always fits between pegs.
const MINGAP = 2 * PR + 2 * BR + 8;   // peg-to-peg distance that leaves the yarn room to pass (60 px)
function pack(cands) {
  const out = [];
  for (const p of cands) {
    if (p.x < 50 || p.x > W - 50 || p.y < 185 || p.y > H - 95) continue;
    if (out.some(q => (q.x - p.x) ** 2 + (q.y - p.y) ** 2 < MINGAP * MINGAP)) continue;
    out.push(p);
  }
  return out;
}
function line(a, x1, y1, x2, y2, gap = 62) { const n = Math.max(1, Math.round(Math.hypot(x2 - x1, y2 - y1) / gap)); for (let i = 0; i <= n; i++) a.push({ x: x1 + (x2 - x1) * i / n, y: y1 + (y2 - y1) * i / n }); }
function ring(a, cx, cy, rx, ry, gap = 62, from = 0, to = Math.PI * 2, ph = 0) {
  const per = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry))) * (to - from) / (Math.PI * 2);
  const n = Math.max(1, Math.round(per / gap)), full = to - from > 6.28;
  for (let i = 0; i < (full ? n : n + 1); i++) { const th = from + ph + (to - from) * i / n; a.push({ x: cx + Math.cos(th) * rx, y: cy + Math.sin(th) * ry }); }
}
const LEVELS = [
  { name: 'Cinturão de Asteroides', gen() { const a = []; for (let r = 0; r < 7; r++) for (let c = 0; c < 13; c++) a.push({ x: 95 + c * 90 + (r % 2 ? 45 : 0), y: 215 + r * 76 }); return pack(a); } },
  { name: 'Anéis de Saturno', gen() { const a = []; ring(a, 600, 450, 115, 82); ring(a, 600, 450, 245, 155, 64, 0, 6.3, .2); ring(a, 600, 450, 390, 235, 66, 0, 6.3, .1); [120, 1080].forEach(x => { for (let y = 230; y <= 690; y += 76) a.push({ x, y }); }); return pack(a); } },
  { name: 'Via Láctea', gen() { const a = []; for (let k = 0; k < 6; k++) for (let i = 0; i < 18; i++) a.push({ x: 75 + i * 61.8, y: 225 + k * 86 + Math.sin(i * .55 + k * .5) * 24 }); return pack(a); } },
  { name: 'Nebulosa Espiral', gen() { const a = []; for (let th = .8; th < 15.2; th += .01) { const r = 15 * th; a.push({ x: 600 + Math.cos(th) * r * 1.7, y: 450 + Math.sin(th) * r }); } [[140, 270], [1060, 270], [140, 630], [1060, 630]].forEach(([x, y]) => { ring(a, x, y, 64, 62, 62); a.push({ x, y }); }); return pack(a); } },
  { name: 'Chuva de Meteoros', gen() { const a = []; for (let i = 0; i < 9; i++) { const x0 = 40 + i * 140, y0 = 200 + (i % 3) * 40; line(a, x0, y0, x0 + 230, y0 + 420, 64); } return pack(a); } },
  { name: 'Gato Cósmico', gen() { const a = [], cx = 600, cy = 470;
      // eyes, nose and whiskers first so they survive packing, then ears and the head outline
      [-1, 1].forEach(d => { a.push({ x: cx + d * 145, y: cy - 40 }); for (let i = 0; i < 6; i++) { const th = i * Math.PI / 3; a.push({ x: cx + d * 145 + Math.cos(th) * 64, y: cy - 40 + Math.sin(th) * 64 }); } });
      a.push({ x: cx - 32, y: cy + 40 }, { x: cx + 32, y: cy + 40 }, { x: cx, y: cy + 92 });
      [-1, 1].forEach(d => [-1, 1].forEach(o => line(a, cx + d * 100, cy + 95 + o * 32, cx + d * 290, cy + 95 + o * 70, 64)));
      [-1, 1].forEach(d => { line(a, cx + d * 330, cy - 80, cx + d * 275, cy - 285, 64); line(a, cx + d * 275, cy - 285, cx + d * 130, cy - 200, 64); });
      ring(a, cx, cy, 360, 215, 64);
      return pack(a); } },
  { name: 'Buraco Negro', gen() { const a = [], cx = 600, cy = 450; [[155, 95], [265, 162], [375, 228]].forEach(([rx, ry], i) => ring(a, cx, cy, rx * 1.2, ry, 62, 0, 6.3, i * .3)); for (let k = 0; k < 8; k++) { const th = k * Math.PI / 4 + .39; line(a, cx + Math.cos(th) * 500, cy + Math.sin(th) * 262, cx + Math.cos(th) * 600, cy + Math.sin(th) * 310); } return pack(a); } },
  { name: 'Pirâmides de Marte', gen() { const a = []; [215, 600, 985].forEach((cx, k) => { for (let r = 0; r < 6; r++) for (let j = 0; j <= r; j++) a.push({ x: cx + (j - r / 2) * 64, y: 225 + r * 72 + (k === 1 ? 20 : 0) }); }); for (let x = 90; x <= 1110; x += 68) a.push({ x, y: 695 }); return pack(a); } },
  { name: 'Ondas Gravitacionais', gen() { const a = []; [190, 285, 380, 475, 570].forEach(r => ring(a, 600, 800, r * 1.22, r, 64, Math.PI, Math.PI * 2)); for (let x = 100; x <= 1100; x += 100) a.push({ x, y: x % 200 ? 200 : 228 }); return pack(a); } },
  { name: 'Supernova', gen() { const a = [], cx = 600, cy = 445; for (let k = 0; k < 16; k++) { const th = k * Math.PI / 8; for (let r = 80; r <= 340; r += 62) a.push({ x: cx + Math.cos(th) * r * 1.55, y: cy + Math.sin(th) * r * .76 }); } a.push({ x: cx, y: cy }); return pack(a); } },
];

// ---------- state
let level = 0, score = 0, levelStartScore = 0, balls = 10, pegs = [], flying = [], state = 'menu', paused = true;
let aim = Math.PI / 2, orangeTotal = 0, orangeHit = 0, longShots = 0, fever = false, slowT = 0, feverText = 0;
let combo = 0, hitSeq = 0, popQueue = [], popTimer = 0, t = 0, shotPts = 0, acc = 0;
const RAIN = 5;   // oranges in one launch for the 'Chuva de planetas' bonus
let orangesThisShot = 0, rainBonus = false;
let shotMult = 1, greensThisShot = 0, lastNew = null, greenBonus = false, farBonus = false, caught = false;
let popups = [], parts = [], links = [], waves = [], scale = 1;
const bucket = { x: W / 2, y: H - 44, w: 120, phase: 0 };

function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }

function buildLevel(i) {
  const pts = LEVELS[i % LEVELS.length].gen();
  pegs = pts.map(p => ({ x: p.x, y: p.y, type: 'blue', hit: false, gone: false, pop: 0, hits: 0, order: 0, rot: Math.random() * 6.28 }));
  const idx = shuffle([...pegs.keys()]);
  orangeTotal = Math.min(25, Math.floor(pegs.length * .35));
  idx.slice(0, orangeTotal).forEach(k => pegs[k].type = 'orange');
  idx.slice(orangeTotal, orangeTotal + 2).forEach(k => pegs[k].type = 'green');
  orangeHit = 0; balls = 10; longShots = 0; fever = false; slowT = 0; feverText = 0; lastWarn = 99; warn = null;
  flying = []; popQueue = []; popups = []; parts = []; links = []; waves = [];
  levelStartScore = score;
  assignPurple(); hud();
}
function assignPurple() {
  pegs.forEach(p => { if (p.type === 'purple' && !p.hit) p.type = 'blue'; });
  const blues = pegs.filter(p => p.type === 'blue' && !p.hit && !p.gone);
  if (blues.length) blues[Math.random() * blues.length | 0].type = 'purple';
}
function mult() { const f = orangeHit / orangeTotal; return f >= .88 ? 10 : f >= .76 ? 5 : f >= .6 ? 3 : f >= .4 ? 2 : 1; }
function hud() {
  $('lvl').textContent = `Fase ${level + 1} · ${LEVELS[level % LEVELS.length].name}`;
  $('balls').textContent = balls; $('balls').classList.toggle('low', balls <= 3); $('balls').classList.toggle('last', balls === 1); $('mult').textContent = '×' + mult(); $('score').textContent = fmt(score);
  $('ohit').textContent = orangeHit; $('otot').textContent = orangeTotal;
  $('fill').style.width = (orangeHit / orangeTotal * 100) + '%';
}

// ---------- audio
let ac = null, muted = false;
try { muted = localStorage.getItem('rdp-muted') === '1'; } catch (e) {}
$('mute').textContent = muted ? 'Som: desligado' : 'Som: ligado';
function initAudio() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (ac && ac.state === 'suspended') ac.resume(); }
function tone(f, dur = .14, type = 'triangle', vol = .13, delay = 0) {
  if (muted || !ac) return;
  const o = ac.createOscillator(), g = ac.createGain(), t0 = ac.currentTime + delay;
  o.type = type; o.frequency.value = f; g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(.001, t0 + dur);
  o.connect(g).connect(ac.destination); o.start(t0); o.stop(t0 + dur + .02);
}
// Synthesized "miau": a sawtooth that rises then falls, shaped by a moving band-pass filter.
function meow(delay = 0, pitch = 1) {
  if (muted || !ac) return;
  const t0 = ac.currentTime + delay, o = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain();
  o.type = 'sawtooth'; f.type = 'bandpass'; f.Q.value = 5;
  o.frequency.setValueAtTime(430 * pitch, t0); o.frequency.linearRampToValueAtTime(760 * pitch, t0 + .13); o.frequency.linearRampToValueAtTime(470 * pitch, t0 + .48);
  f.frequency.setValueAtTime(800, t0); f.frequency.linearRampToValueAtTime(1900, t0 + .16); f.frequency.linearRampToValueAtTime(650, t0 + .48);
  g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(.16, t0 + .05); g.gain.exponentialRampToValueAtTime(.001, t0 + .52);
  o.connect(f).connect(g).connect(ac.destination); o.start(t0); o.stop(t0 + .56);
}
function boom() {
  if (muted || !ac) return;
  const t0 = ac.currentTime, len = ac.sampleRate * .45, buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
  const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
  s.buffer = buf; f.type = 'lowpass'; f.frequency.setValueAtTime(1800, t0); f.frequency.exponentialRampToValueAtTime(120, t0 + .4); g.gain.value = .35;
  s.connect(f).connect(g).connect(ac.destination); s.start(t0);
}

// ---------- physics
function circleBounce(b, px, py, r) {
  const dx = b.x - px, dy = b.y - py, rr = r + BR, d2 = dx * dx + dy * dy;
  if (d2 >= rr * rr) return -1;
  const d = Math.sqrt(d2) || .001, nx = dx / d, ny = dy / d;
  b.x = px + nx * rr; b.y = py + ny * rr;
  const vn = b.vx * nx + b.vy * ny;
  if (vn < 0) { b.vx -= (1 + E) * vn * nx; b.vy -= (1 + E) * vn * ny; return -vn; }
  return 0;
}
function stepBody(b, dt, onPeg) {
  b.vy += G * dt; b.x += b.vx * dt; b.y += b.vy * dt;
  if (b.x < BR) { b.x = BR; b.vx = Math.abs(b.vx) * .85; }
  if (b.x > W - BR) { b.x = W - BR; b.vx = -Math.abs(b.vx) * .85; }
  if (b.y < BR) { b.y = BR; b.vy = Math.abs(b.vy) * .85; }
  for (const p of pegs) {
    if (p.gone) continue;
    const imp = circleBounce(b, p.x, p.y, PR);
    if (imp >= 0 && onPeg) onPeg(p, imp);
  }
}
function traceAim(a) {
  const b = { x: L.x + Math.cos(a) * 52, y: L.y + Math.sin(a) * 52, vx: Math.cos(a) * SPEED, vy: Math.sin(a) * SPEED };
  // Power guide: draw until the 2nd contact (peg or wall), then stop.
  const pts = [{ x: b.x, y: b.y }], maxB = 1; let bounces = 0, stop = false;
  for (let i = 0; i < 1000 && !stop; i++) {
    const svx = Math.sign(b.vx), svy = Math.sign(b.vy);
    stepBody(b, STEP, (p, imp) => { if (imp > 0 && ++bounces > maxB) stop = true; });
    if (!stop && ((svx && Math.sign(b.vx) !== svx && (b.x <= BR + .01 || b.x >= W - BR - .01)) || (svy < 0 && b.vy > 0 && b.y <= BR + .01)) && ++bounces > maxB) stop = true;
    if (i % 4 === 0 || stop) pts.push({ x: b.x, y: b.y });
    if (b.y > H) break;
  }
  return pts;
}
function newBall(x, y, vx, vy) { return { x, y, vx, vy, age: 0, trail: [] }; }

// ---------- scoring & powers
function onHit(p, imp, b, quiet) {
  p.hits++;
  if (p.hits > 14) { p.gone = true; p.pop = 1; }
  if (p.hit) { if (imp > 120) tone(260, .05, 'sine', .04); return; }
  p.hit = true; p.order = ++hitSeq; combo++;
  if (p.type === 'orange') orangeHit++;
  const pts = BASE[p.type] * mult() * shotMult; score += pts; shotPts += pts;
  if (!quiet) tone(330 * Math.pow(2, Math.min(combo, 26) / 12), .16, 'triangle', .12);
  popups.push({ x: p.x, y: p.y - 14, text: fmt(pts), t: 1, color: PEG[p.type], big: p.type === 'purple' });
  for (let i = 0; i < 7; i++) { const a = Math.random() * Math.PI * 2, s = 60 + Math.random() * 120; parts.push({ x: p.x, y: p.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, t: .5, color: PEG[p.type] }); }
  // bonus 1: both catnips in the same launch
  if (p.type === 'green' && ++greensThisShot === 2 && !greenBonus) { greenBonus = true; doubleShot(p, 'Erva em dobro!'); }
  // bonus 2: two consecutive targets far apart, any pair of orange / catnip / comet
  const special = q => q.type === 'orange' || q.type === 'green' || q.type === 'purple';
  if (!farBonus && lastNew && special(p) && special(lastNew) && Math.hypot(p.x - lastNew.x, p.y - lastNew.y) >= FAR) {
    farBonus = true; links.push({ x1: lastNew.x, y1: lastNew.y, x2: p.x, y2: p.y, t: 2.2 }); doubleShot(p, 'Constelação!');
  }
  lastNew = p;
  // bonus 4: the comet doubles this launch
  if (p.type === 'purple') doubleShot(p, 'Cometa!');
  // bonus 3: many oranges in the same launch
  if (p.type === 'orange' && ++orangesThisShot === RAIN && !rainBonus) { rainBonus = true; doubleShot(p, 'Chuva de planetas!'); }
  if (p.type === 'orange' && orangeHit === orangeTotal) startFever();
  if (p.type === 'green') catPower(p, b);
  checkExtra();
  hud();
}
function catPower(p, b) {
  if (catId === 'neon') {
    longShots += 3; meow(0, 1.15);
    popups.push({ x: p.x, y: p.y - 40, text: 'Mira longa!', t: 1.6, color: C.catnip, big: true });
  } else if (catId === 'astro') {
    meow(0, 1.3);
    popups.push({ x: p.x, y: p.y - 40, text: 'Novelo duplo!', t: 1.6, color: C.catnip, big: true });
    if (b) {
      const s = Math.sign(b.vx) || 1, m = Math.max(Math.abs(b.vx), 220);
      b.vx = s * m;
      flying.push(newBall(b.x, b.y, -s * m, b.vy));
    }
  } else if (catId === 'zorp') {
    boom(); meow(.05, .9);
    waves.push({ x: p.x, y: p.y, t: 0 });
    popups.push({ x: p.x, y: p.y - 40, text: 'Explosão!', t: 1.6, color: C.catnip, big: true });
    pegs.filter(q => !q.gone && !q.hit && q !== p && Math.hypot(q.x - p.x, q.y - p.y) <= BLAST)
      .sort((a, c) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(c.x - p.x, c.y - p.y))
      .forEach(q => onHit(q, 0, null, true));
  }
}
// Free yarn for a big launch: one per threshold crossed by the points of this single launch.
const EXTRA = [5000, 15000, 40000];
let extraGiven = 0;
function checkExtra() {
  while (extraGiven < EXTRA.length && shotPts >= EXTRA[extraGiven]) {
    extraGiven++; balls++;
    popups.push({ x: 250, y: 175, text: `Novelo extra! (${fmt(EXTRA[extraGiven - 1])} pts)`, t: 2.4, color: C.wool, big: true });
    meow(0, 1.2); tone(988, .2, 'sine', .1, .15); hud();
  }
}
function doubleShot(p, label) {
  score += shotPts; shotPts *= 2; shotMult *= 2;
  popups.push({ x: p.x, y: p.y - 44, text: `${label} ×${shotMult}`, t: 2, color: C.eye, big: true });
  checkExtra();
  [660, 880, 1320].forEach((f, i) => tone(f, .22, 'sine', .1, i * .07));
}
function startFever() {
  fever = true; slowT = 1.6; feverText = 3;
  meow(0, 1); meow(.5, 1.25);
  [523, 659, 784, 1047].forEach((f, i) => tone(f, .35, 'triangle', .08, i * .09));
}

function shoot() {
  if (state !== 'aim' || paused) return;
  initAudio();
  flying = [newBall(L.x + Math.cos(aim) * 52, L.y + Math.sin(aim) * 52, Math.cos(aim) * SPEED, Math.sin(aim) * SPEED)];
  balls--; combo = 0; shotPts = 0; state = 'fly'; acc = 0;
  extraGiven = 0; shotMult = 1; orangesThisShot = 0; rainBonus = false; greensThisShot = 0; lastNew = null; greenBonus = false; farBonus = false; caught = false;
  if (longShots > 0) longShots--;
  tone(180, .12, 'square', .05); hud();
}
function endShot() {
  flying = []; state = 'clearing'; popTimer = 0;
  popQueue = pegs.filter(p => p.hit && !p.gone).sort((a, b) => a.order - b.order);
}
function afterClear() {
  if (fever) {
    const bonus = balls * 10000; score += bonus; hud();
    const last = (level + 1) % LEVELS.length === 0;
    if (last) showOverlay('Galáxia conquistada', 'Os gatos dominaram o espaço!',
      `Bônus de novelos: ${balls} × 10.000 = ${fmt(bonus)}. Você completou as 10 fases. Deixe seu nome no mural!`,
      'Jogar de novo', () => { score = 0; level = 0; newRun(); buildLevel(level); state = 'aim'; },
      { score, fase: 10, done: true });
    else showOverlay(`Fase ${level + 1} concluída`, 'Todos os planetas laranja foram',
      `Bônus de novelos: ${balls} × 10.000 = ${fmt(bonus)}. Total: ${fmt(score)} pontos.`,
      'Próxima fase', () => { level++; buildLevel(level); state = 'aim'; });
    state = 'done'; return;
  }
  if (balls <= 0) {
    const left = orangeTotal - orangeHit;
    meow(0, .75);
    showOverlay('Acabaram os novelos', `${left > 1 ? 'Faltaram' : 'Faltou'} ${left} planeta${left > 1 ? 's' : ''}`,
      `Mas você chegou à fase ${level + 1} com ${fmt(score)} pontos. Registre essa marca no mural e tente de novo quando quiser.`,
      'Tentar a fase de novo', () => { score = levelStartScore; buildLevel(level); state = 'aim'; },
      { score, fase: level + 1, done: false },
      'Recomeçar da fase 1', () => { score = 0; level = 0; newRun(); buildLevel(0); state = 'aim'; });
    state = 'over'; return;
  }
  assignPurple(); state = 'aim'; hud();
  // low-ammo warnings: 3 left, 2 left, last one (each shown once per level)
  if (balls <= 3 && balls < lastWarn) {
    lastWarn = balls;
    warn = { text: balls === 1 ? 'Último novelo!' : `Restam ${balls} novelos`, last: balls === 1, t: 2.2 };
    if (balls === 1) meow(0, .8); else { tone(392, .18, 'triangle', .1); tone(330, .25, 'triangle', .1, .16); }
  }
}
let warn = null, lastWarn = 99;

// ---------- overlay: messages and cat chooser
// rec = { score, fase, done } shows the "save your record" form; rec === false shows the mural only.
function showOverlay(eyebrow, title, text, btn, fn, rec, btn2, fn2) {
  $('ovEyebrow').textContent = eyebrow; $('ovTitle').textContent = title; $('ovText').textContent = text; $('ovText').hidden = false;
  $('ovBtn').textContent = btn; $('ovBtn').hidden = false; $('legend').hidden = true; $('chooser').hidden = true; $('overlay').hidden = false;
  $('ovBtn').onclick = () => { $('overlay').hidden = true; initAudio(); fn(); cv.focus(); };
  $('ovBtn2').hidden = !btn2;
  if (btn2) { $('ovBtn2').textContent = btn2; $('ovBtn2').onclick = () => { $('overlay').hidden = true; initAudio(); fn2(); cv.focus(); }; }
  $('records').hidden = rec === undefined;
  if (rec !== undefined) setupRecords(rec || null);
  (rec && rec.score > 0 ? $('recName') : $('ovBtn')).focus();
}

// ---------- records mural
// ONLINE MURAL (Supabase). O endereço e a chave "anon public" moram em
// src/pages/miau-orbital.astro e chegam aqui pelos atributos data-mural-*.
// Vazios, o mural fica no navegador de cada pessoa.
// The anon key is meant to be public: the table's security rules only allow reading and adding records.
const MURAL = { url: raiz.dataset.muralUrl || '', key: raiz.dataset.muralChave || '' };
const online = () => !!(MURAL.url && MURAL.key);
const hdr = () => ({ apikey: MURAL.key, Authorization: 'Bearer ' + MURAL.key });
let memRecords = [];
const Local = {
  key: 'mo-records',
  async list() { try { const v = JSON.parse(localStorage.getItem(this.key) || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return memRecords; } },
  async save(e) {
    const all = await this.list(), i = all.findIndex(r => r.run === e.run);
    if (i < 0) all.push(e); else if (e.score >= all[i].score) all[i] = e; else all[i].name = e.name;
    all.sort((a, b) => b.score - a.score);
    memRecords = all.slice(0, 100);
    try { localStorage.setItem(this.key, JSON.stringify(memRecords)); } catch (er) {}
    return memRecords;
  },
};
// One row per save; the mural shows each game (run) once, with its best score.
function bestPerRun(rows) {
  const m = new Map();
  rows.forEach(r => { const o = m.get(r.run); if (!o || r.score > o.score) m.set(r.run, r); });
  return [...m.values()].sort((a, b) => b.score - a.score);
}
const Records = {
  mode: online() ? 'online' : 'local',   // 'online' | 'local' | 'offline' (online configured but unreachable)
  async list() {
    if (online()) {
      try {
        const ctl = new AbortController(), tm = setTimeout(() => ctl.abort(), 8000);
        const r = await fetch(`${MURAL.url}/rest/v1/recordes?select=run,name,score,fase,done,cat&order=score.desc&limit=300`, { headers: hdr(), signal: ctl.signal });
        clearTimeout(tm);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        this.mode = 'online'; return bestPerRun(await r.json());
      } catch (e) { this.mode = 'offline'; }
    }
    return Local.list();
  },
  async save(e) {
    await Local.save(e);
    if (online()) {
      try {
        const r = await fetch(`${MURAL.url}/rest/v1/recordes`, {
          method: 'POST', headers: { ...hdr(), 'Content-Type': 'application/json', Prefer: 'return=minimal' },
          body: JSON.stringify({ run: e.run, name: e.name, score: Math.round(e.score), fase: e.fase, done: e.done, cat: e.cat }),
        });
        if (!r.ok) throw new Error('HTTP ' + r.status);
      } catch (er) { this.mode = 'offline'; return Local.list(); }
    }
    return this.list();
  },
};
// Basic name filter for a public mural (accents, leetspeak and spacing tricks are normalised first).
const BLOCK = ['porra', 'caralho', 'merda', 'puta', 'puto', 'putaria', 'buceta', 'boceta', 'fdp', 'vsf', 'pqp', 'tnc', 'viado', 'bicha', 'foder', 'foda', 'fodase', 'fodasse', 'arrombad', 'cacete', 'piroca', 'xoxota', 'xereca', 'cuzao', 'babaca', 'otario', 'corno', 'vagabund', 'vadia', 'retardad', 'nazi', 'nazista', 'hitler', 'punheta', 'bosta', 'estupr', 'penis', 'cu', 'rola', 'pau', 'macaco', 'fuck', 'shit', 'bitch', 'cunt', 'nigger', 'whore'];
function badName(n) {
  const t = n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[0@4]/g, c => ({ 0: 'o', '@': 'a', 4: 'a' })[c]).replace(/1/g, 'i').replace(/3/g, 'e').replace(/5|\$/g, 's');
  const words = t.split(/[^a-z]+/).filter(Boolean), joined = t.replace(/[^a-z]/g, '');
  return BLOCK.some(w => w.length <= 5 ? words.includes(w) : joined.includes(w));
}
let runId = Date.now().toString(36), recCtx = null;
const newRun = () => { runId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6); };
const faseLabel = r => r.done ? 'Todas as 10' : `Fase ${r.fase}`;
async function renderBoard() {
  const all = await Records.list(), ol = $('recList'); ol.textContent = '';
  all.slice(0, 10).forEach((r, i) => {
    const li = document.createElement('li'); if (r.run === runId) li.className = 'me';
    [['rk', (i + 1) + 'º'], ['nm', r.name], ['ph', faseLabel(r)], ['pt', fmt(r.score)]].forEach(([c, v]) => { const sp = document.createElement('span'); sp.className = c; sp.textContent = v; li.append(sp); });
    ol.append(li);
  });
  $('recEmpty').hidden = all.length > 0;
  $('recNote').textContent = { online: 'Mural online: recordes de todos os jogadores.', local: 'Recordes salvos neste aparelho.', offline: 'Sem conexão com o mural online. Mostrando os recordes deste aparelho.' }[Records.mode];
  return all;
}
function setupRecords(rec) {
  recCtx = rec && rec.score > 0 ? rec : null;
  $('recForm').hidden = !recCtx; $('recDone').hidden = true;
  if (recCtx) $('recSum').textContent = `${fmt(recCtx.score)} pontos · ${recCtx.done ? 'todas as 10 fases' : 'fase ' + recCtx.fase}`;
  try { if (!$('recName').value) $('recName').value = localStorage.getItem('mo-name') || ''; } catch (e) {}
  renderBoard();
}
$('recForm').addEventListener('submit', async e => {
  e.preventDefault();
  const name = $('recName').value.trim().slice(0, 16);
  if (!name || !recCtx) { $('recName').focus(); return; }
  if (badName(name)) { $('recErr').hidden = false; $('recName').focus(); return; }
  $('recErr').hidden = true; $('recSave').disabled = true;
  try { localStorage.setItem('mo-name', name); } catch (er) {}
  const all = await Records.save({ run: runId, name, score: recCtx.score, fase: recCtx.fase, done: recCtx.done, cat: catId, date: Date.now() });
  const pos = all.findIndex(r => r.run === runId) + 1;
  $('recSave').disabled = false;
  $('recForm').hidden = true; $('recDone').hidden = false;
  $('recDone').textContent = pos === 1 ? 'Recorde salvo! Você está em 1º lugar no mural.' : pos <= 10 ? `Recorde salvo! Você está em ${pos}º lugar no mural.` : `Recorde salvo em ${pos}º lugar. Mais um pouco e você entra no top 10.`;
  if (Records.mode === 'offline') $('recDone').textContent += ' (Sem conexão com o mural online: ficou salvo neste aparelho.)';
  renderBoard(); meow(0, 1.1); $('ovBtn').focus();
});
$('recs').onclick = () => {
  if (state === 'menu') {
    showOverlay('Mural', 'Recordes', 'Os melhores lançadores de novelo da galáxia.', 'Voltar', () => openChooser(true), false);
  } else if (state === 'aim' && $('overlay').hidden) {
    paused = true;
    showOverlay('Pausa', 'Recordes', score > 0 ? 'Quer parar por aqui? Registre sua pontuação até agora, ou volte ao jogo e continue.' : 'Os melhores lançadores de novelo da galáxia.',
      'Voltar ao jogo', () => { paused = false; }, score > 0 ? { score, fase: level + 1, done: false } : false);
  }
};
function openChooser(intro) {
  paused = true;
  $('ovEyebrow').textContent = intro ? 'Como jogar' : 'Tripulação';
  $('ovTitle').textContent = intro ? 'Miau Orbital' : 'Trocar gato';
  $('ovText').hidden = !intro; $('legend').hidden = !intro;
  $('chooser').hidden = false; $('ovBtn').hidden = true; $('ovBtn2').hidden = true; $('records').hidden = true; $('overlay').hidden = false;
  document.querySelectorAll('.cat').forEach(b => b.classList.toggle('sel', b.dataset.id === catId));
  const sel = document.querySelector('.cat.sel'); sel && sel.focus();
}
function chooseCat(id) {
  if (id !== catId) longShots = 0;
  catId = id; try { localStorage.setItem('mo-cat', id); } catch (e) {}
  $('overlay').hidden = true; $('ovText').hidden = false; paused = false; initAudio(); meow(0, id === 'zorp' ? .85 : id === 'astro' ? 1.1 : 1);
  if (state === 'menu') state = 'aim';
  cv.focus();
}
CATS.forEach(c => {
  const b = document.createElement('button'); b.className = 'cat'; b.dataset.id = c.id; b.type = 'button';
  const pc = document.createElement('img'); pc.src = ART[c.id]; pc.alt = ''; pc.width = 76; pc.height = 76;
  const txt = document.createElement('div');
  txt.innerHTML = `<div class="nm"></div><div class="pw"></div><div class="ds"></div>`;
  txt.querySelector('.nm').textContent = c.name; txt.querySelector('.pw').textContent = c.power; txt.querySelector('.ds').textContent = c.desc;
  b.append(pc, txt); b.onclick = () => chooseCat(c.id);
  $('cats').append(b);
});

// ---------- update
function update(dt) {
  t += dt;
  if (slowT > 0) slowT -= dt;
  if (feverText > 0) feverText -= dt;
  const sdt = dt * (slowT > 0 ? .3 : 1) * PACE;
  links = links.filter(l => (l.t -= dt) > 0);
  waves = waves.filter(w => (w.t += dt) < .6);
  if (!fever) bucket.phase += sdt * .75;
  bucket.x = W / 2 + Math.sin(bucket.phase) * (W / 2 - 90);

  if (state === 'fly') {
    acc += sdt;
    while (acc >= STEP && flying.length) {
      acc -= STEP;
      for (const b of [...flying]) {
        stepBody(b, STEP, (p, imp) => onHit(p, imp, b));
        b.age += STEP;
        let out = false;
        if (!fever) {
          circleBounce(b, bucket.x - bucket.w / 2, bucket.y, 6);
          circleBounce(b, bucket.x + bucket.w / 2, bucket.y, 6);
          if (b.vy > 0 && b.y > bucket.y + 4 && b.y < bucket.y + 30 && Math.abs(b.x - bucket.x) < bucket.w / 2 - 6) {
            if (!caught) { caught = true; balls++; popups.push({ x: bucket.x, y: bucket.y - 30, text: 'Novelo grátis!', t: 1.6, color: C.star, big: true }); meow(0, 1.1); hud(); }
            out = true;
          }
        } else if (b.y > H - 22) {
          const v = [10000, 25000, 100000, 25000, 10000][Math.min(4, Math.max(0, b.x / (W / 5) | 0))];
          score += v; popups.push({ x: b.x, y: H - 60, text: '+' + fmt(v), t: 2, color: C.sun, big: true });
          tone(1047, .4, 'triangle', .14); hud(); out = true;
        }
        if (b.y > H + BR) out = true;
        if (out) flying.splice(flying.indexOf(b), 1);
      }
    }
    for (const b of flying) {
      if (b.age > 14) { pegs.forEach(p => { if (p.hit && !p.gone) { p.gone = true; p.pop = 1; } }); b.age = 9; }
      b.trail.push({ x: b.x, y: b.y }); if (b.trail.length > 22) b.trail.shift();
    }
    if (!flying.length) endShot();
  }
  if (state === 'clearing') {
    popTimer -= dt;
    while (popTimer <= 0 && popQueue.length) {
      const p = popQueue.shift(); p.gone = true; p.pop = 1; popTimer += .045;
      tone(500 + Math.random() * 200, .05, 'sine', .03);
    }
    if (!popQueue.length && popTimer <= 0) afterClear();
  }
  for (const p of pegs) if (p.pop > 0) p.pop -= dt * 4;
  popups = popups.filter(p => (p.t -= dt) > 0); popups.forEach(p => p.y -= dt * 30);
  parts = parts.filter(p => (p.t -= dt) > 0); parts.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 400 * dt; });
}

// ---------- background (static, drawn once at 2x)
const bg = document.createElement('canvas'); bg.width = W * 2; bg.height = H * 2;
const twinkles = Array.from({ length: 28 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.2 + .8, s: Math.random() * 2 + 1, p: Math.random() * 6 }));
(() => {
  const g = bg.getContext('2d'); g.scale(2, 2);
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, C.void); gr.addColorStop(.6, C.nebula); gr.addColorStop(1, C.void);
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  [[W * .78, H * .32, 300, C.plasma, .10], [W * .16, H * .66, 320, C.ice, .08], [W * .55, H * .88, 240, C.sun, .05]].forEach(([x, y, r, c, a]) => {
    const rg = g.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, c); rg.addColorStop(1, 'transparent');
    g.globalAlpha = a; g.fillStyle = rg; g.fillRect(x - r, y - r, r * 2, r * 2);
  });
  g.globalAlpha = .35; g.fillStyle = C.hull; g.beginPath(); g.arc(-30, H - 10, 140, 0, 7); g.fill();
  g.strokeStyle = C.rim; g.lineWidth = 6; g.beginPath(); g.ellipse(-30, H - 10, 230, 40, -.25, Math.PI * 1.05, Math.PI * 1.95); g.stroke();
  g.fillStyle = C.star;
  for (let i = 0; i < 170; i++) { g.globalAlpha = Math.random() * .5 + .15; g.beginPath(); g.arc(Math.random() * W, Math.random() * H, Math.random() * 1.1 + .3, 0, 7); g.fill(); }
  g.globalAlpha = 1;
})();

function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h); }
function circle(x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); }

function drawPeg(p) {
  // art is drawn at a base radius of 10 and scaled about the peg centre, so details grow with PR
  const k = PR / 10; ctx.save(); ctx.translate(p.x * (1 - k), p.y * (1 - k)); ctx.scale(k, k);
  const col = PEG[p.type], lit = p.hit;
  if (p.type === 'orange') {
    ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.globalAlpha = lit ? .9 : .45;
    ctx.beginPath(); ctx.ellipse(p.x, p.y, 16, 4.5, -.35, Math.PI, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
  }
  if (lit) { ctx.shadowColor = col; ctx.shadowBlur = 18; }
  ctx.fillStyle = col; circle(p.x, p.y, 10); ctx.fill(); ctx.shadowBlur = 0;
  if (p.type === 'blue') { ctx.fillStyle = 'rgba(11,10,26,.28)'; circle(p.x + 3, p.y + 2, 2.6); ctx.fill(); circle(p.x - 3.5, p.y + 4, 1.6); ctx.fill(); }
  if (p.type === 'green') {
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.beginPath(); ctx.moveTo(-6, 0); ctx.quadraticCurveTo(0, -6, 6, 0); ctx.quadraticCurveTo(0, 6, -6, 0); ctx.fill();
    ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(5, 0); ctx.stroke(); ctx.restore();
  }
  if (p.type === 'purple') {
    ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.beginPath();
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + t, r = i % 2 ? 2 : 7; ctx.lineTo(p.x + Math.cos(a) * r, p.y + Math.sin(a) * r); }
    ctx.closePath(); ctx.fill();
  }
  if (!lit) { ctx.fillStyle = 'rgba(11,10,26,.4)'; circle(p.x, p.y, 10); ctx.fill(); }
  ctx.fillStyle = lit ? 'rgba(255,255,255,.8)' : 'rgba(255,255,255,.3)'; circle(p.x - 3, p.y - 3.5, lit ? 3.5 : 2.5); ctx.fill();
  if (p.type === 'orange') {
    ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.globalAlpha = lit ? 1 : .55;
    ctx.beginPath(); ctx.ellipse(p.x, p.y, 16, 4.5, -.35, 0, Math.PI); ctx.stroke(); ctx.globalAlpha = 1;
  }
  if (p.type === 'purple' && !lit) { ctx.strokeStyle = col; ctx.globalAlpha = .5 + .4 * Math.sin(t * 5); ctx.lineWidth = 2; circle(p.x, p.y, 10 + 4); ctx.stroke(); ctx.globalAlpha = 1; }
  ctx.restore();
}

// The chosen cat rides a little pod drawn in the portraits' cartoon style (thick dark outline, cream shell).
// The pod rim hides the flat bottom edge of the portrait; the turret hub sits on the pod at the launch pivot L.
function drawPod() {
  const im = IMG[catId], ol = C.fur;
  ctx.save(); ctx.translate(L.x, L.y);
  const hg = ctx.createRadialGradient(0, -52, 10, 0, -52, 64); hg.addColorStop(0, 'rgba(166,162,204,.22)'); hg.addColorStop(1, 'rgba(166,162,204,0)');
  ctx.fillStyle = hg; circle(0, -52, 64); ctx.fill();
  if (im.complete && im.naturalWidth) {
    // only the last few px of the portrait go behind the rim, so the outfit shows
    const h = 90 * (1 + Math.sin(t * 2) * .012), w = h * im.naturalWidth / im.naturalHeight;
    ctx.drawImage(im, -w / 2, -6 - h, w, h);
  }
  ctx.lineJoin = 'round'; ctx.strokeStyle = ol; ctx.lineWidth = 3.5;
  // bowl
  ctx.fillStyle = C.shell; ctx.beginPath();
  ctx.moveTo(-56, -8); ctx.lineTo(-44, 15); ctx.quadraticCurveTo(-39, 25, -28, 25); ctx.lineTo(28, 25); ctx.quadraticCurveTo(39, 25, 44, 15); ctx.lineTo(56, -8); ctx.closePath();
  ctx.fill(); ctx.stroke();
  // orange stripe, clipped to the bowl
  ctx.save(); ctx.clip(); ctx.fillStyle = C.sun; ctx.fillRect(-60, 3, 120, 7); ctx.restore();
  ctx.beginPath(); ctx.moveTo(-56, -8); ctx.lineTo(-44, 15); ctx.quadraticCurveTo(-39, 25, -28, 25); ctx.lineTo(28, 25); ctx.quadraticCurveTo(39, 25, 44, 15); ctx.lineTo(56, -8); ctx.stroke();
  // rim lip
  ctx.fillStyle = C.shell; rr(-62, -15, 124, 11, 6); ctx.fill(); ctx.stroke();
  ctx.fillStyle = C.shelldark; rr(-58, -8, 116, 3, 2); ctx.fill();
  // panel lights (blink in turn)
  [[-30, C.wool], [30, C.yarn]].forEach(([x, c], i) => { ctx.fillStyle = c; ctx.globalAlpha = .55 + .45 * (Math.sin(t * 3 + i * 2) > 0); circle(x, 17, 3.5); ctx.fill(); ctx.globalAlpha = 1; ctx.lineWidth = 2; ctx.stroke(); });
  // turret barrel
  ctx.save(); ctx.rotate(aim); ctx.lineWidth = 3.5;
  ctx.fillStyle = C.shell; rr(10, -9, 46, 18, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = C.wool; rr(44, -10, 13, 20, 5); ctx.fill(); ctx.stroke();
  ctx.restore();
  // hub
  ctx.fillStyle = C.shell; ctx.lineWidth = 3.5; circle(0, 0, 12); ctx.fill(); ctx.stroke();
  ctx.fillStyle = C.sun; circle(0, 0, 5); ctx.fill(); ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();
}

function drawBall(b) {
  if (b.trail.length > 1) {
    ctx.strokeStyle = C.wool; ctx.lineWidth = 2.5; ctx.globalAlpha = .7; ctx.beginPath();
    b.trail.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke(); ctx.globalAlpha = 1;
  }
  ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.age * 9);
  ctx.fillStyle = C.wool; circle(0, 0, BR); ctx.fill();
  ctx.strokeStyle = C.wooldark; ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.ellipse(0, 0, BR - 1.5, BR * .38, .5, 0, 7); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(0, 0, BR * .38, BR - 1.5, .5, 0, 7); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(0, 0, BR - 1.5, BR * .38, -.7, 0, 7); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.35)'; circle(-BR * .35, -BR * .4, BR * .28); ctx.fill();
  ctx.restore();
}

function draw() {
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.drawImage(bg, 0, 0, W, H);
  ctx.fillStyle = C.star;
  twinkles.forEach(s => { ctx.globalAlpha = .25 + .6 * (.5 + .5 * Math.sin(t * s.s + s.p)); circle(s.x, s.y, s.r); ctx.fill(); });
  ctx.globalAlpha = 1;

  if (fever) {
    const vals = ['10 mil', '25 mil', '100 mil', '25 mil', '10 mil'];
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i === 2 ? C.sun : (i % 2 ? C.plasma : C.ice); ctx.globalAlpha = .28 + .1 * Math.sin(t * 6 + i);
      ctx.fillRect(i * W / 5 + 2, H - 60, W / 5 - 4, 60); ctx.globalAlpha = 1;
      ctx.fillStyle = C.star; ctx.font = `24px ${FD}`; ctx.textAlign = 'center';
      ctx.fillText(vals[i], i * W / 5 + W / 10, H - 22);
    }
  }

  if (state === 'aim' && longShots > 0) {
    const pts = traceAim(aim);
    ctx.fillStyle = C.catnip;
    pts.forEach((p, i) => { ctx.globalAlpha = .7 * (1 - i / pts.length) + .15; circle(p.x, p.y, 2.5); ctx.fill(); });
    ctx.globalAlpha = 1;
  }
  if (state === 'aim' && target) {
    ctx.strokeStyle = C.star; ctx.lineWidth = 1.5; ctx.globalAlpha = .8;
    ctx.beginPath(); ctx.arc(target.x, target.y, 13, 0, 7);
    ctx.moveTo(target.x - 19, target.y); ctx.lineTo(target.x - 8, target.y); ctx.moveTo(target.x + 8, target.y); ctx.lineTo(target.x + 19, target.y);
    ctx.moveTo(target.x, target.y - 19); ctx.lineTo(target.x, target.y - 8); ctx.moveTo(target.x, target.y + 8); ctx.lineTo(target.x, target.y + 19);
    ctx.stroke(); ctx.globalAlpha = 1;
  }

  links.forEach(l => {
    ctx.save(); ctx.globalAlpha = Math.min(1, l.t); ctx.strokeStyle = C.eye; ctx.lineWidth = 2.5; ctx.shadowColor = C.eye; ctx.shadowBlur = 12;
    ctx.setLineDash([8, 6]); ctx.lineDashOffset = -t * 40; ctx.beginPath(); ctx.moveTo(l.x1, l.y1); ctx.lineTo(l.x2, l.y2); ctx.stroke(); ctx.restore();
  });

  for (const p of pegs) {
    if (p.gone) {
      if (p.pop > 0) { ctx.globalAlpha = p.pop; ctx.strokeStyle = PEG[p.type]; ctx.lineWidth = 3; circle(p.x, p.y, PR + (1 - p.pop) * 14); ctx.stroke(); ctx.globalAlpha = 1; }
      continue;
    }
    drawPeg(p);
  }

  // alien shockwaves
  waves.forEach(w => {
    const k = w.t / .6;
    ctx.save(); ctx.globalAlpha = 1 - k; ctx.strokeStyle = C.catnip; ctx.lineWidth = 6 * (1 - k) + 1; ctx.shadowColor = C.catnip; ctx.shadowBlur = 20;
    circle(w.x, w.y, BLAST * (.2 + .8 * Math.sqrt(k))); ctx.stroke();
    ctx.globalAlpha = (1 - k) * .15; ctx.fillStyle = C.catnip; ctx.fill(); ctx.restore();
  });

  // cardboard box
  if (!fever) {
    const { x, y, w } = bucket;
    ctx.fillStyle = C.box; ctx.strokeStyle = C.boxdark; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x + w / 2, y); ctx.lineTo(x + w / 2 - 12, y + 38); ctx.lineTo(x - w / 2 + 12, y + 38); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = C.boxdark; ctx.globalAlpha = .6; ctx.beginPath(); ctx.moveTo(x - 14, y + 4); ctx.lineTo(x + 14, y + 4); ctx.moveTo(x, y + 4); ctx.lineTo(x, y + 36); ctx.stroke(); ctx.globalAlpha = 1;
    ctx.fillStyle = C.boxdark; [-1, 1].forEach(s => { ctx.beginPath(); ctx.moveTo(x + s * (w / 2 - 22), y); ctx.lineTo(x + s * w / 2, y); ctx.lineTo(x + s * (w / 2 + 4), y - 8); ctx.closePath(); ctx.fill(); circle(x + s * w / 2, y, 5); ctx.fill(); });
  }

  drawPod();
  if (state === 'aim') { ctx.fillStyle = C.wool; circle(L.x + Math.cos(aim) * 52, L.y + Math.sin(aim) * 52, BR * .8); ctx.fill(); }

  flying.forEach(drawBall);

  parts.forEach(p => { ctx.globalAlpha = p.t * 2; ctx.fillStyle = p.color; ctx.fillRect(p.x - 2, p.y - 2, 4, 4); });
  ctx.globalAlpha = 1; ctx.textAlign = 'center';
  popups.forEach(p => {
    ctx.globalAlpha = Math.min(1, p.t * 2); ctx.fillStyle = p.color;
    ctx.font = p.big ? `26px ${FD}` : `800 17px ${FB}`;
    ctx.strokeStyle = C.void; ctx.lineWidth = 4; ctx.strokeText(p.text, p.x, p.y); ctx.fillText(p.text, p.x, p.y);
  });
  ctx.globalAlpha = 1;
  if (longShots > 0 && state === 'aim') { ctx.font = `26px ${FD}`; ctx.fillStyle = C.catnip; ctx.fillText(`Mira longa · ${longShots} tiro${longShots > 1 ? 's' : ''}`, W - 250, 118); }
  if (state === 'fly' && shotPts > 0) { // live score of this launch and distance to the next free yarn
    ctx.textAlign = 'center'; ctx.lineWidth = 6; ctx.strokeStyle = C.void;
    ctx.font = `26px ${FD}`; ctx.fillStyle = C.star;
    const s1 = `Jogada: ${fmt(shotPts)}`; ctx.strokeText(s1, W - 250, 118); ctx.fillText(s1, W - 250, 118);
    if (extraGiven < EXTRA.length) {
      ctx.font = `800 15px ${FB}`; ctx.fillStyle = C.wool;
      const s2 = `novelo extra em ${fmt(EXTRA[extraGiven])}`; ctx.strokeText(s2, W - 250, 142); ctx.fillText(s2, W - 250, 142);
    }
  }
  if (warn && (warn.t -= 1 / 60) > 0 && state === 'aim') {
    const a = Math.min(1, warn.t * 2), pop = 1 + Math.max(0, warn.t - 1.9) * 1.2;
    ctx.save(); ctx.translate(250, 124); ctx.scale(pop, pop); ctx.globalAlpha = a; ctx.textAlign = 'center';
    ctx.font = warn.last ? `54px ${FD}` : `42px ${FD}`;
    ctx.lineWidth = 9; ctx.strokeStyle = C.void; ctx.fillStyle = warn.last ? C.sun : C.eye;
    ctx.strokeText(warn.text, 0, 0); ctx.fillText(warn.text, 0, 0);
    ctx.restore(); ctx.globalAlpha = 1;
  } else if (warn && state !== 'aim') warn = null;
  if (feverText > 0) {
    const s = 1 + Math.max(0, feverText - 2.6) * 1.5;
    ctx.save(); ctx.translate(W / 2, H / 2 - 40); ctx.scale(s, s); ctx.globalAlpha = Math.min(1, feverText);
    ctx.font = `76px ${FD}`; ctx.lineWidth = 10; ctx.strokeStyle = C.void; ctx.fillStyle = C.sun;
    ctx.strokeText('MIAAAU!', 0, 0); ctx.fillText('MIAAAU!', 0, 0);
    ctx.font = `800 22px ${FB}`; ctx.fillStyle = C.star; ctx.lineWidth = 6;
    ctx.strokeText('mire nos prêmios lá embaixo', 0, 40); ctx.fillText('mire nos prêmios lá embaixo', 0, 40);
    ctx.restore(); ctx.globalAlpha = 1;
  }
}

// ---------- input
function toLocal(e) { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H }; }
const AMIN = -.35, AMAX = Math.PI + .35;
let target = null;
// Where the ball crosses height ty in free flight (no pegs), using the exact same integrator as the game.
function missAt(a, tx, ty) {
  const b = { x: L.x + Math.cos(a) * 52, y: L.y + Math.sin(a) * 52, vx: Math.cos(a) * SPEED, vy: Math.sin(a) * SPEED };
  for (let i = 0; i < 2000; i++) {
    const px = b.x, py = b.y;
    b.vy += G * STEP; b.x += b.vx * STEP; b.y += b.vy * STEP;
    if (b.vy > 0 && b.y >= ty) { const f = (ty - py) / (b.y - py || 1); return px + (b.x - px) * f - tx; }
  }
  return NaN;
}
function solveAim(tx, ty) {
  // Robust aim: search only on the cursor's side, from straight down toward flat/up.
  // The first angle whose path crosses the cursor height at the cursor is the direct (lower) arc.
  // If the point is out of reach, use the angle that gets closest on that side, so the barrel never flips.
  const dx = tx - L.x;
  if (Math.abs(dx) < 1) return Math.PI / 2;
  const side = dx > 0 ? 1 : -1;
  const down = Math.PI / 2, flat = side > 0 ? AMIN : AMAX;
  const f = a => { const m = missAt(a, tx, ty); return isFinite(m) ? m * side : -1e9; };
  const N = 80;
  let pa = down, pf = f(down), best = down, bestF = pf;
  for (let i = 1; i <= N; i++) {
    const a = down + (flat - down) * i / N, fa = f(a);
    if (fa > bestF) { bestF = fa; best = a; }
    if (pf < 0 && fa >= 0) {             // bracketed: refine by bisection
      let lo = pa, hi = a;
      for (let k = 0; k < 28; k++) { const m = (lo + hi) / 2; if (f(m) < 0) lo = m; else hi = m; }
      return (lo + hi) / 2;
    }
    pa = a; pf = fa;
  }
  return best;
}
function setAim(p) { target = p; aim = solveAim(p.x, p.y); }
let pressing = false;
cv.addEventListener('pointermove', e => { if (state === 'aim' && !paused) setAim(toLocal(e)); });
cv.addEventListener('pointerdown', e => { initAudio(); if (state !== 'aim' || paused) return; pressing = true; cv.setPointerCapture(e.pointerId); setAim(toLocal(e)); });
cv.addEventListener('pointerup', e => { if (pressing && state === 'aim') { setAim(toLocal(e)); shoot(); } pressing = false; });
cv.addEventListener('keydown', e => {
  if (paused) return;
  if (e.key === 'ArrowLeft') { target = null; aim = Math.min(AMAX, aim + .015); e.preventDefault(); }
  if (e.key === 'ArrowRight') { target = null; aim = Math.max(AMIN, aim - .015); e.preventDefault(); }
  if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); shoot(); }
});
$('mute').onclick = () => { muted = !muted; $('mute').textContent = muted ? 'Som: desligado' : 'Som: ligado'; try { localStorage.setItem('rdp-muted', muted ? '1' : '0'); } catch (e) {} };
$('restart').onclick = () => { if (state === 'menu') return; score = levelStartScore; buildLevel(level); $('overlay').hidden = true; paused = false; state = 'aim'; };
$('swap').onclick = () => { if (state === 'menu' || !$('overlay').hidden) return; openChooser(false); };

function resize() { const r = cv.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1); cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d); scale = cv.width / W; }
new ResizeObserver(resize).observe(cv); resize();

let last = performance.now();
function loop(now) { const dt = Math.min(.033, (now - last) / 1000); last = now; if (!paused) update(dt); else t += dt; draw(); requestAnimationFrame(loop); }
buildLevel(0); openChooser(true); requestAnimationFrame(loop);
})();
