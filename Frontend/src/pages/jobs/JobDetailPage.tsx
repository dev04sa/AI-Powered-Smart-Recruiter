
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  BriefcaseIcon, 
  CalendarIcon, 
  ChevronLeftIcon, 
  MapPinIcon, 
  TrashIcon, 
  UserIcon 
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { db, Job, Candidate } from "@/lib/db";
import { aiService } from "@/lib/ai-service";
import { useToast } from "@/components/ui/use-toast";
import CandidateCard from "@/components/candidates/CandidateCard";

const JobDetailPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobData = async () => {
      if (!jobId) return;
      
      try {
        const [jobData, candidatesData] = await Promise.all([
          db.getJob(jobId),
          db.getCandidates(jobId),
        ]);

        if (!jobData) {
          navigate("/jobs");
          toast({
            title: "Job Not Found",
            description: "The requested job listing does not exist",
            variant: "destructive",
          });
          return;
        }

        setJob(jobData);
        setCandidates(candidatesData);
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast({
          title: "Error",
          description: "Failed to load job details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobData();
  }, [jobId, navigate, toast]);

  const handleDeleteJob = async () => {
    if (!jobId || !job) return;
    
    if (window.confirm(`Are you sure you want to delete ${job.title}?`)) {
      try {
        await db.deleteJob(jobId);
        navigate("/jobs");
        toast({
          title: "Job Deleted",
          description: "Job listing has been deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting job:", error);
        toast({
          title: "Error",
          description: "Failed to delete job listing",
          variant: "destructive",
        });
      }
    }
  };

  const handleAnalyzeCandidates = async () => {
    if (!job || candidates.length === 0) return;
    
    try {
      toast({
        title: "Analyzing Candidates",
        description: "Processing candidate matches...",
      });
      
      const analyzedCandidates = await aiService.analyzeJobCandidates(candidates, job);
      
      // Update candidates in the database and state
      for (const candidate of analyzedCandidates) {
        await db.updateCandidate(candidate.id, {
          matchScore: candidate.matchScore,
        });
      }
      
      setCandidates(analyzedCandidates);
      
      toast({
        title: "Analysis Complete",
        description: `${analyzedCandidates.length} candidates analyzed successfully`,
      });
    } catch (error) {
      console.error("Error analyzing candidates:", error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze candidates",
        variant: "destructive",
      });
    }
  };

  const shortlistCandidates = async (threshold = 80) => {
    if (!candidates.length) return;
    
    try {
      const eligibleCandidates = candidates.filter(
        c => (c.matchScore || 0) >= threshold && c.status === "new"
      );
      
      if (eligibleCandidates.length === 0) {
        toast({
          title: "No Eligible Candidates",
          description: `No candidates meet the ${threshold}% match threshold`,
          variant: "destructive",
        });
        return;
      }
      
      for (const candidate of eligibleCandidates) {
        await db.updateCandidate(candidate.id, {
          status: "shortlisted",
        });
      }
      
      // Update the local state
      setCandidates(candidates.map(c => 
        (c.matchScore || 0) >= threshold && c.status === "new"
          ? { ...c, status: "shortlisted" }
          : c
      ));
      
      toast({
        title: "Candidates Shortlisted",
        description: `${eligibleCandidates.length} candidates have been shortlisted`,
      });
    } catch (error) {
      console.error("Error shortlisting candidates:", error);
      toast({
        title: "Error",
        description: "Failed to shortlist candidates",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <PageLayout title="Loading Job Details...">
        <div className="flex justify-center items-center h-64">
          <p>Loading job details...</p>
        </div>
      </PageLayout>
    );
  }

  if (!job) return null;

  return (
    <PageLayout title={job.title} description={job.company}>
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/jobs">
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Back to Jobs
          </Link>
        </Button>
        
        <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <BriefcaseIcon className="w-4 h-4 mr-1.5" />
                  {job.company}
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="w-4 h-4 mr-1.5" />
                  {job.location}
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1.5" />
                  Posted on {job.createdAt}
                </div>
                <div className="flex items-center">
                  <UserIcon className="w-4 h-4 mr-1.5" />
                  {candidates.length} Candidates
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1.5 mb-6">
                {job.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex mt-4 md:mt-0">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDeleteJob}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <TrashIcon className="w-4 h-4 mr-1" />
                Delete Job
              </Button>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <h3 className="font-semibold mb-2">Job Description</h3>
            <p className="text-gray-700 whitespace-pre-line mb-6">{job.description}</p>
            
            <h3 className="font-semibold mb-2">Requirements</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {job.requirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Candidates ({candidates.length})</h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => shortlistCandidates(80)}
                disabled={candidates.length === 0}
              >
                Auto-Shortlist
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleAnalyzeCandidates}
                disabled={candidates.length === 0}
              >
                Analyze Candidates
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link to={`/candidates/new?jobId=${job.id}`}>
                  Add Candidate
                </Link>
              </Button>
            </div>
          </div>
          
          {candidates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium mb-2">No candidates yet</h3>
              <p className="text-gray-500 mb-4">
                Add candidates to this job to start the screening process
              </p>
              <Button asChild>
                <Link to={`/candidates/new?jobId=${job.id}`}>
                  Add First Candidate
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default JobDetailPage;
