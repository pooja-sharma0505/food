const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Auth middleware — verifies the JWT from the Authorization header.
 * On success, attaches the decoded payload to req.user = { id, email, iat, exp }.
 * On failure, returns 401 Unauthorized.
 */
function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
}

module.exports = auth;
