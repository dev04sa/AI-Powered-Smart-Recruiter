
import { Candidate, Job } from "@/lib/db";

// In a real application, this would be an actual AI service
// For now, we'll simulate the AI functionality

export const aiService = {
  // Parse resume text and extract key information
  parseResume: (text: string): Promise<{
    skills: string[];
    education: string[];
    experience: string[];
  }> => {
    // Simulated AI parsing logic
    const skills = extractSkills(text);
    const education = extractEducation(text);
    const experience = extractExperience(text);
    
    return Promise.resolve({
      skills,
      education,
      experience
    });
  },
  
  // Extract key information from job description
  parseJobDescription: (text: string): Promise<{
    skills: string[];
    requirements: string[];
  }> => {
    // Simulated AI parsing logic
    const skills = extractSkills(text);
    const requirements = extractRequirements(text);
    
    return Promise.resolve({
      skills,
      requirements
    });
  },
  
  // Calculate match score between candidate and job
  calculateMatch: (candidate: Candidate, job: Job): Promise<number> => {
    // Simulated matching algorithm
    const skillMatch = calculateSkillMatch(candidate.skills, job.skills);
    const experienceMatch = calculateExperienceMatch(candidate.experience, job.requirements);
    
    // Weighted average
    const score = Math.round((skillMatch * 0.7) + (experienceMatch * 0.3));
    
    return Promise.resolve(score);
  },
  
  // Analyze all candidates for a job and update their match scores
  analyzeJobCandidates: (candidates: Candidate[], job: Job): Promise<Candidate[]> => {
    return Promise.all(
      candidates.map(async (candidate) => {
        const matchScore = await aiService.calculateMatch(candidate, job);
        return {
          ...candidate,
          matchScore
        };
      })
    );
  }
};

// Helper functions for simulated AI analysis

function extractSkills(text: string): string[] {
  const commonSkills = [
    "JavaScript", "TypeScript", "React", "Angular", "Vue", "Node.js",
    "Python", "Java", "C#", "Ruby", "PHP", "Go", "Rust", "Swift",
    "SQL", "MongoDB", "PostgreSQL", "MySQL", "AWS", "Azure", "GCP",
    "Docker", "Kubernetes", "CI/CD", "Git", "HTML", "CSS", "SASS",
    "Redux", "REST API", "GraphQL", "TensorFlow", "PyTorch", "Machine Learning",
    "Data Analysis", "R", "Tableau", "Power BI", "Excel", "Leadership",
    "Project Management", "Scrum", "Agile", "Communication", "Problem Solving"
  ];
  
  return commonSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
}

function extractEducation(text: string): string[] {
  // Simple simulation of education extraction
  const educationKeywords = ["Bachelor", "Master", "PhD", "degree", "university", "college", "school"];
  
  if (educationKeywords.some(keyword => text.includes(keyword))) {
    // Extract sentences containing education keywords
    const sentences = text.split(/[.!?]+/);
    return sentences
      .filter(sentence => 
        educationKeywords.some(keyword => 
          sentence.toLowerCase().includes(keyword.toLowerCase())
        )
      )
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0);
  }
  
  return ["Education details not found"];
}

function extractExperience(text: string): string[] {
  // Simple simulation of experience extraction
  const experienceKeywords = ["experience", "worked", "job", "position", "role", "years", "developer"];
  
  if (experienceKeywords.some(keyword => text.includes(keyword))) {
    // Extract sentences containing experience keywords
    const sentences = text.split(/[.!?]+/);
    return sentences
      .filter(sentence => 
        experienceKeywords.some(keyword => 
          sentence.toLowerCase().includes(keyword.toLowerCase())
        )
      )
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0);
  }
  
  return ["Experience details not found"];
}

function extractRequirements(text: string): string[] {
  // Simple simulation of requirements extraction
  const lines = text.split('\n');
  
  return lines
    .filter(line => 
      line.includes("require") || 
      line.includes("qualification") || 
      line.includes("experience") ||
      line.includes("degree") ||
      line.includes("skill")
    )
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

function calculateSkillMatch(candidateSkills: string[], jobSkills: string[]): number {
  if (jobSkills.length === 0) return 0;
  
  const matchedSkills = candidateSkills.filter(skill => 
    jobSkills.some(jobSkill => 
      jobSkill.toLowerCase().includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(jobSkill.toLowerCase())
    )
  );
  
  return Math.min(100, Math.round((matchedSkills.length / jobSkills.length) * 100));
}

function calculateExperienceMatch(candidateExperience: string[], jobRequirements: string[]): number {
  if (jobRequirements.length === 0) return 50; // Neutral score if no requirements
  
  let matchScore = 50; // Start with a neutral score
  
  // Check for years of experience
  const yearsPattern = /(\d+)\+?\s*years?/i;
  const candidateYears = extractYearsOfExperience(candidateExperience.join(" "));
  const requiredYears = extractYearsOfExperience(jobRequirements.join(" "));
  
  if (requiredYears > 0 && candidateYears > 0) {
    if (candidateYears >= requiredYears) {
      matchScore += 30;
    } else if (candidateYears >= requiredYears * 0.7) {
      matchScore += 15;
    }
  }
  
  // Check for other requirements
  const requirementKeywords = ["degree", "bachelor", "master", "phd", "certification", "experience"];
  const hasKeyRequirements = requirementKeywords.some(keyword => 
    jobRequirements.some(req => req.toLowerCase().includes(keyword)) &&
    candidateExperience.some(exp => exp.toLowerCase().includes(keyword))
  );
  
  if (hasKeyRequirements) {
    matchScore += 20;
  }
  
  return Math.min(100, matchScore);
}

function extractYearsOfExperience(text: string): number {
  const yearsPattern = /(\d+)\+?\s*years?/i;
  const match = text.match(yearsPattern);
  
  if (match && match[1]) {
    return parseInt(match[1]);
  }
  
  return 0;
}
