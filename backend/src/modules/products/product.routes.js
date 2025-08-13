import express from 'express';
import { body } from 'express-validator';
import * as productController from './product.controller.js';
import { validateRequest } from '../../middleware/validation.js';
import { authenticateToken, authorize } from '../../middleware/auth.js';

const router = express.Router();

// Validation rules
const productValidation = [
  body('name').trim().isLength({ min: 1 }).withMessage('Product name required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price required'),
  body('costPrice').isFloat({ min: 0 }).withMessage('Valid cost price required'),
  body('stockQty').optional().isInt({ min: 0 }).withMessage('Stock quantity must be non-negative'),
  body('reorderLevel').optional().isInt({ min: 0 }).withMessage('Reorder level must be non-negative')
];

// All routes require authentication
router.use(authenticateToken);

// Routes
router.get('/', productController.getProducts);
router.get('/categories', productController.getCategories);
router.get('/low-stock', productController.getLowStockProducts);
router.get('/:id', productController.getProduct);

// Admin and Inventory Manager only
router.post('/', 
  authorize('ADMIN', 'INVENTORY_MANAGER'), 
  productValidation, 
  validateRequest, 
  productController.createProduct
);

router.put('/:id', 
  authorize('ADMIN', 'INVENTORY_MANAGER'), 
  productValidation, 
  validateRequest, 
  productController.updateProduct
);

router.delete('/:id', 
  authorize('ADMIN', 'INVENTORY_MANAGER'), 
  productController.deleteProduct
);

export default router;