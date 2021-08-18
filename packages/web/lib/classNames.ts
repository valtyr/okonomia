const classNames = (...classes: (string | null | boolean | undefined)[]) =>
  classes.filter(Boolean).join(' ');

export default classNames;
