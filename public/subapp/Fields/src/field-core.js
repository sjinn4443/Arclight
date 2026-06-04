(function attachFieldCore(global) {
  "use strict";

  const EYE_POSITIONS = ["st", "sn", "it", "in", "c"];

  function createDefaultEyeState() {
    return { st: "R", sn: "R", it: "R", in: "R", c: "R" };
  }

  function parseSymbolToCode(sym) {
    if (sym === "?") return "?";
    if (sym === "X") return "W";
    return "R";
  }

  function parseEyeString(str) {
    const result = createDefaultEyeState();
    String(str || "")
      .split(",")
      .forEach((piece) => {
        const trimmed = piece.trim();
        const pos = trimmed.slice(0, 2);
        const symbol = trimmed.slice(2);
        if (Object.prototype.hasOwnProperty.call(result, pos)) {
          result[pos] = parseSymbolToCode(symbol);
        }
      });
    return result;
  }

  function codeToDisplaySymbol(code) {
    if (code === "?") return "?";
    if (code === "W") return "X";
    return "+";
  }

  function codeToScore(code) {
    if (code === "W") return 2; // 'X' => definite
    if (code === "?") return 1; // '?' => partial
    return 0; // 'R' => normal
  }

  function isEyeNormal(eye) {
    return (
      eye.st === "R" &&
      eye.sn === "R" &&
      eye.it === "R" &&
      eye.in === "R" &&
      eye.c === "R"
    );
  }

  function classifyFiveSum(sum) {
    if (sum === 5) return "Possible";
    if (sum === 10) return "Definite";
    return "Probable";
  }

  const api = {
    EYE_POSITIONS,
    createDefaultEyeState,
    parseSymbolToCode,
    parseEyeString,
    codeToDisplaySymbol,
    codeToScore,
    isEyeNormal,
    classifyFiveSum,
  };

  global.FIELD_CORE = api;

  // Backward-compatible globals for existing files.
  global.parseSymbolToCode = parseSymbolToCode;
  global.parseEyeString = parseEyeString;
  global.codeToDisplaySymbol = codeToDisplaySymbol;
  global.codeToScore = codeToScore;
  global.isEyeNormal = isEyeNormal;
  global.classifyFiveSum = classifyFiveSum;
})(typeof window !== "undefined" ? window : globalThis);
