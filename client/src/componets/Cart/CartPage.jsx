import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SiteHeader from '../SiteHeader/SiteHeader';
import Footer from '../Footer/Footer';
import { useCart, euro, FREE_DELIVERY_FROM } from '../../CartContext';
import './CartPage.css';

function CartPage() {
  const nav = useNavigate();
  const { user, items, count, subtotal, delivery, total, setQty, checkout } = useCart();
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.info('Sign in to see your cart.');
      nav('/');
    }
  }, [user, nav]);

  const toFree = Math.max(0, FREE_DELIVERY_FROM - subtotal);
  const placeOrder = async () => {
    setPlacing(true);
    const order = await checkout();
    setPlacing(false);
    if (order) nav('/profile', { state: { newOrder: order.orderId } });
  };

  return (
    <div className="page cart-page">
      <SiteHeader />
      <main className="cart-wrap">
        <div className="cart-head">
          <h1>Your cart</h1>
          <span>{count} {count === 1 ? 'can' : 'cans'}</span>
        </div>

        {!items.length ? (
          <div className="cart-empty">
            <img src="/img/brand/emblem.svg" alt="" />
            <h2>Nothing poured yet</h2>
            <p>Pick a few flavours and they will show up here.</p>
            <Link to="/home#drinks" className="cart-btn">Browse drinks <span aria-hidden="true">→</span></Link>
          </div>
        ) : (
          <div className="cart-grid">
            <ul className="cart-lines">
              {items.map((i) => (
                <li key={i.productId} className="cart-line" style={{ '--c': i.color }}>
                  <div className="cart-can"><span /><img src={i.img} alt="" /></div>
                  <div className="cart-info">
                    <b>{i.name}</b>
                    <span>{euro(i.price)} · 330 ml can</span>
                    <button type="button" className="cart-remove" onClick={() => setQty(i.productId, 0)}>Remove</button>
                  </div>
                  <div className="cart-qty" aria-label={`Quantity of ${i.name}`}>
                    <button type="button" onClick={() => setQty(i.productId, i.qty - 1)} aria-label="One less">−</button>
                    <span>{i.qty}</span>
                    <button type="button" onClick={() => setQty(i.productId, i.qty + 1)} aria-label="One more">+</button>
                  </div>
                  <b className="cart-line-total">{euro(i.price * i.qty)}</b>
                </li>
              ))}
            </ul>

            <aside className="cart-summary">
              <h2>Summary</h2>
              <div className="cart-free">
                {toFree > 0
                  ? <>Add <b>{euro(toFree)}</b> more for free delivery</>
                  : <><b>Free delivery</b> unlocked</>}
                <i style={{ '--p': `${Math.min(100, (subtotal / FREE_DELIVERY_FROM) * 100)}%` }} />
              </div>
              <dl>
                <div><dt>Subtotal</dt><dd>{euro(subtotal)}</dd></div>
                <div><dt>Delivery</dt><dd>{delivery ? euro(delivery) : 'Free'}</dd></div>
                <div className="cart-total"><dt>Total</dt><dd>{euro(total)}</dd></div>
              </dl>
              <button type="button" className="cart-btn wide" onClick={placeOrder} disabled={placing}>
                {placing ? 'Placing order…' : 'Checkout'} <span aria-hidden="true">→</span>
              </button>
              <p className="cart-note">Demo store: no payment is taken.</p>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default CartPage;
