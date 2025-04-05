
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db, Job } from "@/lib/db";
import PageLayout from "@/components/layout/PageLayout";
import JobCard from "@/components/jobs/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [candidateCounts, setCandidateCounts] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsData = await db.getJobs();
        setJobs(jobsData);
        
        // Get candidate counts for each job
        const counts: Record<string, number> = {};
        for (const job of jobsData) {
          const candidates = await db.getCandidates(job.id);
          counts[job.id] = candidates.length;
        }
        setCandidateCounts(counts);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast({
          title: "Error",
          description: "Failed to load job listings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [toast]);

  const handleDeleteJob = async (id: string) => {
    try {
      await db.deleteJob(id);
      setJobs(jobs.filter((job) => job.id !== id));
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error",
        description: "Failed to delete job listing",
        variant: "destructive",
      });
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <PageLayout 
      title="Job Listings" 
      description="Manage your job postings and review applicants"
    >
      <div className="mb-6 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search jobs, companies, skills..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button asChild>
          <Link to="/jobs/new">
            <PlusIcon className="h-4 w-4 mr-2" />
            Post New Job
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading job listings...</p>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              candidateCount={candidateCounts[job.id] || 0}
              onDelete={handleDeleteJob}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-2">No job listings found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? "Try adjusting your search term" : "Create your first job posting"}
          </p>
          {!searchTerm && (
            <Button asChild>
              <Link to="/jobs/new">
                <PlusIcon className="h-4 w-4 mr-2" />
                Post New Job
              </Link>
            </Button>
          )}
        </div>
      )}
    </PageLayout>
  );
};

export default JobsPage;
