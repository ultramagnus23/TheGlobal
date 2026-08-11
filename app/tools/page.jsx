'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import PageCss from '@/components/PageCss';

const fmt = (n) => Math.round(n).toLocaleString('en-IN');

export default function Tools() {
  return (
    <>
      <PageCss page="tools" />
      <section className="pagehead">
        <div className="wrap">
          <span className="eyebrow">Tools</span>
          <h1>Numbers before<br />you order.</h1>
          <p className="lede">Three calculators we use at the counter every day. They run in your browser, nothing is sent anywhere, and no one asks for your number.</p>
          <div className="toolnav">
            <a href="#tile">Tile calculator</a><a href="#pipe">Pipe calculator</a><a href="#tank">Tank calculator</a>
          </div>
        </div>
      </section>
      <section style={{ paddingTop: '1rem' }}>
        <div className="wrap">
          <TileCalc /><PipeCalc /><TankCalc />
        </div>
      </section>
    </>
  );
}

function TileCalc() {
  const [l, setL] = useState(12);
  const [w, setW] = useState(10);
  const [unit, setUnit] = useState('ft');
  const [size, setSize] = useState('600x600');
  const [waste, setWaste] = useState(10);
  const [per, setPer] = useState(4);

  const out = useMemo(() => {
    const k = unit === 'ft' ? 0.3048 : 1;
    const area = Math.max(0, l) * k * Math.max(0, w) * k;
    const [tw, th] = size.split('x').map(Number);
    const tileArea = (tw / 1000) * (th / 1000);
    const areaW = area * (1 + waste / 100);
    const tiles = tileArea > 0 ? Math.ceil(areaW / tileArea) : 0;
    const perBox = Math.max(1, Math.round(per) || 1);
    return { area, areaW, tiles, boxes: Math.ceil(tiles / perBox), cov: tileArea * perBox };
  }, [l, w, unit, size, waste, per]);

  return (
    <div className="calc" id="tile">
      <div>
        <span className="eyebrow">01</span>
        <h2 style={{ marginTop: '.6rem' }}>Tile calculator</h2>
        <p className="note">Room size in, exact box count out. Wastage covers cuts at edges, breakage and a small reserve for future repairs.</p>
        <div className="fields">
          <div className="row2">
            <Field label="Room length"><input type="number" min="0" step="0.1" value={l} onChange={(e) => setL(+e.target.value)} /></Field>
            <Field label="Room width"><input type="number" min="0" step="0.1" value={w} onChange={(e) => setW(+e.target.value)} /></Field>
          </div>
          <div className="row2">
            <Field label="Units">
              <select value={unit} onChange={(e) => setUnit(e.target.value)}><option value="ft">Feet</option><option value="m">Metres</option></select>
            </Field>
            <Field label="Tile size">
              <select value={size} onChange={(e) => setSize(e.target.value)}>
                <option value="600x600">600 x 600 mm</option><option value="800x800">800 x 800 mm</option>
                <option value="600x1200">600 x 1200 mm</option><option value="800x1600">800 x 1600 mm</option>
                <option value="300x300">300 x 300 mm</option><option value="300x600">300 x 600 mm</option>
                <option value="200x1200">200 x 1200 mm plank</option>
              </select>
            </Field>
          </div>
          <div className="row2">
            <Field label="Wastage">
              <select value={waste} onChange={(e) => setWaste(+e.target.value)}>
                <option value="5">5 percent, simple square room</option>
                <option value="10">10 percent, standard</option>
                <option value="15">15 percent, diagonal or many cuts</option>
              </select>
            </Field>
            <Field label="Tiles per box"><input type="number" min="1" step="1" value={per} onChange={(e) => setPer(+e.target.value)} /></Field>
          </div>
        </div>
      </div>
      <div className="out">
        <div className="eyebrow">You need</div>
        <div className="big">{fmt(out.boxes)}<em>boxes</em></div>
        <div className="lines">
          <Line k="Floor area" v={`${out.area.toFixed(2)} m² / ${(out.area * 10.7639).toFixed(0)} sq ft`} />
          <Line k="Area with wastage" v={`${out.areaW.toFixed(2)} m²`} />
          <Line k="Tiles required" v={`${fmt(out.tiles)} tiles`} />
          <Line k="Coverage per box" v={`${out.cov.toFixed(2)} m²`} />
        </div>
        <p className="hint">Boxes are rounded up. Buy from a single batch so shade and calibration match across the floor.</p>
        <Link className="cta" href="/catalogue?brand=somany">See Somany tiles &rarr;</Link>
      </div>
    </div>
  );
}

