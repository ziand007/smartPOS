import prisma from '../../config/database.js';

export const createSale = async (req, res, next) => {
  try {
    const {
      customerId,
      items,
      paymentMethod,
      discount = 0,
      tax = 0
    } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Sale items required'
      });
    }

    // Check product availability
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.productId} not found`
        });
      }

      if (product.stockQty < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }
    }

    // Generate receipt number
    const receiptNumber = `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Calculate total
    let totalAmount = 0;
    const saleItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      const unitPrice = parseFloat(product.price);
      const quantity = parseInt(item.quantity);
      const subtotal = unitPrice * quantity;

      totalAmount += subtotal;

      saleItems.push({
        productId: item.productId,
        quantity,
        unitPrice,
        subtotal
      });
    }

    // Apply discount and tax
    const discountAmount = parseFloat(discount);
    const taxAmount = parseFloat(tax);
    totalAmount = totalAmount - discountAmount + taxAmount;

    // Create sale with transaction
    const sale = await prisma.$transaction(async (tx) => {
      // Create sale
      const newSale = await tx.sale.create({
        data: {
          userId: req.user.id,
          customerId: customerId || null,
          totalAmount,
          paymentMethod,
          discount: discountAmount,
          tax: taxAmount,
          receiptNumber,
          items: {
            create: saleItems
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          },
          customer: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });

      // Update product stock and create inventory logs
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQty: {
              decrement: item.quantity
            }
          }
        });

        await tx.inventoryLog.create({
          data: {
            productId: item.productId,
            userId: req.user.id,
            changeQty: -item.quantity,
            reason: 'SALE',
            notes: `Sale ${receiptNumber}`
          }
        });
      }

      return newSale;
    });

    res.status(201).json({
      success: true,
      message: 'Sale completed successfully',
      data: { sale }
    });
  } catch (error) {
    next(error);
  }
};

export const getSales = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      startDate,
      endDate,
      paymentMethod,
      userId
    } = req.query;

    const skip = (page - 1) * limit;
    const where = {
      ...(startDate && endDate && {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      }),
      ...(paymentMethod && { paymentMethod }),
      ...(userId && { userId })
    };

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        include: {
          customer: true,
          user: {
            select: {
              name: true,
              email: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  sku: true
                }
              }
            }
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.sale.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        sales,
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

export const getSale = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        customer: true,
        user: {
          select: {
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    res.json({
      success: true,
      data: { sale }
    });
  } catch (error) {
    next(error);
  }
};

export const getDailySales = async (req, res, next) => {
  try {
    const { date = new Date().toISOString().split('T')[0] } = req.query;
    
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const sales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate
        }
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                sku: true
              }
            }
          }
        }
      }
    });

    const summary = {
      totalSales: sales.length,
      totalRevenue: sales.reduce((sum, sale) => sum + parseFloat(sale.totalAmount), 0),
      paymentMethods: {},
      topProducts: {}
    };

    // Calculate payment method breakdown
    sales.forEach(sale => {
      summary.paymentMethods[sale.paymentMethod] = 
        (summary.paymentMethods[sale.paymentMethod] || 0) + 1;
    });

    // Calculate top products
    sales.forEach(sale => {
      sale.items.forEach(item => {
        const productName = item.product.name;
        summary.topProducts[productName] = 
          (summary.topProducts[productName] || 0) + item.quantity;
      });
    });

    res.json({
      success: true,
      data: {
        sales,
        summary
      }
    });
  } catch (error) {
    next(error);
  }
};