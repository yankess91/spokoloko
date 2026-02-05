import { useEffect, useState } from 'react';
import { servicesApi } from '../api';
import { formatDuration } from '../utils/formatters';
import { t } from '../utils/i18n';

export default function useServiceDetails(serviceId) {
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!serviceId) {
        setService(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await servicesApi.getById(serviceId);
        if (isMounted) {
          setService({
            ...data,
            duration: formatDuration(data.duration)
          });
          setError('');
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message ?? t('errors.serviceDetails'));
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
  }, [serviceId]);

  return { service, isLoading, error };
}
