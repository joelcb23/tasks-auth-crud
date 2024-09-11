import jwt from "jsonwebtoken";
import { parse } from "cookie";
import prisma from "../db.js";
import config from "../config/config.js";
import { convertDateToISO } from "../utils/convertDate.js";

export const getTasksByUserId = async (req, res) => {
  const { listId } = req.params;
  console.log(listId);
  try {
    const cookies = parse(req.headers.cookie);
    const token = cookies.token;
    if (!token) return res.status(403).json({ message: "No token provided" });
    const decoded = await jwt.verify(token, config.SECRET);
    req.id = decoded.id;

    const list = await prisma.list.findUnique({
      where: {
        id: Number(listId),
        userId: req.id,
      },
    });
    if (!list) return res.status(404).json({ message: "List not found" });

    const tasks = await prisma.task.findMany({
      where: {
        listId: list.id,
        userId: req.id,
      },
    });
    if (tasks.length === 0)
      return res.status(404).json({ message: "No tasks found" });

    res.status(201).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  const { name, description, complete, completeTo } = req.body;
  const { listId } = req.params;
  try {
    const cookies = parse(req.headers.cookie);
    const token = cookies.token;
    if (!token) return res.status(403).json({ message: "No token provided" });
    const decoded = await jwt.verify(token, config.SECRET);
    req.id = decoded.id;

    const list = await prisma.list.findUnique({
      where: {
        id: Number(listId),
        userId: req.id,
      },
    });
    if (!list) return res.status(404).json({ message: "List not found" });

    const task = await prisma.task.create({
      data: {
        name,
        description,
        complete,
        completeTo: convertDateToISO(completeTo),
        userId: req.id,
        listId: list.id,
      },
    });

    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { name, description, complete, completeTo } = req.body;
  const { listId, taskId } = req.params;
  try {
    const cookies = parse(req.headers.cookie);
    const token = cookies.token;
    if (!token) return res.status(403).json({ message: "No token provided" });
    const decoded = await jwt.verify(token, config.SECRET);
    req.id = decoded.id;

    const list = await prisma.list.findUnique({
      where: {
        id: Number(listId),
        userId: req.id,
      },
    });
    if (!list) return res.status(404).json({ message: "List not found" });

    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId),
        userId: req.id,
        listId: list.id,
      },
      data: {
        name,
        description,
        complete,
        completeTo: convertDateToISO(completeTo),
      },
    });
    if (!updatedTask)
      return res.status(404).json({ message: "Task not found" });

    res.status(201).json({ updatedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  const { listId, taskId } = req.params;
  try {
    const cookies = parse(req.headers.cookie);
    const token = cookies.token;
    if (!token) return res.status(403).json({ message: "No token provided" });
    const decoded = await jwt.verify(token, config.SECRET);
    req.id = decoded.id;

    const list = await prisma.list.findUnique({
      where: {
        id: Number(listId),
        userId: req.id,
      },
    });
    if (!list) return res.status(404).json({ message: "List not found" });

    const deletedTask = await prisma.task.delete({
      where: {
        id: Number(taskId),
        userId: req.id,
        listId: list.id,
      },
    });
    if (!deletedTask)
      return res.status(404).json({ message: "Task not found" });

    res.status(201).json({ message: "Task deleted", deletedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
