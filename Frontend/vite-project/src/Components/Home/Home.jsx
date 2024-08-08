import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import useStore from '../Store/Store';
import './Home.css';
import Category from '../Category/Category';

const Home = () => {
  const [auth, setAuth] = useState(false);
  const [data, setData] = useState([]);
  const [category, setCategory] = useState('');
  const [select, setSelect] = useState([]);
  const [state, setState] = useState(true);
  const [userName, setUserName] = useState('');

  const getProducts = useStore((store) => store.getProducts);
  const getCategory = useStore((store) => store.getCategory);
  const user = useStore((store) => store.user);


  useEffect(() => {
    if (user) {
      setUserName(user.decodedToken.Name); 
    }
  }, [user]);

  useEffect(() => {

    if (user && user.decodedToken.Role) {
      try {
     
        if (user.decodedToken.Role === 'Admin') {
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
        {userName && (
          <p>Welcome {userName}</p>
        )}
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
        <label htmlFor="category" className="form-label">Select Category</label>
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
