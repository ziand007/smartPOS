import express from 'express';
import { body } from 'express-validator';
import * as saleController from './sale.controller.js';
import { validateRequest } from '../../middleware/validation.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();

// Validation rules
const saleValidation = [
  body('items').isArray({ min: 1 }).withMessage('Sale items required'),
  body('items.*.productId').notEmpty().withMessage('Product ID required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Valid quantity required'),
  body('paymentMethod').isIn(['CASH', 'CARD', 'E_WALLET']).withMessage('Valid payment method required'),
  body('discount').optional().isFloat({ min: 0 }).withMessage('Discount must be non-negative'),
  body('tax').optional().isFloat({ min: 0 }).withMessage('Tax must be non-negative')
];

// All routes require authentication
router.use(authenticateToken);

// Routes
router.get('/', saleController.getSales);
router.get('/daily', saleController.getDailySales);
router.get('/:id', saleController.getSale);
router.post('/', saleValidation, validateRequest, saleController.createSale);

export default router;