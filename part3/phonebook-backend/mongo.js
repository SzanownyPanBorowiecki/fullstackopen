const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('usage: node mongo.js password <name> <number> - add person to database')
    console.log('If name or number empty - display all entries')
    process.exit(1)
}

const password = process.argv[2]

const url = 
    `mongodb+srv://miszczu:${password}@cluster0.hozx9nz.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
})

const Person = mongoose.model('Person', personSchema, 'persons') // Isn't auto-pluralising a bit wasteful?


if (process.argv.length < 5) {
    // view all entries
    console.log('phonebook:')

    Person.find({}).then(persons => {
        persons.forEach((person) => {
            console.log(`${person.name} ${person.number}`)            
        })
        mongoose.connection.close()
    })
} else {
    const name = process.argv[3]
    const number = process.argv[4]
    
    const person = new Person({
        name, number
    })
    
    person.save().then(result => {
            console.log(`added ${name} number ${number} to phonebook`)
            mongoose.connection.close()
        })   
}