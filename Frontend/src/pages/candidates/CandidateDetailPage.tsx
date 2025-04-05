
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  BriefcaseIcon, 
  CalendarIcon, 
  ChevronLeftIcon,
  MailIcon,
  PhoneIcon,
  TrashIcon, 
  UserIcon 
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { db, Candidate, Job } from "@/lib/db";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";

const CandidateDetailPage = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCandidateData = async () => {
      if (!candidateId) return;
      
      try {
        const candidateData = await db.getCandidate(candidateId);
        
        if (!candidateData) {
          navigate("/candidates");
          toast({
            title: "Candidate Not Found",
            description: "The requested candidate does not exist",
            variant: "destructive",
          });
          return;
        }
        
        setCandidate(candidateData);
        
        if (candidateData.jobId) {
          const jobData = await db.getJob(candidateData.jobId);
          setJob(jobData);
        }
      } catch (error) {
        console.error("Error fetching candidate details:", error);
        toast({
          title: "Error",
          description: "Failed to load candidate details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidateData();
  }, [candidateId, navigate, toast]);

  const handleDeleteCandidate = async () => {
    if (!candidateId || !candidate) return;
    
    if (window.confirm(`Are you sure you want to delete ${candidate.name}'s profile?`)) {
      try {
        await db.deleteCandidate(candidateId);
        navigate("/candidates");
        toast({
          title: "Candidate Deleted",
          description: "Candidate has been deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting candidate:", error);
        toast({
          title: "Error",
          description: "Failed to delete candidate",
          variant: "destructive",
        });
      }
    }
  };

  const handleStatusChange = async (status: Candidate["status"]) => {
    if (!candidateId || !candidate) return;
    
    try {
      await db.updateCandidate(candidateId, { status });
      setCandidate({ ...candidate, status });
      toast({
        title: "Status Updated",
        description: `Candidate status changed to ${status}`,
      });
    } catch (error) {
      console.error("Error updating candidate status:", error);
      toast({
        title: "Error",
        description: "Failed to update candidate status",
        variant: "destructive",
      });
    }
  };

  const handleScheduleInterview = async () => {
    if (!candidateId || !candidate) return;
    
    // This would normally open a date picker or form
    // For now, just set a future date
    const interviewDate = new Date();
    interviewDate.setDate(interviewDate.getDate() + 3);
    interviewDate.setHours(10, 0, 0, 0);
    
    try {
      await db.updateCandidate(candidateId, { 
        status: "interviewing", 
        interviewDate: interviewDate.toISOString() 
      });
      
      setCandidate({ 
        ...candidate, 
        status: "interviewing", 
        interviewDate: interviewDate.toISOString() 
      });
      
      toast({
        title: "Interview Scheduled",
        description: `Interview scheduled for ${interviewDate.toLocaleDateString()} at ${interviewDate.toLocaleTimeString()}`,
      });
    } catch (error) {
      console.error("Error scheduling interview:", error);
      toast({
        title: "Error",
        description: "Failed to schedule interview",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: Candidate["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "shortlisted":
        return "bg-green-50 text-green-600 border-green-200";
      case "interviewing":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "rejected":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <PageLayout title="Loading Candidate...">
        <div className="flex justify-center items-center h-64">
          <p>Loading candidate details...</p>
        </div>
      </PageLayout>
    );
  }

  if (!candidate) return null;

  return (
    <PageLayout title={candidate.name} description="Candidate Profile">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/candidates">
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Back to Candidates
          </Link>
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center shrink-0">
                    <UserIcon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{candidate.name}</h1>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MailIcon className="w-4 h-4 mr-1.5" />
                        {candidate.email}
                      </div>
                      {candidate.phone && (
                        <div className="flex items-center">
                          <PhoneIcon className="w-4 h-4 mr-1.5" />
                          {candidate.phone}
                        </div>
                      )}
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1.5" />
                        Added on {candidate.createdAt}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={getStatusColor(candidate.status)}
                      >
                        {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                      </Badge>
                      
                      {job && (
                        <Link to={`/jobs/${job.id}`} className="inline-flex items-center">
                          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                            <BriefcaseIcon className="w-3 h-3 mr-1" />
                            {job.title}
                          </Badge>
                        </Link>
                      )}
                      
                      {candidate.matchScore !== undefined && (
                        <Badge variant={candidate.matchScore >= 80 ? "default" : "secondary"}>
                          {candidate.matchScore}% Match
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex mt-4 md:mt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDeleteCandidate}
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              {candidate.skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {candidate.education.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Education</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {candidate.education.map((edu, index) => (
                      <li key={index}>{edu}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {candidate.experience.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Experience</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {candidate.experience.map((exp, index) => (
                      <li key={index}>{exp}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div>
                <h3 className="font-semibold mb-2">Resume</h3>
                <div className="bg-gray-50 p-4 rounded-md border whitespace-pre-line text-sm text-gray-700">
                  {candidate.resumeText}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Actions</h3>
                
                {candidate.status !== "shortlisted" && candidate.status !== "interviewing" && (
                  <Button 
                    variant="default" 
                    className="w-full mb-3"
                    onClick={() => handleStatusChange("shortlisted")}
                  >
                    Shortlist Candidate
                  </Button>
                )}
                
                {candidate.status === "shortlisted" && (
                  <Button 
                    variant="default" 
                    className="w-full mb-3"
                    onClick={handleScheduleInterview}
                  >
                    Schedule Interview
                  </Button>
                )}
                
                {candidate.status !== "rejected" && (
                  <Button 
                    variant="outline" 
                    className="w-full mb-3 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleStatusChange("rejected")}
                  >
                    Reject Candidate
                  </Button>
                )}
                
                {candidate.status === "rejected" && (
                  <Button 
                    variant="outline" 
                    className="w-full mb-3"
                    onClick={() => handleStatusChange("new")}
                  >
                    Move to New
                  </Button>
                )}
              </CardContent>
            </Card>
            
            {job && (
              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Applied For</h3>
                  <Link to={`/jobs/${job.id}`} className="block hover:bg-gray-50 -m-2 p-2 rounded-md">
                    <p className="font-medium text-primary">{job.title}</p>
                    <p className="text-sm text-gray-500">{job.company}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <BriefcaseIcon className="w-3 h-3 mr-1.5" />
                      {job.location}
                    </div>
                  </Link>
                </CardContent>
              </Card>
            )}
            
            {candidate.interviewDate && (
              <Card className="mt-6 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <CalendarIcon className="w-5 h-5 text-purple-500" />
                    <h3 className="font-semibold text-purple-700">Interview Scheduled</h3>
                  </div>
                  <p className="text-sm">
                    Date: {new Date(candidate.interviewDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    Time: {new Date(candidate.interviewDate).toLocaleTimeString()}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CandidateDetailPage;
