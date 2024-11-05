import axios from "axios";

// STATISTICS

export const getStatistics = () => axios
  .get('/api/statistics')
  .then(({data}) => data)
