const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());
// Middleware untuk parsing body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing
const authRoutes = require("./routes/authRoutes");
const rekeningRoutes = require("./routes/rekeningRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

app.use("/api/finance", authRoutes);
app.use("/api/finance", rekeningRoutes);
app.use("/api/finance", transactionRoutes);

// Server listen
app.listen(port, () => {
  console.log(`🚀 Server listening on http://localhost:${port}`);
});
