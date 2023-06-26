import React, { useEffect, useState } from 'react';
import axios from 'axios';

// This component houses all the UI and logic to create a new product
function CreateModal({ open, onClose, refresh, setRefresh, products }) {
    // state that holds all attributes of a product
    const [inputs, setInputs] = useState({});
    // helper states to store validation error messages
    const [productNameError, setProductNameError] = useState(null);
    const [productOwnerNameError, setProductOwnerNameError] = useState(null);
    const [developersError, setDevelopersError] = useState(null);
    const [scrumMasterNameError, setScrumMasterNameError] = useState(null);
    const [startDateError, setStartDateError] = useState(null);
    const [methodologyError, setMethodologyError] = useState(null);
    const [locationError, setLocationError] = useState(null);

    // Set initial values to null so next product creation starts clean
    useEffect(() => {
        function setInputsWithInitialProductValues() {
            setInputs({
                'productName': null,
                'productOwnerName': null,
                'Developers': null,
                'scrumMasterName': null,
                'startDate': null,
                'methodology': null,
                'location': null,
            })
        }
        setInputsWithInitialProductValues()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // helper function to clean previous validation messages and close modal
    function clearValidationMessagesAndCloseCreateModal() {
        setProductNameError(null);
        setProductOwnerNameError(null);
        setDevelopersError(null);
        setScrumMasterNameError(null);
        setStartDateError(null);
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
    // Regex check for valid start date, must be between 1950-2035, in YYYY/MM/DD format
    function isValidStartDate(text) {
        return /^(19[5-9][0-9]|20[0-2][0-9]|20[3][0-5])\/([0][1-9]|[1][0-2])\/([0][1-9]|[1-2][0-9]|[3][0-1])$/.test(text);
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
    // Generates a 24 digit UUID and checks if it already exists, if not return the new UUID
    function generateNonDuplicate24DigitUUID() {
        let counter = 1;
        let twentyFourDigitUUID = '';
        while (counter > 0) {
            counter = 0;
            twentyFourDigitUUID = '';
            for (let j = 0; j < 8; j++) {
                let randomNumber = (Math.random() * 46656) | 0;
                randomNumber = ("000" + randomNumber.toString(36)).slice(-3);
                twentyFourDigitUUID += randomNumber;
            }
            // eslint-disable-next-line
            products.forEach(product => {
                // eslint-disable-next-line
                if (product.productId == twentyFourDigitUUID) {
                    counter += 1;
                }
            });
        }
        return twentyFourDigitUUID;
    }
    // Helper handler to record all input changes
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        if (name === 'Developers') {
            setInputs(values => ({ ...values, [name]: value.split(",") }))
        } else {
            setInputs(values => ({ ...values, [name]: value }))
        }
    }
    // Validates inputs and makes a POST request to backend
    const handleSubmit = async (event) => {
        event.preventDefault();
        setProductNameError(null);
        setProductOwnerNameError(null);
        setDevelopersError(null);
        setScrumMasterNameError(null);
        setStartDateError(null);
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
        if (!isValidStartDate(inputs.startDate)) {
            setStartDateError("Start date must be between 1950 to 2035, in YYYY/MM/DD")
        }
        if (!isValidMethodology(inputs.methodology)) {
            setMethodologyError("Methodology must be either Agile or Waterfall")
        }
        if (!isValidBCGovLink(inputs.location)) {
            setLocationError("Location must be a BC Gov Github repository link")
        }
        if (isValidProductName(inputs.productName) && isValidFullName(inputs.productOwnerName) && isValidDevelopers(inputs.Developers)
            && isValidFullName(inputs.scrumMasterName) && isValidStartDate(inputs.startDate) && isValidMethodology(inputs.methodology)
            && isValidBCGovLink(inputs.location)) {
            var newProductId = generateNonDuplicate24DigitUUID();
            const reqBody = {
                productId: newProductId,
                productName: inputs.productName,
                productOwnerName: inputs.productOwnerName,
                Developers: inputs.Developers,
                scrumMasterName: inputs.scrumMasterName,
                startDate: inputs.startDate,
                methodology: inputs.methodology,
                location: inputs.location
            };
            await axios.post(`http://localhost:3000/api/product`, reqBody)
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
        <div onClick={clearValidationMessagesAndCloseCreateModal} className='fixed flex bg-black/50 w-full h-full z-10 top-[0%] left-[0%]'>
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
                                    placeholder='PRODUCT'
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
                                    placeholder='Firstname Lastname'
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
                                placeholder='Firstname Lastname(,Firstname Lastname) // 5 total'
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
                                placeholder='Firstname Lastname'
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className='flex justify-evenly mb-2'>
                        <div className='px-3'>
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Start Date:
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    type="text"
                                    name="startDate"
                                    placeholder='YYYY/MM/DD'
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <div className='px-3'>
                            <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name'>Methodology:
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    type="text"
                                    name="methodology"
                                    placeholder='Agile or Waterfall'
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                    </div>
                    <div className='flex justify-evenly mb-2'>
                        <div className='px-3'>
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Start Date:
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    type="text"
                                    name="location"
                                    placeholder='https://github.com/bcgov/...'
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button className='w-36 h-11 m-2 border-none bg-gray-300 hover:bg-black hover:text-white text-black rounded-lg text-xl cursor-pointer'
                            onClick={clearValidationMessagesAndCloseCreateModal}
                        >
                            Cancel
                        </button>
                        <input className='w-36 h-11 m-2 border-none bg-gray-300 hover:bg-black hover:text-white text-black rounded-lg text-xl cursor-pointer'
                            value='Save'
                            type="submit" />
                    </div>
                    {/* Validation messages */}
                    {productNameError && <h2 className='text-red-300'>{productNameError}</h2>}
                    {productOwnerNameError && <h2 className='text-red-300'>{productOwnerNameError}</h2>}
                    {developersError && <h2 className='text-red-300'>{developersError}</h2>}
                    {scrumMasterNameError && <h2 className='text-red-300'>{scrumMasterNameError}</h2>}
                    {startDateError && <h2 className='text-red-300'>{startDateError}</h2>}
                    {methodologyError && <h2 className='text-red-300'>{methodologyError}</h2>}
                    {locationError && <h2 className='text-red-300'>{locationError}</h2>}
                </form>
            </div>
        </div>
    );
}

export default CreateModal