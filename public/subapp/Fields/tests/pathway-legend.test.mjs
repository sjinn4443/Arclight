import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = await readFile(resolve(appRoot, "src/pathway.js"), "utf8");
const context = {};
vm.runInNewContext(
    `${source}\nglobalThis.__getPathwayLegendState = getPathwayLegendState;`,
    context
);
const getLegend = context.__getPathwayLegendState;

function assertLegend(targets, expectedLabels, expectedActive) {
    const result = getLegend(targets);
    Object.entries(expectedLabels).forEach(([key, value]) => {
        assert.equal(result.labels[key], value);
    });
    assert.deepEqual(Array.from(result.activeKeys), expectedActive);
}

test("pathway legend uses concise inactive labels", () => {
    assertLegend([], {
        retina: "Retina",
        nerve: "Nerve",
        chiasm: "Chiasm",
        tract: "Tract",
        lgn: "LGN",
        radiations: "Radiations",
        cortex: "V1",
    }, []);
});

test("pre-chiasmal labels identify the eye and bilateral nerve state", () => {
    assertLegend(["part-retina-right"], { retina: "RE Retina" }, ["retina"]);
    assertLegend(["part-nerve-left"], { nerve: "LE Nerve" }, ["nerve"]);
    assertLegend(
        ["part-nerve-right", "part-nerve-left"],
        { nerve: "Both Nerves" },
        ["nerve"]
    );
});

test("chiasmal labels distinguish lateral-only targets", () => {
    assertLegend(["part-chiasm-a", "part-chiasm-b"], { chiasm: "Chiasm" }, ["chiasm"]);
    assertLegend(
        ["part-chiasm-lateral-right"],
        { chiasm: "Lateral chiasm" },
        ["chiasm"]
    );
});

test("posterior labels identify hemisphere, radiation branch and V1 bank", () => {
    assertLegend(
        [
            "part-radiation-left-b",
            "part-occipital-left",
            "part-v1-left",
            "part-calcarine-lower-left",
        ],
        { radiations: "L Meyer", cortex: "L lower V1" },
        ["radiations", "cortex"]
    );
    assertLegend(
        [
            "part-radiation-right-a",
            "part-occipital-right",
            "part-v1-right",
            "part-calcarine-upper-right",
        ],
        { radiations: "R Parietal", cortex: "R upper V1" },
        ["radiations", "cortex"]
    );
});

test("broad unilateral and bilateral posterior targets remain concise", () => {
    assertLegend(
        [
            "part-radiation-left-a",
            "part-radiation-left-b",
            "part-occipital-left",
            "part-v1-left",
        ],
        { radiations: "L Radiations", cortex: "L V1" },
        ["radiations", "cortex"]
    );
    assertLegend(
        [
            "part-radiation-left-a",
            "part-radiation-right-a",
            "part-occipital-left",
            "part-occipital-right",
        ],
        { radiations: "Both Radiations", cortex: "Both V1" },
        ["radiations", "cortex"]
    );
});
