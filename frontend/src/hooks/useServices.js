import { useCallback, useEffect, useState } from 'react';
import { servicesApi } from '../api';
import { formatDuration } from '../utils/formatters';
import { t } from '../utils/i18n';

export default function useServices() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await servicesApi.getAll();
      setServices(
        data.map((service) => ({
          ...service,
          duration: formatDuration(service.duration)
        }))
      );
      setError('');
    } catch (err) {
      setError(err.message ?? t('errors.services'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addService = useCallback(
    async (payload) => {
      const created = await servicesApi.create(payload);
      await load();
      return created;
    },
    [load]
  );

  const removeService = useCallback(
    async (serviceId) => {
      await servicesApi.delete(serviceId);
      await load();
    },
    [load]
  );

  return { services, isLoading, error, reload: load, addService, removeService };
}
