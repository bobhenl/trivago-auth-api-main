const { validationResult, checkSchema } = require("express-validator");

// Validation middleware
const validationMiddleware = (schema) => {
  // Create a validation chain
  const validationChain = checkSchema(schema);

  // Validate the request data based on the schema
  return [
    validationChain,
    (req, res, next) => {
      // Get validation errors from the request
      const errors = validationResult(req);

      // If validation error, return a 400 response
      if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array()[0].msg });
      }

      // On validation success, proceed
      next();
    },
  ];
};

// Schema for EMAIL and PASSWORD validation
const emailAndPassValidation = () => {
  const schema = {
    email: {
      isEmail: true,
      errorMessage: "Email must be a valid email",
    },
    password: {
      isStrongPassword: {
        options: {
          minLength: 10,
          minUppercase: 1,
          minNumbers: 0,
          minSymbols: 0,
        },
        errorMessage:
          "Password must contain a minimum of 10 characters and at least 1 uppercase letter",
      },
    },
  };

  return validationMiddleware(schema);
};

// Schema for EMAIL validation
const emailValidation = () => {
  const schema = {
    email: {
      isEmail: true,
      errorMessage: "Email must be a valid email",
    },
  };

  return validationMiddleware(schema);
};

// Export the validation functions
module.exports.emailAndPassValidation = emailAndPassValidation;
module.exports.emailValidation = emailValidation;
