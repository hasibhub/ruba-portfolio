/* Decorative welcome animation. Not a real download progress metric. */
(() => {
  const overlay = document.getElementById('welcomeLoader');
  const fill = document.getElementById('welcomeLoaderFill');
  const label = document.getElementById('welcomeLoaderPercent');
  if (!overlay || !fill || !label) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = reduced ? 1200 : 4800;
  const start = performance.now();
  let finished = false;
  function finish() {
    if (finished) return;
    finished = true;
    fill.style.width = '100%';
    label.textContent = '100%';
    overlay.classList.add('is-hidden');
    document.body.classList.remove('welcome-loading');
    window.setTimeout(() => overlay.remove(), 700);
  }
  function tick(now) {
    if (finished) return;
    const ratio = Math.min(1, Math.max(0, (now-start)/duration));
    // Gentle ease-out near the end, displayed as a welcome animation.
    const eased = ratio < 0.85 ? ratio * 0.96 : 0.816 + ((ratio-.85)/.15)*.184;
    const progress = Math.min(100, Math.round(eased * 100));
    fill.style.width = progress + '%';
    label.textContent = progress + '%';
    if (ratio < 1) requestAnimationFrame(tick);
    else finish();
  }
  requestAnimationFrame(tick);
  window.addEventListener('pageshow', e => { if (e.persisted) finish(); });
})();
