'use client';
import { useEffect } from 'react';

const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function useSmoothAnchors() {
  useEffect(() => {
    const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    function onClick(e) {
      const a = e.target.closest('a[href^="#"], a[href^="/#"]');
      if (!a) return;
      const hash = a.getAttribute('href').split('#')[1];
      if (!hash) return;
      const target = document.getElementById(hash);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 92;
      if (rm) { window.scrollTo(0, top); return; }
      const from = window.scrollY, dist = top - from;
      const dur = Math.min(1150, 360 + Math.abs(dist) * 0.42);
      const t0 = performance.now();
      let cancelled = false;
      const cancel = () => { cancelled = true; };
      addEventListener('wheel', cancel, { passive: true, once: true });
      addEventListener('touchstart', cancel, { passive: true, once: true });
      (function run(now) {
        const p = Math.min((now - t0) / dur, 1);
        window.scrollTo(0, from + dist * easeIO(p));
        if (p < 1 && !cancelled) requestAnimationFrame(run);
      })(performance.now());
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
}
