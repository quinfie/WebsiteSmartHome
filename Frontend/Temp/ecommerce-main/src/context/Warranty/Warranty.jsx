import { createContext, useState } from 'react';

export const warrantyContext = createContext();

export default function WarrantyContextProvider({ children }) {
  const [warrantyList, setWarrantyList] = useState([]);

  return (
    <warrantyContext.Provider value={{ warrantyList, setWarrantyList }}>
      {children}
    </warrantyContext.Provider>
  );
}