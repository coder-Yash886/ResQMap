import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace('/api', '')
  : 'http://localhost:5000';

export const useSocket = () => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const listenersRef = useRef({});

  const on = useCallback((event, handler) => {
    if (!listenersRef.current[event]) listenersRef.current[event] = [];
    listenersRef.current[event].push(handler);
  }, []);

  const off = useCallback((event, handler) => {
    if (!listenersRef.current[event]) return;
    listenersRef.current[event] = listenersRef.current[event].filter(h => h !== handler);
  }, []);

  const emit = useCallback((event, data) => {
    if (socketRef.current) socketRef.current.emit(event, data);
  }, []);

  useEffect(() => {
    let socket = null;

    const connect = async () => {
      try {
        const { io } = await import('socket.io-client');
        socket = io(SOCKET_URL, {
          transports: ['websocket', 'polling'],
          reconnectionAttempts: 10,
          reconnectionDelay: 2000,
          timeout: 8000,
        });
        socketRef.current = socket;

        socket.on('connect', () => setConnected(true));
        socket.on('disconnect', () => setConnected(false));
        socket.on('connect_error', () => {});

        // Dispatch to registered listeners
        const proxyEvent = (eventName) => {
          socket.on(eventName, (data) => {
            (listenersRef.current[eventName] || []).forEach(h => h(data));
          });
        };

        // Core need events
        ['need:created', 'need:matched', 'need:assigned', 'need:updated',
         'new_request', 'request_assigned', 'request_updated', 'request_completed',
         'allocation_run'].forEach(proxyEvent);

      } catch (_) {
        console.warn('[useSocket] socket.io-client not installed.');
      }
    };

    connect();
    return () => { if (socket) socket.disconnect(); };
  }, []);

  return { connected, on, off, emit, socket: socketRef.current };
};
