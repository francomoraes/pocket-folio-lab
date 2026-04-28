import i18n from "@/shared/i18n/config";

/**
 * Resolves a user-facing error message from an API error.
 * If the error has a backend errorCode, translates it via i18n.
 * Falls back to the error message, then to the provided fallback key.
 */
export function resolveErrorMessage(
  error: unknown,
  fallbackKey: string,
): string {
  const errorCode = (error as any)?.errorCode as string | undefined;

  if (errorCode) {
    const translated = i18n.t(`auth.errorCodes.${errorCode}`);
    // i18n returns the key itself when missing — treat that as no translation found
    if (translated !== `auth.errorCodes.${errorCode}`) {
      return translated;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return i18n.t(fallbackKey);
}
