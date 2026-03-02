import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@tracekit/browser', () => ({
  init: vi.fn(),
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  setUser: vi.fn(),
  setTag: vi.fn(),
  setExtra: vi.fn(),
  addBreadcrumb: vi.fn(),
  getClient: vi.fn(),
}));

import { init } from '@tracekit/browser';
import { initClient } from '../client';

describe('initClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls browser SDK init', () => {
    initClient({ apiKey: 'test-key' });

    expect(init).toHaveBeenCalledOnce();
  });

  it('passes config through to browser SDK init', () => {
    const config = {
      apiKey: 'test-key',
      release: '1.0.0',
      environment: 'staging',
      sampleRate: 0.5,
    };

    initClient(config);

    expect(init).toHaveBeenCalledWith(config);
  });
});
