import axios from "axios"
import { getDefaultStore } from "jotai"
import { authAtom } from "./auth/authStore"

// Create an axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Add a request interceptor to include auth token in all requests
api.interceptors.request.use(
  (config) => {
    const store = getDefaultStore()
    const auth = store.get(authAtom)

    if (auth.token && auth.tokenType) {
      config.headers.Authorization = `${auth.tokenType} ${auth.token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api
