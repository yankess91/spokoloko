import { useCallback, useEffect, useState } from 'react';
import { appointmentsApi } from '../api';
import { t } from '../utils/i18n';

export default function useAppointmentDetails(appointmentId) {
  const [appointment, setAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!appointmentId) {
      setAppointment(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await appointmentsApi.getById(appointmentId);
      setAppointment(data);
      setError('');
    } catch (err) {
      setError(err.message ?? t('errors.appointmentDetails'));
    } finally {
      setIsLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    load();
  }, [load]);

  return { appointment, isLoading, error, reload: load };
}
