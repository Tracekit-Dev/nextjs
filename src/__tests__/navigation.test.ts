import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@tracekit/browser', () => ({
  addBreadcrumb: vi.fn(),
}));

import { addBreadcrumb } from '@tracekit/browser';

describe('onRouterTransitionStart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset module to reset lastUrl
    vi.resetModules();
  });

  it('calls addBreadcrumb with from/to data and navigationType', async () => {
    vi.mock('@tracekit/browser', () => ({
      addBreadcrumb: vi.fn(),
    }));

    const { onRouterTransitionStart } = await import('../navigation');
    const { addBreadcrumb: mockAddBreadcrumb } = await import(
      '@tracekit/browser'
    );

    onRouterTransitionStart('/dashboard', 'push');

    expect(mockAddBreadcrumb).toHaveBeenCalledWith({
      category: 'navigation',
      message: expect.stringContaining('-> /dashboard'),
      data: {
        from: expect.any(String),
        to: '/dashboard',
        navigationType: 'push',
      },
    });
  });

  it('tracks lastUrl across successive calls', async () => {
    vi.mock('@tracekit/browser', () => ({
      addBreadcrumb: vi.fn(),
    }));

    const { onRouterTransitionStart } = await import('../navigation');
    const { addBreadcrumb: mockAddBreadcrumb } = await import(
      '@tracekit/browser'
    );

    onRouterTransitionStart('/first', 'push');
    onRouterTransitionStart('/second', 'push');

    expect(mockAddBreadcrumb).toHaveBeenCalledTimes(2);

    // Second call should have from=/first
    const secondCall = (mockAddBreadcrumb as ReturnType<typeof vi.fn>).mock
      .calls[1][0];
    expect(secondCall.data.from).toBe('/first');
    expect(secondCall.data.to).toBe('/second');
    expect(secondCall.message).toBe('/first -> /second');
  });

  it('handles push navigationType', async () => {
    vi.mock('@tracekit/browser', () => ({
      addBreadcrumb: vi.fn(),
    }));

    const { onRouterTransitionStart } = await import('../navigation');
    const { addBreadcrumb: mockAddBreadcrumb } = await import(
      '@tracekit/browser'
    );

    onRouterTransitionStart('/page', 'push');

    expect(
      (mockAddBreadcrumb as ReturnType<typeof vi.fn>).mock.calls[0][0].data
        .navigationType,
    ).toBe('push');
  });

  it('handles replace navigationType', async () => {
    vi.mock('@tracekit/browser', () => ({
      addBreadcrumb: vi.fn(),
    }));

    const { onRouterTransitionStart } = await import('../navigation');
    const { addBreadcrumb: mockAddBreadcrumb } = await import(
      '@tracekit/browser'
    );

    onRouterTransitionStart('/page', 'replace');

    expect(
      (mockAddBreadcrumb as ReturnType<typeof vi.fn>).mock.calls[0][0].data
        .navigationType,
    ).toBe('replace');
  });

  it('handles traverse navigationType', async () => {
    vi.mock('@tracekit/browser', () => ({
      addBreadcrumb: vi.fn(),
    }));

    const { onRouterTransitionStart } = await import('../navigation');
    const { addBreadcrumb: mockAddBreadcrumb } = await import(
      '@tracekit/browser'
    );

    onRouterTransitionStart('/page', 'traverse');

    expect(
      (mockAddBreadcrumb as ReturnType<typeof vi.fn>).mock.calls[0][0].data
        .navigationType,
    ).toBe('traverse');
  });

  it('message format is from -> to', async () => {
    vi.mock('@tracekit/browser', () => ({
      addBreadcrumb: vi.fn(),
    }));

    const { onRouterTransitionStart } = await import('../navigation');
    const { addBreadcrumb: mockAddBreadcrumb } = await import(
      '@tracekit/browser'
    );

    // First call: from is whatever lastUrl initialized to
    onRouterTransitionStart('/first', 'push');

    const firstCall = (mockAddBreadcrumb as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    expect(firstCall.message).toMatch(/.+ -> \/first/);

    // Second call: from should be /first
    onRouterTransitionStart('/second', 'replace');

    const secondCall = (mockAddBreadcrumb as ReturnType<typeof vi.fn>).mock
      .calls[1][0];
    expect(secondCall.message).toBe('/first -> /second');
  });
});
