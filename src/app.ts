import express, { Application, Request, Response } from "express";
import cors from "cors";
import { ProductRoutes } from "./app/modules/product/product.route";
import { OrderRoutes } from "./app/modules/order/order.route";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFoundRoute from "./app/middlewares/notFoundRoute";
import { UserRoutes } from "./app/modules/user/user.route";
const app: Application = express();

// parsers
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/api/products", ProductRoutes);

app.use("/api/orders", OrderRoutes);

app.use("/api/users", UserRoutes);

// controller func
const getAController = async (req: Request, res: Response) => {
  res.send("Welcome to Doodle Stationery Shop!");
};

app.get("/", getAController);

app.use(globalErrorHandler);

app.use(notFoundRoute);

export default app;
