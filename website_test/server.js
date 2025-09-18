
//URL -> http://localhost:3000
const express = require('express')
const app = express()
const PORT = 3000

let data = ['shaun']
//middleware
app.use(express.json())

app.get('/', (req, res) => {
    console.log('user request home page website')
    res.send(`
        <body
        style="background:green;
        color:blue;">
        <h1>DATA:</h1>
            <p>${JSON.stringify(data)}</p>
            <a href="/test">Test</a>
            </body>
            <script>console.log('test script')</script>
        `)
})

app.get('/test', (req, res) => {

    //console.log('/test endpoint')
    res.send(`
        <body>
        

        <h1>test</h1>
        <a href="/">Home</a>
        </body>
        `)
})

app.get('/api/data', (req, res) => {

    //console.log('data test')
    res.send(data)
})

app.post('/api/data', (req, res) => {

    const newEntry = req.body
    console.log(newEntry)
    data.push(newEntry.name)
    res.sendStatus(201)
})

app.delete('/api/data', (req,res) => {

    data.pop()
    console.log('Deleted last element of array')
    res.sendStatus(203)
})

app.listen(PORT, () => console.log(`Server has started on: ${PORT}`))