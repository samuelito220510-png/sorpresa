const pCanvas = document.getElementById('particles-canvas');
const pCtx = pCanvas.getContext('2d');
let pW, pH, particles = [];

function resizeP() {
  pW = pCanvas.width = window.innerWidth;
  pH = pCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeP);
resizeP();

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * pW;
    this.y = Math.random() * pH;
    this.size = Math.random() * 2.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3 - 0.1;
    this.opacity = Math.random() * 0.4 + 0.1;
    this.shape = Math.random() > 0.85 ? 'heart' : 'dot';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < -10 || this.x > pW + 10 || this.y < -10 || this.y > pH + 10) this.reset();
    if (this.y < 0) { this.y = 0; this.speedY *= -1; }
  }
  draw() {
    pCtx.globalAlpha = this.opacity;
    if (this.shape === 'heart') {
      pCtx.fillStyle = '#d45a7a';
      const s = this.size * 2;
      const x = this.x, y = this.y;
      pCtx.beginPath();
      pCtx.moveTo(x, y + s / 4);
      pCtx.bezierCurveTo(x - s / 2, y - s / 4, x - s / 2, y + s / 2, x, y + s / 2);
      pCtx.bezierCurveTo(x + s / 2, y + s / 2, x + s / 2, y - s / 4, x, y + s / 4);
      pCtx.fill();
    } else {
      pCtx.fillStyle = '#f0c4a0';
      pCtx.beginPath();
      pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      pCtx.fill();
    }
    pCtx.globalAlpha = 1;
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function animateP() {
  pCtx.clearRect(0, 0, pW, pH);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateP);
}
animateP();

const typewriterEl = document.getElementById('typewriter');
const cursorEl = document.getElementById('cursor');
const buttonsEl = document.getElementById('buttons');

const fullText =
  'Hoy, frente a ti, dejo caer todas las dudas. ' +
  'Quiero caminar a tu lado, re\u00edr contigo, ' +
  'abrazarte en los d\u00edas grises y celebrar cada instante juntos. ' +
  'No hay un \u00abhubiera\u00bb que valga m\u00e1s que un \u00abahora\u00bb. ' +
  'As\u00ed que te pregunto, <span class="highlight">\u00bfquieres ser mi novia?</span>';

let index = 0;
let displayText = '';

function type() {
  if (index < fullText.length) {
    const char = fullText[index];
    if (char === '<') {
      const tagEnd = fullText.indexOf('>', index);
      displayText += fullText.slice(index, tagEnd + 1);
      index = tagEnd + 1;
    } else {
      displayText += char;
      index++;
    }
    typewriterEl.innerHTML = displayText + '<span class="cursor-blink"></span>';
    const speed = Math.random() * 30 + 20;
    setTimeout(type, speed);
  } else {
    cursorEl.style.display = 'none';
    typewriterEl.innerHTML = fullText;
    buttonsEl.style.display = 'flex';
    buttonsEl.style.animation = 'fadeIn 0.6s ease';
  }
}
type();

const btnNo = document.getElementById('btnNo');
let noCount = 0;

btnNo.addEventListener('mouseenter', () => {
  if (noCount < 10) {
    const card = document.querySelector('.card');
    const rect = card.getBoundingClientRect();
    const maxX = rect.width - btnNo.offsetWidth - 20;
    const maxY = rect.height - btnNo.offsetHeight - 20;
    const randX = (Math.random() - 0.5) * maxX * 0.8;
    const randY = (Math.random() - 0.5) * maxY * 0.8;
    btnNo.style.transform = `translate(${randX}px, ${randY}px) scale(0.92)`;
    btnNo.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
    noCount++;
  }
});

btnNo.addEventListener('click', () => {
  btnNo.style.transform = 'scale(0.7)';
  btnNo.style.opacity = '0.3';
  setTimeout(() => {
    btnNo.style.transform = 'scale(1)';
    btnNo.style.opacity = '1';
    btnNo.textContent = '\u00bfSegura? \uD83D\uDE05';
  }, 300);
  setTimeout(() => { btnNo.textContent = 'No'; }, 1500);
});

document.getElementById('btnYes').addEventListener('click', () => {
  document.getElementById('celebration').classList.add('show');
  startConfetti();
});

const cCanvas = document.getElementById('confetti-canvas');
const cCtx = cCanvas.getContext('2d');
let cW, cH, confetti = [], confettiRunning = true;

function resizeC() {
  cW = cCanvas.width = window.innerWidth;
  cH = cCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeC);
resizeC();

const confettiColors = ['#d45a7a', '#f0c4a0', '#f7e8d0', '#e8a0b0', '#c08050', '#ff6b8a', '#ffd700'];

class ConfettiPiece {
  constructor() {
    this.reset(true);
  }
  reset(init) {
    this.x = Math.random() * cW;
    this.y = init ? Math.random() * cH - cH : -20;
    this.w = Math.random() * 10 + 4;
    this.h = Math.random() * 6 + 3;
    this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    this.rotation = Math.random() * 360;
    this.rotSpeed = (Math.random() - 0.5) * 6;
    this.speedY = Math.random() * 3 + 2;
    this.speedX = (Math.random() - 0.5) * 2;
    this.opacity = Math.random() * 0.7 + 0.3;
  }
  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotSpeed;
    if (this.y > cH + 20) this.reset(false);
  }
  draw() {
    cCtx.save();
    cCtx.translate(this.x, this.y);
    cCtx.rotate((this.rotation * Math.PI) / 180);
    cCtx.globalAlpha = this.opacity;
    cCtx.fillStyle = this.color;
    cCtx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
    cCtx.restore();
  }
}

function startConfetti() {
  confettiRunning = true;
  confetti = [];
  for (let i = 0; i < 250; i++) confetti.push(new ConfettiPiece());
  animateC();
}

function stopConfetti() {
  confettiRunning = false;
}

function animateC() {
  if (!confettiRunning) return;
  cCtx.clearRect(0, 0, cW, cH);
  confetti.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateC);
}

document.addEventListener('click', (e) => {
  if (e.target.closest('#celebration') && !e.target.closest('.celebration-card')) {
    document.getElementById('celebration').classList.remove('show');
    stopConfetti();
  }
});