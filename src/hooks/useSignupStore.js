import { createContext, useContext, useState } from 'react';

const SignupContext = createContext(null);

export function SignupProvider({ children }) {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    preferences: ['pizza', 'indian', 'healthy'],
    diet: 'Vegetarian',
    flat: '',
    area: '',
    city: '',
    pincode: '',
  });

  const update = (patch) => setData((prev) => ({ ...prev, ...patch }));

  return <SignupContext.Provider value={{ data, update }}>{children}</SignupContext.Provider>;
}

export function useSignupStore() {
  const ctx = useContext(SignupContext);
  if (!ctx) throw new Error('useSignupStore must be used within SignupProvider');
  return ctx;
}