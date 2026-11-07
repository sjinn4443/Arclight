function m(r, p, s, d = "pecWorkshop") {
  p.forEach(({ src: l, caption: c, rotate: i }) => {
    let t = document.createElement("article");
    ((t.className =
      "diabetic-screening-panel diabetic-screening-panel--content-fit"),
      (t.dataset.diabeticScrollStep = ""));
    let n = document.createElement("figure");
    n.className = "workshop-source-figure";
    let e = document.createElement("img");
    ((e.src = l), (e.alt = s(c)), (e.loading = "lazy"));
    let o = document.createElement("figcaption");
    if (((o.dataset.i18n = `${d}.${c}`), (o.textContent = s(c)), i)) {
      let a = document.createElement("div");
      ((a.className = "workshop-source-portrait"), a.append(e), n.append(a, o));
    } else n.append(e, o);
    (t.append(n), r.append(t));
  });
}
export { m as a };
