import { useCallback, useEffect, useState } from 'react';
import { ordersApi } from '../api';
import { prependItem, removeItemById, updateItemById } from '../utils/collectionOptimizers';
import { t } from '../utils/i18n';

const mapOrder = (order) => ({
  ...order,
  items: order.items ?? [],
  totalAmount: Number(order.totalAmount ?? 0)
});

export default function useOrders(initialFilters = {}) {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (nextFilters = filters) => {
    try {
      setIsLoading(true);
      const data = await ordersApi.getAll(nextFilters);
      setOrders(data.map(mapOrder));
      setError('');
    } catch (err) {
      setError(err.message ?? t('errors.orders'));
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load(filters);
  }, [filters, load]);

  const updateFilters = useCallback((nextFilters) => {
    setFilters((current) => ({ ...current, ...nextFilters }));
  }, []);

  const addOrder = useCallback(async (payload) => {
    const created = mapOrder(await ordersApi.create(payload));
    setOrders((current) => prependItem(current, created));
    return created;
  }, []);

  const updateOrder = useCallback(async (orderId, payload) => {
    const updated = mapOrder(await ordersApi.update(orderId, payload));
    setOrders((current) => updateItemById(current, updated));
    return updated;
  }, []);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    const updated = mapOrder(await ordersApi.updateStatus(orderId, status));
    setOrders((current) => updateItemById(current, updated));
    return updated;
  }, []);

  const removeOrder = useCallback(async (orderId) => {
    await ordersApi.delete(orderId);
    setOrders((current) => removeItemById(current, orderId));
  }, []);

  return {
    orders,
    filters,
    isLoading,
    error,
    reload: () => load(filters),
    updateFilters,
    addOrder,
    updateOrder,
    updateOrderStatus,
    removeOrder
  };
}
