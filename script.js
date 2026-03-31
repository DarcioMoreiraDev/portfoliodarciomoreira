const form = document.querySelector('.contato form');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();

  if (!nome || !email || !mensagem) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  const numero = '5585996497608';

  const texto = 
    `Olá, meu nome é ${nome}.\n` +
    `Email: ${email}\n` +
    `Mensagem: ${mensagem}`;

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;

  window.open(url, '_blank');

  form.reset();
});

// Tema escuro / claro: toggle e persistência
const themeToggle = document.getElementById('theme-toggle');
function updateToggleIcon() {
  if (!themeToggle) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateToggleIcon();
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// Inicializa tema salvo ou prefereências do sistema
(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) setTheme(saved);
  else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }
})();

// Botão "Voltar ao topo" — aparece quando o usuário chega ao fim da página
const backToTop = document.getElementById('back-to-top');
function checkScrollBottom() {
  if (!backToTop) return;
  const atBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 40);
  if (atBottom) backToTop.classList.add('visible');
  else backToTop.classList.remove('visible');
}

window.addEventListener('scroll', checkScrollBottom, { passive: true });
window.addEventListener('resize', checkScrollBottom);

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  // verificação inicial
  checkScrollBottom();
}

// Atualiza opacidade do degradê conforme o usuário rola a página
function updateBackgroundGradient() {
  const doc = document.documentElement;
  const scrollTop = window.scrollY || window.pageYOffset;
  const maxScroll = doc.scrollHeight - window.innerHeight;
  const progress = Math.max(0, Math.min(1, (scrollTop / (maxScroll || 1))));
  // queremos que o degradê vá de 0 (top) até 1 (fim)
  doc.style.setProperty('--gradient-opacity', String(progress));
}

window.addEventListener('scroll', updateBackgroundGradient, { passive: true });
window.addEventListener('resize', updateBackgroundGradient);
// inicializa valor
updateBackgroundGradient();

// --- Bubble effect: generate small bubbles and move them subtly on scroll ---
const bubblesWrapper = document.getElementById('bubbles-wrapper');
const bubbles = [];
function createBubbles(count = 18) {
  if (!bubblesWrapper) return;
  const width = window.innerWidth;
  const height = window.innerHeight;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'bubble';
    // random size class
    const size = Math.random();
    if (size < 0.4) el.classList.add('small');
    else if (size < 0.8) el.classList.add('medium');
    else el.classList.add('large');

    // random initial position
    const left = Math.round(Math.random() * (width + 200) - 100); // allow beyond edges
    const top = Math.round(Math.random() * (height + 200) - 100);

    // speed factor controls how much bubble moves relative to scroll
    // Aumentado: velocidade mais alta por padrão (range 0.4 - 1.2)
    const speed = 0.4 + Math.random() * 0.8;
    const drift = (Math.random() - 0.5) * 40; // horizontal drift amplitude

    el.style.left = left + 'px';
    el.style.top = top + 'px';
    bubblesWrapper.appendChild(el);
    bubbles.push({ el, left, top, speed, drift });
  }
}

function updateBubblesOnScroll() {
  if (!bubblesWrapper || bubbles.length === 0) return;
  const scrollY = window.scrollY || window.pageYOffset;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight || 1;
  const progress = Math.max(0, Math.min(1, scrollY / maxScroll));

  // move each bubble up as user scrolls, with slight horizontal sinusoidal drift
  bubbles.forEach((b, i) => {
    const moveY = -progress * (200 + b.speed * 600); // upward movement
    const xOsc = Math.sin((progress * 6 + i) * (1 + b.speed)) * b.drift;
    b.el.style.transform = `translate(${xOsc}px, ${moveY}px)`;
    // fade slightly as near end
    b.el.style.opacity = String(0.9 - progress * 0.6);
  });
}

