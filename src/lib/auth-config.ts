export const AUTH_CONFIG = {
  COOKIE_NAME: 'token',
  COOKIE_SETTINGS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_APP_URL?.startsWith('https'),
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  },
  PATHS: {
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    DASHBOARD: '/dashboard/overview',
    RESET_PASSWORD: '/auth/reset-password/:token'
  } as const
} as const;
