module.exports = {
  ci: {
    collect: {
      // starts your app for LH to hit
      startServerCommand:
        "npm run build && cross-env NODE_ENV=production node server.cjs", // build + serve prod
      startServerReadyPattern: "listening", // ADJUST to your server log
      url: [
        "http://localhost:3000/index.html",
        "http://localhost:3000/#dashboard",
        "http://localhost:3000/#learningModules",
        "http://localhost:3000/html/quizzes.html", // Added quiz page
        "http://localhost:3000/html/videos.html", // Added video-heavy page
      ],
      numberOfRuns: 3,
      settings: {
        preset: "desktop",
        throttlingMethod: "simulate",
        // keep defaults unless you want custom throttling
      },
    },
    assert: {
      assertions: {
        // Core metrics budgets
        "first-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 4000 }],
        interactive: ["error", { maxNumericValue: 5000 }],

        // Overall perf score as a guardrail
        "categories:performance": ["warn", { minScore: 0.75 }],
      },
    },
    upload: {
      target: "temporary-public-storage", // easy local + CI diffs
    },
  },
};
