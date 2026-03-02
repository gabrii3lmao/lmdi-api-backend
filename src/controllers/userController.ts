import type { NextFunction, Request, Response } from "express";
import User from "../models/userModel.js";
import generateToken from "../services/jwtService.js";

export class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const existUser = await User.findOne({ email });
      if (existUser) {
        return res.status(409).json({ error: "Email is already registed" });
      }

      const user = await User.create({ name, email, password });
      return res.status(201).json({ message: "User registered successfuly!" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user || !(await user.isValidPassword(password))) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      const token = generateToken({ id: user.id, email: user.email });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
      });

      return res.json({
        message: "Login successful!",
        token,
        username: user.name,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getUsers(req: Request, res: Response) {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch users" });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      res.cookie("token", "", { maxAge: 0 });

      res.status(200).json({ message: "Logged out successfully!" });
    } catch (error: any) {
      console.log("Error in logout controller", error.message);

      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
