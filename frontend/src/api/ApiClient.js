import { getAuthToken, notifyUnauthorized } from '../utils/auth';

const DEFAULT_TIMEOUT_MS = 15000;

export class ApiClientError extends Error {
  constructor(message, { status = 0, code = 'unknown_error', details = null } = {}) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function withTimeoutSignal(timeoutMs, externalSignal) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(new DOMException('Request timeout', 'AbortError')), timeoutMs);

  const abortHandler = () => controller.abort(externalSignal?.reason);
  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort(externalSignal.reason);
    } else {
      externalSignal.addEventListener('abort', abortHandler, { once: true });
    }
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timeout);
      externalSignal?.removeEventListener('abort', abortHandler);
    }
  };
}

async function parseResponsePayload(response) {
  const contentType = response.headers.get('Content-Type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return text || null;
}

export default class ApiClient {
  constructor(baseUrl, { defaultTimeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
    this.baseUrl = baseUrl;
    this.defaultTimeoutMs = defaultTimeoutMs;
  }

  async request(path, options = {}) {
    const token = getAuthToken();
    const { timeoutMs = this.defaultTimeoutMs, signal, ...requestOptions } = options;
    const timeoutContext = withTimeoutSignal(timeoutMs, signal);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(requestOptions.headers ?? {})
        },
        ...requestOptions,
        signal: timeoutContext.signal
      });

      const payload = await parseResponsePayload(response);

      if (!response.ok) {
        if (response.status === 401) {
          notifyUnauthorized();
        }

        const message = payload?.message
          ?? payload?.title
          ?? `Nie udało się wykonać żądania (${response.status}).`;

        throw new ApiClientError(message, {
          status: response.status,
          code: payload?.code ?? 'http_error',
          details: payload?.errors ?? payload
        });
      }

      if (response.status === 204) {
        return null;
      }

      return payload;
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }

      if (error?.name === 'AbortError') {
        throw new ApiClientError('Przekroczono czas oczekiwania na odpowiedź serwera.', {
          status: 408,
          code: 'request_timeout'
        });
      }

      throw new ApiClientError('Brak połączenia z serwerem.', {
        status: 0,
        code: 'network_error'
      });
    } finally {
      timeoutContext.cleanup();
    }
  }

  get(path, options) {
    return this.request(path, options);
  }

  post(path, payload, options) {
    return this.request(path, {
      method: 'POST',
      body: JSON.stringify(payload),
      ...options
    });
  }

  put(path, payload, options) {
    return this.request(path, {
      method: 'PUT',
      body: JSON.stringify(payload),
      ...options
    });
  }

  delete(path, options) {
    return this.request(path, { method: 'DELETE', ...options });
  }

  patch(path, payload, options) {
    return this.request(path, {
      method: 'PATCH',
      body: JSON.stringify(payload),
      ...options
    });
  }
}
