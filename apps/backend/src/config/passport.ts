import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import AuthService from '../services/auth';
import { authConfig } from './env';

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: authConfig.google.clientId,
      clientSecret: authConfig.google.clientSecret,
      callbackURL: '/api/auth/google/callback',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        // Check if user exists with Google ID
        const existingUser = await AuthService.findUserByGoogleId(profile.id);

        if (existingUser) {
          // User exists, return user
          return done(null, existingUser);
        }

        // Check if user exists with same email
        const userByEmail = await AuthService.findUserByEmail(
          profile.emails?.[0]?.value || ''
        );

        if (userByEmail) {
          // Link Google account to existing user
          const updatedUser = await AuthService.linkGoogleAccount(
            userByEmail.id,
            profile.id
          );
          return done(null, updatedUser);
        }

        // Create new user
        const newUser = await AuthService.createUserFromGoogle({
          googleId: profile.id,
          email: profile.emails?.[0]?.value || '',
          name: profile.displayName || '',
          avatar: profile.photos?.[0]?.value || '',
        });

        return done(null, newUser);
      } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, false);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await AuthService.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
