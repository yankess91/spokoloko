import { useCallback, useEffect, useState } from 'react';
import { appointmentsApi } from '../api';

export default function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await appointmentsApi.getAll();
      setAppointments(data);
      setError('');
    } catch (err) {
      setError(err.message ?? 'Nie udało się pobrać wizyt.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addAppointment = useCallback(
    async (payload) => {
      const created = await appointmentsApi.create(payload);
      await load();
      return created;
    },
    [load]
  );

  return { appointments, isLoading, error, reload: load, addAppointment };
}
