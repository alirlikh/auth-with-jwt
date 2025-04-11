import { getProfile } from "../services/auth.js"
import { ACCOUNT_INITIALISE, LOGIN, LOGOUT } from "../store/action.js"
import { tokenName } from "../services/auth.js"
import { jwtDecode } from "jwt-decode"
import { createContext, useReducer, useEffect } from "react"

const initiaState = {
  isLoggedIn: false,
  isInitialised: false,
  user: null
}

const reducer = (state, action) => {
  switch (action.type) {
    case ACCOUNT_INITIALISE: {
      const { isLoggedIn, user } = action.payload
      return {
        ...state,
        isLoggedIn,
        isInitialised: true,
        user
      }
    }
    case LOGIN: {
      const { user } = action.payload
      return {
        ...state,
        isLoggedIn: true,
        user
      }
    }
    case LOGOUT: {
      return {
        ...state,
        isLoggedIn: false,
        user: null
      }
    }
    default: {
      return { ...state }
    }
  }
}

export const JwtContext = createContext({
  ...initiaState
})

const verifyToken = (serviceToken) => {
  if (!serviceToken) {
    return false
  }

  const decoded = jwtDecode(serviceToken)
  return decoded.exp > Date.now() / 1000
}

const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initiaState)

  const jwtInitialise = async () => {
    try {
      const serviceToken = window.localStorage.getItem(tokenName)
      if (serviceToken && verifyToken(serviceToken)) {
        const user = getProfile()
        if (user.userId) {
          dispatch({
            type: ACCOUNT_INITIALISE,
            payload: {
              isLoggedIn: true,
              user
            }
          })
        } else {
          dispatch({
            type: ACCOUNT_INITIALISE,
            payload: {
              isLoggedIn: false,
              user: null
            }
          })
        }
      } else {
        dispatch({
          type: ACCOUNT_INITIALISE,
          payload: {
            isLoggedIn: false,
            user: null
          }
        })
      }
    } catch (err) {
      console.error(err)
      dispatch({
        type: ACCOUNT_INITIALISE,
        payload: {
          isLoggedIn: false,
          user: null
        }
      })
    }
  }

  useEffect(() => {
    jwtInitialise()
  }, [JwtContext])

  return <JwtContext.Provider value={{ ...state }}>{children}</JwtContext.Provider>
}

export default JWTProvider
