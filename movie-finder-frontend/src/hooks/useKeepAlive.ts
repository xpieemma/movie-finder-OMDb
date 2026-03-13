import { useEffect } from 'react';
import { movieApi } from '../api/movieApi';

export const useKeepAlive = () => {
  useEffect(() => {
    // Use import.meta.env for Vite projects
    if (process.env.PROD) {
      const keepAlive = async () => {
        try {
          // Check if ping exists before calling to avoid runtime crashes
          if (typeof movieApi.ping === 'function') {
            await movieApi.ping();
            console.log('📡 Keep-alive ping sent');
          }
        } catch (error) {
          // We don't usually want to show a toast for a background ping failure
          console.warn('Keep-alive silent failure:', error);
        }
      };

      keepAlive();
      // Ping every 10 minutes to keep Koyeb awake
      const interval = setInterval(keepAlive, 10 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, []);
};