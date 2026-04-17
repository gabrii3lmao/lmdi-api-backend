import nodemailer from "nodemailer";
import "dotenv/config";

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Use variáveis de ambiente!
        pass: process.env.EMAIL_PASS, // Use variáveis de ambiente!
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const mailOptions = {
      from: "no-reply@teste.com",
      to,
      subject: "Recuperação de Senha",
      text: `Você solicitou a alteração de senha. Use o link para alterar a sua senha: \n\n http://localhost:5173/reset-password/${token}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
