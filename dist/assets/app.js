'use strict';
(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  const setMenu = (open) => { nav.classList.toggle('is-open', open); menu.setAttribute('aria-expanded', String(open)); };
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { setMenu(false); menu.focus(); } });
  const wideScreen = window.matchMedia('(min-width: 601px)');
  wideScreen.addEventListener('change', () => { if (wideScreen.matches) setMenu(false); });

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
  document.querySelectorAll('[data-service]').forEach((link) => link.addEventListener('click', () => { serviceField.value = link.dataset.service; status.textContent = ''; }));
  form.addEventListener('input', () => { status.textContent = ''; });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const brief = ['TIETY — PROJECT BRIEF', '', 'Name: ' + String(fields.get('name')).trim(), 'Email: ' + String(fields.get('email')).trim(), 'Service: ' + fields.get('service'), '', 'Project details', '---------------', String(fields.get('brief')).trim(), '', 'Prepared locally. This brief has not been sent to Tiety.'].join('\r\n');
    try {
      const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }));
      const download = document.createElement('a');
      download.href = url; download.download = 'Tiety-project-brief.txt';
      document.body.append(download); download.click(); download.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      status.textContent = 'Your brief download has started. It has not been sent to Tiety.';
    } catch (_) { status.textContent = 'The download could not start. Please copy your details before leaving this page.'; }
  });
  form.querySelector('button[type="submit"]').disabled = false;
})();
