import axios from "axios"

// Function to get token from cookies
const getAuthToken = () => {
  // Get the auth cookie
  const cookies = document.cookie.split(";")
  const authCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("_auth=")
  )

  if (authCookie) {
    try {
      // The cookie value is URL encoded and JSON stringified
      const cookieValue = decodeURIComponent(authCookie.split("=")[1])
      const authData = JSON.parse(cookieValue)
      return authData.auth?.token
    } catch (error) {
      console.error("Error parsing auth cookie:", error)
    }
  }
  return null
}

// Create an axios instance
const api = axios.create({
  baseURL: "http://localhost:8000/api", // Your Laravel API URL
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Add a request interceptor to include auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api
