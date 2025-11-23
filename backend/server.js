require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const imageRoutes = require("./routes/imageRoutes");
const authRoutes = require('./routes/authRoutes');


const app = express();
const PORT = 3000;

// MongoDB connection
mongoose.connect("mongodb+srv://bhaveshbirla1_db_user:birladon@cluster0.s3yepor.mongodb.net/?appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// Static files
app.use(express.static("frontend"));
app.use("/static", express.static("static"));
app.use(express.json());
app.use(cors());

// Routes
app.use("/", imageRoutes);
app.use('/', authRoutes);

// Start server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
