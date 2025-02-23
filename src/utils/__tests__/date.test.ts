import {
  getOrdinalSuffix,
  formatTime,
  formatDateWithOrdinal,
  getTomorrowDate,
  ONE_DAY_IN_MILLISECONDS,
} from "../date";

describe("date utils", () => {
  describe("getOrdinalSuffix", () => {
    const testCases = {
      'returns "st" for numbers ending in 1 (except teens)': {
        inputs: [1, 21, 31],
        expected: "st",
      },
      'returns "nd" for numbers ending in 2 (except teens)': {
        inputs: [2, 22, 32],
        expected: "nd",
      },
      'returns "rd" for numbers ending in 3 (except teens)': {
        inputs: [3, 23, 33],
        expected: "rd",
      },
      'returns "th" for teen numbers (11-19)': {
        inputs: [11, 12, 13, 14, 15],
        expected: "th",
      },
      'returns "th" for all other numbers': {
        inputs: [4, 5, 24, 25, 30],
        expected: "th",
      },
    };

    Object.entries(testCases).forEach(([description, { inputs, expected }]) => {
      it(description, () => {
        inputs.forEach((input) => {
          expect(getOrdinalSuffix(input)).toBe(expected);
        });
      });
    });
  });

  describe("formatTime", () => {
    it("formats seconds into HH:MM format", () => {
      expect(formatTime(0)).toBe("00:00");
      expect(formatTime(3600)).toBe("01:00");
      expect(formatTime(3660)).toBe("01:01");
      expect(formatTime(36000)).toBe("10:00");
    });
  });

  describe("formatDateWithOrdinal", () => {
    it("formats date with ordinal suffix", () => {
      const date = new Date(2024, 0, 1);
      expect(formatDateWithOrdinal(date)).toBe("January 1st, 2024");

      const date2 = new Date(2024, 0, 2);
      expect(formatDateWithOrdinal(date2)).toBe("January 2nd, 2024");

      const date3 = new Date(2024, 0, 3);
      expect(formatDateWithOrdinal(date3)).toBe("January 3rd, 2024");

      const date4 = new Date(2024, 0, 4);
      expect(formatDateWithOrdinal(date4)).toBe("January 4th, 2024");
    });
  });

  describe("getTomorrowDate", () => {
    it("returns tomorrow's date", () => {
      const today = new Date();
      const tomorrow = getTomorrowDate();

      const diffInDays =
        (tomorrow.getTime() - today.getTime()) / ONE_DAY_IN_MILLISECONDS;

      expect(Math.round(diffInDays)).toBe(1);
    });
  });
});
