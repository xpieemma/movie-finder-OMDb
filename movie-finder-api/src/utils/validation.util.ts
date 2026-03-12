export const isValidImdbId = (id: string): boolean => {
  const imdbIdRegex = /^tt\d{1,8}$/;
  return imdbIdRegex.test(id);
};

export const isValidYear = (year: string): boolean => {
  const yearRegex = /^(19|20)\d{2}$/;
  return yearRegex.test(year);
};

export const sanitizeTitle = (title: string): string => {
  return title.trim().replace(/[^\w\s-]/g, '');
};
