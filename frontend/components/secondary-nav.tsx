"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Phone, ChevronDown } from "lucide-react";

export default function SecondaryNav() {
  return (
    <div className="hidden md:flex items-center gap-4">
      <div className="flex items-center gap-1">
        <Phone className="h-4 w-4 text-blue-600" />
        <span className="text-sm text-gray-600">+91 9876543210</span>
      </div>

      <Link href="/auth/login">
        <Button variant="outline" size="sm">
          Sign In
        </Button>
      </Link>
      
      <Link href="/post-job">
        <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
          Post A Job
        </Button>
      </Link>
    </div>
  );
}