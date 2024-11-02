import axios from "axios";


export const getNoteByDate = ({ 
  params
}) => axios.get('/api/notes', { params })
  .then(({ data }) => data)


export const createNote = ({ 
  body
}) => axios.post('/api/notes', body)
  

export const updateNote = ({ 
  body
}) => axios.patch('/api/notes', body)
    