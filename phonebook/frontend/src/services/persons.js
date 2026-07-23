import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => {
  return axios.get(baseUrl).then(response => response.data)
}

const create = newObject => {
  return axios.post(baseUrl, newObject).then(response => response.data)
}

const remove = id => {
  const promise = axios.delete(`${baseUrl}/${id}`)
  return promise.then(response => response.data)
}

const update = (id, updatedPerson) => {
  const promise = axios.put(`${baseUrl}/${id}`, updatedPerson)
  return promise.then(response => response.data)
}

export default { getAll, create, remove, update }