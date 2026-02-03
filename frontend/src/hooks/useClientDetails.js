import { useEffect, useState } from 'react';
import { clientsApi } from '../api';

export default function useClientDetails(clientId) {
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!clientId) {
        setClient(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await clientsApi.getById(clientId);
        if (isMounted) {
          setClient(data);
          setError('');
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message ?? 'Nie udało się pobrać klientki.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [clientId]);

  return { client, isLoading, error };
}
