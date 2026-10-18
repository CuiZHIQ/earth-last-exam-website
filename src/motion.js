(() => {
  const targets = Array.from(document.querySelectorAll('[data-enter]'));
  const preference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  if (preference?.matches || !window.IntersectionObserver) return;

  const seen = new WeakSet();
  const observer = new window.IntersectionObserver(entries => {
    for (const {target, isIntersecting} of entries) {
      if (!isIntersecting || seen.has(target) || preference?.matches) continue;
      seen.add(target);
      const delay = Math.min(240, Math.max(0, Number(target.dataset.enterDelay) || 0));
      target.style.setProperty('--enter-delay', `${delay}ms`);
      target.classList.add('motion-enter');
      observer.unobserve(target);
    }
  }, {threshold: 0.08});

  // Content is visible by default. Entering the viewport starts one brief effect.
  targets.forEach(target => observer.observe(target));
  preference?.addEventListener?.('change', () => {
    if (!preference.matches) return;
    observer.disconnect();
    targets.forEach(target => target.classList.remove('motion-enter'));
  });
})();
