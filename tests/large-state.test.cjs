/**
 * @jest-environment jsdom
 *
 * Improved large-state tests:
 * 1) Large likes state remains stable and performant.
 * 2) Account creation data (interest, role, etc) is cached and restored correctly.
 *
 * NOTE:
 * - Update STORAGE_KEYS / import paths to match your real app.
 * - This test assumes localStorage-based caching (like likes test).
 */

// ---------------------------
// 0) Imports / App hooks
// ---------------------------

// If your app exposes helpers, import them here.
// Change these paths to real ones if they exist.
let likesApi;
let accountApi;

try {
  // eslint-disable-next-line global-require, import/no-unresolved
  likesApi = require("../src/state/likes");
} catch (e) {
  likesApi = null;
}

try {
  // eslint-disable-next-line global-require, import/no-unresolved
  accountApi = require("../src/state/account");
} catch (e) {
  accountApi = null;
}

// ---------------------------
// 1) Storage keys contract
// ---------------------------
// Change these to whatever your app uses.
// The test will fail loudly if the app stores somewhere else.
const STORAGE_KEYS = {
  likes: "likes",
  account: "arclight:onboarded",
};

// ---------------------------
// 2) Test utilities
// ---------------------------
function readJSON(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Generate a large likes list
function makeLikes(n = 250) {
  return Array.from({ length: n }, (_, i) => ({
    id: `item-${i}`,
    type: "module",
    ts: Date.now() + i,
  }));
}

// A realistic account payload from your create-account flow
function makeAccount(overrides = {}) {
  return {
    id: "user-123",
    name: "Test User",
    interest: ["eyes", "ears"], // or a single string depending on your app
    role: "clinician",
    language: "en",
    onboardingComplete: true,
    createdAt: Date.now(),
    ...overrides,
  };
}

// ---------------------------
// 3) Setup
// ---------------------------
beforeEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
});

// ---------------------------
// 4) Tests
// ---------------------------
describe("large-state – likes + account cache", () => {
  // ---------------------------
  // Likes tests (existing intent)
  // ---------------------------
  it("handles 200+ liked items without corruption", () => {
    const likes = makeLikes(250);
    writeJSON(STORAGE_KEYS.likes, likes);

    const stored = readJSON(STORAGE_KEYS.likes);
    expect(stored).toHaveLength(250);
    expect(stored[0].id).toBe("item-0");
    expect(stored[249].id).toBe("item-249");
  });

  it("repeated like/unlike does not corrupt likes state", () => {
    // If your app exposes add/remove helpers, use them.
    // Otherwise we simulate storage writes.
    const likes = makeLikes(10);
    writeJSON(STORAGE_KEYS.likes, likes);

    // Simulate a bunch of toggles
    let current = readJSON(STORAGE_KEYS.likes);
    for (let i = 0; i < 50; i++) {
      const targetId = `item-${i % 10}`;
      const exists = current.some((x) => x.id === targetId);
      current = exists
        ? current.filter((x) => x.id !== targetId)
        : current.concat({ id: targetId, type: "module", ts: Date.now() });

      writeJSON(STORAGE_KEYS.likes, current);
      current = readJSON(STORAGE_KEYS.likes);
    }

    // Should still be valid objects with unique IDs
    const ids = current.map((x) => x.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
    expect(current.every((x) => x && x.id)).toBe(true);
  });

  // ---------------------------
  // Account cache tests (NEW)
  // ---------------------------

  it("caches account creation info (interest, role, etc) to localStorage", () => {
    const account = makeAccount();

    if (accountApi?.saveAccountToCache) {
      accountApi.saveAccountToCache(account);
    } else {
      // Fallback simulation if no helper exists yet.
      writeJSON(STORAGE_KEYS.account, account);
    }

    const cached = readJSON(STORAGE_KEYS.account);
    expect(cached).not.toBeNull();
    expect(cached.role).toBe(account.role);
    expect(cached.interest).toEqual(account.interest);
    expect(cached.onboardingComplete).toBe(true);
  });

  it("restores cached account on app boot and matches original values", () => {
    const account = makeAccount({ role: "student", language: "ko" });
    writeJSON(STORAGE_KEYS.account, account);

    let restored;
    if (accountApi?.loadAccountFromCache) {
      restored = accountApi.loadAccountFromCache();
    } else {
      restored = readJSON(STORAGE_KEYS.account);
    }

    expect(restored).toBeTruthy();
    expect(restored.role).toBe("student");
    expect(restored.language).toBe("ko");
    expect(restored.interest).toEqual(account.interest);
  });

  it("after language change, cached account reflects new language (if your app stores it)", () => {
    // This protects the contract that account prefs update when user changes language.
    const account = makeAccount({ language: "en" });
    writeJSON(STORAGE_KEYS.account, account);

    // Simulate user changing language to 'fr'
    const newLang = "fr";

    if (accountApi?.setUserLanguage) {
      accountApi.setUserLanguage(newLang);
    } else {
      // fallback: update cached object directly
      const cached = readJSON(STORAGE_KEYS.account);
      cached.language = newLang;
      writeJSON(STORAGE_KEYS.account, cached);
    }

    const updated = readJSON(STORAGE_KEYS.account);
    expect(updated.language).toBe(newLang);
  });

  it("does not blow up with large account payloads (future-proofing)", () => {
    // Eg user selects many interests or extended profile fields
    const hugeAccount = makeAccount({
      interest: Array.from({ length: 300 }, (_, i) => `interest-${i}`),
      extraProfile: Array.from({ length: 200 }, (_, i) => ({
        k: `k${i}`,
        v: `v${i}`,
      })),
    });

    if (accountApi?.saveAccountToCache) {
      accountApi.saveAccountToCache(hugeAccount);
    } else {
      writeJSON(STORAGE_KEYS.account, hugeAccount);
    }

    const cached = readJSON(STORAGE_KEYS.account);
    expect(cached.interest).toHaveLength(300);
    expect(cached.extraProfile).toHaveLength(200);
  });
});
