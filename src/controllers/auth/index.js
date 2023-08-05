const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { sendPasswordResetEmail } = require("../../utils/email/passwordReset");

const authController = {
  auth: async (req, res) => {
    // Handle submitted email

    try {
      // Check if the provided email is in the database
      const user = await prisma.user.findUnique({
        where: {
          email: req.body.email,
        },
      });

      if (!user)
        return res.json({
          emailExist: false,
          msg: "Cannot find any user with this email",
        });

      // If the user exists, respond with a positive emailExist status
      res.json({ emailExist: true, msg: "User with this email exist" });
    } catch (error) {
      console.error("Error while checking user:", error);
      res.status(500).json({ msg: "An internal server error occurred" });
    }
  },

  login: async (req, res) => {
    // Handle user login
    try {
      // Check if user exists in the database
      const user = await prisma.user.findUnique({
        where: {
          email: req.body.email,
        },
      });

      if (!user)
        return res.status(404).json({
          msg: "Email not found. Please double-check your email or sign up to create a new account.",
        });

      // Check if the user has a password
      if (!user.password) {
        return res.status(401).json({
          msg: 'The email/password combination you entered is wrong. Please double-check both or click "Forgot your password?".',
        });
      }

      // Compare the provided password with the user's stored hashed password
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(401).json({
          msg: 'The email/password combination you entered is wrong. Please double-check both or click "Forgot your password?".',
        });
      }

      // Create and assign a JSON Web Token (JWT) for authentication
      const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET);

      // Set the JWT token as an HTTP-only cookie, expires after 7 days
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        expires: expirationDate,
      });

      res.json({ msg: "Login successful" });
    } catch (error) {
      console.error("Error while logging in user:", error);
      res.status(500).json({ msg: "An internal server error occurred" });
    }
  },

  register: async (req, res) => {
    // Handle user registration

    // Check if the email is already registered
    const emailExist = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (emailExist)
      return res.status(409).json({ msg: "Email already registered" });

    // Hash the user's password before storing it in the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user in the database
    try {
      const user = await prisma.user.create({
        data: {
          email: req.body.email,
          password: hashedPassword,
        },
      });

      // Create and assign a JSON Web Token (JWT) for authentication
      const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET);

      // Set the JWT token as an HTTP-only cookie, expires after 7 days
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        expires: expirationDate,
      });

      res.json({ msg: "Registration successful" });
    } catch (error) {
      console.error("Error while registering user:", error);
      res.status(500).json({ msg: "An internal server error occurred" });
    }
  },

  forgotPassword: async (req, res) => {
    // Handle forgot password

    try {
      const user = await prisma.user.findUnique({
        where: {
          email: req.body.email,
        },
      });

      if (!user) {
        // User not found
        return res
          .status(404)
          .json({ msg: "User not found with this email address." });
      }

      // Create and assign a JSON Web Token (JWT) for password reset
      //(included user's old password so the token will be invalid after password change)
      const resetToken = jwt.sign(
        { id: user.id, password: user.password },
        process.env.TOKEN_SECRET
      );

      // Send the reset password email to the user
      await sendPasswordResetEmail(req.body.email, resetToken);

      res.status(200).json({ msg: "Password reset email sent successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        msg: "Something went wrong while sending the reset email. Please try again later.",
      });
    }
  },

  changePassword: async (req, res) => {
    // Handle password change

    // Hash the user's password before storing it in the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

    try {
      // Check if password encoded in the Token matches with old user's password
      const existingUser = await prisma.user.findUnique({
        where: {
          id: req.user.id,
          password: req.user.password,
        },
      });

      if (!existingUser) {
        return res.status(404).json({
          msg: "This token has already been used. Please request a new password reset link.",
        });
      }

      // Update the user password
      await prisma.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          password: hashedPassword,
        },
      });

      // Create and assign a JSON Web Token (JWT) for authentication
      const token = jwt.sign({ id: req.user.id }, process.env.TOKEN_SECRET);

      // Set the JWT token as an HTTP-only cookie, expires after 7 days
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        expires: expirationDate,
      });

      res.json({ msg: "Password reset successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  },

  googleCallback: async (req, res) => {
    // Handle Google OAuth2 callback
    const token = req.user;

    // Set the JWT token as an HTTP-only cookie, expires after 7 days
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: expirationDate,
    });

    res.redirect("https://trivago.gangoo.eu");
  },

  logout: async (req, res) => {
    // Handle user logout
    const token = await req.cookies.jwt;
    // Clear the JSON Web Token (JWT) cookie
    res.clearCookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.json({ msg: "Logout successful" });
  },
};

module.exports = authController;
