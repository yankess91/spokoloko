import { useEffect, useState } from 'react';
import { appointmentsApi } from '../api';
import { t } from '../utils/i18n';

export default function useNearestUpcomingAppointment() {
  const [appointment, setAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setIsLoading(true);
        const data = await appointmentsApi.getNearestUpcoming();

        if (isMounted) {
          setAppointment(data);
          setError('');
        }
      } catch (err) {
        const isNotFound = err?.status === 404;

        if (!isMounted) {
          return;
        }

        if (isNotFound) {
          setAppointment(null);
          setError('');
          return;
        }

        setError(err.message ?? t('errors.appointments'));
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
  }, []);

  return { appointment, isLoading, error };
}
