import nodemailer from "nodemailer";

import { env } from "../config/env.js";

const isSecurePort = env.SMTP_PORT === 465;

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: isSecurePort,
  requireTLS: !isSecurePort,

  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export const sendEmail = async ({
  to,
  subject,
  html,
}: SendEmailOptions): Promise<void> => {
  await transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject,
    html,
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
): Promise<void> => {
  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${resetToken}`;

  await sendEmail({
    to: email,
    subject: "Reset Your Password",
    html: `
        <h2>Password Reset Request</h2>
  
        <p>You requested to reset your password.</p>
  
        <p>
          Click the link below to reset your password:
        </p>
  
        <a href="${resetUrl}">
          Reset Password
        </a>
  
        <p>This link will expire in 15 minutes.</p>
  
        <p>If you did not request a password reset, please ignore this email.</p>
      `,
  });
};
