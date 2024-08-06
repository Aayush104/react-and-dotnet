import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Category = ({ categoryId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://localhost:7252/api/Product/Categories/${categoryId}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };

    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  return (
    <div className='card'>
      {data.length > 0 ? (
        data.map((e) => (
          <div className="product-card" key={e.pid}>
            <img src={e.pimage} className="product-image" alt={e.pname} />
            <p>{e.pname}</p>
            <p>{e.pdescription}</p>
            <p>{e.price}</p>
          </div>
        ))
      ) : (
        <p>No products found in this category.</p>
      )}
    </div>
  );
};

export default Category;
