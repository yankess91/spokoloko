import { useCallback, useEffect, useState } from 'react';
import { servicesApi } from '../api';
import { formatDurationRange } from '../utils/formatters';
import { t } from '../utils/i18n';
import { prependItem, removeItemById, updateItemById } from '../utils/collectionOptimizers';

function mapService(service) {
  const durationFromValue = service?.durationFrom ?? '';
  const durationToValue = service?.durationTo ?? '';

  const parseDurationMinutes = (durationValue) =>
    typeof durationValue === 'string' && durationValue.includes(':')
      ? Number(durationValue.split(':')[0] ?? 0) * 60 + Number(durationValue.split(':')[1] ?? 0)
      : null;

  const durationFromMinutes = service?.durationFromMinutes ?? parseDurationMinutes(durationFromValue);
  const durationToMinutes = service?.durationToMinutes ?? parseDurationMinutes(durationToValue);

  return {
    ...service,
    durationFromMinutes: durationFromMinutes ?? 0,
    durationToMinutes: durationToMinutes ?? 0,
    type: service?.type ?? 'OnSite',
    completionDeadlineDate: service?.completionDeadlineDate ?? null,
    orderPosition: Number(service?.orderPosition ?? 0),
    duration: formatDurationRange(durationFromValue, durationToValue)
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