function PipeCalc() {
  const [f, setF] = useState(2);
  const [h, setH] = useState(10.5);
  const [b, setB] = useState(4);
  const [k, setK] = useState(2);
  const [lay, setLay] = useState(1.18);
  const [tank, setTank] = useState(1);

  const out = useMemo(() => {
    const rise = Math.max(1, f) * h + (tank ? h * 0.9 : 0);
    const c15 = (b * 34 + k * 16) * lay;
    const c25 = (b * 11 + k * 7) * lay + rise * 1.6;
    const u50 = rise * 1.2 + (tank ? 45 : 18) + b * 3;
    const s75 = (b * 13 + k * 11) * lay + rise * 0.9;
    const s110 = b * 9 * lay + rise * 1.1 + 26;
    const r5 = (v) => Math.ceil(v / 5) * 5;
    return { c15: r5(c15), c25: r5(c25), u50: r5(u50), s75: r5(s75), s110: r5(s110), total: Math.ceil((c15 + c25 + u50 + s75 + s110) / 10) * 10 };
  }, [f, h, b, k, lay, tank]);

  return (
    <div className="calc" id="pipe">
      <div>
        <span className="eyebrow">02</span>
        <h2 style={{ marginTop: '.6rem' }}>Pipe calculator</h2>
        <p className="note">A planning estimate for a residential build, based on typical fixture counts and riser heights. Use it to budget and to sanity check a plumber&apos;s quantity, not as a substitute for the site drawing.</p>
        <div className="fields">
          <div className="row2">
            <Field label="Floors"><input type="number" min="1" max="12" step="1" value={f} onChange={(e) => setF(+e.target.value)} /></Field>
            <Field label="Floor to floor height (ft)"><input type="number" min="8" max="16" step="0.5" value={h} onChange={(e) => setH(+e.target.value)} /></Field>
          </div>
          <div className="row2">
            <Field label="Bathrooms"><input type="number" min="0" step="1" value={b} onChange={(e) => setB(+e.target.value)} /></Field>
            <Field label="Kitchens & utility points"><input type="number" min="0" step="1" value={k} onChange={(e) => setK(+e.target.value)} /></Field>
          </div>
          <div className="row2">
            <Field label="Layout">
              <select value={lay} onChange={(e) => setLay(+e.target.value)}>
                <option value="1">Compact, stacked wet areas</option>
                <option value="1.18">Standard villa</option>
                <option value="1.35">Spread out, long runs</option>
              </select>
            </Field>
            <Field label="Overhead tank on terrace">
              <select value={tank} onChange={(e) => setTank(+e.target.value)}><option value="1">Yes</option><option value="0">No</option></select>
            </Field>
          </div>
        </div>
      </div>
      <div className="out">
        <div className="eyebrow">Estimated running length</div>
        <div className="big">{fmt(out.total)}<em>ft total</em></div>
        <div className="lines">
          <Line k="CPVC 15mm branches" v={`${fmt(out.c15)} ft`} />
          <Line k="CPVC 20 to 25mm mains" v={`${fmt(out.c25)} ft`} />
          <Line k="UPVC 32 to 50mm supply" v={`${fmt(out.u50)} ft`} />
          <Line k="SWR 75mm waste" v={`${fmt(out.s75)} ft`} />
          <Line k="SWR 110mm soil" v={`${fmt(out.s110)} ft`} />
        </div>
        <p className="hint">Add roughly 30 percent in fittings by count, and order solvent cement at one 500ml tin per 300 ft of CPVC.</p>
        <Link className="cta" href="/catalogue?brand=astral">See Astral plumbing &rarr;</Link>
      </div>
    </div>
  );
}

function TankCalc() {
  const [p, setP] = useState(5);
  const [lpcd, setLpcd] = useState(135);
  const [days, setDays] = useState(2);
  const [extra, setExtra] = useState(0);

  const out = useMemo(() => {
    const day = Math.max(0, p) * lpcd + Math.max(0, extra);
    const total = day * Math.max(1, days);
    const over = Math.max(500, Math.ceil((day * 0.55) / 100) * 100);
    const under = Math.max(0, Math.ceil((total - over) / 100) * 100);
    const std = [500, 750, 1000, 1500, 2000, 3000, 5000];
    const pick = (v) => std.find((s) => s >= v) || Math.ceil(v / 1000) * 1000;
    return { day, total: Math.ceil(total / 50) * 50, over, under, std: `${fmt(pick(over))} L overhead${under > 0 ? ` + ${fmt(pick(under))} L sump` : ''}` };
  }, [p, lpcd, days, extra]);

  return (
    <div className="calc" id="tank">
      <div>
        <span className="eyebrow">03</span>
        <h2 style={{ marginTop: '.6rem' }}>Tank calculator</h2>
        <p className="note">Sizes storage against household demand and how long you want to survive a supply cut. Splitting between an underground sump and an overhead tank is normal, and the split below follows common practice.</p>
        <div className="fields">
          <div className="row2">
            <Field label="People in the house"><input type="number" min="1" step="1" value={p} onChange={(e) => setP(+e.target.value)} /></Field>
            <Field label="Litres per person per day">
              <select value={lpcd} onChange={(e) => setLpcd(+e.target.value)}>
                <option value="100">100, frugal</option><option value="135">135, standard Indian norm</option>
                <option value="180">180, generous</option><option value="250">250, garden and pool</option>
              </select>
            </Field>
          </div>
          <div className="row2">
            <Field label="Reserve days"><input type="number" min="1" max="10" step="1" value={days} onChange={(e) => setDays(+e.target.value)} /></Field>
            <Field label="Extra daily demand (litres)"><input type="number" min="0" step="10" value={extra} onChange={(e) => setExtra(+e.target.value)} /></Field>
          </div>
        </div>
      </div>
      <div className="out">
        <div className="eyebrow">Total storage</div>
        <div className="big">{fmt(out.total)}<em>litres</em></div>
        <div className="lines">
          <Line k="Daily demand" v={`${fmt(out.day)} L per day`} />
          <Line k="Suggested overhead tank" v={`${fmt(out.over)} L`} />
          <Line k="Suggested underground sump" v={out.under > 0 ? `${fmt(out.under)} L` : 'not required'} />
          <Line k="Nearest stocked sizes" v={out.std} />
        </div>
        <p className="hint">Check the terrace slab is designed for the filled weight. One litre is one kilogram, so a 1000 litre tank is a tonne standing on four feet.</p>
        <Link className="cta" href="/catalogue?brand=astral">See Astral tanks &rarr;</Link>
      </div>
    </div>
  );
}

const Field = ({ label, children }) => (
  <div className="field"><label>{label}</label>{children}</div>
);
const Line = ({ k, v }) => (
  <div><span>{k}</span><b>{v}</b></div>
);
