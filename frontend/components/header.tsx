"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import MainNav from "./main-nav";
import SecondaryNav from "./secondary-nav";

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

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 px-4 md:px-8",
      isScrolled ? "bg-white shadow-md" : "bg-transparent"
    )}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <MainNav />
          <SecondaryNav />

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 mt-2">
            <nav className="flex flex-col space-y-4">
              <NavLink href="/" active>Home</NavLink>
              <NavLink href="/find-job">Find Job</NavLink>
              <NavLink href="/employers">Employers</NavLink>
              <NavLink href="/candidates">Candidates</NavLink>
              <NavLink href="/pricing">Pricing Plans</NavLink>
              <NavLink href="/support">Customer Support</NavLink>
            </nav>
            <div className="flex flex-col gap-2 mt-4">
              <Link href="/sign-in">
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link href="/post-job">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Post A Job</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}