import { useCallback, useEffect, useState } from 'react';
import { productsApi } from '../api';

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await productsApi.getAll();
      setProducts(data);
      setError('');
    } catch (err) {
      setError(err.message ?? 'Nie udało się pobrać produktów.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addProduct = useCallback(
    async (payload) => {
      const created = await productsApi.create(payload);
      await load();
      return created;
    },
    [load]
  );

  return { products, isLoading, error, reload: load, addProduct };
}
