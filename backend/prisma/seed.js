import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default store settings
  await prisma.storeSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      storeName: 'Demo POS Store',
      storeAddress: '123 Main Street, City, State 12345',
      storePhone: '+1-555-123-4567',
      storeEmail: 'store@pos.com',
      taxRate: 8.5,
      currency: 'USD',
      receiptNote: 'Thank you for your business!'
    }
  });

  // Create users
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pos.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@pos.com',
      passwordHash: hashedPassword,
      role: 'ADMIN'
    }
  });

  const cashier = await prisma.user.upsert({
    where: { email: 'cashier@pos.com' },
    update: {},
    create: {
      name: 'Cashier User',
      email: 'cashier@pos.com',
      passwordHash: await bcrypt.hash('cashier123', 10),
      role: 'CASHIER'
    }
  });

  const inventory = await prisma.user.upsert({
    where: { email: 'inventory@pos.com' },
    update: {},
    create: {
      name: 'Inventory Manager',
      email: 'inventory@pos.com',
      passwordHash: await bcrypt.hash('inventory123', 10),
      role: 'INVENTORY_MANAGER'
    }
  });

  // Create sample customers
  const customers = await Promise.all([
    prisma.customer.upsert({
      where: { id: 'customer-1' },
      update: {},
      create: {
        id: 'customer-1',
        name: 'John Doe',
        phone: '+1-555-0101',
        email: 'john@example.com',
        address: '456 Oak Ave, City, State'
      }
    }),
    prisma.customer.upsert({
      where: { id: 'customer-2' },
      update: {},
      create: {
        id: 'customer-2',
        name: 'Jane Smith',
        phone: '+1-555-0102',
        email: 'jane@example.com',
        address: '789 Pine St, City, State'
      }
    })
  ]);

  // Create sample products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { sku: 'PROD-001' },
      update: {},
      create: {
        sku: 'PROD-001',
        name: 'Wireless Bluetooth Headphones',
        category: 'Electronics',
        price: 99.99,
        costPrice: 60.00,
        stockQty: 50,
        reorderLevel: 10,
        barcode: '1234567890123'
      }
    }),
    prisma.product.upsert({
      where: { sku: 'PROD-002' },
      update: {},
      create: {
        sku: 'PROD-002',
        name: 'Coffee Mug - Ceramic',
        category: 'Home & Kitchen',
        price: 12.99,
        costPrice: 6.50,
        stockQty: 100,
        reorderLevel: 20,
        barcode: '1234567890124'
      }
    }),
    prisma.product.upsert({
      where: { sku: 'PROD-003' },
      update: {},
      create: {
        sku: 'PROD-003',
        name: 'Notebook - A5 Lined',
        category: 'Stationery',
        price: 8.50,
        costPrice: 4.00,
        stockQty: 75,
        reorderLevel: 15,
        barcode: '1234567890125'
      }
    }),
    prisma.product.upsert({
      where: { sku: 'PROD-004' },
      update: {},
      create: {
        sku: 'PROD-004',
        name: 'USB-C Cable - 6ft',
        category: 'Electronics',
        price: 15.99,
        costPrice: 8.00,
        stockQty: 30,
        reorderLevel: 10,
        barcode: '1234567890126'
      }
    }),
    prisma.product.upsert({
      where: { sku: 'PROD-005' },
      update: {},
      create: {
        sku: 'PROD-005',
        name: 'Water Bottle - Stainless Steel',
        category: 'Sports & Outdoors',
        price: 24.99,
        costPrice: 12.00,
        stockQty: 25,
        reorderLevel: 8,
        barcode: '1234567890127'
      }
    })
  ]);

  // Create sample sales
  const receiptNumber = `RCP-${Date.now()}`;
  const sale = await prisma.sale.create({
    data: {
      userId: cashier.id,
      customerId: customers[0].id,
      totalAmount: 128.48,
      paymentMethod: 'CASH',
      discount: 5.00,
      tax: 10.98,
      receiptNumber,
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            unitPrice: 99.99,
            subtotal: 99.99
          },
          {
            productId: products[1].id,
            quantity: 2,
            unitPrice: 12.99,
            subtotal: 25.98
          }
        ]
      }
    }
  });

  // Update product stock after sale
  await prisma.product.update({
    where: { id: products[0].id },
    data: { stockQty: { decrement: 1 } }
  });
  
  await prisma.product.update({
    where: { id: products[1].id },
    data: { stockQty: { decrement: 2 } }
  });

  // Create inventory logs
  await Promise.all([
    prisma.inventoryLog.create({
      data: {
        productId: products[0].id,
        userId: cashier.id,
        changeQty: -1,
        reason: 'SALE',
        notes: `Sale ${receiptNumber}`
      }
    }),
    prisma.inventoryLog.create({
      data: {
        productId: products[1].id,
        userId: cashier.id,
        changeQty: -2,
        reason: 'SALE',
        notes: `Sale ${receiptNumber}`
      }
    })
  ]);

  console.log('✅ Database seeding completed successfully!');
  console.log('📋 Default users created:');
  console.log('   Admin: admin@pos.com / admin123');
  console.log('   Cashier: cashier@pos.com / cashier123');
  console.log('   Inventory: inventory@pos.com / inventory123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });