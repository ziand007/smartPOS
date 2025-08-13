import app from './app.js';
import config from './config/env.js';
import prisma from './config/database.js';

// Test database connection
async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  await connectDatabase();
  
  const server = app.listen(config.PORT, () => {
    console.log(`🚀 Server running on port ${config.PORT}`);
    console.log(`📊 Environment: ${config.NODE_ENV}`);
    console.log(`🔗 Health check: http://localhost:${config.PORT}/health`);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  });

  process.on('SIGINT', async () => {
    console.log('🛑 SIGINT received, shutting down gracefully');
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  });
}

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});