'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const encode = (data) =>
  Object.keys(data)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
    .join('&');

export default function EnquiryForm() {
  const router = useRouter();
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');
  const [materials, setMaterials] = useState('');

  // Pull anything the visitor added to their list on the catalogue page.
  useEffect(() => {
    try {
      const raw = localStorage.getItem('tg_enquiry_list');
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list) && list.length) setMaterials(list.map((p) => p.n).join('\n'));
      }
    } catch (e) {}
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setState('sending');
    setError('');
    const form = e.target;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'enquiry', ...data })
      });
      if (!res.ok) throw new Error('Submission failed');
      try { localStorage.removeItem('tg_enquiry_list'); } catch (err) {}
      router.push('/thanks');
    } catch (err) {
      setState('idle');
      setError('That did not go through. Please call the office instead, or try again in a moment.');
    }
  }

  return (
    <form className="enquiry reveal" data-d="1" name="enquiry" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={onSubmit}>
      <input type="hidden" name="form-name" value="enquiry" />
      <p hidden><label>Leave this empty <input name="bot-field" /></label></p>
      <h3>Send us the job.</h3>
      <p className="fine">Tell us what you are building and roughly what you need. We reply with availability and a quote, usually the same day.</p>
      <div className="frow">
        <label className="fld"><span>Name</span><input name="name" required autoComplete="name" /></label>
        <label className="fld"><span>Phone</span><input name="phone" required inputMode="tel" autoComplete="tel" /></label>
      </div>
      <div className="frow">
        <label className="fld"><span>Email</span><input name="email" type="email" autoComplete="email" /></label>
        <label className="fld"><span>Site location</span><input name="site" placeholder="Jaipur, Kota, elsewhere" /></label>
      </div>
      <label className="fld"><span>What do you need</span><textarea name="message" rows={3} placeholder="Two floors, four bathrooms, tiling and full plumbing." /></label>
      <label className="fld"><span>Material list</span><textarea name="materials" rows={3} value={materials} onChange={(e) => setMaterials(e.target.value)} placeholder="Anything you added on the catalogue page shows up here." /></label>
      {error ? <p className="err">{error}</p> : null}
      <button className="btn btn-clay" type="submit" disabled={state === 'sending'} style={{ width: '100%', marginTop: '.4rem' }}>
        {state === 'sending' ? 'Sending' : 'Send enquiry'}
      </button>
      <p className="fine" style={{ marginTop: '.8rem' }}>Mon to Sat, 9:30 to 19:00. Dispatch cut off 16:00 for next day.</p>
    </form>
  );
}
