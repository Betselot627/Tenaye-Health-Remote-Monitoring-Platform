import { setDefaultResultOrder, setServers } from 'dns';
setDefaultResultOrder('ipv4first');
setServers(['8.8.8.8', '1.1.1.1']);

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Routes
import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import trackerRoutes from "./routes/trackerRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import callRoutes from "./routes/callRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Connect MongoDB
connectDB();

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/receipts');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/trackers", trackerRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/call", callRoutes);
app.use("/api/admin", adminRoutes);

app.get("/health", (_, res) => res.json({ status: "ok", db: "mongodb" }));

// Socket.IO — WebRTC signaling
io.on("connection", (socket) => {
  console.log(`[Socket] Connected: ${socket.id}`);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", socket.id);
  });

  socket.on("offer", ({ roomId, offer }) =>
    socket.to(roomId).emit("offer", { offer, from: socket.id }),
  );
  socket.on("answer", ({ roomId, answer }) =>
    socket.to(roomId).emit("answer", { answer, from: socket.id }),
  );
  socket.on("ice-candidate", ({ roomId, candidate }) =>
    socket.to(roomId).emit("ice-candidate", { candidate, from: socket.id }),
  );

  socket.on("end-call", ({ roomId }) => {
    socket.to(roomId).emit("call-ended");
    socket.leave(roomId);
  });

  socket.on("disconnect", () =>
    console.log(`[Socket] Disconnected: ${socket.id}`),
  );
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => console.log(`[Server] Running on port ${PORT}`));
