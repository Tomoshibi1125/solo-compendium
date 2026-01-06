# Sentry Error Tracking Setup

Sentry is integrated for error tracking and performance monitoring. It's optional and will only activate if configured.

## Setup

1. **Create a Sentry account** at https://sentry.io
2. **Create a new project** (React/Vite)
3. **Get your DSN** from the project settings

## Environment Variables

Add to your `.env.local` file:

```env
# Sentry Error Tracking (optional)
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id

# Optional: For source map uploads during build
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug
SENTRY_AUTH_TOKEN=your-auth-token
```

## Features

- **Error Tracking**: Automatically captures React errors, unhandled exceptions, and API errors
- **Performance Monitoring**: Tracks page load times, API calls, and user interactions
- **Session Replay**: Records user sessions when errors occur (for debugging)
- **User Context**: Associates errors with user IDs and emails
- **Source Maps**: Uploads source maps for better error debugging (requires auth token)

## Configuration

### Error Filtering

The following errors are automatically filtered out:
- Browser extension errors
- Expected network errors (offline scenarios)
- ResizeObserver loop errors (common, non-critical)

### Performance Sampling

- **Development**: 100% of transactions tracked
- **Production**: 10% of transactions tracked (configurable)

### Session Replay

- **Development**: 100% of sessions recorded
- **Production**: 10% of sessions recorded, 100% on errors

## Usage

### Automatic Error Tracking

Errors are automatically captured by:
- React Error Boundaries
- Unhandled promise rejections
- API errors in hooks

### Manual Error Reporting

```typescript
import { captureException, captureMessage } from '@/lib/sentry';

// Capture an exception
try {
  // some code
} catch (error) {
  captureException(error, { context: 'my-feature' });
}

// Capture a message
captureMessage('Something important happened', 'info', { userId: '123' });
```

### Setting User Context

User context is automatically set when users sign in/out. You can also set it manually:

```typescript
import { setSentryUser } from '@/lib/sentry';

setSentryUser({
  id: 'user-123',
  email: 'user@example.com',
  username: 'username',
});
```

## Disabling Sentry

If you don't want to use Sentry, simply don't set the `VITE_SENTRY_DSN` environment variable. The app will work normally without error tracking.

## Source Maps

To enable source map uploads for better error debugging:

1. Generate an auth token in Sentry (Settings → Auth Tokens)
2. Set the `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT` environment variables
3. Source maps will be uploaded automatically during production builds

**Note**: Source maps are only uploaded in production builds and require the auth token.

