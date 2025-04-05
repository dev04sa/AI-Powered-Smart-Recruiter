
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import CandidateForm from "@/components/candidates/CandidateForm";
import { db } from "@/lib/db";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const NewCandidatePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const query = useQuery();
  const jobId = query.get("jobId");

  const handleSubmit = async (candidateData: {
    name: string;
    email: string;
    phone: string;
    resumeText: string;
    skills: string[];
    education: string[];
    experience: string[];
    jobId?: string;
  }) => {
    setIsLoading(true);

    try {
      const newCandidate = await db.createCandidate(candidateData);
      setIsLoading(false);
      
      if (candidateData.jobId) {
        navigate(`/jobs/${candidateData.jobId}`);
      } else {
        navigate(`/candidates/${newCandidate.id}`);
      }
    } catch (error) {
      console.error("Failed to create candidate:", error);
      setIsLoading(false);
    }
  };

  return (
    <PageLayout title="Add New Candidate" description="Upload a candidate's resume for analysis">
      <div className="max-w-3xl mx-auto">
        <CandidateForm 
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
          initialValues={{ 
            name: "", 
            email: "", 
            phone: "", 
            resumeText: "",
            jobId: jobId || undefined 
          }} 
        />
      </div>
    </PageLayout>
  );
};

export default NewCandidatePage;
