import express from "express";
import cors from "cors";

// this is intitialization of APP using Express
export const createServer = () => {
  const app = express();

  app.use(cors());

  app.use(express.json());

  return app;
};
