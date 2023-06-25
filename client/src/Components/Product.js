import React from 'react'
import GitHub from '../Images/github.png'

// A component that renders all product attributes in the form of a row of a table, along with 
// edit and delete buttons
function Product({ product }) {
    return (
        <tr>
            <td className='border-2 text-center'>{product.productId}</td>
            <td className='border-2 text-center'>{product.productName}</td>
            <td className='border-2 text-center'>{product.productOwnerName}</td>
            <td className='border-2 text-center'>
                <div>
                    {
                        product.Developers.map((developer, index) => {
                            return (
                                <div key={index} >{index + 1}. {developer}</div>
                            )
                        })
                    }
                </div>
            </td>
            <td className='border-2 text-center'>{product.scrumMasterName}</td>
            <td className='border-2 text-center'>{product.startDate}</td>
            <td className='border-2 text-center'>{product.methodology}</td>
            <td className='border-2 text-center bg-red-100'>
                <a href={product.location} className='flex justify-center'>
                    <img src={GitHub} alt="Github Link" className='w-[25px]' title={product.location}/>
                </a>
            </td>
        </tr>
    )
}

export default Product