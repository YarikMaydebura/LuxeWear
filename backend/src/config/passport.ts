import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from 'passport-github2'
import { env } from './env'
import { userRepository } from '../repositories/user.repository'
import { JwtPayload } from '../types'

// JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.JWT_SECRET,
    },
    async (payload: JwtPayload, done) => {
      try {
        const user = await userRepository.findById(payload.userId)
        if (!user) {
          return done(null, false)
        }
        return done(null, user)
      } catch (error) {
        return done(error, false)
      }
    }
  )
)

// Google OAuth Strategy
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_CALLBACK_URL) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          let user = await userRepository.findByProviderId('google', profile.id)

          if (!user) {
            // Check if user exists with same email
            const email = profile.emails?.[0]?.value
            if (email) {
              user = await userRepository.findByEmail(email)
              if (user) {
                // Link Google account to existing user
                user = await userRepository.updateProvider(user.id, 'google', profile.id)
              }
            }
          }

          if (!user) {
            // Create new user
            user = await userRepository.create({
              email: profile.emails?.[0]?.value || '',
              firstName: profile.name?.givenName || profile.displayName || '',
              lastName: profile.name?.familyName || '',
              avatar: profile.photos?.[0]?.value,
              authProvider: 'google',
              providerId: profile.id,
              emailVerified: true,
            })
          }

          return done(null, user)
        } catch (error) {
          return done(error as Error, undefined)
        }
      }
    )
  )
}

// GitHub OAuth Strategy
if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET && env.GITHUB_CALLBACK_URL) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        callbackURL: env.GITHUB_CALLBACK_URL,
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: GitHubProfile,
        done: (error: Error | null, user?: object) => void
      ) => {
        try {
          let user = await userRepository.findByProviderId('github', profile.id)

          if (!user) {
            const email = (profile.emails as Array<{ value: string }> | undefined)?.[0]?.value
            if (email) {
              user = await userRepository.findByEmail(email)
              if (user) {
                user = await userRepository.updateProvider(user.id, 'github', profile.id)
              }
            }
          }

          if (!user) {
            const nameParts = (profile.displayName || profile.username || '').split(' ')
            user = await userRepository.create({
              email: (profile.emails as Array<{ value: string }> | undefined)?.[0]?.value || `${profile.username}@github.local`,
              firstName: nameParts[0] || profile.username || '',
              lastName: nameParts.slice(1).join(' ') || '',
              avatar: (profile.photos as Array<{ value: string }> | undefined)?.[0]?.value,
              authProvider: 'github',
              providerId: profile.id,
              emailVerified: true,
            })
          }

          return done(null, user)
        } catch (error) {
          return done(error as Error, undefined)
        }
      }
    )
  )
}

export default passport
