//Importing the express module
import express from 'express'

//Importing path libary, specfically destructured { dirname }
import path, { dirname } from 'path'

//Importing url libary, { fileURLToPath }
import { fileURLToPath } from 'url'

import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'


//Creating an Express application instance
const app = express()

//Creating port, using enviroment variable or port 5000 otherwise
const PORT = process.env.PORT || 5000

//Get the file path from the URL of the current module (navigate folder directory) 
const __filename = fileURLToPath(import.meta.url)

//Get the directory name from the file path
const __dirname = dirname(__filename)

//parse json
app.use(express.json())

//tells express that all files from /public folder are static
//configuring /public folder to be found up 1 level
app.use(express.static(path.join(__dirname, '../public')))

//Define endpoint '/' route for GET requests
app.get('/', (req, res) => {

    //Get HTML file from the /public directory
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

//routes
app.use('/auth', authRoutes)
app.use('/todos', authMiddleware, todoRoutes)

//Starts the server
app.listen(PORT, () => {
    console.log(`server has started on port: ${PORT}`)
})
