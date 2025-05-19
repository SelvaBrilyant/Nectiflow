import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, Building2, MapPin, Search, Users } from "lucide-react";
import JobCategories from "@/components/home/job-categories";
import StatisticCard from "@/components/home/statistic-card";
import Link from "next/link";
import JobSuggestions from "@/components/home/job-suggestions";
import HowItWorks from "@/components/home/how-it-works";
import PopularCategories from "@/components/home/popular-categories";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-50 to-slate-50 pt-20 pb-16 px-4 md:px-8 lg:px-16 overflow-hidden">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Find a job that suits
              <span className="block">your interest & skills.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Search for the perfect role that matches your experience and career goals.
              Thousands of jobs available with companies looking for talent like yours.
            </p>

            <div className="bg-white rounded-lg p-2 shadow-md flex flex-col md:flex-row gap-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Job title, keyword, company"
                  className="pl-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Your location"
                  className="pl-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 transition-colors">
                Find Job
              </Button>
            </div>

            <JobSuggestions />
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="relative">
              <div className="absolute -right-4 -top-4 h-40 w-40 bg-blue-100 rounded-full opacity-50"></div>
              <div className="absolute left-10 bottom-10 h-20 w-20 bg-blue-200 rounded-full opacity-40"></div>
              <img
                src="https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Person searching for jobs"
                className="relative z-10 rounded-lg shadow-lg w-full max-w-md h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 md:px-8 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatisticCard
              icon={<Briefcase className="h-6 w-6 text-blue-600" />}
              count="175,324"
              label="Live Jobs"
              bgColor="bg-blue-50"
            />
            <StatisticCard
              icon={<Building2 className="h-6 w-6 text-blue-600" />}
              count="97,354"
              label="Companies"
              bgColor="bg-indigo-50"
            />
            <StatisticCard
              icon={<Users className="h-6 w-6 text-blue-600" />}
              count="38,471,54"
              label="Candidates"
              bgColor="bg-sky-50"
            />
            <StatisticCard
              icon={<Briefcase className="h-6 w-6 text-blue-600" />}
              count="7,532"
              label="New Jobs"
              bgColor="bg-blue-50"
            />
          </div>
        </div>
      </section>

      {/* Popular Vacancies */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Most Popular Vacancies</h2>
          <JobCategories />
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Popular Categories */}
      <PopularCategories />

      {/* Call to Action */}
      <section className="py-16 px-4 md:px-8 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start your career journey?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have found their dream jobs through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link href="/sign-up">Create an Account</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-blue-700">
              <Link href="/post-job">Post a Job</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}