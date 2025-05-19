import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <AuthLayout
      image="/auth/banner5.jpg"
      title="Welcome back"
      subtitle="Enter your credentials to access your account"
    >
      <LoginForm />
    </AuthLayout>
  );
}