import { useCallback, useEffect } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { authService } from '@/services/auth-service'
import type { LoginCredentials, RegisterData } from '@/types'

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const addresses = useAuthStore((state) => state.addresses)
  const isLoading = useAuthStore((state) => state.isLoading)
  const setUser = useAuthStore((state) => state.setUser)
  const setToken = useAuthStore((state) => state.setToken)
  const setLoading = useAuthStore((state) => state.setLoading)
  const logoutStore = useAuthStore((state) => state.logout)
  const addAddress = useAuthStore((state) => state.addAddress)
  const updateAddress = useAuthStore((state) => state.updateAddress)
  const removeAddress = useAuthStore((state) => state.removeAddress)
  const setDefaultAddress = useAuthStore((state) => state.setDefaultAddress)
  const getDefaultAddress = useAuthStore((state) => state.getDefaultAddress)

  const isAuthenticated = !!user && !!token

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (token && !user) {
        setLoading(true)
        try {
          const currentUser = await authService.getCurrentUser(token)
          if (currentUser) {
            setUser(currentUser)
          } else {
            // Token is invalid or expired
            logoutStore()
          }
        } catch {
          logoutStore()
        } finally {
          setLoading(false)
        }
      }
    }

    validateToken()
  }, [token, user, setUser, setLoading, logoutStore])

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setLoading(true)
      try {
        const result = await authService.login(credentials)
        setUser(result.user)
        setToken(result.token)
        return { success: true, user: result.user }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed'
        return { success: false, error: message }
      } finally {
        setLoading(false)
      }
    },
    [setUser, setToken, setLoading]
  )

  const register = useCallback(
    async (data: RegisterData) => {
      setLoading(true)
      try {
        const result = await authService.register(data)
        setUser(result.user)
        setToken(result.token)
        return { success: true, user: result.user }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed'
        return { success: false, error: message }
      } finally {
        setLoading(false)
      }
    },
    [setUser, setToken, setLoading]
  )

  const logout = useCallback(async () => {
    setLoading(true)
    try {
      await authService.logout()
    } finally {
      logoutStore()
      setLoading(false)
    }
  }, [logoutStore, setLoading])

  const updateProfile = useCallback(
    async (updates: { firstName?: string; lastName?: string; phone?: string }) => {
      if (!user) return { success: false, error: 'Not authenticated' }

      setLoading(true)
      try {
        const updatedUser = await authService.updateProfile(user.id, updates)
        setUser(updatedUser)
        return { success: true, user: updatedUser }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Update failed'
        return { success: false, error: message }
      } finally {
        setLoading(false)
      }
    },
    [user, setUser, setLoading]
  )

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (!user) return { success: false, error: 'Not authenticated' }

      setLoading(true)
      try {
        await authService.changePassword(user.id, currentPassword, newPassword)
        return { success: true }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Password change failed'
        return { success: false, error: message }
      } finally {
        setLoading(false)
      }
    },
    [user, setLoading]
  )

  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      await authService.requestPasswordReset(email)
      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Request failed'
      return { success: false, error: message }
    }
  }, [])

  return {
    // State
    user,
    token,
    addresses,
    isAuthenticated,
    isLoading,

    // Auth actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,

    // Address actions
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
    getDefaultAddress,

    // Helpers
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    initials: user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : '',
  }
}
