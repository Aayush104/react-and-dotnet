import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import useStore from '../Store/Store';
import './Home.css';
import Category from '../Category/Category'; 

const Home = () => {
  const [auth, setAuth] = useState(false);
  const getProducts = useStore((store) => store.getProducts);
  const [data, setData] = useState([]);
  const [category, setCategory] = useState('');
  const [select, setSelect] = useState([]);
  const [state, setState] = useState(true);

  const getCategory = useStore((store) => store.getCategory);

  useEffect(() => {
    const token = Cookies.get('Token');
    if (token) {
      try {
        const decodeToken = JSON.parse(atob(token.split('.')[1]));
        const userRole = decodeToken.Role;
        if (userRole === 'Admin') {
          setAuth(true);
        }

        const fetchData = async () => {
          const result = await getProducts();
          if (result) {
            console.log('Products', result);
            setData(result);
          }
          const response = await getCategory();
          if (response) {
            setSelect(response);
          }
        };
        fetchData();
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, [getProducts, getCategory]);

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setCategory(selectedCategoryId);
    setState(true);
  };

  return (
    <div className="container">
      <div>
        {auth && (
          <div className="auth-buttons">
            <NavLink to="/AddProduct">
              <button>Add Products</button>
            </NavLink>

            <NavLink to="/AddCategory">
              <button>Add Category</button>
            </NavLink>
          </div>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="category" className="form-label">select category</label>
        <select
          id="category"
          className="form-input"
          value={category}
          onChange={handleCategoryChange}
        >
          <option value="">All products</option>
          {select.map((e) => (
            <option key={e.cid} value={e.cid}>
              {e.cname}
            </option>
          ))}
        </select>
      </div>

      {category ? (
        <Category categoryId={category} />
      ) : (
        <>
          <h2>All Products</h2>
          <div className='card'>
            {data && data.map((e) => (
              <div className="product-card" key={e.pid}>
                <img src={e.pimage} className="product-image" alt={e.pname} />
                <p>{e.pname}</p>
                <p>{e.pdescription}</p>
                <p>{e.price}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
