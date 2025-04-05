
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import JobsPage from "./pages/jobs/JobsPage";
import NewJobPage from "./pages/jobs/NewJobPage";
import JobDetailPage from "./pages/jobs/JobDetailPage";
import CandidatesPage from "./pages/candidates/CandidatesPage";
import NewCandidatePage from "./pages/candidates/NewCandidatePage";
import CandidateDetailPage from "./pages/candidates/CandidateDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/new" element={<NewJobPage />} />
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />
          <Route path="/candidates" element={<CandidatesPage />} />
          <Route path="/candidates/new" element={<NewCandidatePage />} />
          <Route path="/candidates/:candidateId" element={<CandidateDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
