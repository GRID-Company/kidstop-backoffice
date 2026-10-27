export const PASSWORD_VALIDATION = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 20,
  REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
  ERROR_MESSAGES: {
    MIN_LENGTH: 'La contraseña debe tener al menos 8 caracteres',
    MAX_LENGTH: 'La contraseña debe tener máximo 20 caracteres',
    PATTERN:
      'La contraseña debe contener mayúsculas, minúsculas y números o caracteres especiales',
  },
} as const;
