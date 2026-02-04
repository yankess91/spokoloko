import { useCallback, useEffect, useState } from 'react';
import { clientsApi } from '../api';

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
      setError(err.message ?? 'Nie udało się pobrać klientek.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addClient = useCallback(
    async (payload) => {
      const created = await clientsApi.create(payload);
      await load();
      return created;
    },
    [load]
  );

  const updateStatus = useCallback(
    async (clientId, isActive) => {
      const updated = await clientsApi.updateStatus(clientId, { isActive });
      await load();
      return updated;
    },
    [load]
  );

  return { clients, isLoading, error, reload: load, addClient, updateStatus };
}
