export default class ProductsApi {
  constructor(client) {
    this.client = client;
  }

  getAll() {
    return this.client.get('/api/products');
  }

  search(searchTerm = '') {
    const query = searchTerm.trim();
    return this.client.get(`/api/products${query ? `?search=${encodeURIComponent(query)}` : ''}`);
  }

  getById(id) {
    return this.client.get(`/api/products/${id}`);
  }

  create(payload) {
    return this.client.post('/api/products', payload);
  }

  update(id, payload) {
    return this.client.put(`/api/products/${id}`, payload);
  }

  delete(id) {
    return this.client.delete(`/api/products/${id}`);
  }
}
