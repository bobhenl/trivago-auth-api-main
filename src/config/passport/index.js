const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

// Set up Google authentication strategy with Passport.js
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://api-trivago.gangoo.eu/auth/google/callback", // Change this URL to your callback URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in the database
        const user = await prisma.user.findUnique({
          where: {
            email: profile.emails[0].value,
          },
        });

        // If the user exists, generate a JWT token for authentication
        if (user) {
          const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET);
          return done(null, token);
        } else {
          const newUser = await prisma.user.create({
            data: {
              email: profile.emails[0].value,
            },
          });

          // Generate a JWT token for the new user
          const token = jwt.sign({ id: newUser.id }, process.env.TOKEN_SECRET);
          return done(null, token);
        }
      } catch (error) {
        console.error("Error while authenticating with Google:", error);
        return done(error, false);
      }
    }
  )
);

module.exports = passport;
