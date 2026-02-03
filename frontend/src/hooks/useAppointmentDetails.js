import { useEffect, useState } from 'react';
import { appointmentsApi } from '../api';

export default function useAppointmentDetails(appointmentId) {
  const [appointment, setAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!appointmentId) {
        setAppointment(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await appointmentsApi.getById(appointmentId);
        if (isMounted) {
          setAppointment(data);
          setError('');
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message ?? 'Nie udało się pobrać wizyty.');
        }
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
  }, [appointmentId]);

  return { appointment, isLoading, error };
}
