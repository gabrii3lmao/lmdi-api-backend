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
      from: '"Suporte LetMeDoIt" <no-reply@letmedoit.com>',
      to,
      subject: "Recuperação de Senha",
      text: `Olá! 

Recebemos uma solicitação para redefinir a senha da sua conta no LetMeDoIt.

Para prosseguir com a alteração, clique no link abaixo (ou cole no seu navegador):
http://localhost:5173/reset-password/${token}

Este link é válido por apenas 1 hora.

Se você não solicitou essa alteração, por favor, ignore este e-mail. Sua senha permanecerá a mesma e nenhuma ação é necessária.

Atenciosamente,
Equipe LetMeDoIt`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
