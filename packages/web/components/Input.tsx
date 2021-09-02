import { ErrorValue, Field } from '@shopify/react-form';
import React, { ChangeEvent, HTMLAttributes } from 'react';
import classNames from '../lib/classNames';
import FocusRing from './FocusRing';
import FormError from './FormError';

const Input: React.FC<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > &
    Field<string>
> = ({
  error,
  allErrors,
  defaultValue,
  dirty,
  newDefaultValue,
  reset,
  runValidation,
  setError,
  touched,
  ...props
}) => (
  <div>
    <FocusRing>
      <input
        {...props}
        className={classNames(
          `outline-none rounded-lg py-[8px] px-[10px] box-border font-normal
        border border-gray-200 focus:py-[7px] focus:px-[9px]
        focus:border-2
        shadow-sm`,
          props.className,
        )}
      />
    </FocusRing>
    {error && <FormError>{error}</FormError>}
  </div>
);

export default Input;
