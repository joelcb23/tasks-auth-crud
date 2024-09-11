import { Router } from "express";
import { verifyToken } from "../middlewares/authJwt.js";
import {
  createTask,
  deleteTask,
  getTasksByUserId,
  updateTask,
} from "../controllers/task.controller.js";

const router = Router();

router.get("/:listId/task/", verifyToken, getTasksByUserId);
router.post("/:listId/task/", verifyToken, createTask);
router.put("/:listId/task/:taskId", verifyToken, updateTask);
router.delete("/:listId/task/:taskId", verifyToken, deleteTask);

export default router;
