// Move the real page titlebar so its existing updates and translations survive.
const mountedHeaders = new WeakMap();
const TITLEBARS = ".atoms-title-bar, .ml-topbar, .profile-topbar, .eyes-top";

export function restoreWorkspaceHeader(root) {
  const mounted = mountedHeaders.get(root);
  if (mounted) {
    mounted.placeholder.replaceWith(mounted.bar);
    mountedHeaders.delete(root);
  }
  const host = root.querySelector(".dw-route-title");
  host?.replaceChildren();
  if (host) host.hidden = true;
}

export function mountWorkspaceHeader(root) {
  restoreWorkspaceHeader(root);
  const bar = root.querySelector(`.dw-main :is(${TITLEBARS})`);
  const host = root.querySelector(".dw-route-title");
  if (!bar || !host) return;
  const placeholder = document.createComment("workspace page titlebar");
  bar.replaceWith(placeholder);
  host.replaceChildren(bar);
  host.hidden = false;
  mountedHeaders.set(root, { bar, placeholder });
  root
    .querySelector(".dw-main > .page")
    ?.dispatchEvent(new Event("dw:mounted"));
}
