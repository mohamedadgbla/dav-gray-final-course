require("dotenv").config();

const express = require("express");
const morgan = require("morgan");

const fs = require("fs");
const path = require("path");

const connectDB = require("./config/db");
const userRoute = require("./routes/userRoute");
const auth = require("./middleware/auth");
//const uploadRoutes = require("./routes/upload");
const uploadRoute = require("./routes/upload");

const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());  
//allow specific origin
app.use(cors({ origin: "http://localhost:5173" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later"
});

app.use(limiter);


connectDB();


app.use("/api/v1/users", userRoute);
//app.use("/upload", uploadRoutes);
app.use("/api/v1/upload", uploadRoute);

app.get("/dashboard", auth, (req, res) => {
  res.json({
    message: `Welcome user ${req.user.id}`
  });
});



// Error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  res.status(500).json({
    message: "Internal server error"
  });
});


  // pro error handler with a log file of all errors  but add next to the catch block in the auth.js file
// app.use((err, req, res, next) => {
//   const log = `
// ${new Date().toISOString()}
// Method: ${req.method}
// URL: ${req.originalUrl}
// Error: ${err.message}

// `;

//   fs.appendFileSync(
//     path.join(__dirname, "error.log"),
//     log
//   );

//   res.status(err.statusCode || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error"
//   });
// });



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});