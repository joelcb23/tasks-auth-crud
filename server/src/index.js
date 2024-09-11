import express from "express";
import authRoutes from "./routes/auth.routes.js";
import listsRoutes from "./routes/list.routes.js";
import tasksRoutes from "./routes/task.routes.js";
import usersRoutes from "./routes/user.routes.js";

const PORT = process.env.PORT || 3000;
const app = express();

// Middlewares
app.use(express.json());

// Routes
app.get("/api", (req, res) => res.send("Hello World!"));
app.use("/api/auth", authRoutes);
app.use("/api/user", usersRoutes);
app.use("/api/list", listsRoutes);
app.use("/api/list", tasksRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
