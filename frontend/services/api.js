import axios from "axios";
const API_BASE_URL = "/";
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ── JWT Interceptor: auto-attach token to every request ──
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const tokens = JSON.parse(localStorage.getItem("tokens") || "null");
    if (tokens?.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
  }
  return config;
});

// ── Auth ──
export const authService = {
  register: (data) => api.post("api/auth/register/", data),
  login: (data) => api.post("api/auth/login/", data),
  getProfile: () => api.get("api/auth/profile/"),
  refreshToken: (refresh) => api.post("api/auth/token/refresh/", { refresh }),
};

// ── Materials ──
export const materialService = {
  getAll: (params) => api.get("api/materials/", { params }),
  getById: (id) => api.get(`api/materials/${id}/`),
  create: (formData) =>
    api.post("api/materials/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, data) => api.put(`api/materials/${id}/`, data),
  delete: (id) => api.delete(`api/materials/${id}/`),
};

// ── Tests ──
export const testService = {
  getAll: (params) => api.get("api/tests/", { params }),
  getById: (id) => api.get(`api/tests/${id}/`),
  create: (data) => api.post("api/tests/", data),
  addQuestions: (testId, questions) =>
    api.post(`api/tests/${testId}/add_questions/`, questions),
  submit: (testId, answers) =>
    api.post(`api/tests/${testId}/submit/`, { answers }),
  getResults: () => api.get("api/tests/results/"),
};

export default api;
