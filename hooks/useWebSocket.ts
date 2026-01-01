import { useState, useEffect, useCallback, useRef } from 'react';
import { WebSocketMessage, Reading } from '@/lib/types';

const WS_RECONNECT_DELAY = Number(process.env.NEXT_PUBLIC_WS_RECONNECT_DELAY) || 3000;
const WS_MAX_RETRIES = Number(process.env.NEXT_PUBLIC_WS_MAX_RETRIES) || 5;

export function useWebSocket(url: string, isPaused: boolean = false) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<Reading | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const disconnect = useCallback(() => {
    // Clear any pending reconnection attempts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
  }, []);

  const connect = useCallback(() => {
    if (!url) {
      setError('WebSocket URL not configured');
      return;
    }

    // Don't connect if already connected or paused
    if (wsRef.current || isPaused) {
      return;
    }

    try {
      console.log('Connecting to WebSocket...');
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        setRetryCount(0);
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          if (message.type === 'reading' && message.data) {
            setLastMessage(message.data);
          } else if (message.type === 'error') {
            setError(message.error || 'Unknown WebSocket error');
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('WebSocket connection error');
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        wsRef.current = null;

        // Only attempt reconnection if not manually paused and under retry limit
        if (!isPaused && retryCount < WS_MAX_RETRIES) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Reconnecting... attempt ${retryCount + 1}`);
            setRetryCount((prev) => prev + 1);
          }, WS_RECONNECT_DELAY);
        } else if (retryCount >= WS_MAX_RETRIES) {
          setError('Max reconnection attempts reached');
        }
      };

      wsRef.current = ws;
    } catch (err) {
      setError((err as Error).message);
    }
  }, [url, retryCount, isPaused]);

  // Handle pause/resume
  useEffect(() => {
    if (isPaused) {
      console.log('Paused: Disconnecting WebSocket');
      disconnect();
      setRetryCount(0);
      setError(null);
    } else {
      console.log('Resumed: Connecting WebSocket');
      setRetryCount(0);
      setError(null);
      connect();
    }

    return () => {
      disconnect();
    };
  }, [isPaused, disconnect, connect]);

  // Handle auto-reconnection
  useEffect(() => {
    if (retryCount > 0 && !isPaused && !wsRef.current) {
      connect();
    }
  }, [retryCount, isPaused, connect]);

  return {
    isConnected,
    lastMessage,
    error,
    retryCount,
  };
}
