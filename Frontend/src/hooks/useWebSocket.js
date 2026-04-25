import { useState, useEffect, useRef } from 'react';

export const useWebSocket = (url) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    let reconnectInterval;

    const connect = () => {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        setIsConnected(true);
        console.log('WebSocket Connected');
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
        } catch (err) {
          console.error('WebSocket message parsing error', err);
        }
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket Disconnected. Reconnecting...');
        // Auto-reconnect every 3 seconds
        reconnectInterval = setTimeout(connect, 3000);
      };

      ws.current.onerror = (err) => {
        console.error('WebSocket Error:', err);
        ws.current.close();
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectInterval);
      if (ws.current) {
        // Prevent reconnect loop on intentional unmount
        ws.current.onclose = null; 
        ws.current.close();
      }
    };
  }, [url]);

  return { isConnected, lastMessage };
};
