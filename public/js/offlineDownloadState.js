// Shared, lightweight inventory. Enumerate cache keys, never read every response.
let inventory;
let inventoryRequest;
let inventoryTime = 0;
let generation = 0;

export function offlineAssetPath(value) {
  try {
    return decodeURI(new URL(value, window.location.origin).pathname);
  } catch {
    return String(value).split(/[?#]/)[0];
  }
}

export function invalidateOfflineInventory() {
  generation += 1;
  inventoryTime = 0;
  document.dispatchEvent(new CustomEvent("offline:contents-changed"));
}

export async function getOfflineInventory() {
  if (inventoryRequest) return inventoryRequest;
  if (inventory && Date.now() - inventoryTime < 60000) return inventory;
  if (!("caches" in window)) return null;
  const startedGeneration = generation;
  inventoryRequest = (async () => {
    try {
      const names = (await caches.keys()).filter((name) =>
        /^arclight-(?:static-|packs-|download-)/.test(name),
      );
      const lists = await Promise.all(
        names.map(async (name) => (await caches.open(name)).keys()),
      );
      const nextInventory = new Set(
        lists.flat().map((request) => offlineAssetPath(request.url)),
      );
      if (
        !inventory ||
        nextInventory.size !== inventory.size ||
        [...nextInventory].some((path) => !inventory.has(path))
      )
        inventory = nextInventory;
      inventoryTime = startedGeneration === generation ? Date.now() : 0;
      return inventory;
    } catch {
      return null;
    }
  })();
  try {
    return await inventoryRequest;
  } finally {
    inventoryRequest = null;
  }
}

function contentKey(path) {
  // A mini-app or animation is one content item, including its supporting assets.
  const app = path.match(/^\/subapp\/([^/]+)\//i);
  if (app) return `/subapp/${app[1]}`;
  if (/^\/scrolly\//i.test(path)) {
    return path
      .split(/\/(?:images|audio|fonts|assets)\//i)[0]
      .replace(/\/[^/]+\.[^/]+$/, "");
  }
  if (/^\/(?:narration|video-subtitles|video-hls)\//i.test(path)) {
    return path.replace(/\/[^/]+$/, "");
  }
  if (/\.(?:mp4|webm|mov)$/i.test(path)) {
    return path.replace(
      /(?:[_-](?:220|240|360|480|540|720|1080)p)?\.[^.]+$/i,
      "",
    );
  }
  if (/\.(?:webp|png|jpe?g|svg|gif)$/i.test(path)) {
    return path.replace(/\/[^/]+$/, "");
  }
  return path;
}

function contentLabel(key) {
  return (
    key
      .replace(/^\//, "")
      .split("/")
      .slice(1)
      .join(" / ")
      .replace(/[_-]/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2") || key
  );
}

// These are content bundles, not a claim that each asset is an application page.
export function summarizeOfflineContent(
  urls,
  cachedUrls,
  { anyVideoQuality = false } = {},
) {
  const bundles = new Map();
  for (const url of urls) {
    const path = offlineAssetPath(url);
    const key = contentKey(path);
    if (!bundles.has(key))
      bundles.set(key, { key, label: contentLabel(key), paths: new Set() });
    bundles.get(key).paths.add(path);
  }
  const items = [...bundles.values()].map(({ key, label, paths }) => {
    const cached = [...paths].filter((path) => cachedUrls?.has(path)).length;
    const complete =
      anyVideoQuality &&
      [...paths].every((path) => /\.(mp4|webm|mov)$/i.test(path))
        ? cached > 0
        : cached === paths.size;
    return { key, label, complete, started: cached > 0 };
  });
  return {
    items,
    completed: items.filter((item) => item.complete).length,
    total: items.length,
    started: items.some((item) => item.started),
  };
}

export function offlineContentState(summary) {
  return summary.total && summary.completed === summary.total
    ? "complete"
    : summary.started
      ? "partial"
      : "empty";
}
