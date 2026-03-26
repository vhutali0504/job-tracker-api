const jwt = require('jsonwebtoken');

// Middleware that runs before any protected route
// Checks if the request has a valid JWT token
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Token must be sent as: Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token and extract the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next(); // Move on to the actual route handler
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = protect;