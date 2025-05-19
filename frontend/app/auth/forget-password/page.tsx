import { AuthLayout } from "@/components/auth/auth-layout";
import { ForgotPasswordForm } from "@/components/auth/forget-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      image="/auth/banner4.jpg"
      title="Forgot your password?"
      subtitle="Enter your email address and we'll send you a link to reset your password"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}