import { useCallback, useEffect, useMemo, useState } from 'react'
import api, { TOKEN_STORAGE_KEY } from '../lib/api.js'
import AuthContext from './auth-context.js'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => window.localStorage.getItem(TOKEN_STORAGE_KEY))
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(Boolean(token))

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    setToken(null)
    setUser(null)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      const savedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY)
      if (savedToken) {
        config.headers.Authorization = `Bearer ${savedToken}`
      }
      return config
    })

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response?.status === 401 &&
          window.localStorage.getItem(TOKEN_STORAGE_KEY)
        ) {
          logout()
        }
        return Promise.reject(error)
      },
    )

    return () => {
      api.interceptors.request.eject(requestInterceptor)
      api.interceptors.response.eject(responseInterceptor)
    }
  }, [logout])

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await api.get('/api/users/me')
      setUser(response.data)
      return response.data
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!token) {
      return undefined
    }

    // Restore the saved session from the API on initial mount.
    // oxlint-disable-next-line react/set-state-in-effect
    fetchCurrentUser()
      .catch((error) => {
        if (error.response?.status !== 401) {
          console.error('Unable to fetch the current user profile.', error)
        }
      })
    return undefined
  }, [fetchCurrentUser, token])

  const login = useCallback(async (email, password) => {
    const response = await api.post('/api/users/login', { email, password })
    window.localStorage.setItem(TOKEN_STORAGE_KEY, response.data.access_token)
    setToken(response.data.access_token)
    setIsLoading(true)
    return fetchCurrentUser()
  }, [fetchCurrentUser])

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      fetchCurrentUser,
    }),
    [user, token, isLoading, login, logout, fetchCurrentUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
