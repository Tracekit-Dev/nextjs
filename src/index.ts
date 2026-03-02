/**
 * @tracekit/nextjs - Public API
 * @package @tracekit/nextjs
 *
 * Next.js integration for TraceKit with multi-runtime support:
 * - Client-side init for instrumentation-client.ts
 * - Server-side init for instrumentation.ts
 * - Navigation breadcrumbs via onRouterTransitionStart
 * - Error boundary components for App Router and Pages Router
 */

// Client-side init
export { initClient } from './client';

// Server-side init and error capture
export { initServer, captureRequestError } from './server';

// Navigation breadcrumbs
export { onRouterTransitionStart } from './navigation';

// Error boundary components
export { GlobalError, withTraceKitErrorPage } from './errors';

// Re-export browser SDK functions for convenience
export {
  captureException,
  captureMessage,
  setUser,
  setTag,
  setExtra,
  addBreadcrumb,
  getClient,
} from '@tracekit/browser';

// Types
export type {
  TraceKitNextConfig,
  TraceKitServerConfig,
  RequestErrorContext,
  RequestInfo,
} from './types';
