// API Configuration
export const API_CONFIG = {
  // Development
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://backend-6qwu8zyfa-maitrungtruc2002-gmailcoms-projects.vercel.app' 
    : 'http://localhost:3001',
  
  // API Endpoints
  ENDPOINTS: {
    PROJECTS: '/api/projects',
    KEYWORDS: '/api/keywords',
    SCHEMAS: '/api/schemas',
    TAGS: '/api/tags',
    USERS: '/api/users',
    ROLES: '/api/roles',
    XML_IMPORTS: '/api/xml-imports',
    LINK_POSITIONS: '/api/link-positions',
  },
  
  // Headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to make API calls
export const apiCall = async (
  endpoint: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const url = buildApiUrl(endpoint);
  const config: RequestInit = {
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers,
    },
    ...options,
  };
  
  return fetch(url, config);
};
