import axios from "axios"
import { useAuthStore } from "./auth/authStore"

// Create an axios instance
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Add a request interceptor to include auth token in all requests
api.interceptors.request.use(
  (config) => {
    const auth = useAuthStore.getState()

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
