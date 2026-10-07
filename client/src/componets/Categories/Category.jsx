import React, { useEffect, useState } from 'react';
import './Category.css';
import IteamCard from '../IteamCard/IteamCard';
import req from '../../Axios/Axios';

function Category({ onAdd }) {
  // The chosen category; null shows every product
  const [selected, setSelected] = useState(null);
  const choose = (item) => {
    setSelected(selected?.id === item.id ? null : item); // tap again: show all
  };
  // The category cards come from the categories table: { id, name, tagline, img, color }
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    req.get('/products/getcategories').then((res) => {
      if (Array.isArray(res.data?.Data)) setCategories(res.data.Data);
    });
  }, []);

  return (
    <div
      className="body cat-section"
    >
      <div className="cat-head">
        <h2>Categories</h2>
        <p>Choose a category, then pick a can.</p>
      </div>
      <div className="containers">
        {categories.map((item, index) => (
          <div
            key={item.id}
            className={`box ${selected?.id === item.id ? 'chosen' : ''}`}
            data-color={`clr${index + 1}`}
            onClick={() => choose(item)}
            // onMouseLeave={() => setHoveredColor(null)}
          >
            <div className="imgBx">
              <img alt={item.name} src={item.img} />
            </div>
            <div className="glass">
              <h3>{item.name}<br /><span>{item.tagline}</span></h3>
            </div>
          </div>
        ))}
        <br />
        <div className="cat-filter">
          <span>{selected ? <>Showing <b>{selected.name}</b></> : 'Showing all drinks'}</span>
          {selected && <button type="button" onClick={() => setSelected(null)}>Show all</button>}
        </div>
        <IteamCard onAdd={onAdd} categoryId={selected?.id} />
      </div>
    </div>
  );
}

export default Category;
