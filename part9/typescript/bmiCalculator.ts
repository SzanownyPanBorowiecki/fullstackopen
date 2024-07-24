interface Params {
  height: number,
  weight: number
};

const parseArguments = (args: string[]): Params => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3])
    }
  } else {
    throw new Error('Provided values were not numbers!');
  }
}

type BmiCategory = 'Underweight (Severe thinness)'
                    | 'Underweight (Moderate thinness)'
                    | 'Underweight (Mild thinness)'
                    | 'Normal (healthy weight)'
                    | 'Overweight (Pre-obese)'
                    | 'Obese (Class I)'
                    | 'Obese (Class II)'
                    | 'Obese (Class III)';

export const calculateBmi = (height: number, weight: number): BmiCategory => {
  const bmi = weight / (height * height) * 10000;
  if (bmi < 16){ return "Underweight (Severe thinness)" };
  if (bmi >= 16 && bmi < 17){ return "Underweight (Moderate thinness)" };
  if (bmi >= 17 && bmi < 18.5){ return "Underweight (Mild thinness)" };
  if (bmi >= 18.5 && bmi < 25){ return "Normal (healthy weight)" };
  if (bmi >= 25 && bmi < 30){ return "Overweight (Pre-obese)" };
  if (bmi >= 30 && bmi < 35){ return "Obese (Class I)" };
  if (bmi >= 35 && bmi < 40){ return "Obese (Class II)" };
  return "Obese (Class III)";
}

try {
  const { height, weight } = parseArguments(process.argv);
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
