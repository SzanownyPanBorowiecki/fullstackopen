interface Result {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

export const calculateExercises = (
  exerciseHours: number[],
  target: number
): Result => {
  const periodLength = exerciseHours.length;
  const trainingDays = exerciseHours.filter(num => num).length;
  const average = exerciseHours.reduce((total, num) => total += num, 0) / periodLength;
  const success = average >= target;
  const rating = Math.floor(Math.min(2 * (average / target) + 1, 3));
  const ratingDescription = (() => {
    switch (rating) {
      case 1: return 'bad';
      case 2: return 'not bad';
      case 3: return 'good';
      default: return '?';
    }
  })();

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};
