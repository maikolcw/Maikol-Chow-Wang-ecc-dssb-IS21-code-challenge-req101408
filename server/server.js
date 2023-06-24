const express = require('express')

const app = express()
const port = 3000

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
}
)

app.get('/api', (req, res) => {
    res.send('API is healthy!')
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