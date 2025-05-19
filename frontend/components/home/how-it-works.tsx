"use client";

import { UserCircle2, Upload, Search, Send } from "lucide-react";

const steps = [
  {
    icon: <UserCircle2 className="h-8 w-8 text-blue-600" />,
    title: "Create account",
    description: "Create an account to get started with your job search journey."
  },
  {
    icon: <Upload className="h-8 w-8 text-blue-600" />,
    title: "Upload CV/Resume",
    description: "Upload your CV or resume to showcase your skills and experience."
  },
  {
    icon: <Search className="h-8 w-8 text-blue-600" />,
    title: "Find suitable job",
    description: "Search and filter through thousands of job listings to find your perfect match."
  },
  {
    icon: <Send className="h-8 w-8 text-blue-600" />,
    title: "Apply job",
    description: "Apply to jobs with just one click and track your application status."
  }
];

export default function HowItWorks() {
  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How Jobpilot Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-white p-4 rounded-full shadow-sm">
                  {step.icon}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-[2px]">
                  <div className="w-full h-full border-t-2 border-dashed border-blue-200" />
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}