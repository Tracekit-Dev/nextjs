# @tracekit/nextjs

TraceKit integration for Next.js applications. Provides client/server initialization, navigation breadcrumbs, and error boundary helpers for App Router and Pages Router.

## Installation

```bash
npm install @tracekit/nextjs @tracekit/browser
```

## Quick Start

### App Router (Next.js 15+)

Create `instrumentation.ts` in your project root:

```ts
import { initTraceKit } from '@tracekit/nextjs';

export function register() {
  initTraceKit({
    dsn: 'https://your-dsn@tracekit.dev/project',
    environment: 'production',
    release: '1.0.0',
  });
}
```

### Pages Router

Add to `_app.tsx`:

```tsx
import { initTraceKit } from '@tracekit/nextjs';

initTraceKit({
  dsn: 'https://your-dsn@tracekit.dev/project',
  environment: 'production',
  release: '1.0.0',
});

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

## Configuration

| Option        | Type     | Default        | Description                          |
| ------------- | -------- | -------------- | ------------------------------------ |
| `dsn`         | `string` | -              | Your TraceKit project DSN (required) |
| `environment` | `string` | `'production'` | Deployment environment name          |
| `release`     | `string` | -              | Application release/version          |

## Documentation

Full documentation: [https://app.tracekit.dev/docs/frontend/frameworks](https://app.tracekit.dev/docs/frontend/frameworks)

## License

MIT
