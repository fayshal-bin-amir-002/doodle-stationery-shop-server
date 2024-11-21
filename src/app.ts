import express, { Application, Request, Response } from "express";
import cors from "cors";
import { ProductRoutes } from "./app/modules/product/product.route";
import { OrderRoutes } from "./app/modules/order/order.route";
const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// parser for product routes
app.use("/api/products", ProductRoutes);
// parser for order routes
app.use("/api/orders", OrderRoutes);

// controller func
const getAController = async (req: Request, res: Response) => {
  res.send("Welcome to Doodle Stationery Shop!");
};

app.get("/", getAController);

export default app;
