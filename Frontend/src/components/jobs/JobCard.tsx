
import React from "react";
import { Link } from "react-router-dom";
import { BriefcaseIcon, MapPinIcon, UserIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/lib/db";

interface JobCardProps {
  job: Job;
  candidateCount?: number;
  onDelete?: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, candidateCount = 0, onDelete }) => {
  return (
    <Card className="h-full">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{job.title}</CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <BriefcaseIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{job.company}</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <MapPinIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{job.location}</span>
            </div>
          </div>
          <div>
            <Badge variant="outline" className="bg-primary-50 text-primary border-primary-100">
              <UserIcon className="w-3 h-3 mr-1" />
              {candidateCount} Candidates
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mt-2">
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {job.description}
          </p>
          <div className="flex flex-wrap gap-1 mb-4">
            {job.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{job.skills.length - 3} more
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">Posted on {job.createdAt}</span>
            <div className="flex space-x-2">
              {onDelete && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete(job.id);
                  }}
                >
                  Delete
                </Button>
              )}
              <Button variant="default" size="sm" asChild>
                <Link to={`/jobs/${job.id}`}>View Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
