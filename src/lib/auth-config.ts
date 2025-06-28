export const AUTH_CONFIG = {
  COOKIE_NAME: 'token',
  COOKIE_SETTINGS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/'
  },
  PATHS: {
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    DASHBOARD: '/dashboard/overview',
    RESET_PASSWORD: '/auth/reset-password/:token'
  } as const
} as const; 