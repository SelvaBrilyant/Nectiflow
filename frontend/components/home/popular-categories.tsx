"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Paintbrush, Code, BarChart3, Video, Music, Wallet, Heart, Database } from "lucide-react";

const categories = [
  {
    icon: <Paintbrush className="h-6 w-6 text-blue-600" />,
    title: "Graphics & Design",
    positions: "357 Open position",
    bg: "bg-blue-50"
  },
  {
    icon: <Code className="h-6 w-6 text-indigo-600" />,
    title: "Code & Programming",
    positions: "312 Open position",
    bg: "bg-indigo-50"
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-green-600" />,
    title: "Digital Marketing",
    positions: "297 Open position",
    bg: "bg-green-50"
  },
  {
    icon: <Video className="h-6 w-6 text-yellow-600" />,
    title: "Video & Animation",
    positions: "247 Open position",
    bg: "bg-yellow-50"
  },
  {
    icon: <Music className="h-6 w-6 text-purple-600" />,
    title: "Music & Audio",
    positions: "204 Open position",
    bg: "bg-purple-50"
  },
  {
    icon: <Wallet className="h-6 w-6 text-pink-600" />,
    title: "Account & Finance",
    positions: "167 Open position",
    bg: "bg-pink-50"
  },
  {
    icon: <Heart className="h-6 w-6 text-red-600" />,
    title: "Health & Care",
    positions: "125 Open position",
    bg: "bg-red-50"
  },
  {
    icon: <Database className="h-6 w-6 text-blue-600" />,
    title: "Data & Science",
    positions: "57 Open position",
    bg: "bg-blue-50",
    highlighted: true
  }
];

export default function PopularCategories() {
  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Popular Category</h2>
          <Link 
            href="/categories" 
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            View All
            <span className="text-xl">→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link href={`/categories/${category.title.toLowerCase().replace(/\s+/g, '-')}`} key={index}>
              <Card className={`hover:shadow-md transition-shadow cursor-pointer ${
                category.highlighted ? "border-blue-200 bg-blue-50" : ""
              }`}>
                <div className="p-6 flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${category.bg}`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category.positions}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}