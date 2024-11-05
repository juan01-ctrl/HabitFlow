import axios from "axios";

import { INote }   from "../models/Note";
import { IRecord } from "../models/Record";


// NOTES

export const getNoteByDate = ({ 
  params
}) => axios.get('/api/notes', { params })
  .then(({ data }) => data)


export const createNote = ({ 
  body
}: { body: INote }) => axios.post('/api/notes', body)
  


export const updateNote = ({ 
  body
}: { body: Partial<INote> }) => axios.patch('/api/notes', body)

// RECORDS

export const createRecord = ({ 
  body
}: { body: IRecord }) => axios.post('/api/records', body)
  

export const updateRecord = ({ 
  body
}: { body: Partial<IRecord> }) => axios.patch('/api/records', body)
    

