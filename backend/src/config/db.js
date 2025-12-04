const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();  // no adapter needed

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to PostgreSQL via Prisma 5");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
};

module.exports = { prisma, connectDB };
