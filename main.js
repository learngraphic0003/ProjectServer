const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require('cors');
21
dotenv.config();
connectDB();
const app = express();

// app.use(cors({
//     origin: 'http://localhost:5173', 
//   }))

  app.use(cors());


// Middleware
app.use(express.json());
// Routes
app.use("/api/auth", require("./routes/user.route"));
// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`); });