import express, { Application, Request, Response } from "express";
import cors from "cors";
const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

const getAController = async (req: Request, res: Response) => {
  res.send("Hello World!");
};

app.get("/", getAController);

export default app;
