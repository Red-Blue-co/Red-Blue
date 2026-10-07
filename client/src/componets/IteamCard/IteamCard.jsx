import { useEffect, useState } from 'react'
import './IteamCard.css'
// import { Link } from 'react-router-dom'
import AddToCart from '../AddToCart/AddToCart'
import req from '../../Axios/Axios'
function IteamCard({ onAdd }) {
  const [activeToggel, setActiveToggle] = useState(false)
  // The product cards come from the products table: { productId, name, disp, img }
  const [products, setProducts] = useState([])

  useEffect(() => {
    req.get('/products/getproducts').then((res) => {
      if (Array.isArray(res.data?.Data)) setProducts(res.data.Data)
    })
  }, [])

  return (
    <div className='cardboady'>
     {products.map((item , i ) => (

       <div key={item.productId} style={{ '--c': item.color }} className = {`card ${activeToggel === i? 'active' : ''}`} onClick={() => setActiveToggle(prev => (prev === i ? null : i))} >
         <div className= "circle"  > </div>
        <div className='contents'>
          <h2>{item.name}</h2>
          <span className='price'>€{Number(item.price).toFixed(2)}</span>
          <p>{item.disp}</p>
          <AddToCart onAdd={onAdd} />
        </div>
        <img src= {item.img} alt={item.name} />

      </div>
      
     ) )}
    </div>
  )
}

export default IteamCard