import { IconProps } from '@radix-ui/react-icons/dist/types';
import { Field } from '@shopify/react-form';
import React from 'react';
import classNames from '../lib/classNames';
import FocusRing from './FocusRing';
import FormError from './FormError';

const Input: React.FC<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > &
    Partial<Field<string>> & {
      Icon?: React.FC<IconProps & React.RefAttributes<SVGSVGElement>>;
    }
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
  Icon,
  ...props
}) => (
  <div>
    <FocusRing>
      <div
        className={classNames(
          `outline-none rounded-lg box-border font-normal
          border border-gray-200 focus:py-[7px] focus:px-[9px]
          focus:border-2
          shadow-sm flex items-center`,
          props.className,
        )}
      >
        {Icon && <Icon className="ml-3 text-gray-400" />}
        <input
          {...props}
          className="py-[8px] px-[10px] outline-none rounded-lg w-full"
        />
      </div>
    </FocusRing>
    {error && <FormError>{error}</FormError>}
  </div>
);

export default Input;
