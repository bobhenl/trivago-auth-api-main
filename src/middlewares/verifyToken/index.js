const jwt = require("jsonwebtoken");
// Middleware to verify JSON Web Token (JWT)

// Verify Token from cookie
const verifyCookieToken = (req, res, next) => {
  // Extract the JWT token from the 'jwt' cookie in the request
  const token = req.cookies.jwt;

  // If no token is found, return a 401 error
  if (!token) return res.status(401).json({ msg: "Unauthorized" });

  try {
    // Verify the JWT token using TOKEN_SECRET
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    // Attach the decoded user information to the request object for further processing
    req.user = decoded;

    // Proceed to the route handler
    next();
  } catch (error) {
    // If the token is invalid or expired return a 403 error
    return res.status(403).json({ msg: "Invalid token" });
  }
};

// Verify Token from request body
const verifyBodyToken = (req, res, next) => {
  const token = req.body.token;

  // If no token is found, return a 401 error
  if (!token) return res.status(401).json({ msg: "Unauthorized" });

  try {
    // Verify the JWT token using TOKEN_SECRET
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    // Attach the decoded user information to the request object for further processing
    req.user = decoded;

    // Proceed to the route handler
    next();
  } catch (error) {
    // If the token is invalid or expired return a 403 error
    return res.status(403).json({ msg: "Invalid token" });
  }
};

module.exports.verifyCookieToken = verifyCookieToken;
module.exports.verifyBodyToken = verifyBodyToken;
