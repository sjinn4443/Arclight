/**
 * @jest-environment jsdom

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("Large-State Scenarios", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should handle 200+ liked items without significant slowdown", () => {
    const likedItems = [];
    for (let i = 0; i < 250; i++) {
      likedItems.push(`item-${i}`);
    }
    localStorage.setItem("likedItems", JSON.stringify(likedItems));

    const startTime = performance.now();
    const retrievedItems = JSON.parse(localStorage.getItem("likedItems"));
    const endTime = performance.now();

    expect(retrievedItems).toHaveLength(250);
    expect(endTime - startTime).toBeLessThan(200); // 200ms threshold for performance
  });

  it("should handle repeated like/unlike actions correctly", () => {
    let likedItems = [];

    // Like
    likedItems.push("item-1");
    localStorage.setItem("likedItems", JSON.stringify(likedItems));
    expect(JSON.parse(localStorage.getItem("likedItems"))).toEqual(["item-1"]);

    // Unlike
    likedItems = likedItems.filter((item) => item !== "item-1");
    localStorage.setItem("likedItems", JSON.stringify(likedItems));
    expect(JSON.parse(localStorage.getItem("likedItems"))).toEqual([]);

    // Like again
    likedItems.push("item-1");
    localStorage.setItem("likedItems", JSON.stringify(likedItems));
    expect(JSON.parse(localStorage.getItem("likedItems"))).toEqual(["item-1"]);
  });
}); */
