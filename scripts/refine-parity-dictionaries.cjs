const fs = require("node:fs");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const source = read("public/translation/spanish.json");
const lgTerms = {
  Jelly: "Ekintu ekiringa jjeeri",
  Macula: "Makula (ekitundu kya retina eky’okulaba obulungi)",
  Fundus: "Munda mu liiso",
  absent: "tekiriiwo",
  Email: "Emmeeri",
  Download: "Wanula",
  Edit: "Kyusa",
  "Explore App": "Lambula pulogulaamu",
  "Edit Profile": "Kyusa ebikukwatako",
  Generalist: "Omusawo ow’awamu",
  Info: "Ebisingawo",
  Simulator: "Ekyuma eky’okwegezaamu",
  "18mth": "emyezi 18",
  "1wk": "wiiki 1",
  "2wk": "wiiki 2",
  "3mth": "emyezi 3",
  "6mth": "emyezi 6",
  "6wk": "wiiki 6",
};
// Preserve source array types (quiz question/options arrays must remain arrays).
function repair(s, t) {
  if (Array.isArray(s)) return s.map((v, i) => repair(v, t?.[i]));
  if (s && typeof s === "object") {
    for (const [k, v] of Object.entries(s)) t[k] = repair(v, t[k]);
    return t;
  }
  return t;
}
function terms(o) {
  for (const [k, v] of Object.entries(o)) {
    if (v && typeof v === "object") terms(v);
    else if (typeof v === "string") {
      if (lgTerms[v]) o[k] = lgTerms[v];
      else if (/^\| \d+ Qs$/.test(v)) o[k] = v.replace("Qs", "ebibuuzo");
    }
  }
}
for (const name of ["nepali", "french", "luganda"]) {
  const p = `public/translation/${name}.json`;
  const d = repair(source, read(p));
  if (name === "nepali") {
    d.i18nLiteral["Time is up"] = "समय सकियो";
    const localizeFundal = (o) => {
      for (const [key, value] of Object.entries(o)) {
        if (value && typeof value === "object") localizeFundal(value);
        else if (typeof value === "string")
          o[key] = value.replace(/fundal reflex/gi, "फन्डल रिफ्लेक्स");
      }
    };
    localizeFundal(d);
  }
  if (name === "luganda") terms(d);
  fs.writeFileSync(p, JSON.stringify(d, null, 2) + "\n");
}
