(() => {
  'use strict';

  const header = document.querySelector('.header');
  const navigation = document.querySelector('#navegacao');
  const menuButton = document.querySelector('.menu-toggle');
  const hero = document.querySelector('.hero');
  const heroVisual = hero;
  const contact = document.querySelector('#contato');
  const services = document.querySelector('#atuacao');
  const floatingContact = document.querySelector('.floating-contact');
  const scrollProgress = document.querySelector('.scroll-progress');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopMenu = window.matchMedia('(min-width: 1051px)');
  const revealElements = [...document.querySelectorAll('.reveal')];
  let scrollScheduled = false;
  let revealObserver;

  const motionIsReduced = () => reducedMotion.matches;

  function listenToMediaQuery(query, callback) {
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', callback);
    } else if (typeof query.addListener === 'function') {
      query.addListener(callback);
    }
  }

  // Reduced motion keeps all content available without decorative movement.
  function revealAll() {
    revealElements.forEach(element => element.classList.add('is-visible'));
    if (revealObserver) revealObserver.disconnect();
  }

  function syncMotionPreference() {
    document.documentElement.classList.toggle('motion-reduced', motionIsReduced());
    if (motionIsReduced()) {
      revealAll();
      if (heroVisual) heroVisual.style.setProperty('--parallax', '0px');
    }
    requestScrollUpdate();
  }

  listenToMediaQuery(reducedMotion, syncMotionPreference);

  function closeMenu() {
    if (menuButton) {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menu');
    }
    if (navigation) navigation.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      navigation.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
    });
    navigation.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuButton.focus();
      }
    });
    document.addEventListener('click', event => {
      if (menuButton.getAttribute('aria-expanded') !== 'true') return;
      if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
  }
  listenToMediaQuery(desktopMenu, event => {
    if (event.matches) closeMenu();
  });

  // The services carousel moves only when a visitor requests it.
  const servicesTrack = document.querySelector('#services-track');
  const previousServices = document.querySelector('[data-services-prev]');
  const nextServices = document.querySelector('[data-services-next]');

  function updateCarouselControls() {
    if (!servicesTrack) return;
    const maximum = Math.max(0, servicesTrack.scrollWidth - servicesTrack.clientWidth);
    // Allow for subpixel rounding and the track's inline padding.
    const atStart = servicesTrack.scrollLeft <= 4;
    const atEnd = maximum <= 4 || servicesTrack.scrollLeft >= maximum - 4;
    [[previousServices, atStart], [nextServices, atEnd]].forEach(([button, disabled]) => {
      if (!button) return;
      button.disabled = disabled;
      button.setAttribute('aria-disabled', String(disabled));
    });
  }

  function serviceStep() {
    const card = servicesTrack && servicesTrack.querySelector('.service-card');
    if (!servicesTrack || !card) return servicesTrack ? servicesTrack.clientWidth : 0;
    const style = getComputedStyle(servicesTrack);
    const gap = Number.parseFloat(style.columnGap || style.gap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function moveServices(direction) {
    if (!servicesTrack) return;
    servicesTrack.scrollBy({
      left: direction * serviceStep(),
      behavior: motionIsReduced() ? 'auto' : 'smooth'
    });
  }

  if (servicesTrack) {
    if (!servicesTrack.hasAttribute('tabindex')) servicesTrack.tabIndex = 0;
    if (previousServices) previousServices.addEventListener('click', () => moveServices(-1));
    if (nextServices) nextServices.addEventListener('click', () => moveServices(1));
    servicesTrack.addEventListener('scroll', updateCarouselControls, { passive: true });
    servicesTrack.addEventListener('keydown', event => {
      // Links inside the track retain their normal keyboard behavior.
      if (event.target !== servicesTrack) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        moveServices(event.key === 'ArrowLeft' ? -1 : 1);
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        servicesTrack.scrollTo({
          left: event.key === 'Home' ? 0 : servicesTrack.scrollWidth - servicesTrack.clientWidth,
          behavior: motionIsReduced() ? 'auto' : 'smooth'
        });
      }
    });
    if ('ResizeObserver' in window) {
      const carouselResizeObserver = new ResizeObserver(updateCarouselControls);
      carouselResizeObserver.observe(servicesTrack);
      const firstCard = servicesTrack.querySelector('.service-card');
      if (firstCard) carouselResizeObserver.observe(firstCard);
    }
    window.addEventListener('resize', updateCarouselControls);
    updateCarouselControls();
  }

  const whatsappBase = 'https://wa.me/5566996403398';
  const greeting = 'Olá, gostaria de falar com a equipe Braga & Delfino Advocacia.';
  const contactWhatsapp = document.querySelector('#contact-whatsapp');
  const contactHint = document.querySelector('#contact-hint');
  const topicInputs = [...document.querySelectorAll('input[name="assunto"]')];
  const whatsappUrl = topic => `${whatsappBase}?text=${encodeURIComponent(
    topic ? `${greeting} Meu assunto é: ${topic}.` : greeting
  )}`;

  function setContactTopic(topic) {
    if (contactWhatsapp) contactWhatsapp.href = whatsappUrl(topic);
    if (contactHint) {
      contactHint.textContent = topic
        ? `Assunto: ${topic}. Você confirma o envio no WhatsApp.`
        : 'Você confirma o envio da mensagem no WhatsApp.';
    }
  }

  document.querySelectorAll('a[data-topic]').forEach(link => {
    const topic = (link.dataset.topic || '').trim();
    link.href = whatsappUrl(topic);
    link.addEventListener('click', () => {
      setContactTopic(topic);
      topicInputs.forEach(input => { input.checked = input.value === topic; });
    });
  });
  topicInputs.forEach(input => {
    input.addEventListener('change', () => {
      if (input.checked) setContactTopic(input.value);
    });
  });
  const selectedTopic = topicInputs.find(input => input.checked);
  setContactTopic(selectedTopic ? selectedTopic.value : '');

  const privacyDialog = document.querySelector('#privacy-dialog');
  const openPrivacy = document.querySelector('#open-privacy');
  if (privacyDialog) {
    if (openPrivacy) {
      openPrivacy.addEventListener('click', () => {
        if (!privacyDialog.open && typeof privacyDialog.showModal === 'function') {
          privacyDialog.showModal();
        }
      });
    }
    privacyDialog.querySelectorAll('.dialog-close, .dialog-confirm').forEach(button => {
      button.addEventListener('click', () => privacyDialog.close());
    });
    privacyDialog.addEventListener('click', event => {
      if (event.target !== privacyDialog) return;
      const bounds = privacyDialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right
        || event.clientY < bounds.top || event.clientY > bounds.bottom) {
        privacyDialog.close();
      }
    });
  }
  document.querySelectorAll('[data-year]').forEach(element => {
    element.textContent = String(new Date().getFullYear());
  });

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    document.body.classList.add('motion-ready');
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });
    revealElements.forEach(element => revealObserver.observe(element));
  } else {
    revealAll();
  }

  let heroVisible = true;
  let contactVisible = false;
  let servicesVisible = false;
  function updateFloatingContact() {
    if (floatingContact) floatingContact.classList.toggle('is-visible', !heroVisible && !contactVisible && !servicesVisible);
  }
  if ('IntersectionObserver' in window && floatingContact) {
    const contactObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
        if (entry.target === contact) contactVisible = entry.isIntersecting;
        if (entry.target === services) servicesVisible = entry.isIntersecting;
      });
      updateFloatingContact();
    });
    if (hero) contactObserver.observe(hero);
    else heroVisible = false;
    if (contact) contactObserver.observe(contact);
    if (services) contactObserver.observe(services);
    updateFloatingContact();
  }

  const sectionIds = new Set(['inicio', 'atuacao', 'escritorio', 'equipe', 'conteudos', 'processo', 'contato']);
  const sectionLinks = navigation
    ? [...navigation.querySelectorAll('a[href^="#"]')].map(link => {
      const id = link.getAttribute('href').slice(1);
      return { link, section: sectionIds.has(id) ? document.getElementById(id) : null };
    }).filter(item => item.section)
    : [];

  function updateNavigation() {
    const offset = (header ? header.getBoundingClientRect().height : 0) + window.innerHeight * 0.2;
    let currentSection = null;
    let nearestTop = -Infinity;
    sectionLinks.forEach(({ section }) => {
      const top = section.getBoundingClientRect().top;
      if (top <= offset && top > nearestTop) {
        nearestTop = top;
        currentSection = section;
      }
    });
    sectionLinks.forEach(({ link, section }) => {
      const current = section === currentSection;
      link.classList.toggle('is-current', current);
      if (current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function updateScroll() {
    scrollScheduled = false;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.max(0, Math.min(window.scrollY / scrollable, 1)) : 0;
    if (scrollProgress) scrollProgress.style.transform = `scaleX(${progress})`;
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 20);
    if (hero && heroVisual) {
      const bounds = hero.getBoundingClientRect();
      const parallax = !motionIsReduced() && bounds.bottom > 0
        ? Math.min(Math.max(-bounds.top, 0) * 0.04, 28)
        : 0;
      heroVisual.style.setProperty('--parallax', `${parallax}px`);
    }
    if (!('IntersectionObserver' in window)) {
      const isVisible = element => {
        if (!element) return false;
        const bounds = element.getBoundingClientRect();
        return bounds.bottom > 0 && bounds.top < window.innerHeight;
      };
      heroVisible = isVisible(hero);
      contactVisible = isVisible(contact);
      servicesVisible = isVisible(services);
      updateFloatingContact();
    }
    updateNavigation();
  }

  function requestScrollUpdate() {
    if (scrollScheduled) return;
    scrollScheduled = true;
    window.requestAnimationFrame(updateScroll);
  }
  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate);
  window.addEventListener('load', () => {
    updateCarouselControls();
    requestScrollUpdate();
  });
  syncMotionPreference();
})();
