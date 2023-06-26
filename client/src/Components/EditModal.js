import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Modal for editing an existing product
function EditModal({ open, onClose, product, refresh, setRefresh }) {
    // One state that covers all product values in an object data structure
    // Used for prefilling form and creating request body for API call
    const [inputs, setInputs] = useState({});
    // States that store the error messages from validation
    const [productNameError, setProductNameError] = useState(null);
    const [productOwnerNameError, setProductOwnerNameError] = useState(null);
    const [developersError, setDevelopersError] = useState(null);
    const [scrumMasterNameError, setScrumMasterNameError] = useState(null);
    const [methodologyError, setMethodologyError] = useState(null);
    const [locationError, setLocationError] = useState(null);
    // Sets up the inputs state values whenever modal first opens
    useEffect(() => {
        function setInputsWithInitialProductValues() {
            setInputs({
                'productName': product.productName,
                'productOwnerName': product.productOwnerName,
                'Developers': product.Developers,
                'scrumMasterName': product.scrumMasterName,
                'startDate': product.startDate,
                'methodology': product.methodology,
                'location': product.location
            })
        }
        setInputsWithInitialProductValues()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // Cleans up validation messages if any and closes the edit modal
    function clearValidationMessagesAndCloseEditModal() {
        setProductNameError(null);
        setProductOwnerNameError(null);
        setDevelopersError(null);
        setScrumMasterNameError(null);
        setMethodologyError(null);
        setLocationError(null);
        onClose();
    }
    // Regex check for valid product name, must be all capitals one word
    function isValidProductName(text) {
        return /^[A-Z]+$/.test(text);
    }
    // Regex check for valid full names, must have a first and last name each starting with a capital
    function isValidFullName(text) {
        return /^[A-Z][a-z]*\s[A-Z][a-z]*$/.test(text);
    }
    // Regex check for valid developers, must have at least one full name(first and last name) with first letter capitalizations
    // Subsequent full names must be seperated with a comma only
    // Max five full names
    function isValidDevelopers(value) {
        if (value == null) {
            return false;
        } else {
            var arrayToString = value.toString()
            if (value.length < 6 && /^[A-Z][a-z]*\s[A-Z][a-z]*([,][A-Z][a-z]*\s[A-Z][a-z]*)*$/.test(arrayToString)) {
                return true;
            } else {
                return false;
            }
        }
    }
    // Regex check for valid methodology, must either be exactly Agile or Waterfall
    function isValidMethodology(text) {
        return /^(Agile|Waterfall)$/.test(text);
    }
    // Regex check for valid BC Gov GitHub repo address - Must start off with https://github.com/bcgov/ and end with valid
    // Github repository name
    function isValidBCGovLink(text) {
        return /^https:\/\/github.com\/bcgov\/[a-zA-Z-_0-9]+(\w|-)*$/.test(text);
    }
    // one event listener to handle all input events and stores them in inputs state
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        if (name === 'Developers') {
            setInputs(values => ({ ...values, [name]: value.split(",") }))
        } else {
            setInputs(values => ({ ...values, [name]: value }))
        }
    }
    // form handle that cleans previous validations first, goes through all input checks, and if all inputs are valid
    // sends a PUT request to back end with request body of an object of a product
    const handleSubmit = async (event) => {
        event.preventDefault();
        setProductNameError(null);
        setProductOwnerNameError(null);
        setDevelopersError(null);
        setScrumMasterNameError(null);
        setMethodologyError(null);
        setLocationError(null);

        if (!isValidProductName(inputs.productName)) {
            setProductNameError("Product name must be one word all capitals")
        }
        if (!isValidFullName(inputs.productOwnerName)) {
            setProductOwnerNameError("Product owner name must start with a capital for first and last name only")
        }
        if (!isValidDevelopers(inputs.Developers)) {
            setDevelopersError("Developers must start with a capital for first and last name only, seperated by a comma only, max 5")
        }
        if (!isValidFullName(inputs.scrumMasterName)) {
            setScrumMasterNameError("Scrum master name must start with a capital for first and last name only")
        }
        if (!isValidMethodology(inputs.methodology)) {
            setMethodologyError("Methodology must be either Agile or Waterfall")
        }
        if (!isValidBCGovLink(inputs.location)) {
            setLocationError("Location must be a BC Gov Github repository link")
        }
        if (isValidProductName(inputs.productName) && isValidFullName(inputs.productOwnerName) && isValidDevelopers(inputs.Developers)
            && isValidFullName(inputs.scrumMasterName) && isValidMethodology(inputs.methodology) && isValidBCGovLink(inputs.location)) {
            const reqBody = {
                productId: product.productId,
                productName: inputs.productName,
                productOwnerName: inputs.productOwnerName,
                Developers: inputs.Developers,
                scrumMasterName: inputs.scrumMasterName,
                startDate: inputs.startDate,
                methodology: inputs.methodology,
                location: inputs.location
            };
            await axios.put(`http://localhost:3000/api/product/${product.productId}`, reqBody)
                // .then(response => console.log(response.data.msg))
                .catch(error => {
                    alert(`There was an error! ${error.message}`);
                });
            setRefresh(!refresh)
            onClose()
        }
    }

    if (!open) return null;
    return (
        /* 
        This outer div is the greyed out region of the modal that spans the entire screen.
        When user clicks on this region the modal is closed by setting state openEditModal to false.
        */
        <div onClick={clearValidationMessagesAndCloseEditModal} className='fixed flex bg-black/50 w-full h-full z-10 top-[0%] left-[0%]'>
            {/* Need this to close out child elements when clicking on grey region */}
            <div onClick={(e) => {
                e.stopPropagation();
            }}
                className="fixed justify-evenly w-full h-auto sm:max-w-[50%] top-[10%] sm:left-[25%] bg-[#ffffff] rounded-xl shadow-2xl shadow-slate-400 py-5 px-5">
                <form onSubmit={handleSubmit} className="w-full">
                    <div className='flex justify-evenly my-2'>
                        <div className='px-3'>
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Product Name:
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    type="text"
                                    name="productName"
                                    value={inputs.productName || ''}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <div className='px-3'>
                            <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name'>Product Owner Name:
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    type="text"
                                    name="productOwnerName"
                                    value={inputs.productOwnerName || ''}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                    </div>
                    <div className='px-3 mb-2'>
                        <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name'>Developers:
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                type="text"
                                name="Developers"
                                value={inputs.Developers || ''}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className='flex justify-center mb-2'>
                        <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name'>Scrum Master Name:
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                type="text"
                                name="scrumMasterName"
                                value={inputs.scrumMasterName || ''}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className='flex justify-evenly mb-2'>
                        <div className='px-3'>
                            <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name'>Methodology:
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    type="text"
                                    name="methodology"
                                    value={inputs.methodology || ''}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                    </div>
                    <div className='px-3 mb-2'>
                        <div className='px-3'>
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Location:
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    type="text"
                                    name="location"
                                    value={inputs.location || ''}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button className='w-36 h-11 m-2 border-none bg-gray-300 hover:bg-black hover:text-white text-black rounded-lg text-xl cursor-pointer'
                            onClick={clearValidationMessagesAndCloseEditModal}
                        >
                            Cancel
                        </button>
                        <input className='w-36 h-11 m-2 border-none bg-gray-300 hover:bg-black hover:text-white text-black rounded-lg text-xl cursor-pointer'
                            value='Edit'
                            type="submit" />
                    </div>
                    {/* Conditionals to display any validation messages when filling out the form */}
                    {productNameError && <h2 className='text-red-300'>{productNameError}</h2>}
                    {productOwnerNameError && <h2 className='text-red-300'>{productOwnerNameError}</h2>}
                    {developersError && <h2 className='text-red-300'>{developersError}</h2>}
                    {scrumMasterNameError && <h2 className='text-red-300'>{scrumMasterNameError}</h2>}
                    {methodologyError && <h2 className='text-red-300'>{methodologyError}</h2>}
                    {locationError && <h2 className='text-red-300'>{locationError}</h2>}
                </form>
            </div>
        </div>
    );
}

export default EditModal