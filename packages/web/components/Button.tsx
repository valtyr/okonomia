import React, { useRef } from 'react';
import { useButton } from '@react-aria/button';
import { AriaButtonProps } from '@react-types/button';

import assertUnreachable from '../lib/assertUnreachable';
import classNames from '../lib/classNames';
import FocusRing from './FocusRing';

type ButtonStyle = 'primary' | 'secondary' | 'accent';

const classNamesForButtonStyle = (style: ButtonStyle) => {
  switch (style) {
    case 'primary':
      return `border border-black bg-black text-white
              hover:text-black hover:bg-transparent
              transition-all transition-gpu`;
    case 'accent':
      return `border border-blue-600 bg-blue-600 text-white
              hover:text-blue-600 hover:bg-transparent
              transition-all transition-gpu`;
    case 'secondary':
      return 'border border-gray-200 hover:shadow-sm';
    default:
      assertUnreachable(style);
  }
};

const Button: React.FC<
  AriaButtonProps<'div'> & {
    buttonStyle: ButtonStyle;
  }
> = ({ buttonStyle, ...props }) => {
  let ref = useRef<HTMLDivElement>(null);
  let { buttonProps } = useButton({ ...props, elementType: 'div' }, ref);
  let { children } = props;

  return (
    <FocusRing>
      <div
        {...buttonProps}
        className={classNames(
          'rounded-lg px-10 py-2 flex items-center justify-center',
          'appearance-none outline-none',
          classNamesForButtonStyle(
            props.isDisabled ? 'secondary' : buttonStyle,
          ),
          props.isDisabled && 'opacity-60 cursor-not-allowed',
        )}
        ref={ref}
      >
        {children}
      </div>
    </FocusRing>
  );
};

export default Button;
