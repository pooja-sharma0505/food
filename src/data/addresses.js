/**
 * Mock data — Addresses
 * Mirrors the shape returned by GET /api/addresses
 */
export const addresses = [
  {
    id: 1,
    user_id: 1,
    label: 'Home',
    full_name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    address_line1: '42, Sunrise Apartments',
    address_line2: 'Subhash Nagar',
    city: 'Jaipur',
    state: 'Rajasthan',
    postal_code: '302016',
    country: 'India',
    is_default: 1,
    created_at: '2025-01-15T10:30:00.000Z',
    updated_at: '2025-01-15T10:30:00.000Z',
  },
  {
    id: 2,
    user_id: 1,
    label: 'Work',
    full_name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    address_line1: '123, Corporate Plaza',
    address_line2: 'M.I. Road',
    city: 'Jaipur',
    state: 'Rajasthan',
    postal_code: '302001',
    country: 'India',
    is_default: 0,
    created_at: '2025-02-20T14:00:00.000Z',
    updated_at: '2025-02-20T14:00:00.000Z',
  },
];
