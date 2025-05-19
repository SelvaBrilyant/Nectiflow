import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

type JobCategory = {
  title: string;
  openPositions: number;
  highlighted?: boolean;
};

const categories: JobCategory[] = [
  { title: "Anesthesiologists", openPositions: 45_804 },
  { title: "Surgeons", openPositions: 50_364 },
  { title: "Obstetricians-Gynecologists", openPositions: 4_339 },
  { title: "Orthodontists", openPositions: 20_028 },
  { title: "Maxillofacial Surgeons", openPositions: 74_675 },
  { title: "Software Developer", openPositions: 43_139, highlighted: true },
  { title: "Psychiatrists", openPositions: 18_599 },
  { title: "Data Scientist", openPositions: 25_203, highlighted: true },
  { title: "Financial Manager", openPositions: 61_391 },
  { title: "Management Analysis", openPositions: 93_948 },
  { title: "IT Manager", openPositions: 50_863 },
  { title: "Operations Research Analysis", openPositions: 15_627 },
];

export default function JobCategories() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category, index) => (
        <Link href={`/jobs/${category.title.toLowerCase().replace(/\s+/g, '-')}`} key={index}>
          <Card className={`h-full hover:shadow-md transition-shadow cursor-pointer ${
            category.highlighted ? "border-blue-200 bg-blue-50" : ""
          }`}>
            <CardContent className="p-6">
              <h3 className={`font-semibold text-lg mb-2 ${
                category.highlighted ? "text-blue-700" : "text-gray-800"
              }`}>
                {category.title}
              </h3>
              <p className="text-sm text-gray-500">
                {category.openPositions.toLocaleString()} Open Positions
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}