import { d as o } from "./chunk-UEXRDOY7.js";
import { s as l } from "./chunk-C3DWFWW5.js";
import "./chunk-P2HPNKQY.js";
import "./chunk-BGCC32GM.js";
import "./chunk-WOT6VMZA.js";
function u() {
  let e = document.getElementById("proInterestPage"),
    i = e?.querySelector("#interestSubmitBtn");
  if (!e || !i || e.dataset.bound) return;
  e.dataset.bound = "true";
  let r = Array.from(e.querySelectorAll(".chip")),
    s = !1,
    n = () => {
      i.disabled =
        s || r.filter((t) => t.classList.contains("selected")).length < 2;
    };
  for (let t of r)
    t.addEventListener("click", () => {
      (t.classList.toggle("selected"), n());
    });
  (n(),
    i.addEventListener("click", async () => {
      if (i.disabled || s) return;
      ((s = !0), n());
      let t = r
        .filter((a) => a.classList.contains("selected"))
        .map((a) => a.textContent.trim())
        .filter(Boolean);
      try {
        await o({ aims: t.join(", ") || null });
      } catch {}
      try {
        await l("intro");
      } finally {
        ((s = !1), n());
      }
    }));
}
export { u as initializeInterest };
