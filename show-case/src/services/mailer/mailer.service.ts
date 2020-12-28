import { createTransport } from "nodemailer";
import { smtp } from "../config/config.service";
import * as Mail from "nodemailer/lib/mailer";

export class MailerService {
  private transporter: Mail;
  constructor() {
    this.transporter = createTransport(smtp);
  }

  send(mailOptions: Mail.Options) {
    return this.transporter.sendMail(mailOptions);
  }

  sendPermission(to: string, token) {
    const url = "http://localhost:4200/" + "/auth/sign-in/" + token;
    return this.send({
      from: smtp.from,
      to,
      subject: smtp.sendPermission.subject,
      html: smtp.sendPermission.html(url)
    });
  }
}
