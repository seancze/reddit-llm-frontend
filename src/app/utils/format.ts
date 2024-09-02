export const capitaliseFirstLetter = (str: string): string => {
  return str.length > 0 ? str.charAt(0).toUpperCase() + str.slice(1) : str;
};
