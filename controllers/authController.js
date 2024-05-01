import { request, response } from "express";
import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import fs from "fs";

export const registerController = async (req, res) => {
  try {
    const { name, lastname, email, password, age, genre, events, role } =
      req.fields;
    const { photo } = req.files;

    // Validar datos de entrada
    if (
      !name ||
      !lastname ||
      !email ||
      !password ||
      !age ||
      !genre ||
      !events ||
      !role
    ) {
      return res.status(400).send({ message: "All fields are required" });
    }
    if (photo && photo.size > 1000000) {
      return res
        .status(400)
        .send({ message: "Photo is required and should be less than 1mb" });
    }

    // Verificar si el usuario ya existe
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        message: "User already exists, please login",
      });
    }

    // Hash de la contrasena
    const hashedPassword = await hashPassword(password);

    //Crear nuevo usuario
    const newUser = await userModel({
      name,
      lastname,
      email,
      password: hashedPassword,
      age,
      genre,
      events,
      role,
    });

    // Guardar foto si esta presente
    if (photo) {
      newUser.photo.data = fs.readFileSync(photo.path);
      newUser.photo.contentType = photo.type;
    }

    //Guardar usuario en la base de datos
    await newUser.save();

    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error: error.message,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is nor registered",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }

    const token = await JWT.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};
