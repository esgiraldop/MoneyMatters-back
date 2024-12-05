import * as nodemailer from "nodemailer";
import { Injectable } from "@nestjs/common";

export function EnvConfig() {
  return {
    userMail: process.env.USER_MAIL,
    userMailPassword: process.env.USER_MAIL_PASSWORD,
  };
}

@Injectable()
export class MailConfig {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EnvConfig().userMail,
        pass: EnvConfig().userMailPassword,
      },
    });
  }

  public async sendMail(
    mailOptions: nodemailer.SendMailOptions
  ): Promise<void> {
    try {
      await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }
}
