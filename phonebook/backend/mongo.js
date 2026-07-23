const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password, name and number as arguments')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.hyetgmt.mongodb.net/phonebook?appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person)
  })
  mongoose.connection.close()
})
}
else {
  const newName = process.argv[3]
  const newNumber = process.argv.length === 5 ? process.argv[4] : ""

  const note = new Person({
    name: newName,
    number: newNumber,
  })

  note.save().then(result => {
    console.log(`added ${newName} number ${newNumber} to phonebook`)
    mongoose.connection.close()
  })
}

