export interface RegistrationInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}
export type RegistrationErrors = Partial<Record<keyof RegistrationInput, string>>;

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Enter your email address.';
  if (email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Enter a valid email address.';
}

export function normalizeRegistration(input: RegistrationInput) {
  return {
    fullName: input.fullName.trim(), email: input.email.trim().toLowerCase(),
    phone: input.phone.replace(/[\s()-]/g, ''),
  };
}

export function validateRegistration(input: RegistrationInput): RegistrationErrors {
  const errors: RegistrationErrors = {};
  const normalized = normalizeRegistration(input);
  if (normalized.fullName.length < 2 || normalized.fullName.length > 100) errors.fullName = 'Enter your full name (2–100 characters).';
  const emailError = validateEmail(input.email);
  if (emailError) errors.email = emailError;
  if (!/^\+?\d{9,15}$/.test(normalized.phone)) errors.phone = 'Enter a valid phone number, e.g. 077 123 4567.';
  if (input.password.length < 8) errors.password = 'Use at least 8 characters for your password.';
  if (input.password.length > 128) errors.password = 'Use no more than 128 characters.';
  if (!input.confirmPassword) errors.confirmPassword = 'Confirm your password.';
  else if (input.password !== input.confirmPassword) errors.confirmPassword = 'Your passwords don’t match.';
  return errors;
}
