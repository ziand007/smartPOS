import express from 'express';
import * as reportController from './report.controller.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Routes
router.get('/sales', reportController.getSalesReport);
router.get('/inventory', reportController.getInventoryReport);
router.get('/dashboard', reportController.getDashboardStats);

export default router;