import express from 'express'
import bodyParser from 'body-parser'

// import sequelize connector and User and Todo models instances
// import { sequelize, User, Todo } from './models/db.js'
import { sequelize, User, Todo } from './models/db.js'

// Test if database connection is OK else exit
try {
    await sequelize.authenticate() // try to authentificate on the database
    console.log('Connection has been established successfully.')
    await User.sync({ alter: true }) // modify users table schema is something changed
    await Todo.sync({ alter: true }) // same for todos table
} catch (error) {
    console.error('Unable to connect to the database:', error)
    process.exit(1)
}

// Local network configuration
const IP = '127.0.0.1'
const PORT = 7777

const app = express()

// A middle for checking if an api key is provided by the user
// in the Authorization header
const getApiKey = async (req, res, next) => {
    const key = req.headers.authorization
    if (!key) {
        res.status(403).json({ code: 403, data: 'No api token' })
    } else {
        next()
    }
}

// A middleware for checking if an api token is valid
// and is still active.
const validateApiKey = async (req, res, next) => {
    const key = req.headers.authorization
    try {
        const user = await User.findAll({
            where: { api_key: key },
        })
        // check if empty results then not found
        if (user.length === 0) {
            res.status(403).json({ code: 403, data: 'Invalid api token' })
        } else if (!user[0].active) {
            res.status(403).json({
                code: 403,
                data: 'You are in our blacklist, adios',
            })
        } else {
            next()
        }
    } catch (e) {
        res.status(500).json({ code: 500, data: 'Internal server error' })
    }
}

// A middleware for getting user information based on api_key
// the user's information will be attached to the req object
const getUserByApiKey = async (req, res, next) => {
    const key = req.headers.authorization
    try {
        const user = await User.findAll({
            attributes: ['id', 'name', 'api_key'],
            where: { api_key: key },
        })
        req.user = user[0]
        next()
    } catch (e) {
        res.status(500).json({ code: 500, data: 'Internal server error' })
    }
}

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
})
app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: false })) // to support URL-encoded bodies

// Ajouter un utilisateur à la table "users"
app.post('/register', async (req, res) => {
    //check name n'et pas null.
    const name = req.body.name
    try {
        const user = await User.create({ name: name })
        res.json({ code: 200, data: user })
    } catch (e) {
        res.status(500).json({ code: 500, data: 'Internal server error' })
    }
})

// Ajouter une tâche à la table "todos"
app.post('/create', async (req, res) => {
    // const ownerId = req.user.id
    const task = req.body.task
    try {
        const todo = await Todo.create({
            /*owner_id: ownerId,*/
            task: task,
        })
        res.status(200).json({ code: 200, data: todo })
    } catch (e) {
        res.status(500).json({ code: 500, data: e })
    }
})

//task delete

app.post('/delete/:task', async (req, res) => {
    const task = req.params.task
    try {
        await Todo.destroy({
            where: { task: task },
        })
        res.status(200).json({
            code: 200,
            data: task,
        })
    } catch (e) {
        res.status(500).json({
            code: 500,
            data: 'Internal server error',
        })
    }
})

//app.use(getApiKey)
//app.use(validateApiKey)
//app.use(getUserByApiKey)

// Show todos
app.get('/todos', async (req, res) => {
    try {
        const todo = await Todo.findAll({ attributes: ['task', 'done'] })
        res.json({ code: 200, data: todo })
    } catch (e) {
        res.status(500).json({ code: 500, data: '' })
    }
})

// GET user by id
app.get('/id/:id', async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findAll({
            attributes: ['name'],
            where: { id: id },
        })
        if (user.length === 0) {
            res.status(404).json({ code: 404, data: 'user not found' })
        } else {
            res.json({ code: 200, data: user })
        }
    } catch (e) {
        res.status(500).json({ code: 500, data: e })
    }
})

// GET user by name
app.get('/name/:name', async (req, res) => {
    const name = req.params.name
    try {
        const user = await User.findAll({
            attributes: ['name'],
            where: { name: name },
        })
        if (user.length === 0) {
            res.status(404).json({ code: 404, data: 'user not found' })
        } else {
            res.json({ code: 200, data: user })
        }
    } catch (e) {
        res.status(500).json({ code: 500, data: 'Internal server error' })
    }
})

// GET all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['name', 'id'],
        })
        if (users.length === 0) {
            res.status(404).json({ code: 404, data: 'users not found' })
        } else {
            res.json({ code: 200, data: users })
        }
    } catch (e) {
        res.status(500).json({ code: 500, data: 'Internal server error' })
    }
})

// Start express server
app.listen(PORT, IP, () => {
    console.log(`listening on ${IP}:${PORT}`)
})
