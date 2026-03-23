import { useCallback, useEffect, useState } from 'react';
import { clientsApi } from '../api';
import { t } from '../utils/i18n';

export default function useClients() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await clientsApi.getAll();
      setClients(data);
      setError('');
    } catch (err) {
      setError(err.message ?? t('errors.clients'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addClient = useCallback(async (payload) => {
    const created = await clientsApi.create(payload);
    await load();
    return created;
  }, [load]);

  const updateClient = useCallback(async (clientId, payload) => {
    const updated = await clientsApi.update(clientId, payload);
    await load();
    return updated;
  }, [load]);

  const updateStatus = useCallback(async (clientId, isActive) => {
    const updated = await clientsApi.updateStatus(clientId, { isActive });
    await load();
    return updated;
  }, [load]);

  const removeClient = useCallback(async (clientId) => {
    const updated = await clientsApi.delete(clientId);
    await load();
    return updated;
  }, [load]);

  return { clients, isLoading, error, reload: load, addClient, updateClient, updateStatus, removeClient };
}
