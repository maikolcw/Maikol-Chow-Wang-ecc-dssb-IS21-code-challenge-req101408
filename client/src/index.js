import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios'
import Product from './Components/Product';
import CreateModal from './Components/CreateModal';
import EditModal from './Components/EditModal';
import './index.css';



function Main() {
  // state that holds the array of product objects
  const [products, setProducts] = useState([])
  // helper state to govern modal open/close state
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  // the active product that we want to edit
  const [editProduct, setEditProduct] = useState({});
  // helper state to tell when to refresh fetching all products from server
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3000/api/products')
      .then(res => res.data)
      .then(data => {
        setProducts(data);
      })
      .catch(error => {
        alert(`There was an error! ${error.message}`);
      });
  }, [refresh])

  return (
    <>
      <CreateModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        refresh={refresh}
        setRefresh={setRefresh}
        products={products}
      />
      <EditModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        product={editProduct}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      {/* Opens the create product modal */}
      <button onClick={() => {
        setOpenCreateModal(true)
      }
      } className='h-11 px-2 m-2 border-none bg-gray-300 hover:bg-black hover:text-white text-black rounded-lg text-xl cursor-pointer'>
        Add new product
      </button>
      <h1>Total number of products: {products.length}</h1>
      <table className='table-auto'>
        <thead>
          <tr>
            <th className='border-2'>Product Number</th>
            <th className='border-2'>Product Name</th>
            <th className='border-2'>Scrum Master</th>
            <th className='border-2'>Product Owner</th>
            <th className='border-2'>Developer Names</th>
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
                <Product key={index} product={product} setOpenEditModal={setOpenEditModal} setEditProduct={setEditProduct}/>
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
