import type { Request, Response } from "express";
import type { UserService } from "./User.service.js";
import { userValidationSchema, loginValidationSchema } from "./dto/User.dto.js";
import { ZodError } from "zod";

export class UserController {
  constructor(private readonly _userService: UserService) {}

  register = async (req: Request, res: Response) => {
    try {
      const validatedData = userValidationSchema.parse(req.body);
      const user = await this._userService.register(validatedData);

      return res.status(201).json(user);
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const validatedData = loginValidationSchema.parse(req.body);
      const { token, user } = await this._userService.login(validatedData);

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 3600000,
      });

      return res.json({
        message: "Login bem-sucedido!",
        token,
        user,
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  logout = async (_req: Request, res: Response) => {
    res.clearCookie("token");
    return res.json({ message: "Logout realizado com sucesso" });
  };

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      await this._userService.forgotPassword(email);

      return res.status(200).json({ message: "Email de recuperação enviado!" });
    } catch (error: any) {
  
      if (error.message === "Email not found") {
        return res.status(404).json({ error: "E-mail não encontrado." });
      }
      return this.handleError(res, error);
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      await this._userService.resetPassword(token as string, password);

      return res.status(200).json({ message: "Senha atualizada com sucesso!" });
    } catch (error: any) {
      if (error.message === "Invalid or expired token") {
        return res.status(400).json({ error: "Token inválido ou expirado." });
      }
      return this.handleError(res, error);
    }
  };

  private handleError(res: Response, error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Dados inválidos",
        details: error.format,
      });
    }

    if (
      error.message.includes("Invalid credentials") ||
      error.message.includes("not found")
    ) {
      return res.status(401).json({ error: "E-mail ou senha incorretos" });
    }
    if (error.message.includes("Email already in use")) {
      return res.status(409).json({ error: "E-mail já em uso" });
    }

    console.error(error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
