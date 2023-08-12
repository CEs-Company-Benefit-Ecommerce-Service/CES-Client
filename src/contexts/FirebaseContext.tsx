import { initializeApp } from 'firebase/app'
import {
  createUserWithEmailAndPassword, getAuth, onAuthStateChanged,
  signInWithEmailAndPassword, signOut
} from 'firebase/auth'
import { collection, doc, DocumentData, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { createContext, ReactNode, useEffect, useReducer, useState } from 'react'
// @types
import { ActionMap, AuthUser, FirebaseContextType, FixAuthState } from '../@types/auth'
//
import { FIREBASE_API_CES } from '../config'

// ----------------------------------------------------------------------


const firebaseApp = initializeApp(FIREBASE_API_CES);

const AUTH = getAuth(firebaseApp)

export const storage = getStorage(firebaseApp)

const DB = getFirestore(firebaseApp);

const initialState: FixAuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
}

enum Types {
  Initial = 'INITIALISE',
}

type FirebaseAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean
    user: AuthUser
  }
}

type FirebaseActions = ActionMap<FirebaseAuthPayload>[keyof ActionMap<FirebaseAuthPayload>]

const reducer = (state: FixAuthState, action: FirebaseActions) => {
  if (action.type === 'INITIALISE') {
    const { isAuthenticated, user } = action.payload
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    }
  }

  return state
}

const AuthContext = createContext<FirebaseContextType | null>(null)

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: ReactNode
}

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const [profile, setProfile] = useState<DocumentData | undefined>()

  useEffect(
    () =>
      onAuthStateChanged(AUTH, async (user) => {
        if (user) {
          const userRef = doc(DB, 'users', user.uid)

          const docSnap = await getDoc(userRef)

          if (docSnap.exists()) {
            setProfile(docSnap.data())
          }

          dispatch({
            type: Types.Initial,
            payload: { isAuthenticated: true, user },
          })
        } else {
          dispatch({
            type: Types.Initial,
            payload: { isAuthenticated: false, user: null },
          })
        }
      }),
    [dispatch]
  )

  const login = (email: string, password: string) =>
    signInWithEmailAndPassword(AUTH, email, password)

  const register = (email: string, password: string, firstName: string, lastName: string) =>
    createUserWithEmailAndPassword(AUTH, email, password).then(async (res) => {
      const userRef = doc(collection(DB, 'users'), res.user?.uid)

      await setDoc(userRef, {
        uid: res.user?.uid,
        email,
        displayName: `${firstName} ${lastName}`,
      })
    })

  const logout = () => signOut(AUTH)

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'firebase',
        // user: {
        //   id: state?.user?.uid,
        //   email: state?.user?.email,
        //   photoURL: state?.user?.photoURL || profile?.photoURL,
        //   displayName: state?.user?.name || profile?.displayName,
        //   role: ADMIN_EMAILS.includes(state?.user?.email) ? 'admin' : 'user',
        //   phoneNumber: state?.user?.phoneNumber || profile?.phoneNumber || '',
        //   country: profile?.country || '',
        //   address: profile?.address || '',
        //   state: profile?.state || '',
        //   city: profile?.city || '',
        //   zipCode: profile?.zipCode || '',
        //   about: profile?.about || '',
        //   isPublic: profile?.isPublic || false,
        // },
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
