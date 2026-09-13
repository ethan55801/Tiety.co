'use strict';
(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  const setMenu = (open) => { nav.classList.toggle('is-open', open); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); };
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { setMenu(false); menu.focus(); } });
  const wideScreen = window.matchMedia('(min-width: 601px)');
  wideScreen.addEventListener('change', () => { if (wideScreen.matches) setMenu(false); });
  setMenu(false);
  document.body.classList.add('menu-ready');

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = document.querySelector('.motion-toggle');
  let manualPause = false;
  try { manualPause = localStorage.getItem('tiety-motion-paused') === 'true'; } catch (_) {}
  const applyMotion = () => {
    const paused = manualPause || motionPreference.matches;
    document.body.dataset.motion = paused ? 'paused' : 'running';
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.textContent = motionPreference.matches ? 'Reduced motion enabled' : paused ? 'Resume animation ▷' : 'Pause animation Ⅱ';
    motionButton.disabled = motionPreference.matches;
    if (paused) document.querySelectorAll('.reveal').forEach((el) => { el.classList.remove('is-waiting'); el.classList.add('is-visible'); });
  };
  motionButton.addEventListener('click', () => { manualPause = !manualPause; try { localStorage.setItem('tiety-motion-paused', String(manualPause)); } catch (_) {} applyMotion(); });
  motionPreference.addEventListener('change', applyMotion);
  applyMotion();
  document.body.classList.add('motion-ready');
  if ('IntersectionObserver' in window && document.body.dataset.motion !== 'paused') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.remove('is-waiting'); entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach((el) => { el.classList.add('is-waiting'); observer.observe(el); });
    document.addEventListener('focusin', (event) => { const el = event.target.closest('.reveal'); if (el) { el.classList.remove('is-waiting'); el.classList.add('is-visible'); } });
  }
  const progress = document.querySelector('.reading-progress');
  let framePending = false;
  const updateProgress = () => { const total = document.documentElement.scrollHeight - window.innerHeight; progress.style.transform = 'scaleX(' + (total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0) + ')'; framePending = false; };
  const queueProgress = () => { if (!framePending) { framePending = true; requestAnimationFrame(updateProgress); } };
  window.addEventListener('scroll', queueProgress, { passive: true });
  window.addEventListener('resize', queueProgress);
  updateProgress();
  const form = document.querySelector('#brief-form');
  const serviceField = document.querySelector('#service');
  const status = document.querySelector('#form-status');
  const result = document.querySelector('#brief-result');
  const preview = document.querySelector('#brief-preview');
  const save = document.querySelector('#brief-save');
  let briefUrl;
  const clearPreparedBrief = () => {
    status.textContent = ''; result.hidden = true; preview.textContent = ''; save.removeAttribute('href');
    if (briefUrl) { URL.revokeObjectURL(briefUrl); briefUrl = undefined; }
  };
  document.querySelectorAll('[data-service]').forEach((link) => link.addEventListener('click', () => { serviceField.value = link.dataset.service; clearPreparedBrief(); }));
  form.addEventListener('input', (event) => { clearPreparedBrief(); if (event.target.matches('input, textarea')) event.target.setCustomValidity(''); });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    for (const [id, message] of [['name', 'Please enter your name.'], ['brief', 'Please describe your project.']]) {
      const field = form.elements.namedItem(id);
      field.value = field.value.trim();
      field.setCustomValidity(field.value ? '' : message);
    }
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const brief = ['TIETY — PROJECT BRIEF', '', 'Name: ' + String(fields.get('name')).trim(), 'Email: ' + String(fields.get('email')).trim(), 'Service: ' + fields.get('service'), '', 'Project details', '---------------', String(fields.get('brief')).trim(), '', 'Prepared locally. This brief has not been sent to Tiety.'].join('\r\n');
    clearPreparedBrief();
    preview.textContent = brief; result.hidden = false;
    try {
      briefUrl = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }));
      save.href = briefUrl; save.hidden = false;
      status.textContent = 'Your brief is ready. Save the file or copy the preview below. It has not been sent to Tiety.';
      save.focus();
    } catch (_) {
      save.hidden = true; result.querySelector('details').open = true;
      status.textContent = 'Your brief is ready to copy below. A download could not be created.';
    }
  });
  form.querySelector('button[type="submit"]').disabled = false;
})();
