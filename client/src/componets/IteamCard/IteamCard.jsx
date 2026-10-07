import { useEffect, useRef, useState } from 'react'
import './IteamCard.css'
// import { Link } from 'react-router-dom'
import AddToCart from '../AddToCart/AddToCart'
import req from '../../Axios/Axios'
function IteamCard({ onAdd, categoryId }) {
  const [activeToggel, setActiveToggle] = useState(false)
  // The product cards come from the products table: { productId, name, disp, img }
  const [products, setProducts] = useState([])

  // load the products for the chosen category (all of them when none is chosen)
  const [fading, setFading] = useState(false)
  useEffect(() => {
    let live = true
    setFading(true)
    setActiveToggle(null)
    req.get('/products/getproducts', { params: categoryId ? { categoryId } : {} }).then((res) => {
      if (!live) return
      if (Array.isArray(res.data?.Data)) setProducts(res.data.Data)
      setFading(false)
    })
    return () => { live = false }
  }, [categoryId])

  // How many cards fit in a row while leaving room for one of them to open (300px -> 560px).
  // Phones (under 992px) keep the single column.
  const boxRef = useRef(null)
  const [perRow, setPerRow] = useState(0)
  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const measure = () => {
      if (window.innerWidth < 992) return setPerRow(0)
      const CARD = 300, OPEN_EXTRA = 260, GAP = 20
      setPerRow(Math.max(1, Math.floor((el.clientWidth - OPEN_EXTRA + GAP) / (CARD + GAP))))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const rows = []
  if (perRow) for (let r = 0; r < products.length; r += perRow) rows.push(products.slice(r, r + perRow).map((p, k) => [p, r + k]))
  else rows.push(products.map((p, k) => [p, k]))

  return (
    <div className={`cardboady ${fading ? 'fading' : ''}`} ref={boxRef}>
     {rows.map((row, r) => (
      <div className={perRow ? 'card-row' : 'card-row-off'} key={r}>
     {row.map(([item , i]) => (

       <div key={item.productId} style={{ '--c': item.color }} className = {`card ${activeToggel === i? 'active' : ''}`} onClick={() => setActiveToggle(prev => (prev === i ? null : i))} >
         <div className= "circle"  > </div>
        <div className='contents'>
          {item.tag && <span className='tag'>{item.tag}</span>}
          <h2>{item.name}</h2>
          <div className='rating'>
            <span className='stars' style={{ '--r': item.rating }} aria-label={`${item.rating} out of 5`} />
            <span>{Number(item.rating).toFixed(1)} · {item.reviews} reviews</span>
          </div>
          <p>{item.disp}</p>
          {item.notes && <p className='notes'><b>Tastes like</b> {item.notes}</p>}
          <ul className='facts'>
            <li><b>{item.calories}</b><span>kcal</span></li>
            <li><b>{Number(item.sugar)}g</b><span>sugar</span></li>
            <li><b>{item.caffeine}mg</b><span>caffeine</span></li>
          </ul>
          <div className='buy'>
            <span className='price'>€{Number(item.price).toFixed(2)}<small>/ 330 ml</small></span>
            <AddToCart onAdd={onAdd} />
          </div>
        </div>
        <img src= {item.img} alt={item.name} />
        <div className='label'>
          <b>{item.name}</b>
          <span>€{Number(item.price).toFixed(2)}</span>
        </div>

      </div>
      
     ) )}
      </div>
     ))}
    </div>
  )
}

export default IteamCard