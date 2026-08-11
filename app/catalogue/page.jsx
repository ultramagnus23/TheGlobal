'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import PageCss from '@/components/PageCss';
import { ROOMS, loadProducts } from '@/lib/products';

export default function Catalogue() {
  const [products, setProducts] = useState([]);
  const [brand, setBrand] = useState('');
  const [room, setRoom] = useState('');
  const [type, setType] = useState('');
  const [q, setQ] = useState('');
  const [list, setList] = useState([]);

  useEffect(() => {
    setProducts(loadProducts());
    const b = new URLSearchParams(window.location.search).get('brand');
    if (b) setBrand(b);
    try {
      const raw = localStorage.getItem('tg_enquiry_list');
      if (raw) setList(JSON.parse(raw) || []);
    } catch (e) {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('tg_enquiry_list', JSON.stringify(list)); } catch (e) {}
  }, [list]);

  const types = useMemo(
    () => [...new Set(products.map((p) => p.t).filter(Boolean))].sort(),
    [products]
  );

  const shown = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return products.filter((p) => {
      if (brand && p.b !== brand) return false;
      if (room && !(p.r || []).includes(room)) return false;
      if (type && p.t !== type) return false;
      if (words.length) {
        const hay = `${p.n} ${p.t || ''} ${p.d || ''} ${p.s || ''} ${(p.r || []).join(' ')}`.toLowerCase();
        if (!words.every((w) => hay.includes(w))) return false;
      }
      return true;
    });
  }, [products, brand, room, type, q]);

  const toggle = (p) =>
    setList((cur) => (cur.some((x) => x.n === p.n) ? cur.filter((x) => x.n !== p.n) : [...cur, p]));

  const reset = () => { setBrand(''); setRoom(''); setType(''); setQ(''); };

  const meta = [`${shown.length} ${shown.length === 1 ? 'product' : 'products'}`];
  if (brand) meta.push(`from ${brand}`);
  if (room) meta.push(`for ${room.toLowerCase()}`);
  if (type) meta.push(`in ${type.toLowerCase()}`);

  return (
    <>
      <PageCss page="catalogue" />
      <section className="pagehead">
        <div className="wrap">
          <span className="eyebrow">Catalogue</span>
          <h1>Everything we stock,<br />in one place.</h1>
          <p className="lede">Astral plumbing and Somany surfaces. Filter it down, build a list, send it to the counter. Prices are quoted against your quantities, so nothing here is a fixed rate.</p>

          <div className="filterbar">
            <label className="search">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
              <input type="search" placeholder="Search products" aria-label="Search products" value={q} onChange={(e) => setQ(e.target.value)} />
            </label>
            <div className="sel">
              <select aria-label="Brand" value={brand} onChange={(e) => setBrand(e.target.value)}>
                <option value="">All brands</option><option value="astral">Astral</option><option value="somany">Somany</option>
              </select>
            </div>
            <div className="sel">
              <select aria-label="Room" value={room} onChange={(e) => setRoom(e.target.value)}>
                <option value="">Any room</option>
                {ROOMS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="sel">
              <select aria-label="Type" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">Any type</option>
                {types.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="metarow">
            <span>{meta.join(' ')}</span>
            <button type="button" onClick={reset}>Reset</button>
          </div>

          <div className="cards">
            {shown.length === 0 ? (
              <div className="empty">
                <b>Nothing matches that yet.</b>
                Widen a filter or clear the search. If you know the product name, call the counter and we will check the yard.
              </div>
            ) : (
              shown.map((p, i) => {
                const inList = list.some((x) => x.n === p.n);
                return (
                  <article className="pcard" data-b={p.b} key={p.n} style={{ animationDelay: `${Math.min(i * 30, 400)}ms` }}>
                    {p.img ? <img className="shot" src={p.img} alt="" loading="lazy" /> : null}
                    <div className="top"><span className="bt">{p.b}</span><span className="size">{p.s}</span></div>
                    <h3>{p.n}</h3>
                    <p>{p.d}</p>
                    <div className="tagline">{p.t}{p.r && p.r.length ? ` · ${p.r.join(', ')}` : ''}</div>
                    <button className="add" type="button" data-in={inList ? '1' : '0'} onClick={() => toggle(p)}>
                      {inList ? 'Added' : 'Add to list'}
                    </button>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>

      <aside id="tray" className={list.length ? 'on' : ''} aria-live="polite">
        <header><b>Your list</b><span className="c">{list.length} {list.length === 1 ? 'item' : 'items'}</span></header>
        <ul>
          {list.map((p) => (
            <li key={p.n}>
              <span>{p.n}</span>
              <button type="button" aria-label={`Remove ${p.n}`} onClick={() => toggle(p)}>&times;</button>
            </li>
          ))}
        </ul>
        <Link className="cta" href="/#contact">Send this list to the counter</Link>
      </aside>
    </>
  );
}
