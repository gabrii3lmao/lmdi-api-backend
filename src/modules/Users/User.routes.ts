import express from "express";
import { UserController } from "./User.controller.js";
import { UserService } from "./User.service.js";
import { UserRepository } from "./User.repository.js";
import { EmailService } from "./Email.service.js"; // Criaremos isso

const authRouter = express.Router();

const userRepository = new UserRepository();
const emailService = new EmailService(); 
const userService = new UserService(userRepository, emailService);
const userController = new UserController(userService);

authRouter.post("/signup", userController.register);
authRouter.post("/signin", userController.login);
authRouter.post("/signout", userController.logout);

authRouter.post("/forgot-password", userController.forgotPassword);
authRouter.post("/reset-password/:token", userController.resetPassword);

export default authRouter;
