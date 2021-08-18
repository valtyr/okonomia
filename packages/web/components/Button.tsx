import React, { useRef } from 'react';
import { useButton } from '@react-aria/button';
import { AriaButtonProps } from '@react-types/button';

import assertUnreachable from '../lib/assertUnreachable';
import classNames from '../lib/classNames';
import FocusRing from './FocusRing';

type ButtonStyle = 'primary' | 'secondary';

const classNamesForButtonStyle = (style: ButtonStyle) => {
  switch (style) {
    case 'primary':
      return 'bg-black text-white';
    case 'secondary':
      return 'border-2 border-gray-300';
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
          classNamesForButtonStyle(buttonStyle),
        )}
        ref={ref}
      >
        {children}
      </div>
    </FocusRing>
  );
};

export default Button;
