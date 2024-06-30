// src/utils/email.ts
import { Resend } from "resend";
import { render } from "@react-email/render";
import { VerificationEmail } from "@/emails/verification-email";
import { PasswordResetEmail } from "@/emails/password-reset";
import { PasswordChangedEmail } from "@/emails/password-changed";
// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Load environment variables
const APP_NAME = process.env.EMAIL_FROM || "Your App";
const EMAIL_FROM = process.env.EMAIL_FROM || "noreply@yourdomain.com";
const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${BASE_URL}/verify-email?token=${token}`;
  const emailHtml = render(VerificationEmail({ verificationLink }));

  try {
    await resend.emails.send({
      from: `${APP_NAME} <${EMAIL_FROM}>`,
      to: email,
      subject: `Verify your email for ${APP_NAME}`,
      html: emailHtml,
    });
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${BASE_URL}/reset-password?token=${token}`;
  const emailHtml = render(PasswordResetEmail({ resetLink }));

  try {
    await resend.emails.send({
      from: `${APP_NAME} <${EMAIL_FROM}>`,
      to: email,
      subject: `Reset your password for ${APP_NAME}`,
      html: emailHtml,
    });
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
}

export async function sendPasswordChangedEmail(email: string, loginLink: string) {
  const emailHtml = render(PasswordChangedEmail({ loginLink, supportEmail: EMAIL_FROM }));

  try {
    await resend.emails.send({
      from: `${APP_NAME} <${EMAIL_FROM}>`,
      to: email,
      subject: `Your password has been changed for ${APP_NAME}`,
      html: emailHtml,
    });
    console.log("Password changed email sent successfully");
  } catch (error) {
    console.error("Error sending password changed email:", error);
    throw new Error("Failed to send password changed email");
  }
}
