import config from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  // Default error
  let error = {
    success: false,
    message: err.message || 'Internal server error',
    ...(config.NODE_ENV === 'development' && { stack: err.stack })
  };

  // Prisma errors
  if (err.code === 'P2002') {
    error.message = 'Duplicate entry found';
    error.field = err.meta?.target;
    return res.status(400).json(error);
  }

  if (err.code === 'P2025') {
    error.message = 'Record not found';
    return res.status(404).json(error);
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error.message = 'Validation failed';
    error.errors = err.errors;
    return res.status(400).json(error);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    return res.status(401).json(error);
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    return res.status(401).json(error);
  }

  // Default to 500 server error
  res.status(err.statusCode || 500).json(error);
};

export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};