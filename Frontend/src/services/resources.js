// We are using LocalStorage for the hackathon to show mock data since there is no backend.

const STORAGE_KEY = 'resqmap_resources_v3';

// Base coordinates around Delhi for realistic map spread
const MOCK_DATA = [
  { _id: '1', id: '1', title: '500 Thermal Blankets', type: 'shelter', quantity: 500, location: 'Sector 4, District HQ', lat: 28.6139, lng: 77.2090, status: 'available', description: 'Thermal blankets for winter relief.', createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString() },
  { _id: '2', id: '2', title: 'Medical Kits & First Aid', type: 'medicine', quantity: 50, location: 'City Hospital', lat: 28.5921, lng: 77.2250, status: 'allocated', description: 'Standard emergency medical kits.', createdAt: new Date(Date.now() - 172800000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString() },
  { _id: '3', id: '3', title: 'Bottled Water Pallets', type: 'food', quantity: 200, location: 'Warehouse B', lat: 28.6250, lng: 77.1850, status: 'completed', description: 'Clean drinking water. Distributed.', createdAt: new Date(Date.now() - 259200000).toISOString(), updatedAt: new Date(Date.now() - 172800000).toISOString() },
  { _id: '4', id: '4', title: 'Search & Rescue Volunteers', type: 'volunteer', quantity: 15, location: 'North Zone', lat: 28.6850, lng: 77.2150, status: 'available', description: 'Trained personnel for rubble search.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: '5', id: '5', title: 'Emergency Relief Funds ($)', type: 'funds', quantity: 10000, location: 'Central Bank', lat: 28.6300, lng: 77.2200, status: 'available', description: 'Funds for immediate procurement.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: '6', id: '6', title: 'Canned Food Supplies', type: 'food', quantity: 1000, location: 'Community Center', lat: 28.6500, lng: 77.2300, status: 'allocated', description: 'Ready to eat meals.', createdAt: new Date(Date.now() - 40000000).toISOString(), updatedAt: new Date(Date.now() - 30000000).toISOString() },
  { _id: '7', id: '7', title: 'Mobile Field Tents', type: 'shelter', quantity: 20, location: 'Camp Delta', lat: 28.5800, lng: 77.1500, status: 'available', description: 'Waterproof tents accommodating 10 people each.', createdAt: new Date(Date.now() - 300000000).toISOString(), updatedAt: new Date(Date.now() - 200000000).toISOString() },
  { _id: '8', id: '8', title: 'Antibiotics & Painkillers', type: 'medicine', quantity: 300, location: 'Red Cross Base', lat: 28.6100, lng: 77.1900, status: 'available', description: 'Essential medicines for trauma care.', createdAt: new Date(Date.now() - 500000000).toISOString(), updatedAt: new Date(Date.now() - 400000000).toISOString() },
  { _id: '9', id: '9', title: 'Heavy Machinery Operators', type: 'volunteer', quantity: 5, location: 'East District', lat: 28.6400, lng: 77.2800, status: 'allocated', description: 'Operating excavators for clearing debris.', createdAt: new Date(Date.now() - 100000000).toISOString(), updatedAt: new Date(Date.now() - 50000000).toISOString() },
  { _id: '10', id: '10', title: 'Rice and Grain Sacks', type: 'food', quantity: 500, location: 'Sector 2 Warehouse', lat: 28.6600, lng: 77.1600, status: 'completed', description: 'Basic food staples. Fully distributed.', createdAt: new Date(Date.now() - 800000000).toISOString(), updatedAt: new Date(Date.now() - 600000000).toISOString() },
  { _id: '11', id: '11', title: 'Rehabilitation Grants', type: 'funds', quantity: 50000, location: 'Mayor Office', lat: 28.6250, lng: 77.2100, status: 'allocated', description: 'Grants to help families rebuild homes.', createdAt: new Date(Date.now() - 90000000).toISOString(), updatedAt: new Date(Date.now() - 80000000).toISOString() },
  { _id: '12', id: '12', title: 'Portable Generators', type: 'shelter', quantity: 10, location: 'Power Grid Station', lat: 28.5700, lng: 77.2400, status: 'available', description: 'Backup power for emergency camps.', createdAt: new Date(Date.now() - 20000000).toISOString(), updatedAt: new Date().toISOString() },
  { _id: '13', id: '13', title: 'Baby Formula & Diapers', type: 'food', quantity: 150, location: 'Camp Alpha', lat: 28.6900, lng: 77.1800, status: 'allocated', description: 'Infant care essentials.', createdAt: new Date(Date.now() - 450000000).toISOString(), updatedAt: new Date(Date.now() - 300000000).toISOString() },
  { _id: '14', id: '14', title: 'Trauma Counselors', type: 'volunteer', quantity: 8, location: 'City Center', lat: 28.6350, lng: 77.2150, status: 'available', description: 'Mental health professionals for psychological first aid.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: '15', id: '15', title: 'Surgical Equipment Kits', type: 'medicine', quantity: 12, location: 'Naval Hospital', lat: 28.5850, lng: 77.1700, status: 'completed', description: 'Advanced surgical kits for emergency operations.', createdAt: new Date(Date.now() - 900000000).toISOString(), updatedAt: new Date(Date.now() - 800000000).toISOString() },
];

const getStoredData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DATA));
    return MOCK_DATA;
  }
  return JSON.parse(data);
};

const saveStoredData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getResources = async (filters) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let data = getStoredData();
  
  if (filters) {
    if (filters.type) {
      data = data.filter(r => r.type === filters.type);
    }
    if (filters.status) {
      data = data.filter(r => r.status === filters.status);
    }
    if (filters.location) {
      data = data.filter(r => r.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
  }
  
  // Sort by newest first
  data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  return { success: true, count: data.length, data };
};

export const createResource = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const currentData = getStoredData();
  const newResource = {
    ...data,
    id: Date.now().toString(),
    _id: Date.now().toString(),
    status: 'available',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  currentData.push(newResource);
  saveStoredData(currentData);
  
  return { success: true, data: newResource };
};

export const updateStatus = async (id, status) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const currentData = getStoredData();
  const index = currentData.findIndex(r => r.id === id || r._id === id);
  
  if (index === -1) throw new Error('Resource not found');
  
  currentData[index].status = status;
  currentData[index].updatedAt = new Date().toISOString();
  saveStoredData(currentData);
  
  return { success: true, data: currentData[index] };
};

export const checkHealth = async () => {
  return { success: true, service: 'Local Storage Mock', status: 'ok', timestamp: new Date().toISOString() };
};

export const getResourceById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const currentData = getStoredData();
  const resource = currentData.find(r => r.id === id || r._id === id);
  
  if (!resource) throw new Error("Resource not found");
  return { success: true, data: resource };
};
