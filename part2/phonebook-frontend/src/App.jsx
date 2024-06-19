import { useState, useEffect } from 'react'
import axios from 'axios'
import phonebookService from './services/phonebook.js'

const Filter = ({onChange, value}) => (
  <div>
    filter shown with <input onChange={onChange} value={value} />  
  </div>  
)

const PersonForm = ({onSubmit, onNameChange, onNumberChange, name, number}) => (
  <form onSubmit={onSubmit}>
    <div>
      name: <input onChange={onNameChange} value={name} />
    </div>
    <div>
      number: <input onChange={onNumberChange} value={number} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({persons, onPersonRemove}) => (
  <table>
      <thead><tr><td>Name</td><td>Number</td></tr></thead>
      <tbody>
        {persons.map((person) => 
          (
            <tr key={person.id}>
              <td>{person.name}</td>
              <td>{person.number}</td>
              <td><button onClick={() => onPersonRemove(person)}>delete</button></td>
            </tr>
          )
        )}
      </tbody>
    </table>
)

const Notification = ({notification}) => {
  if (notification === null) return null

  return (
    <div className={notification.type}>{notification.message}</div>
  )

}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationTimeout, setNotificationTimeout] = useState(null)

  // Download data from the server
  useEffect(() => {
    phonebookService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  // Hide notification after 5s
  useEffect(() => {
    if (notification) {
      clearTimeout(notificationTimeout)
      setNotificationTimeout(setTimeout(() => setNotification(null), 5000))
    }
  }, [notification])

  const handleSubmit = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(p => p.name.toLowerCase() == newName.toLowerCase())

    if (
      (existingPerson !== undefined)
      && confirm(`${existingPerson.name} is already added to phonebook, replace the old number with a new one?`)
    ) {
      const updatedPerson = {
        ...existingPerson,
        number: newNumber
      }

      phonebookService
        .update(existingPerson.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(
            persons.map(p => p.id !== returnedPerson.id ? p : returnedPerson)
          )
        })
        .catch(error => {
          setNotification({
            type: 'error', 
            message: error.response.data.error
          })
        })
    }
    else {
      const newPerson = {
        name: newName,
        number: newNumber
      }
  
      phonebookService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNotification({
            type: 'success', 
            message: `Added ${returnedPerson.name}`
          })
        })
        .catch(error => {
          setNotification({
            type: 'error',
            message: error.response.data.error
          })
        })
    }

    setNewName('')
    setNewNumber('')
  }

  const addPerson = (person) => {
    
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handlePersonRemove = (person) => {
    console.log('remove ', person)
    if (confirm(`Delete ${person.name} ?`)) {
      phonebookService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
        })
    }
  }

  const personsToShow = filter.length > 0 
    ? persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase())) 
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter onChange={handleFilterChange} value={filter} />

      <h2>Add a new</h2>
      <PersonForm onSubmit={handleSubmit} onNameChange={handleNameChange} onNumberChange={handleNumberChange} name={newName} number={newNumber} />

      <h2>Numbers</h2>
      <Persons persons={personsToShow} onPersonRemove={handlePersonRemove} />
    </div>
  )
}

export default App