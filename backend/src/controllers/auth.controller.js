import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createdAccesToken } from "../libs/jwt.js";


export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    // Verificar si el email ya está en uso
    const userFound = await User.findOne({ email });
    if (userFound) {
      return res.status(400).json(["el correo ya esta en uso "]);
    }

    // Hashear contraseña y crear usuario
    const passwordHash = await bcrypt.hash(password, 10);
    const userSaved = await User.create({
      username,
      email,
      password: passwordHash,
    });

    return res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscar usuario por username
    const userFound = await User.findOne({ username });
    if (!userFound) {
      return res.status(400).json({ message: "User not found" });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Generar token y establecer cookie
    const token = await createdAccesToken({ id: userFound._id });
    res.cookie("token", token, { httpOnly: true });

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  // Eliminar cookie de token
  res.cookie("token", "", { expires: new Date(0) });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  try {
    const userFound = await User.findById(req.user.id);
    if (!userFound) {
      return res.status(400).json({ message: "user not found" });
    }

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(400).json({ message: "No esta autorizado" });
  }

  try {
    const { id: userId } = jwt.verify(token, process.env.TOKEN_SECRET || "default_secret");
    const userFound = await User.findById(userId);

    if (!userFound) {
      return res.status(401).json({ message: "No esta autorizado" });
    }

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  } catch (error) {
    return res.status(401).json({ message: "No esta autorizado" });
  }
};