import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

// register new user endpoint
// assign methods to router
router.post('/register', (req, res) => { 
    const { username, password } = req.body
    
    const hashedPassword = bcrypt.hashSync(password, 8)

    try {
        const insertUser = db.prepare(`INSERT INTO users (username, password) VALUES (?, ?)`)
        const result = insertUser.run(username, hashedPassword)

        //default todo
        const defaultTodo = 'Hi, Add your first todo!'
        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`)
        insertTodo.run(result.lastInsertRowid, defaultTodo)

        // create a token
        const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })

    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }


    //console.log(hashedPassword)
    //console.log(username, password)
    //res.sendStatus(201)
})

//logic to login a user when it reaches endpoint
router.post('/login', (req, res) => {
    // We get their email, and we look up the password associated with that email in the database
    // We get it back in the encrypted form, 
    // Which means we cannot compare the password with the one the user entered to login with
    // we can encrypt the entered password again and compare both encrypted strings

    const { username, password } = req.body

    try {
        const getUser = db.prepare(`SELECT * FROM users WHERE username = ?`)
        const user = getUser.get(username)

        //if we cannot find user associated with that username, return out from the function
        if (!user) { return res.status(404).send({ message: "User not found" }) }
        
        const passwordIsValid = bcrypt.compareSync(password, user.password)

        //if password does not match, return out of function 
        if (!passwordIsValid) { return res.status(401).send({ message: "Invalid password" }) }
        console.log(user)
        //sucessful auth
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {expiresIn: '24h'} )
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }

})

export default router