import { useState } from 'react';
import './Footer.css';

const COLUMNS = [
  { title: 'Shop', links: ['All drinks', 'Sodas', 'Iced teas', '12-packs'] },
  { title: 'Help', links: ['Delivery', 'Returns', 'Track order', 'Contact us'] },
  { title: 'Company', links: ['About Red·Blue', 'Sustainability', 'Careers', 'Press'] },
];

function Footer() {
  const [joined, setJoined] = useState(false);

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <a href="#top" className="footer-logo"><span className="red">Red</span>·<span className="blue">Blue</span></a>
          <p>Small-batch soft drinks, shipped cold to your door.</p>
          <form
            className="footer-news"
            onSubmit={(e) => { e.preventDefault(); setJoined(true); }}
          >
            <input type="email" placeholder="Your email" aria-label="Your email" required disabled={joined} />
            <button type="submit" disabled={joined}>{joined ? 'Subscribed ✓' : 'Subscribe'}</button>
          </form>
          <small>New flavours and offers, about once a month.</small>
        </div>
        {COLUMNS.map((c) => (
          <nav key={c.title} className="footer-col">
            <h4>{c.title}</h4>
            {c.links.map((l) => <a key={l} href="#top">{l}</a>)}
          </nav>
        ))}
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Red·Blue · A demo store</span>
        <span className="footer-pay" aria-label="Payment methods">
          <i>VISA</i><i>Mastercard</i><i>PayPal</i><i>Klarna</i>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
