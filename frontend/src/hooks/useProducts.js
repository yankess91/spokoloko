import { useCallback, useEffect, useState } from 'react';
import { productsApi } from '../api';
import { t } from '../utils/i18n';
import { prependItem, removeItemById, updateItemById } from '../utils/collectionOptimizers';

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
      setError(err.message ?? t('errors.products'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addProduct = useCallback(async (payload) => {
    const created = await productsApi.create(payload);
    setProducts((current) => prependItem(current, created));
    return created;
  }, []);

  const updateProduct = useCallback(async (productId, payload) => {
    const updated = await productsApi.update(productId, payload);
    setProducts((current) => updateItemById(current, updated));
    return updated;
  }, []);

  const removeProduct = useCallback(async (productId) => {
    await productsApi.delete(productId);
    setProducts((current) => removeItemById(current, productId));
  }, []);

  return { products, isLoading, error, reload: load, addProduct, updateProduct, removeProduct };
}
