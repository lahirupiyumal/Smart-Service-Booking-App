export function authErrorMessage(error: unknown): string {
  const code = (error as { code?: string } | null)?.code;
  // The live Identity Toolkit API_KEY_INVALID response becomes this generated
  // SDK code, rather than the better-known auth/invalid-api-key alias.
  if (typeof code === 'string' && /^auth\/api-key-not-valid(?:[.-]|$)/.test(code)) {
    return 'Firebase rejected this app’s API key. Check EXPO_PUBLIC_FIREBASE_API_KEY for this Firebase project, then restart Expo.';
  }
  switch (code) {
    case 'auth/invalid-api-key':
    case 'auth/api-key-expired': return 'Firebase rejected this app’s API key. Check EXPO_PUBLIC_FIREBASE_API_KEY for this Firebase project, then restart Expo.';
    case 'auth/configuration-not-found': return 'Firebase Authentication is not configured for this project. Set it up in the Firebase console and enable Email/Password sign-in.';
    case 'auth/app-not-authorized':
    case 'auth/invalid-app-credential': return 'This app is not authorized to use Firebase Authentication. Check the project’s API key restrictions and app authorization settings.';
    case 'auth/email-already-in-use': return 'An account already uses this email. Sign in or reset your password.';
    case 'auth/invalid-email': return 'Enter a valid email address.';
    case 'auth/weak-password':
    case 'auth/password-does-not-meet-requirements': return 'Choose a stronger password that meets this project’s password requirements.';
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
    case 'auth/user-not-found':
    case 'auth/wrong-password': return 'The email or password is incorrect. Please try again.';
    case 'auth/user-disabled': return 'This account has been disabled. Please contact support.';
    case 'auth/too-many-requests': return 'Too many attempts. Please wait a few minutes and try again.';
    case 'auth/network-request-failed':
    case 'unavailable': return 'Check your internet connection and try again.';
    case 'auth/operation-not-allowed': return 'Email and password sign-in is not enabled for this Firebase project.';
    case 'permission-denied': return 'Your profile could not be saved. Please check the Firestore access rules and try again.';
    case 'app/not-configured': return 'Firebase configuration is missing. Please check the app’s environment settings.';
    case 'app/invalid-registration': return 'Please check your registration details.';
    case 'app/profile-incomplete': return 'Your account was created, but its profile could not be saved. Contact support before registering again.';
    default:
      // Preserve a diagnostic code without exposing arbitrary server messages,
      // credentials, email addresses or internal response payloads.
      if (typeof code === 'string' && /^(?:auth\/|app\/|firestore\/)?[a-z][a-z0-9.-]{0,120}$/.test(code)) {
        return `Firebase request failed (${code}). Please contact support with this error code.`;
      }
      return 'An unexpected error occurred. Please try again or contact support if it continues.';
  }
}
