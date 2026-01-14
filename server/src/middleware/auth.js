// Middleware to check if user is authenticated as admin
const jwt = require('jsonwebtoken');

// This function runs before admin routes to verify the token
const verifyAdmin = (req, res, next) => {
  try {
    // Get token from Authorization header
    // Format: "Bearer TOKEN_HERE"
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // Verify token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add admin info to request object so controllers can use it
    req.admin = decoded;

    // Continue to the next middleware/controller
    next();

  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// This function runs before user routes to verify the token
const verifyUser = (req, res, next) => {
  try {
    // Get token from Authorization header
    // Format: "Bearer TOKEN_HERE"
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // Verify token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request object so controllers can use it
    req.user = decoded;

    // Continue to the next middleware/controller
    next();

  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { verifyAdmin, verifyUser };
