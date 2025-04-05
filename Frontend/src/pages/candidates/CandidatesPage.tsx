
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db, Candidate } from "@/lib/db";
import PageLayout from "@/components/layout/PageLayout";
import CandidateCard from "@/components/candidates/CandidateCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const candidatesData = await db.getCandidates();
        setCandidates(candidatesData);
      } catch (error) {
        console.error("Error fetching candidates:", error);
        toast({
          title: "Error",
          description: "Failed to load candidates",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, [toast]);

  const handleDeleteCandidate = async (id: string) => {
    try {
      await db.deleteCandidate(id);
      setCandidates(candidates.filter((candidate) => candidate.id !== id));
      toast({
        title: "Candidate Removed",
        description: "Candidate has been removed successfully",
      });
    } catch (error) {
      console.error("Error deleting candidate:", error);
      toast({
        title: "Error",
        description: "Failed to remove candidate",
        variant: "destructive",
      });
    }
  };

  const filteredCandidates = candidates.filter(
    (candidate) => {
      const matchesSearch = 
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    }
  );

  return (
    <PageLayout 
      title="Candidates" 
      description="Manage and review job applicants"
    >
      <div className="mb-6 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative md:w-72">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search candidates..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="md:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button asChild>
          <Link to="/candidates/new">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Candidate
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading candidates...</p>
        </div>
      ) : filteredCandidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onDelete={handleDeleteCandidate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-2">No candidates found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search filters"
              : "Add candidates to start the screening process"}
          </p>
          {!searchTerm && statusFilter === "all" && (
            <Button asChild>
              <Link to="/candidates/new">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add First Candidate
              </Link>
            </Button>
          )}
        </div>
      )}
    </PageLayout>
  );
};

export default CandidatesPage;