// initialize bubbles and wire scroll
createBubbles(20);
window.addEventListener('scroll', updateBubblesOnScroll, { passive: true });
window.addEventListener('resize', () => {
  // reposition bubbles on resize so they stay within viewport
  const w = window.innerWidth;
  const h = window.innerHeight;
  bubbles.forEach(b => {
    b.left = Math.max(-100, Math.min(w + 100, b.left));
    b.top = Math.max(-100, Math.min(h + 100, b.top));
    b.el.style.left = b.left + 'px';
    b.el.style.top = b.top + 'px';
  });
});
// initial update
updateBubblesOnScroll();

// Continuous animation loop so bubbles move even without scroll
let _animStart = null;
function animateBubbles(timestamp) {
  if (!_animStart) _animStart = timestamp;
  const t = (timestamp - _animStart) / 1000; // seconds
  const scrollY = window.scrollY || window.pageYOffset;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight || 1;
  const progress = Math.max(0, Math.min(1, scrollY / maxScroll));

  bubbles.forEach((b, i) => {
    // time-based subtle motion
    const timeX = Math.sin(t * (0.3 + b.speed * 2) + i) * (b.drift * 0.6);
    const timeY = Math.cos(t * (0.15 + b.speed) + i) * (12 * b.speed);

    // scroll-driven upward movement
    const moveY = -progress * (200 + b.speed * 600);
    const xOsc = Math.sin((progress * 6 + i) * (1 + b.speed)) * b.drift;

    const totalX = xOsc + timeX;
    const totalY = moveY + timeY;

    b.el.style.transform = `translate(${totalX}px, ${totalY}px)`;
    b.el.style.opacity = String(0.9 - progress * 0.6);
  });

  requestAnimationFrame(animateBubbles);
}

requestAnimationFrame(animateBubbles);

// --- Mobile menu toggle ---
const menuToggle = document.getElementById('menu-toggle');
const navBar = document.querySelector('.nav-bar');
const navList = navBar && navBar.querySelector('ul');

function closeMenu() {
  if (!navBar) return;
  navBar.classList.remove('nav-open');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
}

if (menuToggle && navBar) {
  menuToggle.addEventListener('click', () => {
      const open = navBar.classList.toggle('nav-open');
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      // alterna ícone entre hamburguer e fechar (X)
      if (open) menuToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      else menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });

  // close when a nav link is clicked
  if (navList) {
    navList.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') closeMenu();
    });
  }

  // close on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });

  // close when clicking outside
  document.addEventListener('click', (e) => {
    if (!navBar.contains(e.target) && navBar.classList.contains('nav-open')) closeMenu();
  });
}

// --- Project cards: tilt on mousemove and modal preview ---
const projectCards = Array.from(document.querySelectorAll('.projeto-card'));
const modal = document.getElementById('project-modal');
const modalImage = modal && modal.querySelector('.project-modal__image');
const modalTitle = modal && modal.querySelector('.project-modal__title');
const modalDesc = modal && modal.querySelector('.project-modal__desc');
const modalLink = modal && modal.querySelector('.project-modal__link');

function handleCardMove(e) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width; // 0..1
  const py = (e.clientY - rect.top) / rect.height;
  const rotateY = (px - 0.5) * 8; // degrees
  const rotateX = (0.5 - py) * 6;
  el.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
}

function handleCardLeave(e) {
  const el = e.currentTarget;
  el.style.transform = '';
}

function openProjectModal(card) {
  if (!modal) return;
  const title = card.dataset.title || '';
  const desc = card.dataset.desc || '';
  const image = card.dataset.image || '';
  const link = card.dataset.link || '#';
  modalImage.src = image;
  modalImage.alt = title;
  modalTitle.textContent = title;
  modalDesc.textContent = desc;
  modalLink.href = link;
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

projectCards.forEach(card => {
  card.addEventListener('mousemove', handleCardMove);
  card.addEventListener('mouseleave', handleCardLeave);
  card.addEventListener('click', () => openProjectModal(card));
  card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') openProjectModal(card); });
});

if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target.matches('[data-close]') || e.target.classList.contains('project-modal__close')) closeProjectModal();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeProjectModal(); });
}