export const SECONDS_IN_DAY = 24 * 60 * 60;
export const TURNAROUND_TIME_SECONDS = 20 * 60;
export const ONE_SECOND_IN_MILLISECONDS = 1000;
export const ONE_DAY_IN_MILLISECONDS =
  SECONDS_IN_DAY * ONE_SECOND_IN_MILLISECONDS;

export const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return "th";

  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const formatTime = (seconds: number): string => {
  const date = new Date(seconds * ONE_SECOND_IN_MILLISECONDS);
  return date.toISOString().substring(11, 16);
};

export const formatDateWithOrdinal = (date: Date): string => {
  return date
    .toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .replace(
      /(\d+)/,
      (match) => `${match}${getOrdinalSuffix(parseInt(match))}`
    );
};

export const getTomorrowDate = (): Date => {
  return new Date(Date.now() + ONE_DAY_IN_MILLISECONDS);
};
