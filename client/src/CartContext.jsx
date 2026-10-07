import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import req from './Axios/Axios';
import { getUser } from './session';

// The signed-in user's cart, kept in the database and shared by every page
const CartContext = createContext(null);

export const DELIVERY = 3.9;
export const FREE_DELIVERY_FROM = 25;

export function CartProvider({ children }) {
  const [user, setUserState] = useState(getUser());
  const [items, setItems] = useState([]);

  // follow sign in / sign out
  useEffect(() => {
    const sync = () => setUserState(getUser());
    window.addEventListener('twotone-user', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('twotone-user', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const apply = (res) => {
    if (res.data?.errorCode === '000000' && Array.isArray(res.data.Data)) setItems(res.data.Data);
    else if (res.data?.errorDescription) toast.error(res.data.errorDescription);
    return res.data?.errorCode === '000000';
  };

  const refresh = useCallback(() => {
    if (!user) return setItems([]);
    req.get('/cart/get', { params: { userId: user.userId } }).then(apply);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  // returns false when nobody is signed in, so the page can send them to sign in
  const add = async (product, qty = 1) => {
    if (!user) {
      toast.info('Sign in to start your cart.');
      return false;
    }
    const ok = apply(await req.post('/cart/add', { userId: user.userId, productId: product.productId, qty }));
    if (ok) toast.success(`${product.name} added to your cart.`);
    return ok;
  };

  const setQty = async (productId, qty) => {
    if (!user) return;
    apply(await req.post('/cart/set', { userId: user.userId, productId, qty }));
  };

  const checkout = async () => {
    if (!user) return null;
    const res = await req.post('/cart/checkout', { userId: user.userId });
    if (res.data?.errorCode !== '000000') {
      toast.error(res.data?.errorDescription || 'We could not place your order.');
      return null;
    }
    setItems([]);
    toast.success(res.data.errorDescription);
    return res.data.Data;
  };

  const value = useMemo(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + Number(i.price) * i.qty, 0);
    const delivery = !items.length || subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY;
    return { user, items, count, subtotal, delivery, total: subtotal + delivery, add, setQty, checkout, refresh };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, items, refresh]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);

export const euro = (n) => `€${Number(n).toFixed(2)}`;
