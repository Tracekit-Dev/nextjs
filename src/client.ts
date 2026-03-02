/**
 * @tracekit/nextjs - Client-side initialization
 *
 * Used in the developer's instrumentation-client.ts:
 *   import { initClient } from '@tracekit/nextjs';
 *   initClient({ apiKey: '...' });
 */

import {
  init,
  captureException,
  captureMessage,
  setUser,
  setTag,
  setExtra,
  addBreadcrumb,
  getClient,
} from '@tracekit/browser';
import type { TraceKitNextConfig } from './types';

/**
 * Initialize the TraceKit Browser SDK for Next.js client-side usage.
 * Call this in your instrumentation-client.ts file.
 */
export function initClient(config: TraceKitNextConfig): void {
  init(config);
}

// Re-export browser SDK functions for convenience
export {
  captureException,
  captureMessage,
  setUser,
  setTag,
  setExtra,
  addBreadcrumb,
  getClient,
};
