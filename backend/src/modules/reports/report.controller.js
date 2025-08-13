import prisma from '../../config/database.js';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

export const getSalesReport = async (req, res, next) => {
  try {
    const { 
      startDate, 
      endDate, 
      period = 'daily',
      userId,
      paymentMethod 
    } = req.query;

    let dateFilter = {};
    
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      };
    } else {
      // Default to last 30 days
      const thirtyDaysAgo = subDays(new Date(), 30);
      dateFilter = {
        createdAt: {
          gte: startOfDay(thirtyDaysAgo),
          lte: endOfDay(new Date())
        }
      };
    }

    const where = {
      ...dateFilter,
      ...(userId && { userId }),
      ...(paymentMethod && { paymentMethod })
    };

    // Get sales data
    const sales = await prisma.sale.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                category: true
              }
            }
          }
        },
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate summary statistics
    const summary = {
      totalSales: sales.length,
      totalRevenue: sales.reduce((sum, sale) => sum + parseFloat(sale.totalAmount), 0),
      totalDiscount: sales.reduce((sum, sale) => sum + parseFloat(sale.discount), 0),
      totalTax: sales.reduce((sum, sale) => sum + parseFloat(sale.tax), 0),
      averageOrderValue: 0,
      paymentMethodBreakdown: {},
      categoryBreakdown: {},
      topProducts: {},
      salesByPeriod: {}
    };

    summary.averageOrderValue = summary.totalSales > 0 ? 
      summary.totalRevenue / summary.totalSales : 0;

    // Payment method breakdown
    sales.forEach(sale => {
      const method = sale.paymentMethod;
      summary.paymentMethodBreakdown[method] = {
        count: (summary.paymentMethodBreakdown[method]?.count || 0) + 1,
        amount: (summary.paymentMethodBreakdown[method]?.amount || 0) + parseFloat(sale.totalAmount)
      };
    });

    // Category breakdown and top products
    sales.forEach(sale => {
      sale.items.forEach(item => {
        const category = item.product.category || 'Uncategorized';
        const productName = item.product.name;
        
        // Category breakdown
        summary.categoryBreakdown[category] = {
          count: (summary.categoryBreakdown[category]?.count || 0) + item.quantity,
          revenue: (summary.categoryBreakdown[category]?.revenue || 0) + parseFloat(item.subtotal)
        };

        // Top products
        summary.topProducts[productName] = {
          quantity: (summary.topProducts[productName]?.quantity || 0) + item.quantity,
          revenue: (summary.topProducts[productName]?.revenue || 0) + parseFloat(item.subtotal)
        };
      });
    });

    // Sales by period (daily/weekly/monthly)
    if (period === 'daily') {
      sales.forEach(sale => {
        const date = format(new Date(sale.createdAt), 'yyyy-MM-dd');
        summary.salesByPeriod[date] = {
          count: (summary.salesByPeriod[date]?.count || 0) + 1,
          revenue: (summary.salesByPeriod[date]?.revenue || 0) + parseFloat(sale.totalAmount)
        };
      });
    }

    // Convert top products to sorted array
    summary.topProducts = Object.entries(summary.topProducts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    res.json({
      success: true,
      data: {
        summary,
        sales: sales.slice(0, 100) // Limit to 100 recent sales for performance
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getInventoryReport = async (req, res, next) => {
  try {
    const { category, lowStock = false } = req.query;

    const where = {
      isActive: true,
      ...(category && { category }),
      ...(lowStock === 'true' && {
        stockQty: { lte: prisma.raw('reorder_level') }
      })
    };

    const products = await prisma.product.findMany({
      where,
      include: {
        inventoryLogs: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { stockQty: 'asc' }
    });

    // Calculate inventory value
    const totalValue = products.reduce((sum, product) => {
      return sum + (parseFloat(product.costPrice) * product.stockQty);
    }, 0);

    const lowStockCount = products.filter(p => p.stockQty <= p.reorderLevel).length;

    const summary = {
      totalProducts: products.length,
      totalValue,
      lowStockCount,
      categories: {}
    };

    // Category breakdown
    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      if (!summary.categories[category]) {
        summary.categories[category] = {
          count: 0,
          value: 0,
          lowStock: 0
        };
      }
      
      summary.categories[category].count++;
      summary.categories[category].value += parseFloat(product.costPrice) * product.stockQty;
      
      if (product.stockQty <= product.reorderLevel) {
        summary.categories[category].lowStock++;
      }
    });

    res.json({
      success: true,
      data: {
        summary,
        products
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);
    
    const yesterday = subDays(today, 1);
    const startOfYesterday = startOfDay(yesterday);
    const endOfYesterday = endOfDay(yesterday);

    // Today's sales
    const [todaysSales, yesterdaysSales] = await Promise.all([
      prisma.sale.findMany({
        where: {
          createdAt: {
            gte: startOfToday,
            lte: endOfToday
          }
        }
      }),
      prisma.sale.findMany({
        where: {
          createdAt: {
            gte: startOfYesterday,
            lte: endOfYesterday
          }
        }
      })
    ]);

    const todaysRevenue = todaysSales.reduce((sum, sale) => sum + parseFloat(sale.totalAmount), 0);
    const yesterdaysRevenue = yesterdaysSales.reduce((sum, sale) => sum + parseFloat(sale.totalAmount), 0);

    // Low stock products
    const lowStockProducts = await prisma.product.count({
      where: {
        isActive: true,
        stockQty: { lte: prisma.raw('reorder_level') }
      }
    });

    // Total products and customers
    const [totalProducts, totalCustomers] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.customer.count()
    ]);

    // Recent sales
    const recentSales = await prisma.sale.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: {
            name: true
          }
        },
        user: {
          select: {
            name: true
          }
        }
      }
    });

    const stats = {
      todaysSales: todaysSales.length,
      todaysRevenue,
      revenueChange: yesterdaysRevenue > 0 ? 
        ((todaysRevenue - yesterdaysRevenue) / yesterdaysRevenue) * 100 : 0,
      totalProducts,
      totalCustomers,
      lowStockProducts,
      recentSales
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};