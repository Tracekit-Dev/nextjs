/**
 * @tracekit/nextjs - Client-side navigation breadcrumbs
 *
 * Exports the onRouterTransitionStart function matching Next.js 15.3+
 * instrumentation-client.ts convention.
 *
 * Usage in instrumentation-client.ts:
 *   export { onRouterTransitionStart } from '@tracekit/nextjs';
 */

import { addBreadcrumb } from '@tracekit/browser';

/**
 * Track the previous URL for from/to breadcrumb recording.
 * Page loads do NOT trigger this hook -- they trigger @tracekit/browser's
 * base navigation integration. So this only captures client-side navigations.
 */
let lastUrl: string =
  typeof window !== 'undefined' ? window.location.pathname : '';

/**
 * Next.js 15.3+ onRouterTransitionStart hook.
 * Captures client-side navigation breadcrumbs with from/to URLs and navigationType.
 *
 * @param url - The destination URL
 * @param navigationType - 'push' | 'replace' | 'traverse'
 */
export function onRouterTransitionStart(
  url: string,
  navigationType: 'push' | 'replace' | 'traverse',
): void {
  addBreadcrumb({
    category: 'navigation',
    message: `${lastUrl} -> ${url}`,
    data: {
      from: lastUrl,
      to: url,
      navigationType,
    },
  });

  lastUrl = url;
}
