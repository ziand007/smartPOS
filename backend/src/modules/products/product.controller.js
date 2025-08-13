import prisma from '../../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export const getProducts = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      category, 
      lowStock = false 
    } = req.query;

    const skip = (page - 1) * limit;
    const where = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
          { barcode: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(category && { category }),
      ...(lowStock === 'true' && {
        stockQty: { lte: prisma.raw('reorder_level') }
      })
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: { 
        id,
        isActive: true 
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      category,
      price,
      costPrice,
      stockQty,
      reorderLevel,
      barcode
    } = req.body;

    // Generate SKU if not provided
    const sku = req.body.sku || `PROD-${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        sku,
        name,
        category,
        price: parseFloat(price),
        costPrice: parseFloat(costPrice),
        stockQty: parseInt(stockQty) || 0,
        reorderLevel: parseInt(reorderLevel) || 10,
        barcode
      }
    });

    // Log inventory change
    if (stockQty > 0) {
      await prisma.inventoryLog.create({
        data: {
          productId: product.id,
          userId: req.user.id,
          changeQty: parseInt(stockQty),
          reason: 'RESTOCK',
          notes: 'Initial stock'
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Convert numeric fields
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.costPrice) updateData.costPrice = parseFloat(updateData.costPrice);
    if (updateData.stockQty !== undefined) updateData.stockQty = parseInt(updateData.stockQty);
    if (updateData.reorderLevel) updateData.reorderLevel = parseInt(updateData.reorderLevel);

    const existingProduct = await prisma.product.findFirst({
      where: { id, isActive: true }
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData
    });

    // Log stock change if stock quantity changed
    if (updateData.stockQty !== undefined && updateData.stockQty !== existingProduct.stockQty) {
      const changeQty = updateData.stockQty - existingProduct.stockQty;
      await prisma.inventoryLog.create({
        data: {
          productId: product.id,
          userId: req.user.id,
          changeQty,
          reason: 'ADJUSTMENT',
          notes: 'Stock adjustment'
        }
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: { id, isActive: true }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Soft delete
    await prisma.product.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.product.findMany({
      where: { 
        isActive: true,
        category: { not: null }
      },
      select: { category: true },
      distinct: ['category']
    });

    const categoryList = categories
      .map(p => p.category)
      .filter(Boolean)
      .sort();

    res.json({
      success: true,
      data: { categories: categoryList }
    });
  } catch (error) {
    next(error);
  }
};

export const getLowStockProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        stockQty: { lte: prisma.raw('reorder_level') }
      },
      orderBy: { stockQty: 'asc' }
    });

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    next(error);
  }
};