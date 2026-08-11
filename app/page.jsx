import Link from 'next/link';
import PageCss from '@/components/PageCss';
import Hero from '@/components/Hero';
import Story from '@/components/Story';
import IndiaMap from '@/components/IndiaMap';
import EnquiryForm from '@/components/EnquiryForm';
import Reveal from '@/components/Reveal';

export default function Home() {
  return (
    <>
      <PageCss page="home" />
      <Reveal />
      <Hero />
      <Story />

      <section>
        <div className="wrap">
          <div className="reveal">
            <span className="eyebrow">The house we built</span>
            <h2 className="h2">A distributor is only as good as its worst week.</h2>
          </div>
          <div className="cards3">
            <div className="card reveal"><div className="n">18<em>+</em></div><p>Years spent building supply chains that hold when a site runs three weeks ahead of schedule.</p></div>
            <div className="card reveal" data-d="1"><div className="n">1000<em>s</em></div><p>Of SKUs across plumbing, tiling and bathware, stocked in Jaipur and ready to move.</p></div>
            <div className="card reveal" data-d="2"><div className="n">2</div><p>National brands, one authorised distributor. Astral and Somany under a single roof.</p></div>
          </div>
        </div>
      </section>

      <section id="brands" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="reveal" style={{ marginBottom: '2.4rem' }}>
            <span className="eyebrow">The two names we carry</span>
            <h2 className="h2">Behind the wall, and on it.</h2>
          </div>
          <div className="brands">
            <Link className="bcard astral reveal" href="/catalogue?brand=astral">
              <img src="https://www.astralpipes.com/wp-content/uploads/2026/02/04-CPVC-Pro.jpg" alt="Astral CPVC piping" loading="lazy" />
              <div className="wm">Astral</div>
              <p>CPVC, UPVC, SWR and storage tanks. The systems that carry water through a building for thirty years without anyone thinking about them once.</p>
              <div className="chips"><span className="chip">Pipes</span><span className="chip">Fittings</span><span className="chip">Tanks</span><span className="chip">Adhesives</span></div>
              <div className="go">Explore Astral <span>&rarr;</span></div>
            </Link>
            <Link className="bcard somany reveal" data-d="1" href="/catalogue?brand=somany">
              <img src="https://d3joggurz1vobr.cloudfront.net/storefront/images/tiles-home-hero.webp" alt="Somany tiles" loading="lazy" />
              <div className="wm">Somany</div>
              <p>Tiles, sanitaryware and bath fittings. Large format floors, anti skid baths and finishes that still look considered after a decade of use.</p>
              <div className="chips"><span className="chip">Tiles</span><span className="chip">Bathware</span><span className="chip">Sanitaryware</span><span className="chip">Adhesives</span></div>
              <div className="go">Explore Somany <span>&rarr;</span></div>
            </Link>
          </div>
        </div>
      </section>

      <section id="projects" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="reveal">
            <span className="eyebrow">Projects</span>
            <h2 className="h2">Where the material ends up.</h2>
          </div>
          <div className="pgrid">
            <div className="proj reveal">
              <img src="https://d3joggurz1vobr.cloudfront.net/storefront/images/image-homediscoverysettings-3.webp" alt="Private villa interior, Jaipur" loading="lazy" />
              <div className="meta">
                <div><h3>Private villa</h3><div className="loc">Jaipur, Rajasthan &middot; 2025</div></div>
                <div className="used"><b>Astral</b> CPVC Pro, water tanks<br /><b>Somany</b> large format tiles, bathware</div>
              </div>
            </div>
            <div className="proj reveal">
              <img src="https://d3joggurz1vobr.cloudfront.net/storefront/images/image-homediscoverysettings-1.webp" alt="Regional hospital, Udaipur" loading="lazy" />
              <div className="meta">
                <div><h3>Regional hospital</h3><div className="loc">Udaipur &middot; 2024</div></div>
                <div className="used"><b>Astral</b> SWR<br /><b>Somany</b> anti skid vitrified</div>
              </div>
            </div>
            <div className="proj reveal" data-d="1">
              <img src="https://d3joggurz1vobr.cloudfront.net/storefront/images/image-homediscoverysettings-5.webp" alt="Residential towers, Jodhpur" loading="lazy" />
              <div className="meta">
                <div><h3>Residential towers</h3><div className="loc">Jodhpur &middot; 2023</div></div>
                <div className="used"><b>Astral</b> full plumbing<br /><b>Somany</b> floors and walls</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="band" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Link className="bandcard reveal" href="/catalogue">
            <div>
              <span className="eyebrow">The catalogue</span>
              <h2 className="h2" style={{ maxWidth: '16ch' }}>Everything we stock, in one place.</h2>
              <p className="lede">Astral plumbing and Somany surfaces, filterable by brand, room and type. Build a list and send it straight to the counter.</p>
            </div>
            <div className="bandgo"><span className="btn btn-clay">Open the catalogue &rarr;</span></div>
          </Link>
        </div>
      </section>

      <section id="logistics" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="reveal">
            <span className="eyebrow">Reach</span>
            <h2 className="h2">Rooted in Jaipur. Shipping across India.</h2>
          </div>
          <div className="logi">
            <IndiaMap />
            <div className="reveal" data-d="1">
              <p className="lede">Rajasthan is home, and the yard in Jaipur is where everything moves from. But material leaves for sites anywhere in the country, and we plan dispatch around your pour dates rather than ours. Whatever the state, we tell you the truth about stock before you place the order.</p>
              <div className="stats">
                <div><b>Pan</b><span>India dispatch</span></div>
                <div><b>48h</b><span>typical Rajasthan dispatch</span></div>
                <div><b>1</b><span>number that always picks up</span></div>
              </div>
              <a href="#contact" className="btn btn-ghost" style={{ marginTop: '2rem' }}>Check stock for your site</a>
            </div>
          </div>
        </div>
      </section>

      <section className="light">
        <div className="wrap">
          <div className="reveal">
            <span className="eyebrow">Resources</span>
            <h2 className="h2">Tools for the people actually building.</h2>
            <p className="lede">Working calculators, not lead capture forms. Nothing asks for your number.</p>
          </div>
          <div className="tools">
            <Link className="tool reveal" href="/tools#tile"><h4>Tile calculator</h4><p>Room size in, exact box count out, wastage included.</p><div className="go">Open <span>&rarr;</span></div></Link>
            <Link className="tool reveal" data-d="1" href="/tools#pipe"><h4>Pipe calculator</h4><p>Estimate CPVC, UPVC and SWR runs for a full villa.</p><div className="go">Open <span>&rarr;</span></div></Link>
            <Link className="tool reveal" data-d="2" href="/tools#tank"><h4>Tank calculator</h4><p>Size storage to household demand and reserve days.</p><div className="go">Open <span>&rarr;</span></div></Link>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="bgimg"><img src="https://d3joggurz1vobr.cloudfront.net/storefront/images/image-choosing-somany-img-3.webp" alt="" loading="lazy" /></div>
        <div className="wrap">
          <span className="eyebrow">Jaipur, Rajasthan</span>
          <h2 style={{ marginTop: '1rem' }}>Let&apos;s build<br />together.</h2>
          <div className="cgrid">
            <div className="clist reveal">
              <Link href="/catalogue"><span className="k">Browse the catalogue</span><span className="v">Build a list</span></Link>
              <a href="tel:+91"><span className="k">Call the office</span><span className="v">Mon to Sat</span></a>
              <a href="https://wa.me/91"><span className="k">WhatsApp the counter</span><span className="v">Send a material list</span></a>
              <a href="mailto:"><span className="k">Email us</span><span className="v">Quotes in 24h</span></a>
              <a href="https://maps.google.com"><span className="k">Get directions</span><span className="v">Warehouse &amp; showroom</span></a>
            </div>
            <EnquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
