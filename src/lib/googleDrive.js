// Utility to validate a Google Doc URL
export const isValidGoogleDocUrl = (url) => {
  return /^https:\/\/docs\.google\.com\/document\/d\/.+\/edit$/.test(url);
};
