import { useCallback, useEffect, useState } from 'react';
import { clientsApi } from '../api';
import { t } from '../utils/i18n';
import { prependItem, removeItemById, updateItemById } from '../utils/collectionOptimizers';

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
    setClients((current) => prependItem(current, created));
    return created;
  }, []);

  const updateClient = useCallback(async (clientId, payload) => {
    const updated = await clientsApi.update(clientId, payload);
    setClients((current) => updateItemById(current, updated));
    return updated;
  }, []);

  const updateStatus = useCallback(async (clientId, isActive) => {
    const updated = await clientsApi.updateStatus(clientId, { isActive });
    setClients((current) => updateItemById(current, updated));
    return updated;
  }, []);

  const removeClient = useCallback(async (clientId) => {
    await clientsApi.delete(clientId);
    setClients((current) => removeItemById(current, clientId));
  }, []);

  return { clients, isLoading, error, reload: load, addClient, updateClient, updateStatus, removeClient };
}
