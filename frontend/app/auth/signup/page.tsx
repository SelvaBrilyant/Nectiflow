import { AuthLayout } from "@/components/auth/auth-layout";
import { SignupForm } from "@/components/auth/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account",
};

export default function SignupPage() {
  return (
    <AuthLayout
      image="/auth/banner1.jpg"
      title="Create an account"
      subtitle="Enter your information to get started"
    >
      <SignupForm />
    </AuthLayout>
  );
}