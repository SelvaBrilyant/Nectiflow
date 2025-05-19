"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Briefcase } from "lucide-react";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  active?: boolean;
};

const NavLink = ({ href, children, active }: NavLinkProps) => (
  <Link 
    href={href} 
    className={cn(
      "text-sm font-medium transition-colors hover:text-blue-600",
      active ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
    )}
  >
    {children}
  </Link>
);

export default function MainNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mr-6">
        <Briefcase className="h-6 w-6 text-blue-600" />
        <span className="text-xl font-bold text-gray-900">Jobpilot</span>
      </Link>

      {/* Main Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        <NavLink href="/" active={pathname === "/"}>Home</NavLink>
        <NavLink href="/find-job" active={pathname === "/find-job"}>Find Job</NavLink>
        <NavLink href="/employers" active={pathname === "/employers"}>Employers</NavLink>
        <NavLink href="/candidates" active={pathname === "/candidates"}>Candidates</NavLink>
        <NavLink href="/pricing" active={pathname === "/pricing"}>Pricing Plans</NavLink>
        <NavLink href="/support" active={pathname === "/support"}>Customer Support</NavLink>
      </nav>
    </div>
  );
}