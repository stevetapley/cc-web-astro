export const isExternalUrl = (url?: string) => {
  if (!url) return false;
  return /^(https?:)?\/\//i.test(url) || url.startsWith("mailto:");
};
