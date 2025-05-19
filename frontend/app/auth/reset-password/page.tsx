import { AuthLayout } from "@/components/auth/auth-layout";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Create a new password",
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      image="/auth/banner2.jpg"
      title="Reset your password"
      subtitle="Enter your new password below"
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}