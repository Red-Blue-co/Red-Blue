import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../CartContext';
import './Home.css';
import Category from '../Categories/Category';
import Footer from '../Footer/Footer';
import req from '../../Axios/Axios';

function Home() {
  // The hero slides come from the banner table: { name, img, color }
  const [banners, setBanners] = useState([]);
  const [activeClass, setActiveClass] = useState(0);
  const [activeToggel, setActiveToggle] = useState(false);
  // the header stays at the top; once the page scrolls it gets a solid background
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const nav = useNavigate();
  const { count: cartCount, add } = useCart();
  // add to the cart; with nobody signed in, go to sign in
  const addToCart = async (product) => { if (!(await add(product)) && !localStorage.getItem('twotone-user')) nav('/'); };
  const activeIndex = banners[activeClass] || { name: '', img: '', color: '#fc4a55' };

  // arriving from another page with #drinks: scroll down once the page has drawn
  useEffect(() => {
    if (window.location.hash !== '#drinks') return;
    const t = setTimeout(() => document.getElementById('drinks')?.scrollIntoView({ behavior: 'smooth' }), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    req.get('/products/getbanners').then((res) => {
      if (Array.isArray(res.data?.Data)) setBanners(res.data.Data);
    });
  }, []);

  useEffect(() => {
    if (!banners.length) return;
    const interval = setInterval(() => {
      setActiveClass((prev) => (prev + 1) % banners.length);
    }, 5000); // next slide every 5 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, [banners.length]);

  return (
    <div className='home' id='top'>
      <div className='section'>
        <div className='bg' style={{ background: activeIndex.color }}></div>
        <div className={`header ${scrolled ? 'scrolled' : ''}`}>
          <Link to='/home' className='logo'><img src='/img/brand/mark-lemon.svg' alt='' className='logo-mark' />Two Tone</Link>
          <div  className={`toggle ${activeToggel? 'active' : ''}`} onClick={() => setActiveToggle(prev => !prev)}> </div>
          <ul  className= {` navigation ${activeToggel ? 'active' : ''}`}> 
            <li className='nav-item'><Link to='/home' className='active'>Home</Link></li>
            <li className='nav-item'><Link to='/profile'>Profile</Link></li>
            <li className='nav-item'><Link to='/cart' className='cart-link'>Cart <span className='cart-count'>{cartCount}</span></Link></li>
          </ul>
        </div>
        <div className='content'>
          <div className='textbox'>
            <span className='kicker' key={activeIndex.name}>Now pouring · {activeIndex.name}</span>
            <h2>Welcome to our store</h2>
            <p>Discover the best products at unbeatable prices.</p>
            <a href='#drinks' className='btn'>Shop Now</a>
          </div>
          <div className='imgbox'>
            {activeIndex.img && <img key={activeIndex.img} src={activeIndex.img} alt={activeIndex.name} />}
          </div>
        </div>
        <ul className='thumb'>
          {banners.map((item, index) => (
            <li
              key={item.id}
              data-text={item.name}
              className={`${index === activeClass ? 'active' : ''}`}
              onClick={() => setActiveClass(index)}
            >
              <img src={item.img} alt={item.name} />
            </li>
          ))}
        </ul>
      </div>
      <Category onAdd={addToCart} />
      <Footer />
      
    </div>
  );
}

export default Home;
