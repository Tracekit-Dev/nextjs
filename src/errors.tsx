/**
 * @tracekit/nextjs - Error boundary components
 *
 * GlobalError: For App Router global-error.tsx
 * withTraceKitErrorPage: HOC for Pages Router _error.tsx
 */

'use client';

import React, { useEffect } from 'react';
import { captureException } from '@tracekit/browser';

/**
 * App Router GlobalError component.
 * Captures errors via captureException and renders a resettable error UI.
 *
 * Usage in app/global-error.tsx:
 *   export { GlobalError as default } from '@tracekit/nextjs';
 */
export function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.JSX.Element {
  useEffect(() => {
    captureException(error, {
      mechanism: 'nextjs.globalError',
      digest: error.digest,
    });
  }, [error]);

  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={reset}>Try again</button>
        {process.env.NODE_ENV === 'development' && (
          <p>{error.message}</p>
        )}
      </body>
    </html>
  );
}

/**
 * Pages Router error page HOC.
 * Wraps a custom error page component to capture errors via captureException.
 *
 * Usage in pages/_error.tsx:
 *   export default withTraceKitErrorPage(MyErrorPage);
 */
export function withTraceKitErrorPage<P extends object>(
  ErrorPageComponent: React.ComponentType<P>,
): React.ComponentType<P & { err?: Error }> {
  function TraceKitErrorPage(props: P & { err?: Error }): React.JSX.Element {
    const { err, ...rest } = props;

    useEffect(() => {
      if (err) {
        captureException(err, {
          mechanism: 'nextjs.errorPage',
        });
      }
    }, [err]);

    return <ErrorPageComponent {...(rest as P)} />;
  }

  TraceKitErrorPage.displayName = `withTraceKitErrorPage(${
    ErrorPageComponent.displayName || ErrorPageComponent.name || 'Component'
  })`;

  return TraceKitErrorPage;
}
