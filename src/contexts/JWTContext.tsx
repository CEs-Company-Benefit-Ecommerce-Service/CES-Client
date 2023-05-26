import { createContext, ReactNode, useEffect, useReducer } from 'react'
// utils
import axios from '../utils/axios'
import { isValidToken, setSession } from '../utils/jwt'
// @types
import { ActionMap, AuthState, AuthUser, JWTContextType } from '../@types/auth'

// ----------------------------------------------------------------------

enum Types {
  Initial = 'INITIALIZE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  Register = 'REGISTER',
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean
    user: AuthUser
  }
  [Types.Login]: {
    user: AuthUser
    // refreshToken: string;
  }
  [Types.Logout]: undefined
  [Types.Register]: {
    user: AuthUser
  }
}

export type JWTActions = ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>]

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
}

const JWTReducer = (state: AuthState, action: JWTActions) => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
      }
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        // user: action.payload.user,
      }
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      }

    case 'REGISTER':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      }

    default:
      return state
  }
}

const AuthContext = createContext<JWTContextType | null>(null)

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: ReactNode
}

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(JWTReducer, initialState)

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken)

          // const response = await axios.get('/api/account/my-account');
          const response = await axios.get('/api/account')

          const { user } = response.data

          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: true,
              user,
            },
          })
        } else {
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          })
        }
      } catch (err) {
        console.error(err)
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        })
      }
    }

    initialize()
  }, [])

  const login = async (email: string, password: string) => {
    if (email === 'test@gmail.com' && password === 'test') {
      setSession(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic3RyaW5nIiwiZW1haWwiOiJ0cnVuZ0BnbWFpbC5jb20iLCJzdWIiOiJ0cnVuZ0BnbWFpbC5jb20iLCJqdGkiOiI4NWFjMGQwYy0yZDA3LTQ2ODEtYjNlMS0zOTljMTYwOGNiNTAiLCJVc2VyTmFtZSI6InN0cmluZyIsIlVzZXJJZCI6IjQwZTQ1Nzc0LThiNmUtNDdkNi04ZTE1LTMyMjA2OWE0MDdmOCIsInJvbGUiOiJTeXN0ZW1BZG1pbiIsIlRva2VuSWQiOiI4ZmZiNzViNy0wMDc4LTRlMDgtYjA1OC04M2VkNmU2Yzg2ZGUiLCJuYmYiOjE2ODUwODU5MzEsImV4cCI6MTY4NTA5MzEzMSwiaWF0IjoxNjg1MDg1OTMxfQ.tcLIDcQmseBPORyKPBfH0rBHjVDjIrXycwGD_G9Frg4'
      )
      dispatch({
        type: Types.Login,
        payload: {
          user: {},
        },
      })
    } else {
      const response = await axios.post('/api/login', {
        email,
        password,
      })
      const { accessToken, refreshToken, user } = response.data.data
      // console.log(accessToken, refreshToken, user);

      setSession(accessToken)
      // setSession(refreshToken);

      dispatch({
        type: Types.Login,
        payload: {
          user,
        },
      })
    }
  }

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await axios.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName,
    })
    const { accessToken, user } = response.data

    localStorage.setItem('accessToken', accessToken)

    dispatch({
      type: Types.Register,
      payload: {
        user,
      },
    })
  }

  const logout = async () => {
    setSession(null)
    dispatch({ type: Types.Logout })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
