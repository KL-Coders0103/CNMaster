import dotenv from "dotenv";
dotenv.config();
import { redisClient } from "./app";
import app from "./app";
import { PrismaClient } from "@prisma/client";

const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

const server = app.listen(PORT, () => {
  console.log(`🚀 CN Backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

const shutdown = async () => {
  console.log("Gracefully shutting down...");
  server.close(async () => {
    console.log("HTTP server closed.");
    
    try {
      await prisma.$disconnect();
      console.log("PostgreSQL connection closed.");
      
      await redisClient.quit();
      console.log("Redis connection closed.");
    } catch (err) {
      console.error("Error during teardown:", err);
    }
    
    process.exit(0);
  });
};

process.on("unhandledRejection", (err: Error) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  shutdown();
});

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);