import { NewPatientEntry, Gender } from './types';

const isDate = (param: string) =>
  Boolean(Date.parse(param));

const isString = (param: unknown): param is string =>
  typeof(param) === 'string' || param instanceof String;

const isGender = (param: string): param is Gender =>
  Object.values(Gender).map(v => v.toString()).includes(param);

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error('Incorrect date');
  }

  return date;
};

const parseString = (s: unknown): string => {
  if (!isString(s)) {
    throw new Error(s + ` is not a string`);
  }

  return s;
};

const parseGender = (s: unknown): Gender => {
  if (!isString(s) || !isGender(s)) {
    throw new Error('Incorrect gender: ' + s);
  }

  return s;
};


export const toNewPatientEntry = (data: unknown): NewPatientEntry => {
  if (!data || typeof(data) !== 'object') {
    throw new Error('wrong data!');
  }

  if (
    'name' in data
    && 'dateOfBirth' in data
    && 'ssn' in data
    && 'gender' in data
    && 'occupation' in data
  ) {
    const newPatient: NewPatientEntry = {
      name: parseString(data.name),
      dateOfBirth: parseDate(data.dateOfBirth),
      ssn: parseString(data.ssn),
      gender: parseGender(data.gender),
      occupation: parseString(data.occupation)
    };

    return newPatient;
  }

  throw new Error('some fields are missing');
};


