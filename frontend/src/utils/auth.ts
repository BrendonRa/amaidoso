import { isAxiosError } from 'axios';

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function normalizeCpfDigits(value: string) {
  return value.replace(/\D/g, '').slice(0, 11);
}

export function formatCpf(value: string) {
  const digits = normalizeCpfDigits(value);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (!isAxiosError(error)) return fallbackMessage;

  const apiMessage =
    (error.response?.data as { error?: string } | undefined)?.error ??
    (error.response?.data as { message?: string } | undefined)?.message;

  if (apiMessage) return apiMessage;

  if (error.request) {
    return 'Não foi possível conectar ao servidor. Verifique se o backend está ligado.';
  }

  return fallbackMessage;
}

