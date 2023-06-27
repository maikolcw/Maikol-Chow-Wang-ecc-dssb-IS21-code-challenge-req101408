import React from 'react'
import GitHub from '../Images/github.png'
import Pen from '../Images/pen.png'

// A component that renders all product attributes, along with edit button
function Product({ product, setOpenEditModal, setEditProduct, isWindowSize1024 }) {
    if (isWindowSize1024) {
        return (
            <tr>
                <td className='border-2 text-center'>{product.productId}</td>
                <td className='border-2 text-center'>{product.productName}</td>
                <td className='border-2 text-center'>{product.scrumMasterName}</td>
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
                <td className='border-2 text-center'>{product.startDate}</td>
                <td className='border-2 text-center'>{product.methodology}</td>
                <td className='border-2 text-center'>
                    <a href={product.location} className='flex justify-center'>
                        <img src={GitHub} alt="Github Link" className='w-[25px]' title={product.location} />
                    </a>
                </td>
                <td className='border-2 text-center'>
                    {/* Sets the product state to the current product and opens the edit product modal */}
                    <button onClick={() => {
                        setEditProduct(product)
                        setOpenEditModal(true)
                    }
                    }>
                        <img src={Pen} alt="Edit" className='w-[25px]' />
                    </button>
                </td>
            </tr>
        )
    } else {
        return <div className='flex flex-col w-full'>
            <div className='flex flex-row'>
                <div className='border-2 font-bold px-3 w-40'>Product Number</div>
                <div className='border-2 px-3 w-64 sm:w-2/3 text-center'>{product.productId}</div>
            </div>
            <div className='flex flex-row'>
                <div className='border-2 font-bold px-3 w-40'>Product Name</div>
                <div className='border-2 px-3 w-64 sm:w-2/3 text-center'>{product.productName}</div>
            </div>
            <div className='flex flex-row'>
                <div className='border-2 font-bold px-3 w-40'>Scrum Master</div>
                <div className='border-2 px-3 w-64 sm:w-2/3 text-center'>{product.scrumMasterName}</div>
            </div>
            <div className='flex flex-row'>
                <div className='border-2 font-bold px-3 w-40'>Product Owner</div>
                <div className='border-2 px-3 w-64 sm:w-2/3 text-center'>{product.productOwnerName}</div>
            </div>
            <div className='flex flex-row'>
                <div className='border-2 font-bold px-3 w-40'>Developer Names</div>
                <div className='border-2 px-3 w-64 sm:w-2/3 text-center'>
                    {
                        product.Developers.map((developer, index) => {
                            return (
                                <div key={index} >{index + 1}. {developer}</div>
                            )
                        })
                    }
                </div>
            </div>
            <div className='flex flex-row'>
                <div className='border-2 font-bold px-3 w-40'>Start Date</div>
                <div className='border-2 px-3 w-64 sm:w-2/3 text-center'>{product.startDate}</div>
            </div>
            <div className='flex flex-row'>
                <div className='border-2 font-bold px-3 w-40'>Methodology</div>
                <div className='border-2 px-3 w-64 sm:w-2/3 text-center'>{product.methodology}</div>
            </div>
            <div className='flex flex-row mb-2'>
                <div className='border-2 font-bold px-3 w-40'>Location</div>
                <div className='flex flex-row border-2 w-64 sm:w-2/3 justify-evenly'>
                    <div className='flex border-r-2 w-1/2 justify-center'>
                        <a href={product.location}>
                            <img src={GitHub} alt="Github Link" className='w-[25px]' title={product.location} />
                        </a>
                    </div>
                    <div className='flex border-l-2 w-1/2 justify-center'>
                        {/* Sets the product state to the current product and opens the edit product modal */}
                        <button onClick={() => {
                            setEditProduct(product)
                            setOpenEditModal(true)
                        }
                        }>
                            <img src={Pen} alt="Edit" className='w-[25px]' />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    }
}

export default Product