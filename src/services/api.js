import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and auth (if needed in future)
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          throw new Error(data.message || 'Invalid request data');
        case 404:
          throw new Error(data.message || 'Resource not found');
        case 409:
          throw new Error(data.message || 'Conflict occurred');
        case 500:
          throw new Error(data.message || 'Internal server error');
        default:
          throw new Error(data.message || `Server error: ${status}`);
      }
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      // Other error
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

// Vehicle API functions
export const vehicleAPI = {
  // Add a new vehicle
  addVehicle: async (vehicleData) => {
    try {
      const response = await api.post('/vehicles', vehicleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all vehicles
  getAllVehicles: async () => {
    try {
      const response = await api.get('/vehicles');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Find available vehicles
  findAvailableVehicles: async (searchParams) => {
    try {
      const response = await api.get('/vehicles/available', {
        params: searchParams
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Booking API functions
export const bookingAPI = {
  // Create a new booking
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all bookings with optional filters
  getAllBookings: async (filters = {}) => {
    try {
      const response = await api.get('/bookings', {
        params: filters
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get specific booking by ID
  getBookingById: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update booking status
  updateBookingStatus: async (bookingId, status) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Health check function
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Utility functions
export const formatError = (error) => {
  if (error.response?.data?.details) {
    return error.response.data.details.join(', ');
  }
  return error.message || 'An unexpected error occurred';
};

export const isNetworkError = (error) => {
  return !error.response && error.request;
};

export default api;
