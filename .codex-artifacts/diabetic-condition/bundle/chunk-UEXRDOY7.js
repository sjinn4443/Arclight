var _ = "[redacted]";
var S =
    /(?:^|[_-])(pass(word)?|pwd|secret|token|api[_-]?key|authorization|auth|cookie|session|credential|dsn|email|contact|phone|anon[_-]?id|user[_-]?id|geo|lat|lon|lng|latitude|longitude)(?:$|[_-])/i,
  E = /(?:^|[_-])ip(?:v[46])?(?:$|[_-])/i,
  k = [
    "name",
    "message",
    "code",
    "type",
    "status",
    "statusCode",
    "errno",
    "syscall",
  ];
function f() {
  if (typeof window > "u" || !window.location) return !1;
  let e = String(window.location.hostname || "").toLowerCase();
  return !(
    window.location.protocol === "file:" ||
    e === "localhost" ||
    e === "127.0.0.1" ||
    e === "::1" ||
    e === "[::1]"
  );
}
function p() {
  return f()
    ? typeof window < "u" && window.__ARCLIGHT_DEBUG_ERRORS__ === !0
    : !0;
}
function w(e) {
  return (
    e instanceof Error ||
    (!!e &&
      typeof e == "object" &&
      (typeof e.message == "string" || typeof e.stack == "string"))
  );
}
function c(e) {
  return String(e)
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
function h(e) {
  let n = String(e || "").trim();
  if (!n) return null;
  let t = n.startsWith("::ffff:") ? n.slice(7) : n;
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(t)) {
    let r = t.split(".");
    return ((r[3] = "x"), r.join("."));
  }
  if (t.includes(":")) {
    let r = t.split(":").filter(Boolean);
    return r.length <= 2 ? "xxxx:xxxx" : `${r.slice(0, 2).join(":")}:xxxx:xxxx`;
  }
  return _;
}
function b(e) {
  if (e)
    return c(String(e)).split(/\r?\n/).slice(0, 8).join(`
`);
}
function m(e, n = {}) {
  if (!w(e)) return a(e, n);
  let t = n.includeStack === !0,
    r = {};
  for (let o of k) {
    let s = e?.[o];
    s == null || s === "" || (r[o] = c(s));
  }
  return (
    r.name || (r.name = "Error"),
    t && e?.stack && (r.stack = b(e.stack)),
    e?.cause != null && (r.cause = a(e.cause, { ...n, includeStack: !1 })),
    r
  );
}
function a(e, n = {}, t = new WeakSet(), r = 0) {
  if (e == null) return e;
  if (typeof e == "string") return c(e);
  if (typeof e == "number" || typeof e == "boolean") return e;
  if (typeof e == "bigint") return e.toString();
  if (typeof e == "function") return `[Function ${e.name || "anonymous"}]`;
  if (e instanceof Date) return e.toISOString();
  if (w(e)) return m(e, n);
  if (r >= 4)
    return Array.isArray(e)
      ? `[Array(${e.length})]`
      : `[Object ${e?.constructor?.name || "Object"}]`;
  if (typeof e != "object") return c(e);
  if (t.has(e)) return "[Circular]";
  if ((t.add(e), Array.isArray(e)))
    return e.slice(0, 20).map((i) => a(i, n, t, r + 1));
  let o = {},
    s = 0;
  for (let [i, l] of Object.entries(e)) {
    if (((s += 1), s > 24)) {
      o.__truncated__ = Object.keys(e).length - 24;
      break;
    }
    if (E.test(i)) {
      o[i] = h(l);
      continue;
    }
    if (S.test(i)) {
      o[i] = _;
      continue;
    }
    o[i] = a(l, n, t, r + 1);
  }
  return o;
}
function y(e, n = {}) {
  if (typeof e == "string") return c(e);
  let t = a(e, n);
  if (t && typeof t == "object")
    try {
      return JSON.stringify(t);
    } catch {
      return "[sanitized-object]";
    }
  return t;
}
function O() {
  if (
    typeof console > "u" ||
    console.__arclightSafeConsoleInstalled ||
    console.error?._isMockFunction ||
    console.warn?._isMockFunction
  )
    return;
  let e = {
    error: console.error.bind(console),
    warn: console.warn.bind(console),
  };
  typeof window < "u" &&
    !window.__ARCLIGHT_NATIVE_CONSOLE__ &&
    (window.__ARCLIGHT_NATIVE_CONSOLE__ = e);
  let n = !f();
  ((console.error = (...t) => {
    p() && e.error(...t.map((r) => y(r, { includeStack: n })));
  }),
    (console.warn = (...t) => {
      p() && e.warn(...t.map((r) => y(r, { includeStack: !1 })));
    }),
    (console.__arclightSafeConsoleInstalled = !0));
}
function A(e = {}) {
  return Object.fromEntries(
    Object.entries(e)
      .filter(([, n]) => n != null && n !== "")
      .map(([n, t]) => [n, c(t)]),
  );
}
function d(e, n, t = {}) {
  let r =
      t.extra && typeof t.extra == "object"
        ? a(t.extra, { includeStack: !1 })
        : void 0,
    o = m(n, { includeStack: !f() });
  (t.level === "warn"
    ? r
      ? console.warn(e, o, r)
      : console.warn(e, o)
    : r
      ? console.error(e, o, r)
      : console.error(e, o),
    typeof window < "u" &&
      window.Sentry?.captureException &&
      window.Sentry.captureException(n, { tags: A(t.tags || {}), extra: r }));
}
var x = "arclight-telemetry-token";
function g() {
  if (typeof window > "u" || !window.location) return !1;
  let e = String(window.location.hostname || "").toLowerCase();
  return (
    window.location.protocol === "file:" ||
    e === "localhost" ||
    e === "127.0.0.1" ||
    e === "::1" ||
    e === "[::1]"
  );
}
function T() {
  if (typeof document > "u") return "";
  let e = document.querySelector(`meta[name="${x}"]`);
  return String(e?.content || "").trim();
}
function u(e = {}) {
  let n = { ...e },
    t = T();
  return (t && (n["X-Arclight-Telemetry"] = t), n);
}
async function R(e) {
  if (g()) return { ok: !0, skipped: !0 };
  let n = { ...e };
  try {
    await fetch("/api/app/profile", {
      method: "POST",
      headers: u({ "Content-Type": "application/json" }),
      credentials: "same-origin",
      body: JSON.stringify(n),
    });
  } catch (t) {
    d("[telemetry] saveProfile failed", t, {
      tags: { area: "telemetry", op: "saveProfile" },
    });
  }
}
async function C(e = {}) {
  if (g()) return { ok: !0, skipped: !0 };
  let n = { ...e };
  try {
    await fetch("/api/app/refresh", {
      method: "POST",
      credentials: "same-origin",
      headers: u({ "Content-Type": "application/json" }),
      body: JSON.stringify(n),
    });
  } catch (t) {
    d("[telemetry] bumpRefresh failed", t, {
      tags: { area: "telemetry", op: "bumpRefresh" },
    });
  }
}
window.ARCLIGHT = Object.assign(window.ARCLIGHT || {}, {
  buildTelemetryRequestHeaders: u,
  saveProfile: R,
  bumpRefresh: C,
});
export { O as a, d as b, u as c, R as d, C as e };
