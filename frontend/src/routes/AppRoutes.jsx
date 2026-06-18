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
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}