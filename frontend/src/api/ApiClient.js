import { getAuthToken } from '../utils/auth';

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
      throw new Error(`Nie udało się wykonać żądania: ${response.status}`);
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
}
