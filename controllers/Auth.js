import Users from "../models/UserModel.js";
import argon2 from "argon2";

const statusCodes = {
  SUCCESS: 200,
  USER_NOT_FOUND: 404,
  INVALID_CREDENTIALS: 400,
  INTERNAL_SERVER_ERROR: 500,
};

const messages = {
  SUCCESS: "Login berhasil",
  USER_NOT_FOUND: "Pengguna tidak ditemukan",
  INVALID_CREDENTIALS: "Email atau password salah",
  INTERNAL_SERVER_ERROR: "Terjadi kesalahan pada server",
};

export const Register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  const userRole = "pengguna";

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ msg: "Password and Confirm Password do not match" });
  }

  const existingUser = await Users.findOne({ where: { email: email } });
  if (existingUser) {
    return res.status(400).json({ msg: "Email is already in use" });
  }

  const hashPassword = await argon2.hash(password);

  try {
    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
      role: userRole,
    });
    res.status(201).json({ msg: "Registration Successful" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const Login = async (req, res) => {
  try {
    // Finding user based on the provided email
    const data = await Users.findOne({
      where: {
        email: req.body.email,
      },
    });

    // Checking if user exists
    const match = data !== null;

    // Defining status code and message based on the match result
    const statusCode = match
      ? statusCodes.SUCCESS
      : statusCodes.INVALID_CREDENTIALS;
    const message = match ? messages.SUCCESS : messages.INVALID_CREDENTIALS;

    // Building the response payload
    const responsePayload = {
      status: statusCode,
      success: match,
      message,
    };

    if (match) {
      const { uuid, name, email, role } = data;
      responsePayload.data = {
        uuid,
        name,
        email,
        role,
      };
    }

    res.status(statusCode).json(responsePayload);
  } catch (error) {
    // console.error(error);
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: messages.INTERNAL_SERVER_ERROR });
  }
};

export const Me = async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ msg: "Unauthenticated" });
  const user = await Users.findOne({
    attributes: ["uuid", "name", "email", "role"],
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.status(200).json(user);
};

export const Logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: err.message });
  });
  res.status(200).json({ msg: "Logout success" });
};
