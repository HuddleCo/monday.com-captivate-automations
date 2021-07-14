import { isSimilarColumnTitles } from "./isSimilarColumnTitle";

describe("isSimilarColumnTitles", () => {
  describe("when the titles are similar", () => {
    it("is true with blanks", () =>
      expect(isSimilarColumnTitles("", "")).toBe(true));
    it("is true with white spaces", () =>
      expect(isSimilarColumnTitles(" ", "")).toBe(true));
    it("is true with leading whitespace", () =>
      expect(isSimilarColumnTitles(" a", "a")).toBe(true));
    it("is true with mixed case", () =>
      expect(isSimilarColumnTitles("MiXeD cAsE", "Mixed Case")).toBe(true));
  });

  describe("when the titles are not similar enough", () => {
    it("is false with different a characters", () =>
      expect(isSimilarColumnTitles("a", "b")).toBe(false));
    it("is false with different lengths", () =>
      expect(isSimilarColumnTitles("ab", "a")).toBe(false));
  });
});
