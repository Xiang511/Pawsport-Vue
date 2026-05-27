export const googleOAuthConfig = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  scope: 'email profile',
  auto_select: false,
  cancel_on_tap_outside: true,
}
