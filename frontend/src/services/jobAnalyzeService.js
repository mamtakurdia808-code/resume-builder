import api from "./api";

/**
 * Analyze a Job Description
 * POST /api/job-analysis/analyze
 */
export const analyzeJob = async (payload) => {
  const response = await api.post("/job-analysis/analyze", payload);
  return response.data;
};

/**
 * Get all saved job analyses
 * GET /api/job-analysis
 */
export const getJobAnalyses = async () => {
  const response = await api.get("/job-analysis");
  return response.data;
};

/**
 * Get one analysis by ID
 * GET /api/job-analysis/:id
 */
export const getJobAnalysisById = async (id) => {
  const response = await api.get(`/job-analysis/${id}`);
  return response.data;
};

/**
 * Delete an analysis
 * DELETE /api/job-analysis/:id
 */
export const deleteJobAnalysis = async (id) => {
  const response = await api.delete(`/job-analysis/${id}`);
  return response.data;
};