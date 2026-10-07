import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import Category from '../Categories/Category';
import Footer from '../Footer/Footer';
import req from '../../Axios/Axios';

function Home() {
  // The hero slides come from the banner table: { name, img, color }
  const [banners, setBanners] = useState([]);
  const [activeClass, setActiveClass] = useState(0);
  const [activeToggel, setActiveToggle] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const activeIndex = banners[activeClass] || { name: '', img: '', color: '#fc4a55' };

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
        <div className="header">
          <Link to='#' className='logo'><span className='logo-red'>Red</span>·<span className='logo-blue'>Blue</span></Link>
          <div  className={`toggle ${activeToggel? 'active' : ''}`} onClick={() => setActiveToggle(prev => !prev)}> </div>
          <ul  className= {` navigation ${activeToggel ? 'active' : ''}`}> 
            <li className='nav-item'><Link to='#' className='active'>Home</Link></li>
            <li className='nav-item'><Link to='#'>Profile</Link></li>
            <li className='nav-item'><Link to='#' className='cart-link'>Cart <span className='cart-count'>{cartCount}</span></Link></li>
          </ul>
        </div>
        <div className='content'>
          <div className='textbox'>
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
      <Category onAdd={() => setCartCount((n) => n + 1)} />
      <Footer />
      
    </div>
  );
}

export default Home;
