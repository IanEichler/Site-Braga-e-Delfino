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

  // Three identical sets make the wrap invisible in either direction.
  const servicesTrack = document.querySelector('#services-track');
  if (servicesTrack) {
    const originals = [...servicesTrack.querySelectorAll('.service-card')];
    function copyCards() {
      const fragment = document.createDocumentFragment();
      originals.forEach(card => {
        const copy = card.cloneNode(true);
        copy.dataset.clone = 'true';
        copy.setAttribute('aria-hidden', 'true');
        copy.tabIndex = -1;
        copy.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
        copy.querySelectorAll('img').forEach(image => { image.loading = 'eager'; });
        // Mouse clicks still open the link without focusing a hidden copy.
        copy.addEventListener('pointerdown', event => {
          if (event.pointerType === 'mouse') event.preventDefault();
        });
        fragment.append(copy);
      });
      return fragment;
    }
    servicesTrack.prepend(copyCards());
    servicesTrack.append(copyCards());
    servicesTrack.classList.add('is-looping');
    const cards = [...servicesTrack.querySelectorAll('.service-card')];
    let cycle = 0;
    let beginning = 0;
    let position = 0;
    let frame = 0;
    let lastTime = 0;
    let visible = false;
    let hovered = false;
    let touching = false;
    let focused = false;
    let manualUntil = 0;
    let resumeTimer;
    const speed = 30; // Pixels per second, independent of frame rate.
    const focusedCard = () => servicesTrack.contains(document.activeElement)
      && document.activeElement !== servicesTrack;

    function wrap(value) {
      if (!cycle) return value;
      return beginning + ((value - beginning) % cycle + cycle) % cycle;
    }
    function normalize() {
      if (focusedCard()) return;
      const wrapped = wrap(position);
      if (Math.abs(wrapped - position) > 1) {
        position = wrapped;
        servicesTrack.scrollLeft = position;
      }
    }
    function canPlay() {
      return cycle > 0 && visible && !document.hidden && !motionIsReduced()
        && !hovered && !touching && !focused && performance.now() >= manualUntil;
    }
    function animate(time) {
      frame = 0;
      if (!canPlay()) { lastTime = 0; return; }
      if (lastTime) position = wrap(position + speed * Math.min((time - lastTime) / 1000, .05));
      lastTime = time;
      servicesTrack.scrollLeft = position;
      frame = requestAnimationFrame(animate);
    }
    function updatePlayback() {
      if (!canPlay()) {
        cancelAnimationFrame(frame);
        frame = 0;
        lastTime = 0;
        return;
      }
      if (!frame) {
        position = servicesTrack.scrollLeft;
        normalize();
        frame = requestAnimationFrame(animate);
      }
    }
    function holdForInteraction() {
      manualUntil = performance.now() + 1400;
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(updatePlayback, 1450);
      updatePlayback();
    }
    function measure() {
      const oldCycle = cycle;
      const phase = oldCycle ? ((position - beginning) % oldCycle + oldCycle) % oldCycle / oldCycle : 0;
      cycle = cards[originals.length * 2].getBoundingClientRect().left
        - originals[0].getBoundingClientRect().left;
      beginning = originals[0].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;
      position = focusedCard() ? servicesTrack.scrollLeft : beginning + phase * cycle;
      if (!focusedCard()) servicesTrack.scrollLeft = position;
      lastTime = 0;
      updatePlayback();
    }
    servicesTrack.addEventListener('scroll', () => {
      const actual = servicesTrack.scrollLeft;
      if (Math.abs(actual - position) <= 2) return;
      position = actual;
      normalize();
      holdForInteraction();
    }, { passive: true });
    servicesTrack.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse') return;
      hovered = true;
      updatePlayback();
    });
    servicesTrack.addEventListener('pointerleave', () => { hovered = false; updatePlayback(); });
    servicesTrack.addEventListener('pointerdown', () => { touching = true; holdForInteraction(); });
    function releasePointer() {
      if (!touching) return;
      touching = false;
      holdForInteraction();
    }
    window.addEventListener('pointerup', releasePointer);
    window.addEventListener('pointercancel', releasePointer);
    servicesTrack.addEventListener('wheel', holdForInteraction, { passive: true });
    servicesTrack.addEventListener('focusin', () => { focused = true; updatePlayback(); });
    servicesTrack.addEventListener('focusout', () => {
      queueMicrotask(() => {
        focused = servicesTrack.contains(document.activeElement);
        updatePlayback();
      });
    });
    servicesTrack.addEventListener('keydown', event => {
      if (event.target !== servicesTrack) return;
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const step = cycle / originals.length;
      position = event.key === 'Home' ? beginning
        : event.key === 'End' ? beginning + step * (originals.length - 1)
        : wrap(servicesTrack.scrollLeft + (event.key === 'ArrowLeft' ? -step : step));
      servicesTrack.scrollLeft = position;
      holdForInteraction();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        updatePlayback();
      }, { threshold: .05 }).observe(servicesTrack);
    } else {
      const checkVisibility = () => {
        const bounds = servicesTrack.getBoundingClientRect();
        visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
        updatePlayback();
      };
      window.addEventListener('scroll', checkVisibility, { passive: true });
      window.addEventListener('resize', checkVisibility);
      checkVisibility();
    }
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(measure);
      observer.observe(servicesTrack);
      observer.observe(originals[0]);
    }
    window.addEventListener('resize', measure);
    document.addEventListener('visibilitychange', updatePlayback);
    listenToMediaQuery(reducedMotion, updatePlayback);
    window.addEventListener('load', measure);
    measure();
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

  const demoDialog = document.querySelector('#demo-dialog');
  if (demoDialog && typeof demoDialog.showModal === 'function') {
    demoDialog.querySelectorAll('.dialog-close, .demo-confirm').forEach(button => {
      button.addEventListener('click', () => demoDialog.close());
    });
    demoDialog.addEventListener('close', () => {
      document.body.classList.remove('dialog-open');
    });
    document.body.classList.add('dialog-open');
    demoDialog.showModal();
  }

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
    requestScrollUpdate();
  });
  syncMotionPreference();
})();
