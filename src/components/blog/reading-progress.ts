type ReadingProgress = {
  readPercent: number;
  remainingPercent: number;
};

const MIN_PERCENT = 0;
const MAX_PERCENT = 100;

const clampPercent = (value: number): number =>
  Math.min(MAX_PERCENT, Math.max(MIN_PERCENT, value));

export const calculateReadingProgress = (
  currentPx: number,
  totalPx: number
): ReadingProgress => {
  if (totalPx <= 0) {
    return {
      readPercent: MIN_PERCENT,
      remainingPercent: MAX_PERCENT,
    };
  }

  const rawReadPercent = (currentPx / totalPx) * MAX_PERCENT;
  const readPercent = clampPercent(rawReadPercent);
  const remainingPercent = clampPercent(MAX_PERCENT - readPercent);

  return { readPercent, remainingPercent };
};
