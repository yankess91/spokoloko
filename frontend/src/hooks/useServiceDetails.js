import { useCallback, useEffect, useState } from 'react';
import { servicesApi } from '../api';
import { formatDuration } from '../utils/formatters';
import { t } from '../utils/i18n';

export default function useServiceDetails(serviceId) {
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!serviceId) {
      setService(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await servicesApi.getById(serviceId);
      setService({
        ...data,
        duration: formatDuration(data.duration)
      });
      setError('');
    } catch (err) {
      setError(err.message ?? t('errors.serviceDetails'));
    } finally {
      setIsLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    load();
  }, [load]);

  return { service, isLoading, error, reload: load };
}
