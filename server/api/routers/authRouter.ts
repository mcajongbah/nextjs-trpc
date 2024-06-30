import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/trpc";
import {
  sendPasswordChangedEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "@/utils/email";
import { TRPCError } from "@trpc/server";
import { compare, hash } from "bcryptjs";
import { z } from "zod";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name, email, password } = input;
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }
      const hashedPassword = await hash(password, 10);
      const user = await ctx.prisma.user.create({
        data: { name, email, password: hashedPassword },
      });

      if (!user || !user.email) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
        });
      }

      const verificationToken = await ctx.prisma.verificationToken.create({
        data: {
          identifier: user.email,
          token: crypto.randomUUID(),
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      });
      await sendVerificationEmail(user.email, verificationToken.token);
      return { success: true };
    }),

  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { token } = input;
      const verificationToken = await ctx.prisma.verificationToken.findUnique({
        where: { token },
      });
      if (!verificationToken) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid token",
        });
      }
      if (verificationToken.expires < new Date()) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Token expired",
        });
      }
      await ctx.prisma.user.update({
        where: { email: verificationToken.identifier },
        data: { emailVerified: new Date() },
      });
      await ctx.prisma.verificationToken.delete({
        where: { id: verificationToken.id },
      });
      return { success: true };
    }),

  forgotPassword: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      const { email } = input;
      const user = await ctx.prisma.user.findUnique({ where: { email } });

      if (user) {
        const resetToken = await ctx.prisma.passwordResetToken.create({
          data: {
            userId: user.id,
            token: crypto.randomUUID(),
            expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
          },
        });
        await sendPasswordResetEmail(user.email!, resetToken.token);
      }
      // Always return success to prevent email enumeration
      return { success: true };
    }),

  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { token, password } = input;
      const resetToken = await ctx.prisma.passwordResetToken.findUnique({
        where: { token },
        include: { user: true },
      });
      if (!resetToken || resetToken.expires < new Date()) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Invalid or expired token",
        });
      }
      const hashedPassword = await hash(password, 10);
      await ctx.prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      });
      await ctx.prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      });
      return { success: true };
    }),

  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(8),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { currentPassword, newPassword } = input;
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      });
      if (!user || !user.password) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      const isPasswordValid = await compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Current password is incorrect",
        });
      }
      const hashedPassword = await hash(newPassword, 10);
      await ctx.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      // send email to user about password change
      await sendPasswordChangedEmail(user.email!, "support@yourdomain.com"); // replace with your support email
      return { success: true };
    }),
});
