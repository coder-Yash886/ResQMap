import api from './api';

export const getResources = async (filters) => {
  try {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.type) params.append('type', filters.type);
      if (filters.status) params.append('status', filters.status);
      if (filters.location) params.append('location', filters.location);
    }
    
    const response = await api.get(`/resources?${params.toString()}`);
    return response.data; // { success: true, count: X, data: [...] }
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    throw error;
  }
};

export const createResource = async (data) => {
  try {
    const response = await api.post('/resources', data);
    return response.data;
  } catch (error) {
    console.error("Failed to create resource:", error);
    throw error;
  }
};

export const updateStatus = async (id, status) => {
  try {
    const response = await api.put(`/resources/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error("Failed to update status:", error);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await api.get('/resources');
    return { success: true, service: 'MongoDB Backend', status: 'ok', timestamp: new Date().toISOString() };
  } catch (error) {
    return { success: false, service: 'MongoDB Backend', status: 'down', timestamp: new Date().toISOString() };
  }
};

export const getResourceById = async (id) => {
  try {
    const response = await api.get(`/resources/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch resource by id:", error);
    throw error;
  }
};
