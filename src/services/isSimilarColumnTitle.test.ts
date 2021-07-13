import { isSimilarColumnTitles } from "./isSimilarColumnTitle";

describe("isSimilarColumnTitles", () => {
  describe("when the titles are similar", () => {
    it("is true", () => {
      expect.hasAssertions();
      expect(isSimilarColumnTitles("", "")).toBe(true);
      expect(isSimilarColumnTitles(" ", "")).toBe(true);
      expect(isSimilarColumnTitles("a", "A")).toBe(true);
      expect(isSimilarColumnTitles(" a", "a")).toBe(true);
      expect(isSimilarColumnTitles("MiXeD cAsE", "Mixed Case")).toBe(true);
    });
  });

  describe("when the titles are not similar enough", () => {
    it("is false", () => {
      expect.hasAssertions();
      expect(isSimilarColumnTitles("a", "b")).toBe(false);
      expect(isSimilarColumnTitles("ab", "a")).toBe(false);
    });
  });
});
