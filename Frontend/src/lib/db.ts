
// Mock database service since we don't have SQLite integration in the browser
// In a real application, this would be replaced with actual SQLite operations

import { toast } from "@/components/ui/use-toast";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  skills: string[];
  createdAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeText: string;
  skills: string[];
  education: string[];
  experience: string[];
  matchScore?: number;
  jobId?: string;
  status: 'new' | 'reviewed' | 'shortlisted' | 'rejected' | 'interviewing';
  createdAt: string;
  interviewDate?: string;
}

// Initial mock data
let jobs: Job[] = [
  {
    id: "job-1",
    title: "Frontend Developer",
    company: "Tech Innovations Inc.",
    location: "Remote",
    description: "We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user interfaces and implementing web designs.",
    requirements: ["3+ years of experience", "Bachelor's degree in Computer Science", "Experience with agile methodologies"],
    skills: ["React", "TypeScript", "CSS", "HTML", "JavaScript", "Responsive Design"],
    createdAt: "2023-10-15"
  },
  {
    id: "job-2",
    title: "Data Scientist",
    company: "Data Analytics Pro",
    location: "New York, NY",
    description: "We're seeking a Data Scientist to analyze large datasets and build predictive models.",
    requirements: ["5+ years of experience", "Master's degree in Statistics or related field", "Experience with big data technologies"],
    skills: ["Python", "R", "SQL", "Machine Learning", "TensorFlow", "Data Visualization"],
    createdAt: "2023-10-10"
  },
  {
    id: "job-3",
    title: "Backend Developer",
    company: "Cloud Solutions Ltd.",
    location: "San Francisco, CA",
    description: "Seeking a Backend Developer to build and maintain scalable APIs and microservices.",
    requirements: ["4+ years of experience", "Proficiency in Node.js and Express", "Familiarity with database systems"],
    skills: ["Node.js", "Express", "MongoDB", "SQL", "Docker", "Kubernetes"],
    createdAt: "2023-10-12"
  },
  {
    id: "job-4",
    title: "DevOps Engineer",
    company: "InfraTech Solutions",
    location: "Remote",
    description: "We are hiring a DevOps Engineer to automate and enhance our cloud infrastructure.",
    requirements: ["5+ years of experience", "Expertise in CI/CD tools", "Strong background in cloud platforms"],
    skills: ["AWS", "Terraform", "Kubernetes", "CI/CD", "Jenkins", "Docker"],
    createdAt: "2023-10-08"
  },
  {
    id: "job-5",
    title: "Full Stack Developer",
    company: "InnovateTech",
    location: "Seattle, WA",
    description: "Looking for a Full Stack Developer to work on modern web applications from frontend to backend.",
    requirements: ["3+ years of experience", "Experience with both frontend and backend frameworks", "Strong problem-solving skills"],
    skills: ["React", "Node.js", "GraphQL", "MongoDB", "TypeScript", "Docker"],
    createdAt: "2023-10-05"
  },
  {
    id: "job-6",
    title: "Cybersecurity Analyst",
    company: "SecureNet Corp.",
    location: "Washington, DC",
    description: "We need a Cybersecurity Analyst to protect our systems and networks from threats.",
    requirements: ["4+ years of experience", "Knowledge of security best practices", "Experience with penetration testing"],
    skills: ["Ethical Hacking", "SIEM", "Firewalls", "Network Security", "Incident Response"],
    createdAt: "2023-10-03"
  },
  {
    id: "job-7",
    title: "AI Engineer",
    company: "NextGen AI",
    location: "Boston, MA",
    description: "Hiring an AI Engineer to develop machine learning models and AI-driven applications.",
    requirements: ["3+ years of experience", "Proficiency in deep learning frameworks", "Experience with AI product deployment"],
    skills: ["Python", "TensorFlow", "PyTorch", "NLP", "Computer Vision", "Deep Learning"],
    createdAt: "2023-09-30"
  },
  {
    id: "job-8",
    title: "Blockchain Developer",
    company: "CryptoTech",
    location: "Remote",
    description: "Seeking a Blockchain Developer to build decentralized applications and smart contracts.",
    requirements: ["2+ years of experience", "Familiarity with Ethereum and Solidity", "Understanding of cryptographic principles"],
    skills: ["Solidity", "Ethereum", "Smart Contracts", "Blockchain", "DeFi", "Rust"],
    createdAt: "2023-09-28"
  },
  {
    id: "job-9",
    title: "Mobile App Developer",
    company: "AppWave",
    location: "Los Angeles, CA",
    description: "We are looking for a Mobile App Developer to build high-performance mobile applications.",
    requirements: ["3+ years of experience", "Proficiency in React Native or Flutter", "Understanding of mobile UI/UX best practices"],
    skills: ["React Native", "Flutter", "Swift", "Kotlin", "Mobile UI/UX", "Firebase"],
    createdAt: "2023-09-25"
  },
  {
    id: "job-10",
    title: "Product Manager",
    company: "Visionary Products",
    location: "Austin, TX",
    description: "We need a Product Manager to lead product development and strategy.",
    requirements: ["5+ years of experience", "Strong leadership skills", "Experience with Agile methodologies"],
    skills: ["Product Strategy", "Agile", "Scrum", "Market Analysis", "User Research", "Roadmap Planning"],
    createdAt: "2023-09-20"
  }
];


