import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../routes/ProtectedRoutes";
import DashboardLayout from "../pages/layout/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/Signup";
import ResumeBuilder from "../pages/resume/ResumeBuilder";
import MyResumes from "../pages/resume/MyResumes";
import EditResume from "../pages/resume/EditResume";
import ResumePreview from "../pages/resume/ResumePreview";
import Templates from "../pages/resume/Templates";
import Profile from "../pages/profile/Profile";
import ATSChecker from "../pages/ats/ATSChecker";
import ATSReports from "../pages/ats/ATSReports";
import ATSReportDetail from "../pages/ats/ATSReportDetail";
import AIResumeReview from "../pages/ai/aiResumeReview";
import AIResumeRewrite from "../pages/ai/aiResumeRewrite";
import jobAnalysis from "../pages/job/jobAnalysis";
import JobAnalyzer from "../pages/job/jobAnalysis";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/builder" element={<ResumeBuilder />} />
          <Route path="/resumes" element={<MyResumes />} />
          <Route path="/resumes/create" element={<ResumeBuilder />} />
          <Route path="/resumes/edit/:id" element={<EditResume />} />
          <Route path="/resumes/:id" element={<ResumePreview />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/ats-checker" element={<ATSChecker/>} />
          <Route path="/ats/reports" element={<ATSReports/>} />
          <Route path="/ats/reports/:id" element={<ATSReportDetail/>} />
          <Route path="/ai-review" element={<AIResumeReview/>} />
          <Route path="/ai-rewrite" element={<AIResumeRewrite/>} />
          <Route path="/job-analyzer" element={<JobAnalyzer/>} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}