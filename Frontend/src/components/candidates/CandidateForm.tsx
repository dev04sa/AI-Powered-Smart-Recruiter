
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { aiService } from "@/lib/ai-service";
import { db, Job } from "@/lib/db";

interface CandidateFormProps {
  initialValues?: {
    name: string;
    email: string;
    phone: string;
    resumeText: string;
    jobId?: string;
  };
  onSubmit: (values: {
    name: string;
    email: string;
    phone: string;
    resumeText: string;
    skills: string[];
    education: string[];
    experience: string[];
    jobId?: string;
  }) => void;
  isLoading: boolean;
}

const CandidateForm: React.FC<CandidateFormProps> = ({
  initialValues = {
    name: "",
    email: "",
    phone: "",
    resumeText: "",
  },
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    name: initialValues.name,
    email: initialValues.email,
    phone: initialValues.phone,
    resumeText: initialValues.resumeText,
    jobId: initialValues.jobId || "",
  });

  const [parsedData, setParsedData] = useState<{
    skills: string[];
    education: string[];
    experience: string[];
  }>({
    skills: [],
    education: [],
    experience: [],
  });

  const [jobs, setJobs] = useState<Job[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isParsed, setIsParsed] = useState(false);

  // Fetch jobs when component mounts
  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsData = await db.getJobs();
        setJobs(jobsData);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectJob = (value: string) => {
    setFormData((prev) => ({ ...prev, jobId: value }));
  };

  const handleParseResume = async () => {
    if (!formData.resumeText) {
      toast({
        title: "Error",
        description: "Please add resume text to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await aiService.parseResume(formData.resumeText);
      setParsedData(result);
      setIsParsed(true);
      
      toast({
        title: "Resume Parsed",
        description: "Resume analyzed successfully",
      });
    } catch (error) {
      toast({
        title: "Parsing Failed",
        description: "Failed to analyze resume text",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isParsed) {
      toast({
        title: "Parse Resume First",
        description: "Please parse the resume before submitting",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit({
      ...formData,
      skills: parsedData.skills,
      education: parsedData.education,
      experience: parsedData.experience,
      jobId: formData.jobId || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. John Smith"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="e.g. john@example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. 555-123-4567"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobId">Job Position</Label>
          <Select value={formData.jobId} onValueChange={handleSelectJob}>
            <SelectTrigger>
              <SelectValue placeholder="Select a job position" />
            </SelectTrigger>
            <SelectContent>
              {jobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>
                  {job.title} - {job.company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="resumeText">Resume Text</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleParseResume}
            disabled={isAnalyzing || !formData.resumeText}
          >
            {isAnalyzing ? "Analyzing..." : "Parse Resume"}
          </Button>
        </div>
        <Textarea
          id="resumeText"
          name="resumeText"
          value={formData.resumeText}
          onChange={handleChange}
          required
          placeholder="Paste the full text of the candidate's resume here"
          className="h-56"
        />
      </div>

      {isParsed && (
        <div className="space-y-4 border rounded-md p-4 bg-gray-50">
          <div>
            <h4 className="font-medium mb-1">Extracted Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {parsedData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">Extracted Education:</h4>
            <ul className="list-disc pl-5 text-sm">
              {parsedData.education.map((edu, index) => (
                <li key={index}>{edu}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">Extracted Experience:</h4>
            <ul className="list-disc pl-5 text-sm">
              {parsedData.experience.map((exp, index) => (
                <li key={index}>{exp}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading || !isParsed}>
          {isLoading ? "Saving..." : "Save Candidate"}
        </Button>
      </div>
    </form>
  );
};

export default CandidateForm;
