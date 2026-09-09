import { start } from "node:repl";
import app from "./app.js";
import { env } from "./config/env.js";
import prisma from "./config/prisma.js";

const startServer = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

startServer();
