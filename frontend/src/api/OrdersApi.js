export default class OrdersApi {
  constructor(client) {
    this.client = client;
  }

  getAll(filters = {}) {
    const params = new URLSearchParams();

    if (filters.search?.trim()) {
      params.set('search', filters.search.trim());
    }

    if (filters.status) {
      params.set('status', filters.status);
    }

    if (filters.deliveryMethod) {
      params.set('deliveryMethod', filters.deliveryMethod);
    }

    if (filters.clientId) {
      params.set('clientId', filters.clientId);
    }

    const query = params.toString();
    return this.client.get(`/api/orders${query ? `?${query}` : ''}`);
  }

  getById(id) {
    return this.client.get(`/api/orders/${id}`);
  }

  create(payload) {
    return this.client.post('/api/orders', payload);
  }

  update(id, payload) {
    return this.client.put(`/api/orders/${id}`, payload);
  }

  updateStatus(id, status) {
    return this.client.patch(`/api/orders/${id}/status`, { status });
  }

  delete(id) {
    return this.client.delete(`/api/orders/${id}`);
  }
}
