const express = require('express')
const { writeFile, readFile } = require('fs')
const util = require('util')
const writeFileAsync = util.promisify(writeFile)
const readFileAsync = util.promisify(readFile)

const app = express()
const port = 3000
// holds the products info from data.json in memory for manipulation
var productsJSON = []

app.listen(port, async () => {
    try {
        productsJSON = await readFileAsync('./data.json', 'utf-8')
        if (!productsJSON) {
            console.log("Could not read the file");
            return
        }
        productsJSON = JSON.parse(productsJSON)
    } catch (error) {
        console.log(error);
    }
    console.log(`Example app listening on port ${port} and is ready to go`)
}
)

// check health route
app.get('/api', (req, res) => {
    res.status(200).json({ msg: "API is healthy!" })
})

// grabs all products
app.get('/api/products', (req, res) => {
    res.status(200).json(productsJSON)
})

// used for testing post/put/delete routes
app.get('/api/product/:productId', (req, res) => {
    var found = false
    if (!isValidProductId(req.params.productId)) {
        res.status(400).json({ msg: "Bad Request" })
        return
    }
    for (i = 0; i < productsJSON.length; i++) {
        if (productsJSON[i].productId == req.params.productId) {
            found = true
            break
        }
    }

    if (found) {
        res.status(200).json(productsJSON[i])
    } else {
        res.status(404).json({ msg: "Not Found" })
    }
})

app.use(express.json())
// post a new product
app.post('/api/product', (req, res) => {
    if (isValidRequestBody(req.body)) {
        productsJSON.unshift(req.body)
        res.status(201).json({ msg: "Successfully created" })
    } else {
        res.status(400).json({ msg: "Bad Request" })
    }
})

// replace a product by productId, must provide all proper attributes of a product object in request body
app.put('/api/product/:productId', (req, res) => {
    var found = false
    if (!isValidProductId(req.params.productId)) {
        res.status(400).json({ msg: "Bad Request" })
        return
    }
    if (!isValidRequestBody(req.body)) {
        res.status(400).json({ msg: "Bad Request" })
        return
    }
    for (i = 0; i < productsJSON.length; i++) {
        if (productsJSON[i].productId == req.params.productId) {
            found = true
            break
        }
    }
    if (found) {
        productsJSON = productsJSON.map(product => {
            if (product.productId == req.body.productId) {
                return req.body
            } else {
                return product
            }
        })
        res.status(200).json({ msg: "Successfully updated" })
    } else {
        res.status(404).json({ msg: "Not Found" })
    }
})

// delete a product by productId
app.delete('/api/product/:productId', (req, res) => {
    var found = false
    if (!isValidProductId(req.params.productId)) {
        res.status(400).json({ msg: "Bad Request" })
        return
    }
    for (i = 0; i < productsJSON.length; i++) {
        if (productsJSON[i].productId == req.params.productId) {
            found = true
            break
        }
    }
    if (found) {
        productsJSON = productsJSON.filter(product => product.productId != req.params.productId);
        res.status(200).json({ msg: "Successfully deleted" })
    } else {
        res.status(404).json({ msg: "Not Found" })
    }
})

// Backend verification of request body
// Regex check for valid product id, must be 23-24 characters of letters and numbers only
function isValidProductId(text) {
    return /^[a-zA-Z0-9]{23,24}$/.test(text);
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
function isValidDevelopers(text) {
    return /^[A-Z][a-z]*\s[A-Z][a-z]*([,][A-Z][a-z]*\s[A-Z][a-z]*)*$/.test(text);
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
// Main function to test all attributes of Product object is valid
function isValidRequestBody(requestBody) {
    if (isValidProductId(requestBody.productId) && isValidProductName(requestBody.productName) && isValidFullName(requestBody.productOwnerName)
        && isValidDevelopers(requestBody.Developers.toString()) && isValidFullName(requestBody.scrumMasterName) && isValidStartDate(requestBody.startDate)
        && isValidMethodology(requestBody.methodology) && isValidBCGovLink(requestBody.location)) {
        return true;
    } else {
        return false;
    }
}