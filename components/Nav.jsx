'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const [tuck, setTuck] = useState(false);
  const [open, setOpen] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const onScroll = () => setTuck(window.scrollY > 60);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => setOpen(false), [path]);

  const cur = (href) => (path === href ? { 'aria-current': 'page' } : {});

  return (
    <nav id="nav" className={`${tuck ? 'tuck' : ''} ${open ? 'open' : ''}`}>
      <ul className="left">
        <li><Link className="link" href="/#work">Work</Link></li>
        <li><Link className="link" href="/#brands">Brands</Link></li>
        <li><Link className="link" href="/catalogue" {...cur('/catalogue')}>Catalogue</Link></li>
      </ul>
      <Link className="brandmark" href="/">The Global<i>.</i></Link>
      <ul className="right">
        <li><Link className="link" href="/tools" {...cur('/tools')}>Tools</Link></li>
        <li><Link className="link" href="/#logistics">Reach</Link></li>
        <li><Link className="link" href="/#contact">Contact</Link></li>
      </ul>
      <button className="navtoggle" type="button" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>Menu</button>
    </nav>
  );
}
