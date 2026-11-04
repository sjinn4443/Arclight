module.exports = function positioningDividers(width, height, end) {
  const c = (k) => ({ a: 0, k });
  return [1, 2].map((row) => ({
    ddd: 0,
    ind: 10000 + row,
    ty: 1,
    nm: `Positioning white divider ${row}`,
    sw: width,
    sh: 6,
    sc: "#ffffff",
    sr: 1,
    ks: {
      o: c(100),
      r: c(0),
      p: c([0, (height * row) / 3 - 3, 0]),
      a: c([0, 0, 0]),
      s: c([100, 100, 100]),
    },
    ip: 0,
    op: end,
    st: 0,
    bm: 0,
  }));
};
