import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import prisma from "../db.js";
import { encryptPass, comparePass } from "../utils/encryptPass.js";
import config from "../config/config.js";

export const register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const userExisting = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (userExisting)
      return res.status(400).json({ message: "User already exists" });

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: await encryptPass(password),
        role,
      },
    });

    // create a token
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
        id: user.id,
        email: user.email,
        role: user.role,
      },
      config.SECRET
    );
    // set a cookie
    const serialized = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/",
    });

    res.setHeader("Set-Cookie", serialized);
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // validation
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    // check if user exists
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    // check if password matches
    const matchPassword = await comparePass(password, user.password);
    if (!matchPassword)
      return res.status(400).json({ message: "Invalid credentials" });

    // create a token
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
        id: user.id,
        email: user.email,
        role: user.role,
      },
      config.SECRET
    );
    // set a cookie
    const serialized = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/",
    });

    res.setHeader("Set-Cookie", serialized);
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
