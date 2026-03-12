import { useEffect } from 'react';
import { movieApi } from '../api/movieApi';

export const useKeepAlive = () => {
  useEffect(() => {
    if (import.meta.env.PROD) {
      const keepAlive = async () => {
        try {
          await movieApi.ping();
          console.log('í²“ Keep-alive ping sent');
        } catch (error) {
          console.error('Keep-alive failed:', error);
        }
      };

      keepAlive();
      const interval = setInterval(keepAlive, 10 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, []);
};
