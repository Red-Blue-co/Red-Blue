import React, { useEffect, useState } from 'react';
import './Category.css';
import IteamCard from '../IteamCard/IteamCard';
import req from '../../Axios/Axios';

function Category() {
  const [hoveredColor, setHoveredColor] = useState(null);
  // The category cards come from the categories table: { id, name, tagline, img, color }
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    req.get('/products/getcategories').then((res) => {
      if (Array.isArray(res.data?.Data)) setCategories(res.data.Data);
    });
  }, []);

  return (
    <div
      className="body"
      style={{
        background: hoveredColor ? hoveredColor : "#fff",
        transition: "background 0.3s"
      }}
    >
      <div className="containers">
        {categories.map((item, index) => (
          <div
            key={item.id}
            className="box"
            data-color={`clr${index + 1}`}
            onClick={() => setHoveredColor(item.color)}
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
        <IteamCard />
      </div>
    </div>
  );
}

export default Category;
