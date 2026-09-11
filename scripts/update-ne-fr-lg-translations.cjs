// Resumable Spanish-coverage parity update. Translate original English sources
// where available to avoid compounding errors through a pivot translation.
const fs = require("node:fs");
const path = require("node:path");
const locales = { ne: "nepali", fr: "french", lg: "luganda" };
const cacheDir = "tmp/locale-parity";
fs.mkdirSync(cacheDir, { recursive: true });
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const write = (p, o) => fs.writeFileSync(p, JSON.stringify(o, null, 2) + "\n");
const flatten = (o, p = [], out = []) => {
  for (const [k, v] of Object.entries(o)) {
    if (v && typeof v === "object") flatten(v, [...p, k], out);
    else out.push([[...p, k], v]);
  }
  return out;
};
const get = (o, p) => p.reduce((a, k) => a?.[k], o);
const set = (o, p, v) => {
  for (let i = 0; i < p.length - 1; i++)
    o = o[p[i]] ??= /^\d+$/.test(p[i + 1]) ? [] : {};
  o[p.at(-1)] = v;
};
const walk = (p) =>
  fs
    .readdirSync(p, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? walk(path.join(p, e.name)) : [path.join(p, e.name)],
    );
const en = read("public/translation/english.json");
const es = read("public/translation/spanish.json");
const glossary = {
  ne: {
    pupils: "नानीहरू",
    pupil: "नानी",
    pupillary: "नानीसम्बन्धी",
    "fundal reflex": "नेत्रपटलको रातो प्रतिबिम्ब",
    "red reflex": "रातो प्रतिबिम्ब",
    "visual acuity": "दृष्टि तीक्ष्णता",
  },
  fr: {
    pupils: "pupilles",
    pupil: "pupille",
    pupillary: "pupillaire",
    "fundal reflex": "reflet du fond d’œil",
    "red reflex": "reflet rouge",
    "visual acuity": "acuité visuelle",
  },
  lg: {
    pupils: "obutuli obuddugavu obw’amaaso",
    pupil: "akatuli akaddugavu ak’eriiso",
    pupillary: "ekikwata ku katuli akaddugavu ak’eriiso",
    "fundal reflex": "ekitangaala ekimyufu ekidda okuva munda mu liiso",
    "red reflex": "ekitangaala ekimyufu ekidda okuva munda mu liiso",
    "visual acuity": "obukali bw’okulaba",
  },
};
async function main(code) {
  const file = `public/translation/${locales[code]}.json`;
  const dict = fs.existsSync(file) ? read(file) : {};
  const cachePath = `${cacheDir}/${code}.json`;
  const cache = fs.existsSync(cachePath) ? read(cachePath) : {};
  const tasks = [];
  const add = (source, apply, sourceLang = "en") => {
    if (
      typeof source !== "string" ||
      !source.trim() ||
      !/\p{L}/u.test(source) ||
      /^(?:https?:\/\/|\/images\/)/.test(source)
    ) {
      apply(source);
      return;
    }
    tasks.push({ source, apply, key: sourceLang + "|" + source, sourceLang });
  };
  // Reuse translations already reviewed in this locale for identical source text.
  for (const [p, s] of flatten(en)) {
    const v = get(dict, p);
    if (typeof s === "string" && typeof v === "string" && v.trim() && v !== s)
      cache["en|" + s] ??= v;
  }
  let missing = 0;
  for (const [p, v] of flatten(es)) {
    const current = get(dict, p),
      source = get(en, p);
    if (
      current != null &&
      current !== "" &&
      !(
        typeof source === "string" &&
        current === source &&
        v !== source &&
        /[a-z]{3}/i.test(source)
      )
    )
      continue;
    missing++;
    add(
      source ?? (p[0] === "i18nLiteral" ? p.slice(1).join(".") : v),
      (t) => set(dict, p, t),
      source != null || p[0] === "i18nLiteral" ? "en" : "es",
    );
  }
  const subtitles = [];
  for (const esp of walk("public/video-subtitles").filter(
    (p) => path.basename(p) === "es.vtt",
  )) {
    const target = path.join(path.dirname(esp), code + ".vtt");
    if (fs.existsSync(target)) continue;
    const ep = path.join(path.dirname(esp), "en.vtt");
    const lines = fs
      .readFileSync(fs.existsSync(ep) ? ep : esp, "utf8")
      .split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      if (
        !lines[i].trim() ||
        lines[i] === "WEBVTT" ||
        lines[i].includes("-->") ||
        /^\d+$/.test(lines[i]) ||
        (lines[i + 1] || "").includes("-->")
      )
        continue;
      const index = i;
      add(lines[i], (t) => (lines[index] = t), fs.existsSync(ep) ? "en" : "es");
    }
    subtitles.push({ target, lines });
  }
  const narrationPath =
    "public/narration/fundal-reflex/full-animation/script.json";
  const script = read(narrationPath);
  const timed = script.timedCues.en.map((c) => ({ ...c }));
  for (const cue of timed) add(cue.text, (t) => (cue.text = t));
  const baseCues = script.cues.map((c) => ({ id: c.id, text: c.en }));
  for (const cue of baseCues) add(cue.text, (t) => (cue.text = t));
  const unique = [
    ...new Map(
      tasks.filter((t) => !cache[t.key]).map((t) => [t.key, t]),
    ).values(),
  ];
  console.log(
    `[${code}] dictionary updates=${missing}, subtitle files=${subtitles.length}, uncached texts=${unique.length}`,
  );
  const protect = (text) => {
    const tokens = [];
    let s = text.replace(
      /\{\{[^}]+\}\}|\$\{[^}]+\}|<[^>]+>|&(?:#\d+|#x[0-9a-f]+|\w+);/gi,
      (m) => {
        tokens.push(m);
        return `ZXQ${tokens.length - 1}QXZ`;
      },
    );
    for (const [term, value] of Object.entries(glossary[code]))
      s = s.replace(new RegExp("\\b" + term + "\\b", "gi"), () => {
        tokens.push(value);
        return `ZXQ${tokens.length - 1}QXZ`;
      });
    return {
      s,
      restore: (t) => {
        for (let i = 0; i < tokens.length; i++) {
          const r = new RegExp(`ZXQ\\s*${i}\\s*QXZ`, "gi");
          if (!r.test(t)) throw Error("Lost protected token");
          t = t.replace(r, () => tokens[i]);
        }
        return t;
      },
    };
  };
  const batches = [];
  for (const t of unique) {
    const p = protect(t.source);
    t.protected = p;
    let b = batches.at(-1);
    if (!b || b.lang !== t.sourceLang || b.size + p.s.length > 2800) {
      b = { lang: t.sourceLang, size: 0, items: [] };
      batches.push(b);
    }
    b.items.push(t);
    b.size += p.s.length + 20;
  }
  let cursor = 0,
    done = 0;
  async function translate(items, lang, attempt = 0) {
    const input =
      items.length === 1
        ? items[0].protected.s
        : items.map((t, i) => `ZXQX${i}XQXZ\n${t.protected.s}`).join("\n");
    try {
      const url =
        "https://translate.googleapis.com/translate_a/single?" +
        new URLSearchParams({
          client: "gtx",
          sl: lang,
          tl: code,
          dt: "t",
          q: input,
        });
      const r = await fetch(url, { signal: AbortSignal.timeout(45000) });
      if (!r.ok) throw Error("HTTP " + r.status);
      const data = await r.json();
      const output = data[0].map((x) => x[0] || "").join("");
      const split =
        items.length === 1
          ? [output]
          : output.split(/ZXQX\s*\d+\s*XQXZ\s*/gi).slice(1);
      if (split.length !== items.length) throw Error("Batch boundary changed");
      const values = split.map((s, i) => items[i].protected.restore(s.trim()));
      values.forEach((s, i) => (cache[items[i].key] = s));
    } catch (e) {
      if (attempt < 3) {
        await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
        return translate(items, lang, attempt + 1);
      }
      if (items.length > 1) {
        for (const t of items) await translate([t], lang);
        return;
      }
      throw Error(`${code}: ${e.message}: ${items[0].source}`);
    }
  }
  await Promise.all(
    Array.from({ length: 3 }, async () => {
      while (cursor < batches.length) {
        const b = batches[cursor++];
        await translate(b.items, b.lang);
        write(cachePath, cache);
        if (++done % 10 === 0)
          console.log(`[${code}] ${done}/${batches.length} batches`);
      }
    }),
  );
  for (const t of tasks) t.apply(cache[t.key]);
  write(file, dict);
  for (const { target, lines } of subtitles)
    fs.writeFileSync(target, lines.join("\n"));
  // Reload to retain changes if another locale was processed before this one.
  const latest = read(narrationPath);
  latest.timedCues[code] = timed;
  latest.timedAudioCues ??= {};
  latest.timedAudioCues[code] = timed.map((c) => ({ ...c }));
  latest.cues.forEach(
    (c) => (c[code] = baseCues.find((b) => b.id === c.id).text),
  );
  latest.languages[code] = {
    label: { ne: "नेपाली", fr: "Français", lg: "Luganda" }[code],
    locale: { ne: "ne-NP", fr: "fr-FR", lg: "lg-UG" }[code],
    voice: { ne: "ne-NP-HemkalaNeural", fr: "fr-FR-DeniseNeural", lg: null }[
      code
    ],
    style: "Calm medical educator; slightly slow",
  };
  write(narrationPath, latest);
  write(`${cacheDir}/${code}-summary.json`, {
    dictionaryUpdates: missing,
    subtitleFiles: subtitles.length,
    translationProvider: "Google Translate",
    source: "English source with Spanish coverage baseline",
    requiresNativeReview: true,
  });
  console.log(`[${code}] saved dictionary, subtitles and narration text`);
}
(async () => {
  for (const code of process.argv.slice(2).length
    ? process.argv.slice(2)
    : Object.keys(locales))
    await main(code);
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
