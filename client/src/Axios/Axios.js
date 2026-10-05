import axios from "axios"

const req = axios.create({
  // Same server as the site by default; set REACT_APP_API_URL to call another backend
  baseURL: process.env.REACT_APP_API_URL || "",
  headers: {
    'X-Custom-Header': 'foobar',
    "Apikey": "heloo"
  }
});
export default req

