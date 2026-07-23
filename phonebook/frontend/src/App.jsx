import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const Person = ({person, deletePerson}) => {
  return (
    <div>
      {person.name} {person.number}
      <button onClick={deletePerson}>delete </button>
    </div>
  )
}

const Filter = ({value, handler}) => {
  return (
    <form>
      <div>
        filter shown with <input value={value} onChange={handler}/>
      </div>
    </form>
  )
}

const PersonForm = ({newName, nameHandler, newNumber, numberHandler, onSubmit}) => {
  return(
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={newName} onChange={nameHandler}/>
      </div>
      <div>
        number: <input value={newNumber} onChange={numberHandler}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({personsToShow, deletePerson}) => {
  return (
    <div>
        {personsToShow.map(person => <Person 
          person={person} 
          deletePerson={() => deletePerson(person.name, person.id)}
          key={person.id}/>
        )}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notifMessage, setNotifMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])


  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name.toLowerCase() === newName.toLowerCase())) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
          const person = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())
          const newPerson = {...person, number: newNumber }
          personService
            .update(person.id, newPerson)
            .then(returnedPerson => {
              setPersons(persons.map(p => p.id === person.id ? newPerson : p))
              setNewName('')
              setNewNumber('')
              setNotifMessage(
                `Changed number of ${newName}`
              )
              setTimeout(() => {
                setNotifMessage(null)
              }, 5000)
            })
            .catch(error => {
              setErrorMessage(
                `Information of ${newName} has already been removed from the server`
              )
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
            })
        }
    }
    else {
      const newPerson = {name: newName, number: newNumber, id: String(persons.length + 1)}
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setNotifMessage(
          `Added ${newName}`
          )
          setTimeout(() => {
            setNotifMessage(null)
          }, 5000)
        })
    }
  }

  const deletePerson = (name, id) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
      .remove(id)
      .then(returnedPerson => {
        setPersons(persons.filter(p => p.id !== id))
      })
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)

  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const handleFilterChange = (event) => setFilter(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notifMessage} classname="notif" />
      <Notification message={errorMessage} classname="error"/>
      <Filter value={filter} handler={handleFilterChange}/>
      <h2>add a new</h2>
      <PersonForm newName={newName} nameHandler={handleNameChange}
       newNumber={newNumber} numberHandler={handleNumberChange} 
       onSubmit={addPerson}/>
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson}/>
    </div>
  )
}

export default App