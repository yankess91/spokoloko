import { getAuthToken, notifyUnauthorized } from '../utils/auth';

export default class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(path, options = {}) {
    const token = getAuthToken();
    const response = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {})
      },
      ...options
    });

    if (!response.ok) {
      if (response.status === 401) {
        notifyUnauthorized();
      }
      const error = new Error(`Nie udało się wykonać żądania: ${response.status}`);
      error.status = response.status;
      throw error;
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  get(path) {
    return this.request(path);
  }

  post(path, payload) {
    return this.request(path, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  delete(path) {
    return this.request(path, { method: 'DELETE' });
  }

  patch(path, payload) {
    return this.request(path, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  }
}
