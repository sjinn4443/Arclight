const REDACTED = "[redacted]";
const MAX_DEPTH = 4;
const MAX_KEYS = 24;
const MAX_ARRAY_ITEMS = 20;

const SENSITIVE_KEY_RE =
  /(?:^|[_-])(pass(word)?|pwd|secret|token|api[_-]?key|authorization|auth|cookie|session|credential|dsn|email|contact|phone|anon[_-]?id|user[_-]?id|geo|lat|lon|lng|latitude|longitude)(?:$|[_-])/i;
const IP_KEY_RE = /(?:^|[_-])ip(?:v[46])?(?:$|[_-])/i;
const ERROR_FIELD_KEYS = [
  "name",
  "message",
  "code",
  "type",
  "status",
  "statusCode",
  "errno",
  "syscall",
];

function isProdBrowser() {
  if (typeof window === "undefined" || !window.location) return false;
  const host = String(window.location.hostname || "").toLowerCase();
  return !(
    window.location.protocol === "file:" ||
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host === "[::1]"
  );
}

function shouldEmitConsoleErrors() {
  if (!isProdBrowser()) return true;
  return (
    typeof window !== "undefined" && window.__ARCLIGHT_DEBUG_ERRORS__ === true
  );
}

function isErrorLike(value) {
  return (
    value instanceof Error ||
    (!!value &&
      typeof value === "object" &&
      (typeof value.message === "string" || typeof value.stack === "string"))
  );
}

function redactString(value) {
  return String(value)
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[redacted-email]")
    .replace(/\bBearer\s+[A-Za-z0-9._~+/=-]+\b/gi, "Bearer [redacted]")
    .replace(/\bBasic\s+[A-Za-z0-9+/=]+\b/gi, "Basic [redacted]")
    .replace(
      /([?&](?:access_?token|refresh_?token|token|secret|password|api[_-]?key|authorization|session|cookie)=)[^&#\s]*/gi,
      "$1[redacted]",
    )
    .replace(
      /\b((?:token|secret|password|api[_-]?key|authorization|session|cookie)\s*[:=]\s*)([^\s,;]+)/gi,
      "$1[redacted]",
    );
}

function maskIp(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;

  const normalized = raw.startsWith("::ffff:") ? raw.slice(7) : raw;
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(normalized)) {
    const parts = normalized.split(".");
    parts[3] = "x";
    return parts.join(".");
  }

  if (normalized.includes(":")) {
    const parts = normalized.split(":").filter(Boolean);
    if (parts.length <= 2) return "xxxx:xxxx";
    return `${parts.slice(0, 2).join(":")}:xxxx:xxxx`;
  }

  return REDACTED;
}

function sanitizeStack(stack) {
  if (!stack) return undefined;
  return redactString(String(stack)).split(/\r?\n/).slice(0, 8).join("\n");
}

export function sanitizeError(error, options = {}) {
  if (!isErrorLike(error)) return sanitizeValue(error, options);

  const includeStack = options.includeStack === true;
  const sanitized = {};

  for (const key of ERROR_FIELD_KEYS) {
    const value = error?.[key];
    if (value == null || value === "") continue;
    sanitized[key] = redactString(value);
  }

  if (!sanitized.name) sanitized.name = "Error";

  if (includeStack && error?.stack) {
    sanitized.stack = sanitizeStack(error.stack);
  }

  if (error?.cause != null) {
    sanitized.cause = sanitizeValue(error.cause, {
      ...options,
      includeStack: false,
    });
  }

  return sanitized;
}

export function sanitizeValue(
  value,
  options = {},
  seen = new WeakSet(),
  depth = 0,
) {
  if (value == null) return value;
  if (typeof value === "string") return redactString(value);
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "function") {
    return `[Function ${value.name || "anonymous"}]`;
  }
  if (value instanceof Date) return value.toISOString();
  if (isErrorLike(value)) return sanitizeError(value, options);

  if (depth >= MAX_DEPTH) {
    if (Array.isArray(value)) return `[Array(${value.length})]`;
    return `[Object ${value?.constructor?.name || "Object"}]`;
  }

  if (typeof value !== "object") return redactString(value);
  if (seen.has(value)) return "[Circular]";
  seen.add(value);

  if (Array.isArray(value)) {
    return value
      .slice(0, MAX_ARRAY_ITEMS)
      .map((entry) => sanitizeValue(entry, options, seen, depth + 1));
  }

  const sanitized = {};
  let count = 0;

  for (const [key, entry] of Object.entries(value)) {
    count += 1;
    if (count > MAX_KEYS) {
      sanitized.__truncated__ = Object.keys(value).length - MAX_KEYS;
      break;
    }

    if (IP_KEY_RE.test(key)) {
      sanitized[key] = maskIp(entry);
      continue;
    }

    if (SENSITIVE_KEY_RE.test(key)) {
      sanitized[key] = REDACTED;
      continue;
    }

    sanitized[key] = sanitizeValue(entry, options, seen, depth + 1);
  }

  return sanitized;
}

function normalizeConsoleArg(value, options = {}) {
  if (typeof value === "string") return redactString(value);
  const sanitized = sanitizeValue(value, options);
  if (sanitized && typeof sanitized === "object") {
    try {
      return JSON.stringify(sanitized);
    } catch {
      return "[sanitized-object]";
    }
  }
  return sanitized;
}

export function installSafeConsole() {
  if (
    typeof console === "undefined" ||
    console.__arclightSafeConsoleInstalled
  ) {
    return;
  }
  if (console.error?._isMockFunction || console.warn?._isMockFunction) return;

  const native = {
    error: console.error.bind(console),
    warn: console.warn.bind(console),
  };

  if (typeof window !== "undefined" && !window.__ARCLIGHT_NATIVE_CONSOLE__) {
    window.__ARCLIGHT_NATIVE_CONSOLE__ = native;
  }

  const includeStack = !isProdBrowser();

  console.error = (...args) => {
    if (!shouldEmitConsoleErrors()) return;
    native.error(
      ...args.map((arg) => normalizeConsoleArg(arg, { includeStack })),
    );
  };

  console.warn = (...args) => {
    if (!shouldEmitConsoleErrors()) return;
    native.warn(
      ...args.map((arg) => normalizeConsoleArg(arg, { includeStack: false })),
    );
  };

  console.__arclightSafeConsoleInstalled = true;
}

function sanitizeSentryTags(tags = {}) {
  return Object.fromEntries(
    Object.entries(tags)
      .filter(([, value]) => value != null && value !== "")
      .map(([key, value]) => [key, redactString(value)]),
  );
}

export function captureClientError(context, error, options = {}) {
  const extra =
    options.extra && typeof options.extra === "object"
      ? sanitizeValue(options.extra, { includeStack: false })
      : undefined;

  const summary = sanitizeError(error, {
    includeStack: !isProdBrowser(),
  });

  if (options.level === "warn") {
    if (extra) {
      console.warn(context, summary, extra);
    } else {
      console.warn(context, summary);
    }
  } else if (extra) {
    console.error(context, summary, extra);
  } else {
    console.error(context, summary);
  }

  if (typeof window !== "undefined" && window.Sentry?.captureException) {
    window.Sentry.captureException(error, {
      tags: sanitizeSentryTags(options.tags || {}),
      extra,
    });
  }
}

export function isConsoleSuppressedInBrowser() {
  return !shouldEmitConsoleErrors();
}
