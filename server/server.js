import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import ConnectToMongoDB from "./db/ConnectToMongoDB.js";
import protectRoute from "./middlewares/protectRoute.js";

const app = express();
const PORT = process.env.PORT || 8000;

dotenv.config();

app.use(express.json()); //to parse income request with json payloads (req.body);
app.use(cookieParser()); //to parse income request with json payloads (req.body);

app.use("/api/auth", authRoutes);
app.use("/api/messages", protectRoute, messageRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => res.send("Hello World!"));


app.listen(PORT, () => {
  ConnectToMongoDB();
  console.log(`server running on port ${PORT}`);
});