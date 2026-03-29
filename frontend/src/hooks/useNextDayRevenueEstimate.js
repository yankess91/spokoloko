import { useEffect, useState } from 'react';
import { appointmentsApi } from '../api';
import { t } from '../utils/i18n';

export default function useNextDayRevenueEstimate() {
  const [estimate, setEstimate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setIsLoading(true);
        const data = await appointmentsApi.getNextDayRevenueEstimate();

        if (isMounted) {
          setEstimate(data);
          setError('');
        }
      } catch (err) {
        if (!isMounted) {
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

  return { estimate, isLoading, error };
}
