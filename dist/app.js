const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navegacao');
const header = document.querySelector('.header');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = false;
const motionToggle = document.querySelector('.motion-toggle');
function syncMotionControl() {
  motionToggle.hidden = reducedMotion.matches;
  document.body.classList.toggle('motion-paused', motionPaused);
  motionToggle.setAttribute('aria-pressed', String(motionPaused));
  motionToggle.innerHTML = `${motionPaused ? 'Retomar animações' : 'Pausar animações'} <span aria-hidden="true">${motionPaused ? '▷' : 'Ⅱ'}</span>`;
}
motionToggle.addEventListener('click', () => {
  motionPaused = !motionPaused;
  syncMotionControl();
});
reducedMotion.addEventListener('change', syncMotionControl);
syncMotionControl();
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  navigation.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  navigation.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); }
});
window.matchMedia('(min-width: 721px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const practiceTabs = [...document.querySelectorAll('.practice-tab')];
const practicePanels = [...document.querySelectorAll('.practice-panel')];
function selectPractice(index, focus = false) {
  practiceTabs.forEach((tab, i) => {
    const active = index === i;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    tab.classList.toggle('is-active', active);
    practicePanels[i].hidden = !active;
  });
  document.querySelector('#practice-current').textContent = String(index + 1).padStart(2, '0');
  document.querySelector('#practice-progress').style.width = `${((index + 1) / practiceTabs.length) * 100}%`;
  if (focus) practiceTabs[index].focus();
}
practiceTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectPractice(index));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % practiceTabs.length;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + practiceTabs.length) % practiceTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = practiceTabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectPractice(next, true); }
  });
});

const whatsappBase = 'https://wa.me/5566996403398';
const greeting = 'Olá, gostaria de falar com a equipe Braga & Delfino Advocacia.';
const topicMessage = topic => `${greeting} Meu assunto é: ${topic}.`;
document.querySelectorAll('[data-topic]').forEach(link => { link.href = `${whatsappBase}?text=${encodeURIComponent(topicMessage(link.dataset.topic))}`; });
document.querySelectorAll('input[name="assunto"]').forEach(input => input.addEventListener('change', () => {
  document.querySelector('#contact-whatsapp').href = `${whatsappBase}?text=${encodeURIComponent(topicMessage(input.value))}`;
  document.querySelector('#contact-hint').textContent = `Assunto: ${input.value}. Você confirma o envio no WhatsApp.`;
}));

const privacyDialog = document.querySelector('#privacy-dialog');
document.querySelector('#open-privacy').addEventListener('click', () => privacyDialog.showModal());
privacyDialog.querySelectorAll('.dialog-close, .dialog-confirm').forEach(button => button.addEventListener('click', () => privacyDialog.close()));
privacyDialog.addEventListener('click', event => {
  if (event.target !== privacyDialog) return;
  const bounds = privacyDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) privacyDialog.close();
});
document.querySelectorAll('[data-year]').forEach(element => { element.textContent = new Date().getFullYear(); });

if ('IntersectionObserver' in window) {
  document.body.classList.add('motion-ready');
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
  }), { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
  let heroVisible = true;
  let contactVisible = false;
  const contactObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.target.id === 'inicio') heroVisible = entry.isIntersecting;
      if (entry.target.id === 'contato') contactVisible = entry.isIntersecting;
    });
    document.querySelector('.floating-contact').classList.toggle('is-visible', !heroVisible && !contactVisible);
  });
  contactObserver.observe(document.querySelector('.hero'));
  contactObserver.observe(document.querySelector('.contact'));
  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navigation.querySelectorAll('a').forEach(link => {
      const current = link.getAttribute('href') === `#${entry.target.id}`;
      link.classList.toggle('is-current', current);
      if (current) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
  }), { rootMargin: '-20% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
}

const scrollProgress = document.querySelector('.scroll-progress');
const heroLandscape = document.querySelector('.hero-landscape');
const hero = document.querySelector('.hero');
let scrollScheduled = false;
function updateScroll() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.transform = `scaleX(${scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0})`;
  header.classList.toggle('is-scrolled', window.scrollY > 20);
  if (!reducedMotion.matches && !motionPaused && window.scrollY < hero.offsetHeight + 120) heroLandscape.style.setProperty('--parallax', `${Math.min(window.scrollY * 0.08, 55)}px`);
  scrollScheduled = false;
}
function requestScrollUpdate() { if (!scrollScheduled) { scrollScheduled = true; requestAnimationFrame(updateScroll); } }
window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', requestScrollUpdate);
reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) heroLandscape.style.setProperty('--parallax', '0px'); requestScrollUpdate(); });
requestScrollUpdate();
document.querySelectorAll('.magnetic').forEach(link => {
  link.addEventListener('pointermove', event => {
    if (reducedMotion.matches || motionPaused || event.pointerType !== 'mouse') return;
    const bounds = link.getBoundingClientRect();
    link.style.setProperty('--magnetic-x', `${((event.clientX - bounds.left) / bounds.width - .5) * 10}px`);
    link.style.setProperty('--magnetic-y', `${((event.clientY - bounds.top) / bounds.height - .5) * 8}px`);
  });
  link.addEventListener('pointerleave', () => { link.style.setProperty('--magnetic-x', '0px'); link.style.setProperty('--magnetic-y', '0px'); });
});
