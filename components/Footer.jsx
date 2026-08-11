import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="wrap foot">
        <div>
          <h4>The Global</h4>
          <p>Exclusive authorised Somany distributor for Rajasthan.<br />Trusted Astral distribution partner since 2018.<br />Jaipur, Rajasthan.</p>
        </div>
        <nav>
          <Link href="/#work">Work</Link>
          <Link href="/#brands">Brands</Link>
          <Link href="/catalogue">Catalogue</Link>
          <Link href="/tools">Tools</Link>
          <Link href="/#contact">Contact</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
      <div className="wrap footline">
        <span>A family business, second generation, still answering the phone.</span>
        <span>&copy; 2026 The Global, Jaipur</span>
      </div>
    </footer>
  );
}
