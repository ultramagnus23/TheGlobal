import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import SmoothAnchors from '@/components/SmoothAnchors';

export const metadata = {
  title: 'The Global, Building Rajasthan. Supplying India.',
  description:
    'Exclusive authorised Somany distributor for Rajasthan and trusted Astral distribution partner. Pipes, tiles, bathware and sanitaryware, stocked in Jaipur.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SmoothAnchors />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
