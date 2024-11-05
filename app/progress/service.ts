import axios from "axios";

export const getRecords = ({ params }) => axios
  .get('/api/records', { params }).then(({ data }) => data) 