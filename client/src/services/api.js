import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

export async function submitLead(data) {
  const response = await api.post('/leads', data);
  return response.data;
}

export async function getLeadStatus(leadId) {
  const response = await api.get(`/leads/${leadId}/status`);
  return response.data;
}

export async function getLeadById(leadId) {
  const response = await api.get(`/leads/${leadId}`);
  return response.data;
}

export default api;
