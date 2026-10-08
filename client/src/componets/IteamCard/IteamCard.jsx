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
  // Phones and tablets (under 992px) use a grid instead.
  const boxRef = useRef(null)
  const [perRow, setPerRow] = useState(0)
  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const measure = () => {
      if (window.innerWidth < 992) {
        setPerRow(0)
        return
      }
      const CARD = 300, OPEN_EXTRA = 260, GAP = 20
      setPerRow(Math.max(1, Math.floor((el.clientWidth - OPEN_EXTRA + GAP) / (CARD + GAP))))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Phones: the opened drink's details slide up as a sheet over the page, so the cans never move.
  // The page behind it doesn't scroll while the sheet is open; Escape closes it.
  const sheetOpen = !perRow && activeToggel !== null && !!products[activeToggel]
  useEffect(() => {
    if (!sheetOpen) return
    const close = (e) => { if (e.key === 'Escape') setActiveToggle(null) }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', close)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', close) }
  }, [sheetOpen])

  const toggle = (i) => setActiveToggle(prev => (prev === i ? null : i))

  const card = (item, i, { detail = false } = {}) => {
    const open = activeToggel === i
    const cls = detail ? 'card active detail' : `card ${open ? (perRow ? 'active' : 'chosen') : ''}`
    return (
      <div key={detail ? `detail-${item.productId}` : item.productId}
        style={{ '--c': item.color }} className={cls} onClick={detail ? undefined : () => toggle(i)}>
        <div className="circle"> </div>
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
          <div className='buy' onClick={(e) => e.stopPropagation()}>
            <span className='price'>€{Number(item.price).toFixed(2)}<small>/ 330 ml</small></span>
            <AddToCart onAdd={() => onAdd?.(item)} />
          </div>
        </div>
        <img src={item.img} alt={item.name} />
        <div className='label'>
          <b>{item.name}</b>
          <span>€{Number(item.price).toFixed(2)}</span>
        </div>
      </div>
    )
  }

  // Desktop: rows of cards, one of which can open in place
  if (perRow) {
    const rows = []
    for (let r = 0; r < products.length; r += perRow) rows.push(products.slice(r, r + perRow).map((p, k) => [p, r + k]))
    return (
      <div className={`cardboady ${fading ? 'fading' : ''}`} ref={boxRef}>
        {rows.map((row, r) => (
          <div className='card-row' key={r}>{row.map(([item, i]) => card(item, i))}</div>
        ))}
      </div>
    )
  }

  // Phones and tablets: a grid of cans; the chosen one opens in a sheet from the bottom
  return (
    <>
      <div className={`cardboady ${fading ? 'fading' : ''}`} ref={boxRef}>
        {products.map((item, i) => card(item, i))}
      </div>
      {sheetOpen && (
        <div className='sheet' onClick={() => setActiveToggle(null)}>
          <div className='sheet-panel' onClick={(e) => e.stopPropagation()}>
            <button type='button' className='sheet-close' aria-label='Close' onClick={() => setActiveToggle(null)}>✕</button>
            {card(products[activeToggel], activeToggel, { detail: true })}
          </div>
        </div>
      )}
    </>
  )
}

export default IteamCard