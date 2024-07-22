interface Result {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
};

const calculateExercises = (
  exerciseHours: number[],
  target: number
): Result => {
  const periodLength = exerciseHours.length;
  const trainingDays = exerciseHours.filter(num => num).length;
  const average = exerciseHours.reduce((total, num) => total += num, 0) / periodLength;
  const success = average >= target;
  const rating = Math.floor(Math.min(2*(average/target)+1, 3));
  const ratingDescription = (() => {
    switch (rating) {
      case 1: return 'bad';
      case 2: return 'not bad';
      case 3: return 'good';
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
  }
}

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
