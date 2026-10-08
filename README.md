# AgriConnect — Farmer to Customer Marketplace
## Stack: Java Spring Boot + MySQL + React + Razorpay + Maven
---
## 📁 Project Structure
```
farmer connect customer/
├── springboot-backend/          ← NEW Java Spring Boot Backend
│   ├── pom.xml
│   └── src/main/java/com/agriconnect/
│       ├── entity/              (User, Product, CartItem, Order, OrderItem)
│       ├── repository/          (JPA repositories)
│       ├── service/             (UserService, ProductService, CartService, OrderService, PaymentService)
│       ├── controller/          (AuthController, ProductController, CartController, OrderController, PaymentController)
│       ├── config/              (SecurityConfig, JwtUtil, JwtAuthFilter)
│       └── dto/                 (LoginRequest/Response, ProductDto, CartItemDto, OrderDto, PaymentDtos)
├── frontend/                    ← React + Vite Frontend (rebuilt)
│   └── src/
│       ├── pages/               (LandingPage, Login, Register, Home, ProductList, Cart, Checkout, Orders, SellerDashboard, SellerOrders, PaymentSuccess)
│       ├── components/          (Navbar, ProductCard)
│       ├── api.js               (Axios API client)
│       └── store.js             (Zustand global state)
└── database/
    └── init.sql                 (MySQL schema + 22 seed products)
```
---
## ⚙️ Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8.0+
- Node.js 18+
---
## 🚀 Setup & Run
### Step 1 — MySQL Setup
```sql
-- In MySQL client:
CREATE DATABASE IF NOT EXISTS agriconnect;
-- Tables are AUTO-created by Spring JPA on first run
```
### Step 2 — Configure Backend
Edit `springboot-backend/src/main/resources/application.properties`:
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD   # change from 'root'

# Get from https://dashboard.razorpay.com (test mode)
razorpay.key.id=rzp_test_YOUR_KEY_ID
razorpay.key.secret=YOUR_KEY_SECRET
```
### Step 3 — Run Spring Boot Backend
```bash
cd springboot-backend
mvn spring-boot:run
```
### Step 4 — Seed Database (after first run)
```bash
# Run the init.sql to add sample data
mysql -u root -p agriconnect < database/init.sql
```
### Step 5 — Run React Frontend
```bash
cd frontend
npm install
npm run dev
```
---
## 🔑 Demo Accounts (after seeding)
| Role     | Username        | Password    |
|----------|-----------------|-------------|
| Farmer   | raju_farmer     | password123 |
| Farmer   | meena_farmer    | password123 |
| Customer | priya_customer  | password123 |
---
## 💳 Razorpay Test Payment
Use these test card details:
- **Card**: 4111 1111 1111 1111
- **CVV**: 123
- **Expiry**: Any future date
- **OTP**: 1234
---
## 📡 API Endpoints

| Method | Endpoint                    | Auth       | Description              |
|--------|-----------------------------|------------|--------------------------|
| POST   | /api/auth/register          | Public     | Register (FARMER/CUSTOMER) |
| POST   | /api/auth/login             | Public     | Login, returns JWT       |
| GET    | /api/products               | Public     | List products            |
| GET    | /api/products/{id}          | Public     | Product detail           |
| POST   | /api/products               | FARMER     | Add product              |
| PUT    | /api/products/{id}          | FARMER     | Update product           |
| DELETE | /api/products/{id}          | FARMER     | Delete product           |
| GET    | /api/cart                   | CUSTOMER   | View cart                |
| POST   | /api/cart                   | CUSTOMER   | Add to cart              |
| PUT    | /api/cart/{id}              | CUSTOMER   | Update quantity          |
| DELETE | /api/cart/{id}              | CUSTOMER   | Remove item              |
| POST   | /api/payment/create-order   | Auth       | Create Razorpay order    |
| POST   | /api/payment/verify         | Auth       | Verify payment signature |
| POST   | /api/orders                 | CUSTOMER   | Place order              |
| GET    | /api/orders                 | CUSTOMER   | My orders                |
| GET    | /api/orders/farmer          | FARMER     | Incoming orders          |
