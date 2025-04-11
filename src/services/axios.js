import axios from "axios"
import { getToken } from "./auth"

axios.defaults.baseURL = "http://localhost:3005/api/"
export const instance = axios.create({
  baseURL: "http://localhost:3005/api/",
  timeout: 500000
})

instance.interceptors.request.use(
  (config) => {
    // config.headers = {
    //   ...config.headers
    //   // Authorization: getToken()
    // }
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response.status === 401) {
      return Promise.reject(error)
    }
  }
)
