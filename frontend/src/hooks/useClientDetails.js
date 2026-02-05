import { useCallback, useEffect, useRef, useState } from 'react';
import { clientsApi } from '../api';
import { t } from '../utils/i18n';

export default function useClientDetails(clientId) {
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const isMountedRef = useRef(true);

  const load = useCallback(async () => {
    if (!clientId) {
      if (isMountedRef.current) {
        setClient(null);
        setIsLoading(false);
      }
      return;
    }

    try {
      if (isMountedRef.current) {
        setIsLoading(true);
      }
      const data = await clientsApi.getById(clientId);
      if (isMountedRef.current) {
        setClient(data);
        setError('');
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err.message ?? t('errors.clientDetails'));
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [clientId]);

  useEffect(() => {
    isMountedRef.current = true;
    load();

    return () => {
      isMountedRef.current = false;
    };
  }, [load]);

  return { client, isLoading, error, reload: load };
}
