
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ChevronRightIcon, UserIcon } from "lucide-react";
import { Candidate } from "@/lib/db";

interface CandidateCardProps {
  candidate: Candidate;
  onDelete?: (id: string) => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onDelete }) => {
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

  return (
    <Card className="h-full">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{candidate.name}</h3>
              <p className="text-sm text-gray-500">{candidate.email}</p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={getStatusColor(candidate.status)}
          >
            {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="my-3">
          <div className="flex flex-wrap gap-1 mb-3">
            {candidate.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {candidate.skills.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{candidate.skills.length - 4} more
              </Badge>
            )}
          </div>
          
          {candidate.matchScore !== undefined && (
            <div className="mb-3">
              <p className="text-sm font-medium">Match Score</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className={`h-2 rounded-full ${
                    candidate.matchScore >= 80
                      ? "bg-green-500"
                      : candidate.matchScore >= 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${candidate.matchScore}%` }}
                ></div>
              </div>
              <p className="text-xs mt-1 text-gray-500">{candidate.matchScore}% match</p>
            </div>
          )}
          
          {candidate.interviewDate && (
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <CalendarIcon className="w-4 h-4 mr-2 text-purple-500" />
              <span>Interview: {new Date(candidate.interviewDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">Added on {candidate.createdAt}</span>
          <div className="flex space-x-2">
            {onDelete && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(candidate.id);
                }}
              >
                Delete
              </Button>
            )}
            <Button variant="default" size="sm" asChild className="group">
              <Link to={`/candidates/${candidate.id}`}>
                View
                <ChevronRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateCard;