let candidates: Candidate[] = [
  {
    id: "candidate-1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "555-123-4567",
    resumeText: "Frontend developer with 4 years of experience building responsive web applications using React, TypeScript, and modern CSS frameworks.",
    skills: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Redux"],
    education: ["Bachelor's in Computer Science, University of Technology, 2019"],
    experience: ["Senior Frontend Developer at Web Solutions Inc., 2019-2023", "Frontend Intern at Tech Labs, 2018"],
    matchScore: 85,
    jobId: "job-1",
    status: "shortlisted",
    createdAt: "2023-10-20"
  },
  {
    id: "candidate-2",
    name: "Jane Davis",
    email: "jane.davis@example.com",
    phone: "555-987-6543",
    resumeText: "Data scientist with expertise in statistical analysis, machine learning, and data visualization. 5 years of experience working with large datasets.",
    skills: ["Python", "R", "SQL", "TensorFlow", "PyTorch", "Data Visualization"],
    education: ["Master's in Statistics, State University, 2018", "Bachelor's in Mathematics, State University, 2016"],
    experience: ["Senior Data Scientist at Analytics Corp, 2020-2023", "Data Analyst at Research Center, 2018-2020"],
    matchScore: 92,
    jobId: "job-2",
    status: "interviewing",
    interviewDate: "2023-11-05T10:00:00",
    createdAt: "2023-10-18"
  },
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `candidate-${i + 3}`,
    name: `Candidate ${i + 3}`,
    email: `candidate${i + 3}@example.com`,
    phone: `555-000-${String(i + 3).padStart(4, '0')}`,
    resumeText: `Software engineer with experience in full-stack development, cloud computing, and microservices architecture.`,
    skills: ["Java", "Spring Boot", "AWS", "Docker", "Kubernetes", "Microservices"],
    education: ["Bachelor's in Computer Science, Tech University, 2020"],
    experience: ["Software Engineer at Cloud Systems Inc., 2020-2023"],
    matchScore: Math.floor(Math.random() * 50) + 50,
    jobId: `job-${(i % 5) + 1}`,
    status: ["shortlisted", "new", "reviewed", "rejected", "interviewing"][Math.floor(Math.random() * 5)] as "shortlisted" | "new" | "reviewed" | "rejected" | "interviewing",
    createdAt: `2023-10-${String((i % 28) + 1).padStart(2, '0')}`
  }))
];

// Database operations
export const db = {
  // Job operations
  getJobs: () => Promise.resolve(jobs),
  
  getJob: (id: string) => Promise.resolve(jobs.find(job => job.id === id) || null),
  
  createJob: (job: Omit<Job, "id" | "createdAt">) => {
    const newJob: Job = {
      ...job,
      id: `job-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    jobs = [...jobs, newJob];
    toast({ title: "Job Created", description: "New job listing added successfully" });
    return Promise.resolve(newJob);
  },
  
  updateJob: (id: string, updates: Partial<Job>) => {
    jobs = jobs.map(job => job.id === id ? { ...job, ...updates } : job);
    toast({ title: "Job Updated", description: "Job listing updated successfully" });
    return Promise.resolve(jobs.find(job => job.id === id) || null);
  },
  
  deleteJob: (id: string) => {
    jobs = jobs.filter(job => job.id !== id);
    toast({ title: "Job Deleted", description: "Job listing removed successfully" });
    return Promise.resolve(true);
  },
  
  // Candidate operations
  getCandidates: (jobId?: string) => {
    if (jobId) {
      return Promise.resolve(candidates.filter(candidate => candidate.jobId === jobId));
    }
    return Promise.resolve(candidates);
  },
  
  getCandidate: (id: string) => Promise.resolve(candidates.find(candidate => candidate.id === id) || null),
  
  createCandidate: (candidate: Omit<Candidate, "id" | "createdAt" | "status">) => {
    const newCandidate: Candidate = {
      ...candidate,
      id: `candidate-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'new'
    };
    candidates = [...candidates, newCandidate];
    toast({ title: "Candidate Added", description: "New candidate added successfully" });
    return Promise.resolve(newCandidate);
  },
  
  updateCandidate: (id: string, updates: Partial<Candidate>) => {
    candidates = candidates.map(candidate => candidate.id === id ? { ...candidate, ...updates } : candidate);
    toast({ title: "Candidate Updated", description: "Candidate information updated successfully" });
    return Promise.resolve(candidates.find(candidate => candidate.id === id) || null);
  },
  
  deleteCandidate: (id: string) => {
    candidates = candidates.filter(candidate => candidate.id !== id);
    toast({ title: "Candidate Removed", description: "Candidate removed successfully" });
    return Promise.resolve(true);
  },
  
  // Analytics
  getStats: () => {
    return Promise.resolve({
      totalJobs: jobs.length,
      totalCandidates: candidates.length,
      shortlistedCandidates: candidates.filter(c => c.status === 'shortlisted').length,
      interviewingCandidates: candidates.filter(c => c.status === 'interviewing').length,
    });
  }
};
