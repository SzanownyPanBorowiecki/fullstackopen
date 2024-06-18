require('dotenv').config()

const express = require('express')
const cors = require('cors')

const Note = require('./models/note')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist')
)
// app.use((req, resp, next) => {
//     console.log(req.headers)
//     next()
// })

let notes = [
  { id: 1, content: "HTML is easy", important: true },
  { id: 2, content: "Browser can execute only JavaScript", important: false },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
]

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})


app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note)
    })
})


app.delete('/api/notes/:id', (request, response) => {
    Note.findByIdAndDelete(request.params.id).then(note => {
        response.status(204).end()
    })
})


const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    return maxId + 1
}


app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: Boolean(body.important) || false,
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
