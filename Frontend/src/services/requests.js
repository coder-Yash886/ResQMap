import api from './api';

/**
 * Create a new need request.
 * @param {Object} data - { title, category, quantity, unit, urgency, location: { address, lat, lng }, description, requesterId, requesterName, requesterEmail }
 */
export const createNeedRequest = (data) => api.post('/requests', data).then(r => r.data);

/**
 * Get all requests with optional filters.
 * @param {Object} filters - { urgency, status, category }
 */
export const getAllRequests = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
  return api.get(`/requests?${params.toString()}`).then(r => r.data);
};

/**
 * Get requests near a GPS location.
 * @param {number} lat
 * @param {number} lng
 * @param {number} radius - km (default 10)
 */
export const getNearbyRequests = (lat, lng, radius = 10) =>
  api.get(`/requests/nearby?lat=${lat}&lng=${lng}&radius=${radius}`).then(r => r.data);

/**
 * Volunteer accepts a request.
 * @param {string} id - request ID
 * @param {string} volunteerId
 * @param {string} volunteerName
 */
export const assignRequest = (id, volunteerId, volunteerName) =>
  api.patch(`/requests/${id}/assign`, { volunteerId, volunteerName }).then(r => r.data);

/**
 * Volunteer starts delivery.
 * @param {string} id - request ID
 */
export const startDelivery = (id) =>
  api.patch(`/requests/${id}/start`).then(r => r.data);

/**
 * Mark a request as completed.
 * @param {string} id - request ID
 * @param {Object} feedback - { rating, comment }
 */
export const completeRequest = (id, feedback = {}) =>
  api.patch(`/requests/${id}/complete`, feedback).then(r => r.data);
