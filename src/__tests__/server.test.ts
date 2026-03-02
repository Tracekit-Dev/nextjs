import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock global fetch
const mockFetch = vi.fn().mockResolvedValue({ ok: true });
vi.stubGlobal('fetch', mockFetch);

describe('server', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset module to clear stored config
    vi.resetModules();
    vi.stubGlobal('fetch', mockFetch);
  });

  it('initServer stores config', async () => {
    const { initServer, captureRequestError } = await import('../server');

    initServer({ apiKey: 'test-key' });

    const error = new Error('test error');
    captureRequestError(
      error,
      { path: '/api/test', method: 'GET', headers: {} },
      { routerKind: 'App Router', routePath: '/api/test', routeType: 'route' },
    );

    // If config was stored, fetch should be called
    expect(mockFetch).toHaveBeenCalled();
  });

  it('captureRequestError formats error payload with request context', async () => {
    const { initServer, captureRequestError } = await import('../server');

    initServer({ apiKey: 'test-key', release: '1.0.0', environment: 'prod' });

    const error = Object.assign(new Error('Something failed'), {
      digest: 'abc123',
    });
    captureRequestError(
      error,
      { path: '/users/123', method: 'POST', headers: {} },
      {
        routerKind: 'App Router',
        routePath: '/users/[id]',
        routeType: 'page',
      },
    );

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, options] = mockFetch.mock.calls[0];

    expect(url).toBe('https://app.tracekit.dev/v1/traces');

    const body = JSON.parse(options.body);
    expect(body.error.message).toBe('Something failed');
    expect(body.error.digest).toBe('abc123');
    expect(body.request.path).toBe('/users/123');
    expect(body.request.method).toBe('POST');
    expect(body.context.routerKind).toBe('App Router');
    expect(body.context.routePath).toBe('/users/[id]');
    expect(body.context.routeType).toBe('page');
    expect(body.release).toBe('1.0.0');
    expect(body.environment).toBe('prod');
    expect(body.timestamp).toEqual(expect.any(Number));
  });

  it('captureRequestError sends via fetch with API key header', async () => {
    const { initServer, captureRequestError } = await import('../server');

    initServer({ apiKey: 'my-secret-key' });

    captureRequestError(
      new Error('test'),
      { path: '/', method: 'GET', headers: {} },
      { routerKind: 'App Router', routePath: '/', routeType: 'page' },
    );

    const [, options] = mockFetch.mock.calls[0];
    expect(options.method).toBe('POST');
    expect(options.headers['Content-Type']).toBe('application/json');
    expect(options.headers['X-API-Key']).toBe('my-secret-key');
  });

  it('captureRequestError catches fetch errors gracefully', async () => {
    const failingFetch = vi.fn().mockRejectedValue(new Error('Network error'));
    vi.stubGlobal('fetch', failingFetch);

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { initServer, captureRequestError } = await import('../server');

    initServer({ apiKey: 'test-key' });

    // Should not throw
    captureRequestError(
      new Error('test'),
      { path: '/', method: 'GET', headers: {} },
      { routerKind: 'App Router', routePath: '/', routeType: 'page' },
    );

    // Wait for the promise rejection to be caught
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(warnSpy).toHaveBeenCalledWith(
      '[TraceKit] Failed to send server error:',
      expect.any(Error),
    );

    warnSpy.mockRestore();
  });

  it('captureRequestError warns when server not initialized', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { captureRequestError } = await import('../server');

    captureRequestError(
      new Error('test'),
      { path: '/', method: 'GET', headers: {} },
      { routerKind: 'App Router', routePath: '/', routeType: 'page' },
    );

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Server SDK not initialized'),
    );
    expect(mockFetch).not.toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it('captureRequestError uses custom apiEndpoint when configured', async () => {
    const { initServer, captureRequestError } = await import('../server');

    initServer({
      apiKey: 'test-key',
      apiEndpoint: 'https://custom.tracekit.dev',
    });

    captureRequestError(
      new Error('test'),
      { path: '/', method: 'GET', headers: {} },
      { routerKind: 'App Router', routePath: '/', routeType: 'page' },
    );

    const [url] = mockFetch.mock.calls[0];
    expect(url).toBe('https://custom.tracekit.dev/v1/traces');
  });
});
