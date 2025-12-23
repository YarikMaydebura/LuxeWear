import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { setAccessToken } from '@/lib/api'
import { useAuthStore } from '@/store/auth-store'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const setUser = useAuthStore((state) => state.setUser)

  useEffect(() => {
    const accessToken = searchParams.get('accessToken')
    const error = searchParams.get('error')

    if (error) {
      console.error('OAuth error:', error)
      navigate('/login?error=oauth_failed')
      return
    }

    if (accessToken) {
      // Set the access token
      setAccessToken(accessToken)

      // Fetch user data and set in store
      const fetchUser = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )

          if (response.ok) {
            const data = await response.json()
            setUser(data.data, accessToken)
            navigate('/')
          } else {
            throw new Error('Failed to fetch user')
          }
        } catch (error) {
          console.error('Failed to fetch user:', error)
          navigate('/login?error=fetch_failed')
        }
      }

      fetchUser()
    } else {
      navigate('/login')
    }
  }, [searchParams, navigate, setUser])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  )
}
