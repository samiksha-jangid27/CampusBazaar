require("dotenv").config();      // LOAD ENV FIRST
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");


// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/listings", require("./routes/listingRoutes"));

app.get("/", (req, res) => {
  res.status(200).json({ message: "CampusBazaar API is running" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});