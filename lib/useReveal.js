'use client';
import { useEffect } from 'react';

export default function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.on)');
    if (!els.length) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}
