const strip = (string: string): string =>
  string.replace(/ /g, "").toLowerCase();

export const isSimilarColumnTitles = (a: string, b: string): boolean =>
  strip(a) === strip(b);
