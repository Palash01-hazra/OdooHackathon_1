// API Configuration
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  // Register new user
  register: async (userData) => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (credentials) => {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    // Store token in localStorage
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Get current user profile
  getProfile: async () => {
    return apiRequest("/auth/profile");
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return apiRequest("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },
};

// Questions API calls
export const questionsAPI = {
  // Get all questions with filters
  getQuestions: async (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiRequest(`/questions?${searchParams}`);
  },

  // Get single question by ID
  getQuestion: async (id) => {
    return apiRequest(`/questions/${id}`);
  },

  // Create new question
  createQuestion: async (questionData) => {
    return apiRequest("/questions", {
      method: "POST",
      body: JSON.stringify(questionData),
    });
  },

  // Vote on question
  voteQuestion: async (id, type) => {
    return apiRequest(`/questions/${id}/vote`, {
      method: "POST",
      body: JSON.stringify({ type }),
    });
  },

  // Search questions
  searchQuestions: async (query, filters = {}) => {
    const params = { search: query, ...filters };
    return questionsAPI.getQuestions(params);
  },
};

// Answers API calls
export const answersAPI = {
  // Create new answer
  createAnswer: async (questionId, content) => {
    return apiRequest(`/questions/${questionId}/answers`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  },

  // Vote on answer
  voteAnswer: async (id, type) => {
    return apiRequest(`/answers/${id}/vote`, {
      method: "POST",
      body: JSON.stringify({ type }),
    });
  },

  // Accept answer
  acceptAnswer: async (id) => {
    return apiRequest(`/answers/${id}/accept`, {
      method: "POST",
    });
  },
};

// Users API calls
export const usersAPI = {
  // Get user by ID
  getUser: async (id) => {
    return apiRequest(`/users/${id}`);
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    return apiRequest("/users");
  },
};

// Utility functions
export const utils = {
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAuthToken();
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Format date for display
  formatDate: (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString();
    }
  },

  // Validate email format
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password strength
  isStrongPassword: (password) => {
    // At least 6 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return passwordRegex.test(password);
  },
};

// Default export with all APIs
const api = {
  auth: authAPI,
  questions: questionsAPI,
  answers: answersAPI,
  users: usersAPI,
  utils,
};

export default api;
