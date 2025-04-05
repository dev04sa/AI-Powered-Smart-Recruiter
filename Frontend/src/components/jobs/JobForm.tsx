
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { aiService } from "@/lib/ai-service";

interface JobFormProps {
  initialValues?: {
    title: string;
    company: string;
    location: string;
    description: string;
    requirements: string[];
    skills: string[];
  };
  onSubmit: (values: {
    title: string;
    company: string;
    location: string;
    description: string;
    requirements: string[];
    skills: string[];
  }) => void;
  isLoading: boolean;
}

const JobForm: React.FC<JobFormProps> = ({
  initialValues = { 
    title: "", 
    company: "", 
    location: "", 
    description: "", 
    requirements: [], 
    skills: [] 
  },
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    title: initialValues.title,
    company: initialValues.company,
    location: initialValues.location,
    description: initialValues.description,
    requirements: initialValues.requirements.join("\n"),
    skills: initialValues.skills.join(", "),
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnalyzeDescription = async () => {
    if (!formData.description) {
      toast({
        title: "Error",
        description: "Please add a job description to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await aiService.parseJobDescription(formData.description);
      
      setFormData((prev) => ({
        ...prev,
        skills: result.skills.join(", "),
        requirements: result.requirements.join("\n"),
      }));
      
      toast({
        title: "Analysis Complete",
        description: "Job description analyzed successfully",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze job description",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Convert requirements and skills back to arrays
    const requirementsArray = formData.requirements
      .split("\n")
      .map((req) => req.trim())
      .filter((req) => req.length > 0);
    
    const skillsArray = formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);
    
    onSubmit({
      title: formData.title,
      company: formData.company,
      location: formData.location,
      description: formData.description,
      requirements: requirementsArray,
      skills: skillsArray,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g. Frontend Developer"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            placeholder="e.g. Acme Inc."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="e.g. Remote, New York, London"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="description">Job Description</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAnalyzeDescription}
            disabled={isAnalyzing || !formData.description}
          >
            {isAnalyzing ? "Analyzing..." : "Auto-analyze"}
          </Button>
        </div>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Describe the job role, responsibilities, and expectations"
          className="h-32"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirements">Requirements</Label>
        <Textarea
          id="requirements"
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          placeholder="Enter each requirement on a new line"
          className="h-24"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Required Skills</Label>
        <Input
          id="skills"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="e.g. JavaScript, React, TypeScript (comma separated)"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Job"}
        </Button>
      </div>
    </form>
  );
};

export default JobForm;
