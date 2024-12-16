const jwt = require("jsonwebtoken");

// Use a secure key or store it in environment variables

/**
 * Middleware to authenticate and authorize the user based on JWT.
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Next middleware function
 */
const authMiddleware = (req, res, next) => {
  // Get the token from headers or query parameters
  const token = req.headers["authorization"]?.split(" ")[1] || req.query.token;

  // If there's no token, send a 401 Unauthorized response
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication token is required" });
  }

  // Verify the token using the secret key
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // Attach the decoded user information to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  });
};

module.exports = authMiddleware;
