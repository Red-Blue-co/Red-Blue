import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SiteHeader from '../SiteHeader/SiteHeader';
import Footer from '../Footer/Footer';
import req from '../../Axios/Axios';
import { clearUser, setUser } from '../../session';
import { useLoader } from '../../LoaderContext';
import { useCart, euro } from '../../CartContext';
import '../Cart/CartPage.css';
import './Profile.css';

const day = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

function Profile() {
  const nav = useNavigate();
  const { state } = useLocation();
  const { user, count } = useCart();
  const [orders, setOrders] = useState(null);
  const { setLoading } = useLoader();

  // edit profile
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ userName: '', userMail: '', newPass: '', currentPass: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const startEdit = () => {
    setForm({ userName: user.userName, userMail: user.userMail, newPass: '', currentPass: '' });
    setEditing(true);
  };
  const save = async (e) => {
    e.preventDefault();
    if (!form.currentPass) return toast.error('Enter your current password to save changes.');
    setLoading(true);
    const res = await req.post('/user/update', { userId: user.userId, ...form });
    setLoading(false);
    if (res.data?.errorCode !== '000000') return toast.error(res.data?.errorDescription || 'We could not save your changes.');
    setUser(res.data.Data[0]);
    toast.success(res.data.errorDescription);
    setEditing(false);
  };

  useEffect(() => {
    if (!user) {
      toast.info('Sign in to see your profile.');
      nav('/');
      return;
    }
    req.get('/cart/orders', { params: { userId: user.userId } }).then((res) => {
      setOrders(Array.isArray(res.data?.Data) ? res.data.Data : []);
    });
  }, [user, nav]);

  if (!user) return null;

  const spent = (orders || []).reduce((s, o) => s + Number(o.total), 0);
  const cans = (orders || []).reduce((s, o) => s + o.itemCount, 0);
  const signOut = () => {
    clearUser();
    toast.success('Signed out. See you soon!');
    nav('/');
  };

  return (
    <div className="page profile-page">
      <SiteHeader />
      <main className="cart-wrap">
        <div className="profile-top">
          {/* the member card */}
          <div className="member-card">
            <img src="/img/brand/emblem.svg" alt="" className="member-stamp" />
            <div className="member-row">
              <span>Two Tone · Member</span>
              <span>No. {String(user.userId).padStart(4, '0')}</span>
            </div>
            <div className="member-avatar">{user.userName.slice(0, 2).toUpperCase()}</div>
            <h1>{user.userName}</h1>
            <p>{user.userMail}</p>
            <div className="member-row bottom">
              <span>Member since</span>
              <span>{user.createdAt ? day(user.createdAt) : '—'}</span>
            </div>
          </div>

          <div className="profile-side">
            <h2>Hi, {user.userName}</h2>
            <p className="profile-sub">Here is everything you have poured so far.</p>
            <ul className="profile-stats">
              <li><b>{orders ? orders.length : '…'}</b><span>Orders</span></li>
              <li><b>{orders ? cans : '…'}</b><span>Cans enjoyed</span></li>
              <li><b>{orders ? euro(spent) : '…'}</b><span>Spent</span></li>
              <li><b>{count}</b><span>In your cart</span></li>
            </ul>
            <div className="profile-actions">
              <Link to="/cart" className="cart-btn">Go to cart <span aria-hidden="true">→</span></Link>
              <button type="button" className="profile-edit" onClick={editing ? () => setEditing(false) : startEdit}>
                {editing ? 'Close' : 'Edit profile'}
              </button>
              <button type="button" className="profile-out" onClick={signOut}>Sign out</button>
            </div>
          </div>
        </div>

        {editing && (
          <form className="profile-form" onSubmit={save}>
            <div className="profile-form-head">
              <h2>Edit profile</h2>
              <p>Change your details. We need your current password to save.</p>
            </div>
            <div className="profile-form-grid">
              <label>
                <span>Username</span>
                <input value={form.userName} onChange={set('userName')} autoComplete="username" required />
              </label>
              <label>
                <span>Email</span>
                <input type="email" value={form.userMail} onChange={set('userMail')} autoComplete="email" required />
              </label>
              <label>
                <span>New password <em>(optional)</em></span>
                <input type="password" value={form.newPass} onChange={set('newPass')} autoComplete="new-password" placeholder="Leave empty to keep it" />
              </label>
              <label className="need">
                <span>Current password</span>
                <input type="password" value={form.currentPass} onChange={set('currentPass')} autoComplete="current-password" required />
              </label>
            </div>
            <div className="profile-form-actions">
              <button type="submit" className="cart-btn">Save changes <span aria-hidden="true">→</span></button>
              <button type="button" className="profile-out" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
        )}

        <section className="profile-orders">
          <h2>Your orders</h2>
          {orders && !orders.length && (
            <p className="profile-empty">No orders yet. <Link to="/home#drinks">Pick your first round →</Link></p>
          )}
          <ul>
            {(orders || []).map((o) => (
              <li key={o.orderId} className={`order ${state?.newOrder === o.orderId ? 'new' : ''}`}>
                <div className="order-head">
                  <div>
                    <b>Order #{String(o.orderId).padStart(5, '0')}</b>
                    <span>{day(o.createdAt)} · {o.itemCount} {o.itemCount === 1 ? 'can' : 'cans'}</span>
                  </div>
                  <span className="order-status">{state?.newOrder === o.orderId ? 'Just placed' : 'Delivered'}</span>
                  <b className="order-total">{euro(o.total)}</b>
                </div>
                <div className="order-cans">
                  {o.items.map((i, k) => (
                    <span key={k} className="order-can" title={`${i.qty} × ${i.name}`} style={{ '--c': i.color }}>
                      <img src={i.img} alt={i.name} />
                      <i>×{i.qty}</i>
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Profile;
