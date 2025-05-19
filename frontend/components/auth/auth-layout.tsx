"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  image: string;
  title: string;
  subtitle: string;
}

export function AuthLayout({
  children,
  image,
  title,
  subtitle,
}: AuthLayoutProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const isLoginPage = pathname === "/auth/login";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="grid lg:grid-cols-2 min-h-screen">
      <div className="flex items-center justify-center p-4 sm:p-8 md:p-12">
        <div
          className="mx-auto w-full max-w-md space-y-6"
        >
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          {children}
          <div className="text-center text-sm">
            {isLoginPage ? (
              <p>
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
                >
                  Sign up
                </Link>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
                >
                  Log in
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
      <div
        className={cn(
          "hidden lg:block bg-cover bg-center",
          isLoginPage ? "bg-muted" : "bg-muted"
        )}
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="h-full w-full bg-black/20 backdrop-blur-sm">
          <div className="relative h-full w-full bg-gradient-to-t from-black/80 to-transparent">
            <div className="absolute bottom-12 left-12 text-white max-w-md">
              <h2 className="text-2xl font-bold leading-tight mb-2">
                {isLoginPage 
                  ? "Unlock a world of possibilities" 
                  : "Join our growing community today"}
              </h2>
              <p className="text-white/80">
                {isLoginPage
                  ? "Log back in to access your personalized experience and continue your journey."
                  : "Create an account and discover a seamless, secure, and personalized experience."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}