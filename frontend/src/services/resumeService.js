import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const createResume = (data) =>
  API.post("/resumes", data);

export const getAllResumes = () =>
  API.get("/resumes");

export const getResumeById = (id) =>
  API.get(`/resumes/${id}`);

export const updateResume = (id, data) =>
  API.put(`/resumes/${id}`, data);

export const deleteResume = (id) =>
  API.delete(`/resumes/${id}`);
