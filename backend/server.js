require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();
connectDB();

const server = http.createServer(app);

//  Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://bookmycar-tau.vercel.app"
];

//  Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Store io instance globally
app.set("io", io);

//  Socket Connection
io.on("connection", (socket) => {
  console.log("🔌 User Connected:", socket.id);

  socket.on("join", (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`👤 User joined room: ${userId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User Disconnected:", socket.id);
  });
});

//  Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//  Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/variants", require("./routes/variantRoutes"));
app.use("/api/bookings", require("./routes/booking"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/uploads", express.static("uploads"));

//  Start Server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);