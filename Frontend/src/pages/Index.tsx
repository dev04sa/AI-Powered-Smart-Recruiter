
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BriefcaseIcon, PlusIcon, UsersIcon } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import StatCard from "@/components/dashboard/StatCard";
import CandidateStatusChart from "@/components/dashboard/CandidateStatusChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Button } from "@/components/ui/button";
import { db, Candidate } from "@/lib/db";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCandidates: 0,
    shortlistedCandidates: 0,
    interviewingCandidates: 0,
  });
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, candidatesData] = await Promise.all([
          db.getStats(),
          db.getCandidates(),
        ]);
        setStats(statsData);
        setCandidates(candidatesData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const candidateStatusData = [
    {
      name: "New",
      value: candidates.filter((c) => c.status === "new").length,
      color: "#3b82f6",
    },
    {
      name: "Reviewed",
      value: candidates.filter((c) => c.status === "reviewed").length,
      color: "#6366f1",
    },
    {
      name: "Shortlisted",
      value: candidates.filter((c) => c.status === "shortlisted").length,
      color: "#10b981",
    },
    {
      name: "Interviewing",
      value: candidates.filter((c) => c.status === "interviewing").length,
      color: "#8b5cf6",
    },
    {
      name: "Rejected",
      value: candidates.filter((c) => c.status === "rejected").length,
      color: "#ef4444",
    },
  ].filter((item) => item.value > 0);

  // Mock activities - in a real app, these would come from a database
  const recentActivities = [
    {
      id: "act-1",
      title: "New candidate applied",
      description: "John Smith applied for Frontend Developer position",
      timestamp: "Today, 2:30 PM",
      type: "candidate" as const,
    },
    {
      id: "act-2",
      title: "Interview scheduled",
      description: "Interview with Jane Davis for Data Scientist position",
      timestamp: "Yesterday, 11:20 AM",
      type: "interview" as const,
    },
    {
      id: "act-3",
      title: "New job posted",
      description: "Frontend Developer job was posted",
      timestamp: "3 days ago",
      type: "job" as const,
    },
  ];

  return (
    <PageLayout 
      title="Dashboard" 
      description="Overview of your recruitment activities"
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end space-x-4">
            <Button asChild size="sm">
              <Link to="/candidates/new">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Candidate
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/jobs/new">
                <PlusIcon className="w-4 h-4 mr-2" />
                Post Job
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Active Jobs"
              value={stats.totalJobs}
              icon={<BriefcaseIcon className="h-4 w-4" />}
              description="Total active job listings"
            />
            <StatCard
              title="Total Candidates"
              value={stats.totalCandidates}
              icon={<UsersIcon className="h-4 w-4" />}
              description="Candidates in database"
            />
            <StatCard
              title="Shortlisted"
              value={stats.shortlistedCandidates}
              description="Candidates ready for interviews"
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Interviews"
              value={stats.interviewingCandidates}
              description="Scheduled interviews"
              trend={{ value: 5, isPositive: true }}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {candidateStatusData.length > 0 ? (
                <CandidateStatusChart data={candidateStatusData} />
              ) : (
                <div className="h-80 flex items-center justify-center border rounded-lg bg-gray-50">
                  <div className="text-center">
                    <p className="text-gray-500">No candidate data available</p>
                    <Button asChild size="sm" className="mt-2">
                      <Link to="/candidates/new">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Candidate
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <RecentActivity activities={recentActivities} />
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Dashboard;
