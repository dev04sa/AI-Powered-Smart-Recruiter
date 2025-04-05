
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import JobForm from "@/components/jobs/JobForm";
import { db } from "@/lib/db";

const NewJobPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (jobData: {
    title: string;
    company: string;
    location: string;
    description: string;
    requirements: string[];
    skills: string[];
  }) => {
    setIsLoading(true);

    try {
      const newJob = await db.createJob(jobData);
      setIsLoading(false);
      navigate(`/jobs/${newJob.id}`);
    } catch (error) {
      console.error("Failed to create job:", error);
      setIsLoading(false);
    }
  };

  return (
    <PageLayout title="Post New Job" description="Create a new job listing">
      <div className="max-w-3xl mx-auto">
        <JobForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </PageLayout>
  );
};

export default NewJobPage;
