/**
 * @fileoverview This file manages the unified "likes" store for the application, providing functionality to read, write, and toggle liked items, with same-tab change notifications.

 */

// Canonical storage key (baseline-compatible) for liked items in localStorage.
const CANONICAL_KEY = "likedItems";
// Legacy keys to support older saved data formats.
const LEGACY_KEYS = ["likedEyes_v1", "eyesLikes"];

// ---- helpers ----
/**
 * Safely parses a JSON string. Returns null if parsing fails.
 * @param {string} raw - The raw JSON string to parse.
 * @returns {any|null} The parsed object or null if an error occurs.
 */
function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Reads liked items from localStorage, supporting both canonical and legacy keys.
 * Returns a Set of strings representing the IDs of liked items.
 * @returns {Set<string>} A Set containing the IDs of all liked items.
 */
export function readLikes() {
  const raw = localStorage.getItem(CANONICAL_KEY);
  if (raw !== null) {
    const arr = safeParse(raw) || [];
    return Array.isArray(arr) ? new Set(arr.map(String)) : new Set();
  }
  for (const k of LEGACY_KEYS) {
    const r = localStorage.getItem(k);
    if (r !== null) {
      const arr = safeParse(r) || [];
      if (Array.isArray(arr)) return new Set(arr.map(String));
    }
  }
  return new Set();
}

/**
 * Writes the current set of liked item IDs to localStorage and dispatches a custom event
 * to notify other parts of the application (e.g., 'My Learnings' page) about the change.
 * @param {Set<string>} setOfIds - A Set containing the current IDs of all liked items.
 */
export function writeLikes(setOfIds) {
  const arr = Array.from(setOfIds).map(String);
  localStorage.setItem(CANONICAL_KEY, JSON.stringify(arr));
  // same-tab notification
  window.dispatchEvent(new CustomEvent("likes:changed", { detail: arr }));
}

// Convenience checks/toggle (used by Eyes + others)
/**
 * Checks if a specific item is liked.
 * @param {string|number} id - The ID of the item to check.
 * @returns {boolean} True if the item is liked, false otherwise.
 */
export function isLiked(id) {
  return readLikes().has(String(id));
}

/**
 * Toggles the 'liked' status of an item. If the item is currently liked, it will be unliked,
 * and vice-versa. The updated set of likes is then written to localStorage.
 * @param {string|number} id - The ID of the item to toggle.
 * @returns {Set<string>} The updated Set of liked items.
 */
export function toggleLike(id) {
  const key = String(id);
  const likes = readLikes();
  if (likes.has(key)) likes.delete(key);
  else likes.add(key);
  writeLikes(likes);
  return likes;
}

/**
 * Alias for modules that import { getLikes }.
 * Provides a convenient way to access the current set of liked items.
 * @returns {Set<string>} A Set containing the IDs of all liked items.
 */
export const getLikes = () => readLikes();
