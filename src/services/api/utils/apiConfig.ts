const DEFAULT_API_URL = "http://localhost";

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.trim() ||
  DEFAULT_API_URL;

export const API_TIMEOUT_MS = 5000;
