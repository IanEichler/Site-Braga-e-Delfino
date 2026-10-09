const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navegacao');
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
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia('(min-width: 851px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

const whatsappBase = 'https://wa.me/5566996403398';
const greeting = 'Olá, gostaria de falar com a equipe Braga & Delfino Advocacia.';
const topicMessage = topic => `${greeting} Meu assunto é: ${topic}.`;
document.querySelectorAll('[data-topic]').forEach(link => {
  link.href = `${whatsappBase}?text=${encodeURIComponent(topicMessage(link.dataset.topic))}`;
});
const topicSelect = document.querySelector('#assunto');
topicSelect.addEventListener('change', () => {
  const topic = topicSelect.value;
  document.querySelector('#contact-whatsapp').href = `${whatsappBase}?text=${encodeURIComponent(topic ? topicMessage(topic) : greeting)}`;
  document.querySelector('#contact-hint').textContent = topic
    ? `Assunto: ${topic}. Continue para abrir a conversa no WhatsApp.`
    : 'O WhatsApp será aberto para você iniciar a conversa.';
});

const areas = [...document.querySelectorAll('.area')];
areas.forEach(area => area.addEventListener('toggle', () => {
  if (area.open) areas.forEach(other => { if (other !== area) other.open = false; });
}));

const privacyDialog = document.querySelector('#privacy-dialog');
document.querySelector('#open-privacy').addEventListener('click', () => privacyDialog.showModal());
privacyDialog.querySelectorAll('.dialog-close, .dialog-confirm').forEach(button => {
  button.addEventListener('click', () => privacyDialog.close());
});
privacyDialog.addEventListener('click', event => {
  if (event.target === privacyDialog) {
    const bounds = privacyDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) privacyDialog.close();
  }
});
document.querySelector('#year').textContent = new Date().getFullYear();
if ('IntersectionObserver' in window) {
  const heroObserver = new IntersectionObserver(entries => {
    document.querySelector('.floating-contact').classList.toggle('is-visible', !entries[0].isIntersecting);
  });
  heroObserver.observe(document.querySelector('.hero'));
  const footerObserver = new IntersectionObserver(entries => {
    document.querySelector('.floating-contact').classList.toggle('at-footer', entries[0].isIntersecting);
  });
  footerObserver.observe(document.querySelector('.footer'));
} else {
  document.querySelector('.floating-contact').classList.add('is-visible');
}
