require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())


morgan.token('post-data', (req, res) => {
    return req.method === "POST" ? JSON.stringify(req.body) : null
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))


app.get('/info', (req, res, next) => {
    date = new Date()
    Person.countDocuments()
        .then(count => {
            res.send(`Phonebook has info for ${count} people <br />\n${date.toString()}`)
        })
        .catch(error => next(error))
})

app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then(persons => res.json(persons))
        .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person)
                res.json(person)
            else res.status(404).end()
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person
        .findByIdAndDelete(req.params.id)
        .then(() => res.status(204).end())
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const name = req.body.name
    const number = req.body.number

    if (!name || !number) {
        return res.status(400).json({error: 'name or number is missing'})
    }
    
    Person.find({name})
        .then(results => {
            if (results.length > 0) {
                return res.status(409).json({error: 'name already exists in the phonebook'})
            }

            const newPerson = new Person({name, number})
            return newPerson.save().then(() => {
                res.status(201).json(newPerson)
            })
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const person = {
        name: req.body.name,
        number: req.body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformed id' })
    }
    
    return res.status(500).send({ error: 'unknown error' })
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})