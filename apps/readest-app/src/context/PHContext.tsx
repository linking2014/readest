'use client';
import { ReactNode } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

if (
  typeof window !== 'undefined' &&
  process.env['NODE_ENV'] === 'production' &&
  process.env['NEXT_PUBLIC_POSTHOG_KEY']
) {
  posthog.init(process.env['NEXT_PUBLIC_POSTHOG_KEY'], {
    api_host: process.env['NEXT_PUBLIC_POSTHOG_HOST'],
    person_profiles: 'always',
  });
}
export const CSPostHogProvider = ({ children }: { children: ReactNode }) => {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
};
