import axios from 'axios';

// Base URL - in development, this is proxied to http://localhost:5000
const API = axios.create({
  baseURL: '/api',
});

// Automatically attach token from localStorage to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const registerUser  = (data) => API.post('/auth/register', data);
export const loginUser     = (data) => API.post('/auth/login', data);

// ─── Jobs ─────────────────────────────────────────────────────────────────────
export const fetchJobs     = (params) => API.get('/jobs', { params });
export const fetchJobById  = (id)     => API.get(`/jobs/${id}`);
export const createJob     = (data)   => API.post('/jobs', data);
export const updateJob     = (id, data) => API.put(`/jobs/${id}`, data);
export const deleteJob     = (id)     => API.delete(`/jobs/${id}`);
export const fetchMyJobs   = ()       => API.get('/jobs/employer/myjobs');

// ─── Applications ─────────────────────────────────────────────────────────────
export const applyToJob         = (jobId, data)  => API.post(`/applications/${jobId}`, data);
export const fetchMyApplications = ()            => API.get('/applications/my');
export const fetchJobApplications = (jobId)      => API.get(`/applications/job/${jobId}`);
export const updateAppStatus    = (id, status)   => API.put(`/applications/${id}/status`, { status });

// ─── Profile ──────────────────────────────────────────────────────────────────
export const fetchProfile  = ()       => API.get('/profile/me');
export const updateProfile = (data)   => API.put('/profile/me', data);
