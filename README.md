# Point of Sale (POS) System

A complete, production-ready Point of Sale web application built with React, Node.js, PostgreSQL, and modern web technologies.

## 🚀 Features

- **Multi-role Authentication** (Admin, Cashier, Inventory Manager)
- **Product Management** with barcode generation and image upload
- **Sales Processing** with multiple payment methods
- **Customer Management** with profiles and history
- **Real-time Inventory** tracking with low-stock alerts
- **Comprehensive Reports** (Sales, Inventory) with CSV/PDF export
- **Responsive Design** with dark/light mode
- **Offline Mode** with local storage syncing
- **Role-based Dashboards** with custom widgets

## 🛠 Tech Stack

### Frontend
- React 18 + TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Zustand for state management
- React Router v6 for routing
- Framer Motion for animations
- Axios for API calls

### Backend
- Node.js with Express.js
- PostgreSQL with Prisma ORM
- JWT authentication (access & refresh tokens)
- Multer for file uploads
- ES Modules

### DevOps
- Docker & Docker Compose
- Production-ready configurations

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Quick Start with Docker

1. Clone the repository
```bash
git clone <repository-url>
cd pos-system
```

2. Start with Docker Compose
```bash
docker-compose up -d
```

3. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Manual Installation

1. Install all dependencies
```bash
npm run install:all
```

2. Setup PostgreSQL database
```bash
createdb pos_system
```

3. Configure environment variables
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your database credentials
```

4. Run database migrations
```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

5. Start development servers
```bash
npm run dev
```

## 🔧 Environment Configuration

### Backend (.env)
```
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://username:password@localhost:5432/pos_system
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
UPLOAD_PATH=./uploads
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=POS System
```

## 📱 Default Users

After seeding, you can login with:

**Admin:**
- Email: admin@pos.com
- Password: admin123

**Cashier:**
- Email: cashier@pos.com
- Password: cashier123

**Inventory Manager:**
- Email: inventory@pos.com
- Password: inventory123

## 🏗 Project Structure

```
pos-system/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── config/         # Database & environment config
│   │   ├── middleware/     # Auth & error handling
│   │   ├── modules/        # Feature modules
│   │   │   ├── auth/
│   │   │   ├── products/
│   │   │   ├── sales/
│   │   │   ├── customers/
│   │   │   └── reports/
│   │   ├── app.js
│   │   └── server.js
│   ├── prisma/
│   └── uploads/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores
│   │   ├── layouts/       # Layout components
│   │   └── routes/        # Route definitions
│   └── public/
└── docker-compose.yml
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/:id/upload` - Upload product image

### Sales
- `GET /api/sales` - List sales
- `POST /api/sales` - Create sale
- `GET /api/sales/:id` - Get sale details

### Customers
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Reports
- `GET /api/reports/sales` - Sales reports
- `GET /api/reports/inventory` - Inventory reports

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Start backend in production
cd ../backend
NODE_ENV=production npm start
```

### Docker Deployment
```bash
docker-compose up -d
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support, email support@possystem.com or create an issue in the repository.