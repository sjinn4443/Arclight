export async function saveProfile(fields) {
  await fetch("/api/app/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(fields),
  });
}

export async function bumpRefresh() {
  await fetch("/api/app/refresh", {
    method: "POST",
    credentials: "same-origin",
  });
}

// Also expose as a global for non-module scripts
window.ARCLIGHT = Object.assign(window.ARCLIGHT || {}, {
  saveProfile,
  bumpRefresh,
});
