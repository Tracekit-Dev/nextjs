/**
 * @tracekit/nextjs - Server-side initialization and error capture
 *
 * Used in the developer's instrumentation.ts:
 *   import { initServer, captureRequestError } from '@tracekit/nextjs';
 *   export function register() { initServer({ apiKey: '...' }); }
 *   export const onRequestError = captureRequestError;
 *
 * This runs in Node.js/Edge -- no browser APIs.
 */

import type {
  TraceKitServerConfig,
  RequestErrorContext,
  RequestInfo,
} from './types';

// Module-level config storage
let serverConfig: TraceKitServerConfig | null = null;

/**
 * Initialize server-side TraceKit configuration.
 * Stores config for use by captureRequestError.
 */
export function initServer(config: TraceKitServerConfig): void {
  serverConfig = config;
}

/**
 * Capture a server-side request error and send to TraceKit.
 * Matches Next.js onRequestError signature.
 *
 * Fire-and-forget: catches and logs errors, never throws.
 */
export function captureRequestError(
  error: Error & { digest?: string },
  request: RequestInfo,
  context: RequestErrorContext,
): void | Promise<void> {
  if (!serverConfig) {
    console.warn(
      '[TraceKit] Server SDK not initialized. Call initServer() before captureRequestError().',
    );
    return;
  }

  const apiEndpoint =
    (serverConfig.apiEndpoint as string) || 'https://app.tracekit.dev';

  const payload = {
    error: {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    },
    request: {
      path: request.path,
      method: request.method,
    },
    context: {
      routerKind: context.routerKind,
      routePath: context.routePath,
      routeType: context.routeType,
    },
    release: serverConfig.release,
    environment: serverConfig.environment,
    timestamp: Date.now(),
  };

  // Fire-and-forget: catch and log, never throw
  try {
    fetch(`${apiEndpoint}/v1/traces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': serverConfig.apiKey,
      },
      body: JSON.stringify(payload),
    }).catch((fetchError: unknown) => {
      console.warn('[TraceKit] Failed to send server error:', fetchError);
    });
  } catch (syncError: unknown) {
    console.warn('[TraceKit] Failed to send server error:', syncError);
  }
}
