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

app.get('/api/product/:productId', (req, res) => {
    var found = false
    for (i = 0; i < productsJSON.length; i++) {
        if (productsJSON[i].productId == req.params.id) {
            found = true
            break
        }
    }

    if (found) { res.json(productsJSON[i]); return }
    res.status(404).json({ msg: "not found" })
})

app.post('/api', (req, res) => {
    res.send('Create a new product')
})

app.use(express.json())
app.post('/api/product', (req, res) => {
    productsJSON.push(req.body)
    res.json(req.body)
})

app.delete('/api', (req, res) => {
    res.send('Delete a product')
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