import express from 'express';
import { body } from 'express-validator';
import * as customerController from './customer.controller.js';
import { validateRequest } from '../../middleware/validation.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();

// Validation rules
const customerValidation = [
  body('name').trim().isLength({ min: 1 }).withMessage('Customer name required'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
  body('email').optional().isEmail().withMessage('Valid email required')
];

// All routes require authentication
router.use(authenticateToken);

// Routes
router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomer);
router.post('/', customerValidation, validateRequest, customerController.createCustomer);
router.put('/:id', customerValidation, validateRequest, customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

export default router;