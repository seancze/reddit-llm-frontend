export const capitaliseFirstLetter = (str: string): string => {
  return str.length > 0 ? str.charAt(0).toUpperCase() + str.slice(1) : str;
};

// converts a date string formatted as "YYYY-MM-DDTHH:MM:SSZ" to seconds since epoch
export const toSecondsSinceEpoch = (dateString: string) => {
  const date = new Date(dateString);
  return Math.floor(date.getTime() / 1000);
};
