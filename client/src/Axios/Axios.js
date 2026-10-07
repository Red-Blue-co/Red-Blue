import axios from "axios"

const req = axios.create({
  // Same server as the site by default; set REACT_APP_API_URL to call another backend
  baseURL: process.env.REACT_APP_API_URL || "",
  headers: {
    'X-Custom-Header': 'foobar',
    "Apikey": "heloo"
  }
});

// sv-nex replies with { errorCode, message, data } and sends errors as HTTP 500.
// The screens read { errorCode, errorDescription, Data } and expect a resolved
// response, so map the reply here once instead of in every component.
const toScreenShape = (res) => {
  const body = res.data || {};
  res.data = { ...body, errorDescription: body.errorDescription ?? body.message, Data: body.Data ?? body.data };
  return res;
};

req.interceptors.response.use(toScreenShape, (error) => {
  if (error.response?.data && typeof error.response.data === "object") {
    return toScreenShape(error.response);
  }
  // Server unreachable or a non-JSON reply: show a message instead of crashing
  return { data: { errorCode: "NETWORK", errorDescription: "We can't reach Two Tone right now. Check your connection and try again." } };
});

export default req

