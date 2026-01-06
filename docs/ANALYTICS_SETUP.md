# Privacy-Respecting Analytics Setup

The Solo Compendium app includes a privacy-respecting analytics system that requires explicit user consent before tracking any data.

## Features

### ✅ Privacy-First Design

- **Opt-In Only**: Analytics only work when users explicitly consent
- **No Tracking Without Consent**: Zero analytics data is collected without permission
- **User Control**: Users can accept, reject, or dismiss the consent banner
- **Respectful**: Banner can be dismissed without forcing a choice

### ✅ Supported Providers

The analytics system supports multiple providers:

1. **Plausible Analytics** (Recommended)
   - Privacy-friendly, GDPR compliant
   - No cookies, no personal data collection
   - Lightweight and fast

2. **PostHog** (Optional)
   - Feature flags and product analytics
   - Session replay (with consent)
   - User identification

3. **Custom Backend** (Optional)
   - Send events to your own analytics endpoint
   - Full control over data collection

## Setup

### 1. Enable Analytics

Set environment variable:

```env
VITE_ANALYTICS_ENABLED=true
```

### 2. Configure Provider (Optional)

#### Plausible Analytics

```env
VITE_PLAUSIBLE_DOMAIN=your-domain.com
```

#### PostHog

```env
VITE_POSTHOG_KEY=your-posthog-key
VITE_POSTHOG_HOST=https://app.posthog.com
```

## How It Works

### Consent Flow

1. **First Visit**: User sees consent banner
2. **User Choice**: 
   - Accept: Analytics enabled, banner dismissed
   - Reject: Analytics disabled, banner dismissed
   - Dismiss: Banner hidden, consent remains pending
3. **Consent Stored**: Choice saved in localStorage
4. **Respect Consent**: Analytics only work if accepted

### What Gets Tracked

When consent is **accepted**:

- **Page Views**: Route changes and page navigation
- **User Actions**: Sign in, sign up, character creation, etc.
- **Feature Usage**: Dice rolls, power casts, equipment changes
- **User Identification**: Anonymous user IDs (no personal data)

When consent is **rejected** or **pending**:

- **Nothing**: Zero tracking, zero data collection

### Event Types

The system tracks common events:

- `user_signed_up` - New user registration
- `user_signed_in` - User login
- `user_signed_out` - User logout
- `character_created` - New character created
- `character_leveled_up` - Character level increase
- `compendium_searched` - Search performed
- `dice_rolled` - Dice roll action
- And more...

## Usage

### Automatic Tracking

Page views and auth events are tracked automatically when consent is given.

### Manual Tracking

```typescript
import { trackEvent, AnalyticsEvents } from '@/lib/analytics';

// Track a custom event
trackEvent({
  name: AnalyticsEvents.CHARACTER_CREATED,
  properties: {
    characterLevel: 1,
    job: 'Striker',
  },
  userId: 'user-123',
});
```

### User Identification

```typescript
import { identifyUser } from '@/lib/analytics';

// Identify user (only when consented)
identifyUser('user-123', {
  email: 'user@example.com',
  role: 'player',
});
```

## Privacy Compliance

### GDPR Compliance

- ✅ Explicit consent required
- ✅ Users can opt out at any time
- ✅ No tracking without consent
- ✅ Clear privacy policy recommended

### Data Minimization

- Only essential analytics data collected
- No personal information tracked
- Anonymous user IDs only
- No cross-site tracking

### User Rights

Users can:
- Accept analytics tracking
- Reject analytics tracking
- Dismiss the banner (no tracking)
- Clear consent (via browser settings)

## Customization

### Consent Banner

Edit `src/components/ui/AnalyticsConsentBanner.tsx` to customize:
- Banner appearance
- Messaging
- Button labels

### Consent Version

Increment `CONSENT_VERSION` in `useAnalyticsConsent.ts` to re-prompt users:
- Useful when changing privacy policy
- Allows users to re-consent with new terms

### Custom Events

Add new event types in `src/lib/analytics.ts`:

```typescript
export const AnalyticsEvents = {
  // ... existing events
  MY_CUSTOM_EVENT: 'my_custom_event',
} as const;
```

## Testing

### Development

Analytics events are logged to console in development mode.

### Production

1. Build: `npm run build`
2. Preview: `npm run preview`
3. Test consent flow
4. Verify events in your analytics dashboard

## Troubleshooting

### Analytics Not Working

- Check `VITE_ANALYTICS_ENABLED=true` is set
- Verify user has accepted consent
- Check browser console for errors
- Ensure provider credentials are correct

### Consent Banner Not Showing

- Clear localStorage: `localStorage.removeItem('solo-compendium-analytics-consent')`
- Increment consent version to force re-prompt
- Check browser console for errors

### Events Not Appearing

- Verify consent is accepted
- Check provider configuration
- Ensure network requests aren't blocked
- Check provider dashboard for data

## Best Practices

1. **Respect User Choice**: Never track without consent
2. **Be Transparent**: Explain what data is collected
3. **Minimize Data**: Only collect what you need
4. **Secure Storage**: Consent stored locally only
5. **Regular Review**: Audit what data is collected

## Future Enhancements

- Consent management page in settings
- Granular consent options (different types of tracking)
- Analytics dashboard integration
- Export user data functionality

