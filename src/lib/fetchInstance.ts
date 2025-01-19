type FetchOptions = RequestInit & { headers?: Record<string, string> };

export class FetchInstance {
  private baseURL: string;
  private defaultOptions: FetchOptions;

  constructor(baseURL: string, defaultOptions: FetchOptions = {}) {
    this.baseURL = baseURL;
    this.defaultOptions = defaultOptions;
  }

  private async request<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: FetchOptions = {
      ...this.defaultOptions,
      ...options,
      headers: {
        ...(this.defaultOptions.headers as Record<string, string>),
        ...(options.headers as Record<string, string>)
      }
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error ${response.status}: ${response.statusText}\n${errorText}`
      );
    }

    return response.json() as Promise<T>;
  }
  // Método GET
  get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  // Método POST
  post<T>(endpoint: string, body: unknown, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers as Record<string, string>)
      }
    });
  }

  // Método PUT
  put<T>(endpoint: string, body: unknown, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers as Record<string, string>)
      }
    });
  }

  // Método DELETE
  delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}
