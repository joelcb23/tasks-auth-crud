import { Router } from "express";
import {
  isAdmin,
  isModeratorOrAdmin,
  verifyToken,
} from "../middlewares/authJwt.js";
import { deleteUser, getUsers } from "../controllers/user.controller.js";

const router = Router();

router.get("/", [verifyToken, isModeratorOrAdmin], getUsers);
router.delete("/:userId", [verifyToken, isAdmin], deleteUser);

export default router;
