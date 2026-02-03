import { useEffect, useState } from 'react';
import { productsApi } from '../api';

export default function useProductDetails(productId) {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!productId) {
        setProduct(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await productsApi.getById(productId);
        if (isMounted) {
          setProduct(data);
          setError('');
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message ?? 'Nie udało się pobrać produktu.');
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
  }, [productId]);

  return { product, isLoading, error };
}
