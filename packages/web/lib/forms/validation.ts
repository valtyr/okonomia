type ValidationFunction<T> = (value: T) => string | undefined;

export const requiredField: ValidationFunction<
  string | number | Date | null | undefined
> = (value) => {
  if (!value || (typeof value === 'string' && !value.trim()))
    return 'Upplýsingar vantar';
  return;
};

export const validEmail: ValidationFunction<string> = (value) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (value && !re.test(value.trim().toLowerCase())) return 'Ógilt netfang';
  return;
};
