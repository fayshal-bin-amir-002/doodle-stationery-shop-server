# **Doodle Stationery Shop**

A professional and efficient backend system for managing a stationery shop, built using **Express** with **TypeScript**, integrated with **MongoDB** using **Mongoose**. This application ensures data integrity through schema validation and provides a robust framework for handling stationery shop operations.

---

## **Features**

- **CRUD Operations**:
  - Add, view, update, and delete products in the stationery shop.
  - Manage customer orders seamlessly.
- **Data Validation**:
  - Ensures data integrity using Mongoose schema validation and Zod.
- **TypeScript Support**:
  - Strongly-typed codebase for better maintainability and reduced runtime errors.
- **Environment Variables**:
  - Secure sensitive data using `.env` configuration.
- **Code Quality**:
  - Integrated **Prettier** and **ESLint** for consistent code styling and error checking.

---

## **Technologies Used**

- **Backend**: Express.js
- **Database**: MongoDB with Mongoose
- **Language**: TypeScript
- **Validation**: Mongoose Schema, Zod
- **Utilities**: Prettier, ESLint, dotenv

---

## **Getting Started**

Follow these instructions to set up the project locally on your machine.

### **Prerequisites**

Ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud-based, e.g., MongoDB Atlas)

### **Setup Instructions**

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/fayshal-bin-amir-002/doodle-stationery-shop-server.git
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Set Up Environment Variables**:

- Create a .env file in the root directory and configure the following variables:

```bash
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/doodle-shop
```

4. **Run the Application**:

- Development Mode:

```bash
npm run start:dev
```

- Production Mode:

```bash
npm run build
npm run start:prod
```

5. **Lint and Format Code**:

- Check for linting issues:

```bash
npm run lint
```

- Fix linting issues:

```bash
npm run lint:fix
```

- Format code:

```bash
npm run format
```

## **API Endpoints**

### **Products**

- `GET /api/products`  
  Retrieve all products.

- `POST /api/products`  
  Add a new product.

- `PUT /api/products/:id`  
  Update a product by ID.

- `DELETE /api/products/:id`  
  Remove a product by ID.

---

### **Orders**

- `POST /api/orders`  
  Add a new order.

- `GET /api/orders/revenue`  
  Get revenue of orders.
