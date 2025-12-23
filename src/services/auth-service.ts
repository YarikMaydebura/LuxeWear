import { api, setAccessToken, useBackend } from '@/lib/api'
import type { User, LoginCredentials, RegisterData } from '@/types'

// Mock user database (used when backend is not available)
const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: '1',
    email: 'demo@luxewear.com',
    password: 'demo123',
    firstName: 'Demo',
    lastName: 'User',
    phone: '+1 234 567 8900',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Generate mock JWT token
const generateToken = (userId: string): string => {
  const payload = { userId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 } // 7 days
  return btoa(JSON.stringify(payload))
}

// Generate unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Backend API methods
const backendAuth = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await api.post('/auth/login', credentials)
    const { user, accessToken } = response.data.data
    setAccessToken(accessToken)
    return { user, token: accessToken }
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const response = await api.post('/auth/register', data)
    const { user, accessToken } = response.data.data
    setAccessToken(accessToken)
    return { user, token: accessToken }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get('/auth/me')
      return response.data.data
    } catch {
      return null
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } finally {
      setAccessToken(null)
    }
  },

  async updateProfile(
    userId: string,
    updates: Partial<Pick<User, 'firstName' | 'lastName' | 'phone'>>
  ): Promise<User> {
    const response = await api.put('/auth/me', updates)
    return response.data.data
  },

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await api.put('/auth/me/password', { currentPassword, newPassword })
  },

  async requestPasswordReset(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email })
  },
}

// Mock API methods (fallback)
const mockAuth = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    await delay(800)

    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === credentials.email.toLowerCase() && u.password === credentials.password
    )

    if (!user) {
      throw new Error('Invalid email or password')
    }

    const { password: _, ...userWithoutPassword } = user
    const token = generateToken(user.id)

    return { user: userWithoutPassword, token }
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    await delay(1000)

    const existingUser = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    )

    if (existingUser) {
      throw new Error('Email already registered')
    }

    const newUser: User & { password: string } = {
      id: generateId(),
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    MOCK_USERS.push(newUser)

    const { password: _, ...userWithoutPassword } = newUser
    const token = generateToken(newUser.id)

    return { user: userWithoutPassword, token }
  },

  async getCurrentUser(token: string): Promise<User | null> {
    await delay(300)

    try {
      const payload = JSON.parse(atob(token))

      if (payload.exp < Date.now()) {
        return null
      }

      const user = MOCK_USERS.find((u) => u.id === payload.userId)
      if (!user) return null

      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword
    } catch {
      return null
    }
  },

  async updateProfile(
    userId: string,
    updates: Partial<Pick<User, 'firstName' | 'lastName' | 'phone'>>
  ): Promise<User> {
    await delay(500)

    const userIndex = MOCK_USERS.findIndex((u) => u.id === userId)
    if (userIndex === -1) {
      throw new Error('User not found')
    }

    MOCK_USERS[userIndex] = {
      ...MOCK_USERS[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    const { password: _, ...userWithoutPassword } = MOCK_USERS[userIndex]
    return userWithoutPassword
  },

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await delay(500)

    const user = MOCK_USERS.find((u) => u.id === userId)
    if (!user) {
      throw new Error('User not found')
    }

    if (user.password !== currentPassword) {
      throw new Error('Current password is incorrect')
    }

    user.password = newPassword
    user.updatedAt = new Date().toISOString()
  },

  async requestPasswordReset(email: string): Promise<void> {
    await delay(500)
    console.log(`Password reset requested for: ${email}`)
  },

  async logout(): Promise<void> {
    await delay(200)
  },
}

// Export auth service that switches between backend and mock
export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    if (useBackend) {
      return backendAuth.login(credentials)
    }
    return mockAuth.login(credentials)
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    if (useBackend) {
      return backendAuth.register(data)
    }
    return mockAuth.register(data)
  },

  async getCurrentUser(token: string): Promise<User | null> {
    if (useBackend) {
      return backendAuth.getCurrentUser()
    }
    return mockAuth.getCurrentUser(token)
  },

  async updateProfile(
    userId: string,
    updates: Partial<Pick<User, 'firstName' | 'lastName' | 'phone'>>
  ): Promise<User> {
    if (useBackend) {
      return backendAuth.updateProfile(userId, updates)
    }
    return mockAuth.updateProfile(userId, updates)
  },

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    if (useBackend) {
      return backendAuth.changePassword(userId, currentPassword, newPassword)
    }
    return mockAuth.changePassword(userId, currentPassword, newPassword)
  },

  async requestPasswordReset(email: string): Promise<void> {
    if (useBackend) {
      return backendAuth.requestPasswordReset(email)
    }
    return mockAuth.requestPasswordReset(email)
  },

  async logout(): Promise<void> {
    if (useBackend) {
      return backendAuth.logout()
    }
    return mockAuth.logout()
  },

  // OAuth methods (backend only)
  getGoogleAuthUrl(): string {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth/google`
  },

  getGithubAuthUrl(): string {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth/github`
  },
}
