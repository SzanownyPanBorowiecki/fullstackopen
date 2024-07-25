import express from 'express';

import { calculateBmi } from './calculators/bmi';
import { calculateExercises } from './calculators/exercise';


const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const weight = Number(req.query.weight);
  const height = Number(req.query.height);

  if (isNaN(weight) || isNaN(height)) {
    res.status(400).json({ 'error': 'malformatted parameters' });
  } else {
    res.json({
      weight, height,
      bmi: calculateBmi(height, weight)
    });
  }
});

app.post('/exercises', (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (!Object.hasOwn(req.body, 'daily_exercises') || !Object.hasOwn(req.body, 'target')) {
      throw new Error("parameters missing");
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { daily_exercises, target } = req.body;

    if ((daily_exercises as number[]).some(isNaN) || isNaN(Number(target))) {
      throw new Error("malformed parameters");
    }

    const result = calculateExercises(daily_exercises as number[], Number(target));
    res.json(result);
  } catch (error) {
    let message;
    if (error instanceof Error) {
      message = error.message;
    } else {
      message = error;
    }
    res.status(400).json({ error: message });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
