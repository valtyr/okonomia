import kennitala from 'kennitala';

type ValidationFunction<T> = (value: T) => string | undefined;

export const requiredField: ValidationFunction<
  string | number | Date | File | null | undefined
> = (value) => {
  if (!value || (typeof value === 'string' && !value.trim()))
    return 'Má ekki sleppa';
  return;
};

export const validEmail: ValidationFunction<string> = (value) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (value && !re.test(value.trim().toLowerCase())) return 'Ógilt netfang';
  return;
};

export const validKennitala: ValidationFunction<string> = (value) => {
  const valid = kennitala.isValid(value);
  if (!valid) return 'Ógild kennitala';
  if (!kennitala.isPerson(value)) return 'Þetta er fyrirtækjakennitala';
  return;
};

export const max4MBFile: ValidationFunction<File | null> = (f) => {
  if (!f) return;
  const valid = f.size < 4 * 1024 * 1024;
  if (!valid) return 'Myndin má vera 4MB að hámarki';
  return;
};
