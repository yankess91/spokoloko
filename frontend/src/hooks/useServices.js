import { useCallback, useEffect, useState } from 'react';
import { servicesApi } from '../api';
import { formatDuration } from '../utils/formatters';
import { t } from '../utils/i18n';
import { prependItem, removeItemById, updateItemById } from '../utils/collectionOptimizers';

function mapService(service) {
  return {
    ...service,
    duration: formatDuration(service.duration)
  };
}

export default function useServices() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await servicesApi.getAll();
      setServices(data.map(mapService));
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

  const addService = useCallback(async (payload) => {
    const created = mapService(await servicesApi.create(payload));
    setServices((current) => prependItem(current, created));
    return created;
  }, []);

  const updateService = useCallback(async (serviceId, payload) => {
    const updated = mapService(await servicesApi.update(serviceId, payload));
    setServices((current) => updateItemById(current, updated));
    return updated;
  }, []);

  const removeService = useCallback(async (serviceId) => {
    await servicesApi.delete(serviceId);
    setServices((current) => removeItemById(current, serviceId));
  }, []);

  return { services, isLoading, error, reload: load, addService, updateService, removeService };
}
