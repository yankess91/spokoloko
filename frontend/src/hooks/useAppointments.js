import { useCallback, useEffect, useState } from 'react';
import { appointmentsApi } from '../api';
import { t } from '../utils/i18n';

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
      setError(err.message ?? t('errors.appointments'));
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

  const removeAppointment = useCallback(
    async (appointmentId) => {
      await appointmentsApi.delete(appointmentId);
      await load();
    },
    [load]
  );

  return { appointments, isLoading, error, reload: load, addAppointment, removeAppointment };
}
