import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';


function Main() {

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
          
        </tbody>
      </table>
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Main />
);
