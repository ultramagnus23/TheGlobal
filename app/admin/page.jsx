'use client';
import { useEffect, useRef, useState } from 'react';
import PageCss from '@/components/PageCss';
import { ROOMS, DEFAULTS, loadProducts, saveProducts } from '@/lib/products';

const blank = { b: 'astral', n: '', t: '', s: '', d: '', r: [], img: '' };
const FIELDS = { brand: 'b', name: 'n', type: 't', size: 's', description: 'd', rooms: 'r', image: 'img' };

export default function Admin() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [editing, setEditing] = useState(null); // {index, product}
  const [toast, setToast] = useState('');
  const dlg = useRef(null);
  const fileRef = useRef(null);
  const jsonRef = useRef(null);

  useEffect(() => { setItems(loadProducts()); }, []);

  const say = (m) => { setToast(m); setTimeout(() => setToast(''), 3800); };

  function commit(next) {
    setItems(next);
    const r = saveProducts(next);
    if (!r.ok) say(r.msg);
  }

  function openEditor(index) {
    setEditing({ index, product: index >= 0 ? { ...items[index] } : { ...blank } });
    setTimeout(() => dlg.current?.showModal(), 0);
  }
  function closeEditor() { dlg.current?.close(); setEditing(null); }

  function save() {
    const p = editing.product;
    if (!p.n.trim()) { say('A product needs a name.'); return; }
    const next = [...items];
    if (editing.index >= 0) next[editing.index] = p; else next.push(p);
    commit(next);
    say(editing.index >= 0 ? 'Saved.' : 'Added.');
    closeEditor();
  }

  function remove(i) {
    if (!confirm(`Delete "${items[i].n}"?`)) return;
    commit(items.filter((_, x) => x !== i));
    say('Deleted.');
  }

  /* ---------- image ---------- */
  function readImage(file) {
    const fr = new FileReader();
    fr.onload = () => {
      const im = new Image();
      im.onload = () => {
        const max = 900, sc = Math.min(1, max / Math.max(im.width, im.height));
        const c = document.createElement('canvas');
        c.width = Math.round(im.width * sc); c.height = Math.round(im.height * sc);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        setEditing((e) => ({ ...e, product: { ...e.product, img: c.toDataURL('image/jpeg', 0.82) } }));
      };
      im.src = fr.result;
    };
    fr.readAsDataURL(file);
  }

  /* ---------- import ---------- */
  function parseCSV(text) {
    const rows = []; let row = [], cell = '', q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
      else if (c === '"') q = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
      else if (c !== '\r') cell += c;
    }
    if (cell.length || row.length) { row.push(cell); rows.push(row); }
    return rows.filter((r) => r.some((c) => String(c).trim() !== ''));
  }
  function rowsToProducts(rows) {
    const head = rows[0].map((h) => String(h).trim().toLowerCase());
    const out = [];
    for (let i = 1; i < rows.length; i++) {
      const o = { ...blank, r: [] };
      head.forEach((h, j) => {
        const key = FIELDS[h]; if (!key) return;
        const v = rows[i][j] == null ? '' : String(rows[i][j]).trim();
        if (key === 'r') o.r = v ? v.split(/[;|]/).map((x) => x.trim()).filter(Boolean) : [];
        else if (key === 'b') o.b = v.toLowerCase().includes('somany') ? 'somany' : 'astral';
        else o[key] = v;
      });
      if (o.n) out.push(o);
    }
    return out;
  }
  function merge(list) {
    const next = [...items];
    let added = 0, updated = 0;
    list.forEach((p) => {
      const i = next.findIndex((x) => x.n.toLowerCase() === p.n.toLowerCase());
      if (i >= 0) { next[i] = { ...next[i], ...p }; updated++; } else { next.push(p); added++; }
    });
    commit(next);
    say(`${added} added, ${updated} updated.`);
  }
  async function importFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'csv') {
      const text = await file.text();
      try { merge(rowsToProducts(parseCSV(text))); } catch (e) { say('Could not read that CSV.'); }
      return;
    }
    try {
      const XLSX = await import('xlsx');
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(new Uint8Array(buf), { type: 'array' });
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, blankrows: false });
      merge(rowsToProducts(rows));
    } catch (e) { say('Could not read that spreadsheet.'); }
  }

  /* ---------- export ---------- */
  function dl(name, content, type) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type }));
    a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  function toCSV(list) {
    const head = ['brand', 'name', 'type', 'size', 'description', 'rooms', 'image'];
    const esc = (v) => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
    return [head.join(',')]
      .concat(list.map((p) => [p.b, p.n, p.t, p.s, p.d, (p.r || []).join('; '), p.img && !p.img.startsWith('data:') ? p.img : ''].map(esc).join(',')))
      .join('\n');
  }

  const stat = {
    astral: items.filter((p) => p.b === 'astral').length,
    somany: items.filter((p) => p.b === 'somany').length,
    imgs: items.filter((p) => p.img).length
  };
  const shown = items
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => !filter || `${p.n} ${p.b} ${p.t}`.toLowerCase().includes(filter.toLowerCase()));

  return (
    <>
      <PageCss page="admin" />
      <section className="pagehead">
        <div className="wrap">
          <span className="eyebrow">Internal</span>
          <h1>Catalogue admin</h1>
          <p className="lede">Add, edit and remove products, attach photos, and bulk import from a spreadsheet. Everything saves in this browser and feeds the public catalogue. Export a backup before clearing the browser or moving to another machine.</p>
          <div className="stat">
            <span><b>{items.length}</b> products</span><span><b>{stat.astral}</b> astral</span>
            <span><b>{stat.somany}</b> somany</span><span><b>{stat.imgs}</b> with photos</span>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: '1rem' }}>
        <div className="wrap">
          <div className="panel">
            <h2>Bulk import</h2>
            <p className="sub">Drop a CSV or Excel file with the columns brand, name, type, size, description, rooms, image. Rooms go in one cell separated by semicolons. Image takes a URL. Download the template to get the exact headers.</p>
            <Drop onFile={importFile} accept=".csv,.xlsx,.xls" inputRef={fileRef}>
              Drop a .csv, .xlsx or .xls file here, or click to choose one
            </Drop>
            <div className="bar">
              <button className="b" type="button" onClick={() => dl('the-global-product-template.csv', toCSV([{ b: 'astral', n: 'Example pipe', t: 'Water supply', s: '20mm', d: 'What it is and when to use it.', r: ['Bathroom', 'Kitchen'], img: 'https://example.com/photo.jpg' }]), 'text/csv')}>Download CSV template</button>
              <button className="b" type="button" onClick={() => dl('the-global-catalogue.csv', toCSV(items), 'text/csv')}>Export current as CSV</button>
              <button className="b" type="button" onClick={() => dl('the-global-catalogue-backup.json', JSON.stringify(items, null, 2), 'application/json')}>Export backup (JSON)</button>
              <button className="b" type="button" onClick={() => jsonRef.current?.click()}>Restore from backup</button>
              <input ref={jsonRef} type="file" accept=".json" hidden onChange={async (e) => {
                const f = e.target.files[0]; if (!f) return;
                try {
                  const j = JSON.parse(await f.text());
                  if (Array.isArray(j)) { commit(j); say('Backup restored.'); } else say('That file is not a catalogue backup.');
                } catch (err) { say('Could not read that file.'); }
                e.target.value = '';
              }} />
              <button className="b danger" type="button" onClick={() => {
                if (confirm('Replace everything with the original catalogue? Export a backup first if you need one.')) {
                  commit(DEFAULTS.map((p) => ({ ...p }))); say('Reset to defaults.');
                }
              }}>Reset to defaults</button>
            </div>
          </div>

          <div className="panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
              <div><h2>Products</h2><p className="sub">Click edit to change any field or swap the photo.</p></div>
              <button className="b primary" type="button" onClick={() => openEditor(-1)}>Add a product</button>
            </div>
            <div className="field" style={{ marginTop: '1.4rem' }}>
              <label>Filter</label>
              <input type="search" placeholder="Search by name, brand or type" value={filter} onChange={(e) => setFilter(e.target.value)} />
            </div>
            <div className="list">
              {shown.length === 0 ? <p className="sub">Nothing here. Add a product or import a spreadsheet.</p> : shown.map(({ p, i }) => (
                <div className="rowitem" key={p.n + i}>
                  {p.img ? <img src={p.img} alt="" /> : <div className="ph">no photo</div>}
                  <div>
                    <h4>{p.n}</h4>
                    <div className="m">{p.b} &middot; {p.t || 'uncategorised'} &middot; {p.s}</div>
                  </div>
                  <div className="acts">
                    <button type="button" onClick={() => openEditor(i)}>Edit</button>
                    <button type="button" onClick={() => remove(i)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <dialog ref={dlg} onClose={() => setEditing(null)}>
        {editing ? (
          <div className="modal">
            <h2>{editing.index >= 0 ? 'Edit product' : 'Add a product'}</h2>
            <Editor product={editing.product} onChange={(product) => setEditing((e) => ({ ...e, product }))} onImage={readImage} />
            <div className="bar" style={{ justifyContent: 'flex-end' }}>
              <button className="b" type="button" onClick={closeEditor}>Cancel</button>
              <button className="b primary" type="button" onClick={save}>Save product</button>
            </div>
          </div>
        ) : null}
      </dialog>

      <div className={`toast ${toast ? 'on' : ''}`}>{toast}</div>
    </>
  );
}

function Editor({ product, onChange, onImage }) {
  const set = (k, v) => onChange({ ...product, [k]: v });
  const toggleRoom = (r) =>
    set('r', (product.r || []).includes(r) ? product.r.filter((x) => x !== r) : [...(product.r || []), r]);
  const imgRef = useRef(null);
  return (
    <div style={{ marginTop: '1.4rem' }}>
      <div className="grid2">
        <div className="field"><label>Brand</label>
          <select value={product.b} onChange={(e) => set('b', e.target.value)}><option value="astral">Astral</option><option value="somany">Somany</option></select>
        </div>
        <div className="field"><label>Type</label><input value={product.t} onChange={(e) => set('t', e.target.value)} placeholder="Floor tile, Drainage, Fittings" /></div>
      </div>
      <div className="field"><label>Product name</label><input value={product.n} onChange={(e) => set('n', e.target.value)} placeholder="CPVC Pro hot & cold pipe" /></div>
      <div className="field"><label>Size or range</label><input value={product.s} onChange={(e) => set('s', e.target.value)} placeholder="600x600mm, 15mm to 50mm, Full range" /></div>
      <div className="field"><label>Description</label><textarea value={product.d} onChange={(e) => set('d', e.target.value)} placeholder="One or two sentences on what it is and when to use it." /></div>
      <div className="field"><label>Rooms</label>
        <div className="roomboxes">
          {ROOMS.map((r) => (
            <label key={r}><input type="checkbox" checked={(product.r || []).includes(r)} onChange={() => toggleRoom(r)} />{r}</label>
          ))}
        </div>
      </div>
      <div className="field"><label>Photo</label>
        <Drop onFile={onImage} accept="image/*" inputRef={imgRef}>Drop an image here, or click to choose. It is resized and stored with the product.</Drop>
        <div className="thumbwrap">
          {product.img ? <img className="thumb" src={product.img} alt="" /> : <div className="thumb" />}
          <input value={product.img && product.img.startsWith('data:') ? '' : product.img} onChange={(e) => set('img', e.target.value.trim())} placeholder="or paste an image URL" />
        </div>
      </div>
    </div>
  );
}

function Drop({ onFile, accept, inputRef, children }) {
  const [hot, setHot] = useState(false);
  return (
    <div
      className={`drop ${hot ? 'hot' : ''}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setHot(true); }}
      onDragLeave={() => setHot(false)}
      onDrop={(e) => { e.preventDefault(); setHot(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
    >
      {children}
      <input ref={inputRef} type="file" accept={accept} hidden onChange={(e) => { const f = e.target.files[0]; if (f) onFile(f); e.target.value = ''; }} />
    </div>
  );
}
