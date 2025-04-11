import axios from "axios"
import { instance } from "../services/axios"
import { jwtDecode } from "jwt-decode"

export const tokenName = "token"

const setToken = (tokenId) => {
  localStorage.setItem(tokenName, tokenId)
}

export const getToken = () => {
  return localStorage.getItem(tokenName)
}

export const getProfile = () => {
  if (getToken()) {
    return jwtDecode(getToken())
  }
  return null
}

export const logout = () => {
  localStorage.removeItem(tokenName)
}

export const login = async (userData) => {
  try {
    const data = await instance.post("auth/userlogin", userData)
    setToken(data.data.token)
    return { profileInfo: getProfile() }
  } catch (error) {
    console.log(error)
    return error
  }
}
