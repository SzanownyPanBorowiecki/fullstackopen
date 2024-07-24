interface Params {
  exerciseHours: number[],
  target: number
}

interface Result {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

const parseArguments = (args: string[]): Params => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const target = Number(args[2]);
  const exerciseHours = args.slice(3).map(Number);
  if (exerciseHours.some(isNaN) || isNaN(target)) {
    throw new Error('Provided values were not numbers!');
  }

  return { exerciseHours, target };
};


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

try {
  const { exerciseHours, target } = parseArguments(process.argv);
  console.log(calculateExercises(exerciseHours, target));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
