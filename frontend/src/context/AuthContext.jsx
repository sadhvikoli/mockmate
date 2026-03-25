import { createContext, useContext, useState, useEffect } from 'react'
import { login as loginApi, register as registerApi } from '../api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await loginApi({ email, password })
    localStorage.setItem('token', res.data.access_token)
    const userData = { email }
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const register = async (email, username, password) => {
    await registerApi({ email, username, password })
    await login(email, password)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)