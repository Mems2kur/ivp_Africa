'use client';
import React, { useState } from 'react';
import { 
  HiSearch, 
  HiLocationMarker, 
  HiBriefcase, 
  HiOutlineBookmark, 
  HiBookmark,
  HiFilter,
  HiClock
} from 'react-icons/hi';
import Button from '../components/common/Button';

// --- Types ---
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  postedAt: string;
  isSaved?: boolean;
  tags: string[];
}

// --- Dummy Data ---
const DUMMY_JOBS: Job[] = [
  {
    id: '1',
    title: 'Full Stack Web Developer',
    company: 'Jantra Soft',
    location: 'Remote',
    type: 'Full-time',
    salary: '$80k - $120k',
    postedAt: '2 hours ago',
    isSaved: false,
    tags: ['React', 'Node.js', 'TypeScript', 'Tailwind'],
  },
  {
    id: '2',
    title: 'AI Engineer',
    company: 'TechStart Inc.',
    location: 'Lagos, Nigeria',
    type: 'Contract',
    salary: '$90k - $140k',
    postedAt: '5 hours ago',
    isSaved: true,
    tags: ['Python', 'LLMs', 'LangChain', 'VoltAgent'],
  },
  {
    id: '3',
    title: 'Backend Developer',
    company: 'Nile Africa Technologies',
    location: 'Hybrid',
    type: 'Full-time',
    salary: 'Competitive',
    postedAt: '1 day ago',
    isSaved: false,
    tags: ['NestJS', 'PostgreSQL', 'Supabase', 'Prisma'],
  },
  {
    id: '4',
    title: 'Frontend React Engineer',
    company: 'TravelPal',
    location: 'Remote',
    type: 'Full-time',
    salary: '$70k - $100k',
    postedAt: '2 days ago',
    isSaved: false,
    tags: ['React', 'Next.js', 'Framer Motion'],
  }
];

const SearchJobs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>(DUMMY_JOBS);

  const toggleSaveJob = (id: string) => {
    setJobs(jobs.map(job => 
      job.id === id ? { ...job, isSaved: !job.isSaved } : job
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      {/* Search Hero Section */}
      <div className="bg-primary/5 py-12 border-b border-primary/10">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#8c52ff] mb-4">
              Find Your Dream <span className="text-primary">Role</span>
            </h1>
            <p className="text-lg text-gray-600">
              Search thousands of tech jobs, freelance opportunities, and AI roles across the continent.
            </p>
          </div>

          {/* Search Bar Container */}
          <div className="max-w-4xl mx-auto bg-white p-3 rounded-2xl md:rounded-full shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center bg-gray-50 rounded-xl md:rounded-full px-4 py-3 md:py-0 border border-transparent focus-within:border-primary/30 focus-within:bg-white transition-all">
              <HiSearch className="text-gray-400 text-xl min-w-[24px]" />
              <input 
                type="text" 
                placeholder="Job title, keywords, or company" 
                className="w-full bg-transparent border-none focus:ring-0 text-gray-700 px-3 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex-1 flex items-center bg-gray-50 rounded-xl md:rounded-full px-4 py-3 md:py-0 border border-transparent focus-within:border-primary/30 focus-within:bg-white transition-all">
              <HiLocationMarker className="text-gray-400 text-xl min-w-[24px]" />
              <input 
                type="text" 
                placeholder="City, state, or Remote" 
                className="w-full bg-transparent border-none focus:ring-0 text-gray-700 px-3 outline-none"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
            </div>

            <Button 
              href="#"
              variant="primary"
              size="md"
              className="bg-primary text-black md:w-auto w-full px-8 py-3.5 rounded-xl md:rounded-full font-semibold shadow-md transition-all duration-300 text-center flex justify-center"
            >
              Search Jobs
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="section-container mt-12 px-20 py-20 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Filters</h3>
              <HiFilter className="text-gray-400" />
            </div>

            {/* Job Type Filter */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-3">Job Type</h4>
              <div className="space-y-2.5">
                {['Full-time', 'Part-time', 'Contract', 'Freelance'].map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/30 transition-colors" />
                    <span className="text-gray-600 group-hover:text-primary transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-gray-100 my-6" />

            {/* Experience Level Filter */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-3">Experience Level</h4>
              <div className="space-y-2.5">
                {['Entry Level', 'Mid Level', 'Senior Level', 'Lead / Manager'].map((level) => (
                  <label key={level} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/30 transition-colors" />
                    <span className="text-gray-600 group-hover:text-primary transition-colors">{level}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Job Listings */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recommended for you</h2>
            <span className="text-sm text-gray-500 font-medium">Showing {jobs.length} results</span>
          </div>

          {jobs.map((job) => (
            <div 
              key={job.id} 
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group relative"
            >
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                
                {/* Job Info */}
                <div className="flex gap-4">
                  {/* Placeholder Logo */}
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-[#8c52ff] font-bold text-xl">
                    {job.company.charAt(0)}
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-gray-600 font-medium">
                      <span>{job.company}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                      <span className="flex items-center gap-1">
                        <HiLocationMarker className="text-gray-400" />
                        {job.location}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg flex items-center gap-1">
                        <HiBriefcase className="w-4 h-4" />
                        {job.type}
                      </span>
                      {job.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-gray-50 text-gray-600 text-sm font-medium rounded-lg border border-gray-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex md:flex-col items-center md:items-end justify-between mt-4 md:mt-0">
                  <button 
                    onClick={() => toggleSaveJob(job.id)}
                    className="p-2 rounded-full hover:bg-gray-50 transition-colors"
                    title={job.isSaved ? "Unsave Job" : "Save Job"}
                  >
                    {job.isSaved ? (
                      <HiBookmark className="text-primary text-2xl" />
                    ) : (
                      <HiOutlineBookmark className="text-gray-400 hover:text-primary text-2xl transition-colors" />
                    )}
                  </button>

                  <div className="text-right">
                    <p className="font-bold text-gray-900 mb-2 hidden md:block">{job.salary}</p>
                    <p className="text-sm text-gray-400 flex items-center gap-1 md:justify-end">
                      <HiClock /> {job.postedAt}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Salary & Apply Button */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <p className="font-bold text-gray-900 md:hidden">{job.salary}</p>
                <Button 
                  href={`/jobs/${job.id}`}
                  variant="primary"
                  size="sm"
                  className="bg-primary/10 text-primary px-6 py-2 rounded-xl font-semibold transition-all duration-300 ml-auto"
                >
                  Apply Now
                </Button>
              </div>
            </div>
          ))}

          {/* Pagination Placeholder */}
          <div className="flex justify-center mt-10">
            <Button 
              href="#"
              variant="outline"
              size="md"
              className="border-2 border-gray-200 text-gray-600 px-8 py-2.5 rounded-full font-semibold transition-all duration-300"
            >
              Load More Jobs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchJobs;
