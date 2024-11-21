import express, { Application, Request, Response } from "express";
import cors from "cors";
const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// controller func
const getAController = async (req: Request, res: Response) => {
  res.send("Welcome to Doodle Stationery Shop!");
};

app.get("/", getAController);

export default app;
