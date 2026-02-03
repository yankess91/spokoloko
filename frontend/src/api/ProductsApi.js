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
}
