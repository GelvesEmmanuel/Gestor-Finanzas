// funciones para poder procesar peticios y gestionar rutes de auth.routes.js
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"; // para encriptar passwords
import { createdAccesToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    // validacion de usuario antes de encriptar
    const userFound = await User.findOne({ email });
    if (userFound) return res.status(400).json(["el correo ya esta en uso "]);

    const passwordHashs = await bcrypt.hash(password, 10); // encriptamos la contrasena
    const newUser = new User({
      username,
      email,
      password: passwordHashs,
    });
    //guarda al nuevooo usuario en mongo db
    const userSaved = await newUser.save();

    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  try {
    console.log(username, password);
    const userFound = await User.findOne({ username });
    if (!userFound) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, userFound.password); // ecomparamos contrase;a guardada en bas de datos
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const token = await createdAccesToken({ id: userFound._id });
    console.log("Token generado:", token);
    res.cookie("token", token); // guardo elp token creado como una cookie

    //devuelve el usuario que se ha guardado
    // se modifica para que no devuelva passworr

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};
export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);

  if (!userFound) return res.status(400).json({ message: "user not found" });

  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });

  res.send("profile");
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(400).json({ message: "No esta autorizado" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "No esta autorizado" });

    const userFound = await User.findById(user.id);
    if (!userFound)
      return res.status(401).json({ message: "No esta autorizado" });

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  });
};
