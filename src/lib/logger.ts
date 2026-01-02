/**
 * Secure Logger utility with sensitive data redaction
 * Only logs in development mode to prevent production log exposure
 */

// Sensitive patterns to redact from logs
const SENSITIVE_PATTERNS = [
  /mongodb\+srv:\/\/[^@]+@/gi,  // MongoDB URIs
  /Bearer\s+[a-zA-Z0-9._-]+/gi, // Auth tokens
  /password['":\s=]+[^,\n}]+/gi, // Passwords in various formats
  /JWT['":\s=]+[^,\n}]+/gi,      // JWT tokens
  /api[_-]?key['":\s=]+[^,\n}]+/gi, // API keys
];

/**
 * Redact sensitive data from log messages
 * @param message - Log message (string or object)
 * @returns Redacted message
 */
function redactSensitiveData(message: any): any {
  if (typeof message === 'string') {
    let redacted = message;
    SENSITIVE_PATTERNS.forEach(pattern => {
      redacted = redacted.replace(pattern, '[REDACTED]');
    });
    return redacted;
  }

  // For objects, return as-is (could be extended to deep redact)
  return message;
}

export const logger = {
  log: (...args: any[]) => {
    // Only log in development (strict check)
    if (process.env.NODE_ENV === 'development') {
      const redacted = args.map(redactSensitiveData);
      console.log(...redacted);
    }
  },
  error: (...args: any[]) => {
    // Only log in development (strict check)
    if (process.env.NODE_ENV === 'development') {
      const redacted = args.map(redactSensitiveData);
      console.error(...redacted);
    }
  },
  warn: (...args: any[]) => {
    // Only log in development (strict check)
    if (process.env.NODE_ENV === 'development') {
      const redacted = args.map(redactSensitiveData);
      console.warn(...redacted);
    }
  },
};
