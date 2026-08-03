/**
 * Mock data — Authentication
 * Dummy user credentials for the fake local login.
 * No backend authentication, no database, no JWT.
 */
export const dummyUser = {
  id: 1,
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  phone: '+91 98765 43210',
  password: 'password', // demo only — never store real passwords in frontend code
};

export const dummyToken = 'mock-jwt-token-savor-demo';
