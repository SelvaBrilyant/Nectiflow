"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </ThemeProvider>
  );
}