/** @jest-environment node */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

test.each(["localhost", "127.0.0.1", "app.example.com"])(
  "startup preserves installed workers and sibling apps on %s",
  async (hostname) => {
    const unregister = jest.fn();
    const getRegistrations = jest.fn(async () => [{ unregister }]);
    vm.runInNewContext(
      fs.readFileSync(
        path.join(__dirname, "../public/js/runtime-bootstrap.js"),
        "utf8",
      ),
      {
        location: { hostname },
        navigator: { serviceWorker: { getRegistrations } },
        window: {},
      },
    );
    await Promise.resolve();
    expect(unregister).not.toHaveBeenCalled();
  },
);
