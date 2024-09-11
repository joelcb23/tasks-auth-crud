import jwt from "jsonwebtoken";
import { parse } from "cookie";
import prisma from "../db.js";
import config from "../config/config.js";

export const getListByUserId = async (req, res) => {
  try {
    const cookies = parse(req.headers.cookie);
    const token = cookies.token;
    if (!token) return res.status(403).json({ message: "No token provided" });
    const decoded = await jwt.verify(token, config.SECRET);
    req.id = decoded.id;

    const lists = await prisma.list.findMany({
      where: {
        userId: req.id,
      },
    });
    if (lists.length === 0)
      return res.status(404).json({ message: "No lists found" });

    res.status(201).json({ lists });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createList = async (req, res) => {
  const { name, description } = req.body;
  try {
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.token;
    if (!token) return res.status(403).json({ message: "No token provided" });
    const decoded = await jwt.verify(token, config.SECRET);
    req.id = decoded.id;

    const list = await prisma.list.create({
      data: {
        name,
        description,
        userId: req.id,
      },
    });

    res.status(201).json({ list });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateList = async (req, res) => {
  const { name, description } = req.body;
  const { listId } = req.params;
  try {
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.token;
    if (!token) return res.status(403).json({ message: "No token provided" });
    const decoded = await jwt.verify(token, config.SECRET);
    req.id = decoded.id;

    const updatedList = await prisma.list.update({
      where: {
        id: Number(listId),
        userId: req.id,
      },
      data: {
        name,
        description,
      },
    });

    if (!updatedList)
      return res.status(404).json({ message: "List not found" });

    res.status(201).json({ updatedList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteList = async (req, res) => {
  const { listId } = req.params;
  try {
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.token;
    if (!token) return res.status(403).json({ message: "No token provided" });
    const decoded = await jwt.verify(token, config.SECRET);
    req.id = decoded.id;
    const deletedList = await prisma.list.delete({
      where: {
        id: Number(listId),
        userId: req.id,
      },
    });

    if (!deletedList)
      return res.status(404).json({ message: "List not found" });

    res.status(201).json({ message: "List deleted", deletedList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
