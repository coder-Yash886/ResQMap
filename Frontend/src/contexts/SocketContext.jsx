import React, { createContext, useContext, useRef } from 'react';
import { useSocket } from '../hooks/useSocket';

const SocketContext = createContext(null);
export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketData = useSocket();
  return (
    <SocketContext.Provider value={socketData}>
      {children}
    </SocketContext.Provider>
  );
};
