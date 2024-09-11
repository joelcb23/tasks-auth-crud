import { Router } from "express";
import {
  createList,
  deleteList,
  getListByUserId,
  updateList,
} from "../controllers/list.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", verifyToken, getListByUserId);
router.post("/", verifyToken, createList);
router.put("/:listId", verifyToken, updateList);
router.delete("/:listId", verifyToken, deleteList);

export default router;
