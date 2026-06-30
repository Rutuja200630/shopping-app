import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

// Protect routes - verify access token
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check authorization header for Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode access token
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      // Fetch user profile and attach to request
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        res.status(401);
        throw new Error('User session no longer exists.');
      }

      next();
    } catch (err) {
      res.status(401);
      if (err.name === 'TokenExpiredError') {
        throw new Error('Session expired. Access token has expired.');
      }
      throw new Error('Not authorized. Access token verification failed.');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized. No credentials provided.');
  }
});

// Restrict access based on user role roles checks
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Forbidden. Access denied for role: ${req.user?.role || 'anonymous'}`);
    }
    next();
  };
};

// Optional route protection - attaches user to request if token is present
export const optionalProtect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (err) {
      // Continue without user on error
    }
  }
  next();
});
