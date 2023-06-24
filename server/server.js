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

app.get('/api', (req, res) => {
    res.send('API is healthy!')
})

app.get('/api/products', (req, res) => {
    res.json(productsJSON)
})

app.get('/api/product/:id', (req, res) => {
    var found = false
    for (i = 0; i < productsJSON.length; i++) {
        if (productsJSON[i].productId == req.params.id) {
            found = true
            break
        }
    }

    if (found) { res.json(productsJSON[i]); return }
    res.json({ msg: "not found" })
})

app.post('/api', (req, res) => {
    res.send('Create a new product')
})

app.put('/api', (req, res) => {
    res.send('Update a product')
})

app.delete('/api', (req, res) => {
    res.send('Delete a product')
})