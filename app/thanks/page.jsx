import Link from 'next/link';

export const metadata = { title: 'Thank you, The Global' };

export default function Thanks() {
  return (
    <section style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
      <div className="wrap">
        <span className="eyebrow">Enquiry received</span>
        <h1 style={{ fontSize: 'clamp(2.2rem,5vw,3.6rem)', marginTop: '1rem' }}>Thank you. We have it.</h1>
        <p className="lede" style={{ margin: '1.2rem auto 0' }}>
          Someone from the counter will come back to you with availability and a quote, usually the same working day.
          If it is urgent, call the office directly and mention that you sent an enquiry through the site.
        </p>
        <div style={{ display: 'flex', gap: '.8rem', justifyContent: 'center', marginTop: '2.2rem', flexWrap: 'wrap' }}>
          <Link className="btn btn-solid" href="/">Back to the site</Link>
          <Link className="btn btn-ghost" href="/catalogue">Keep browsing the catalogue</Link>
        </div>
      </div>
    </section>
  );
}
