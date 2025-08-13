import express from 'express';
import { body } from 'express-validator';
import * as authController from './auth.controller.js';
import { validateRequest } from '../../middleware/validation.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['ADMIN', 'CASHIER', 'INVENTORY_MANAGER']).withMessage('Invalid role')
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
];

const refreshValidation = [
  body('refreshToken').notEmpty().withMessage('Refresh token required')
];

// Routes
router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);
router.post('/refresh', refreshValidation, validateRequest, authController.refresh);
router.post('/logout', authController.logout);
router.get('/profile', authenticateToken, authController.getProfile);

export default router;