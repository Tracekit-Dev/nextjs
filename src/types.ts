import type { TracekitBrowserConfig } from '@tracekit/browser';

export interface TraceKitNextConfig extends TracekitBrowserConfig {
  // Client-specific options can be added here
}

export interface TraceKitServerConfig {
  apiKey: string;
  release?: string;
  environment?: string;
  apiEndpoint?: string;
  [key: string]: unknown;
}

export interface RequestErrorContext {
  routerKind: string; // 'Pages Router' or 'App Router'
  routePath: string; // Route pattern e.g. '/users/[id]'
  routeType: string; // 'page', 'route', 'middleware'
}

export interface RequestInfo {
  path: string;
  method: string;
  headers: Record<string, string | string[]>;
}
