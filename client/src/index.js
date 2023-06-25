import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios'
import Product from './Components/Product';
import './index.css';



function Main() {
  // state that hold the vanilla array of product objects
  const [products, setProducts] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3000/api/products')
      .then(res => res.data)
      .then(data => {
        setProducts(data);
      })
      .catch(error => {
        alert(`There was an error! ${error.message}`);
      });
  }, [])

  return (
    <>
      <table className='table-auto'>
        <thead>
          <tr>
            <th className='border-2'>Product ID</th>
            <th className='border-2'>Product Name</th>
            <th className='border-2'>Product Owner Name</th>
            <th className='border-2'>Developers</th>
            <th className='border-2'>Scrum Master Name</th>
            <th className='border-2'>Start Date</th>
            <th className='border-2'>Methodology</th>
            <th className='border-2'>Location</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            products.map((product, index) => {
              return (
                <Product key={index} product={product} />
              )
            })
          }
        </tbody>
      </table>
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Main />
);
