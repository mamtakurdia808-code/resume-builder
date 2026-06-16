import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../routes/ProtectedRoutes";
import DashboardLayout from "../pages/layout/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/Signup";
import ResumeBuilder from "../pages/resume/ResumeBuilder";
import MyResumes from "../pages/resume/MyResumes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes with DashboardLayout */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/resume-builder" element={<ResumeBuilder />} />
          <Route path="/resumes" element={<MyResumes />} />
          <Route path="/resumes/create" element={<ResumeBuilder />} />
          <Route path="/resumes/edit/:id" element={<ResumeBuilder />} />
          <Route path="/resumes/:id" element={<Dashboard />} />
          {/* Add more nested routes here */}
        </Route>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 Route */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
