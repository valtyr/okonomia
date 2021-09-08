import React, { useRef } from 'react';
import { useButton } from '@react-aria/button';
import { AriaButtonProps } from '@react-types/button';

import assertUnreachable from '../lib/assertUnreachable';
import classNames from '../lib/classNames';
import FocusRing from './FocusRing';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import useCombinedRefs from '../lib/useCombinedRefs';

export type ButtonStyle =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'dangerous'
  | 'small-accent';

const classNamesForButtonStyle = (style: ButtonStyle) => {
  switch (style) {
    case 'primary':
      return `border border-black bg-black text-white
              hover:text-black hover:bg-transparent
              transition-all transition-gpu
              flex items-center justify-center
              rounded-lg px-10 py-2`;
    case 'accent':
      return `bg-gradient-to-r from-indigo-500 to-blue-500 
              border border-blue-600 text-white
              hover:text-blue-600 hover:from-transparent hover:to-transparent
              flex items-center justify-center
              rounded-lg px-10 py-2`;
    case 'secondary':
      return `border border-gray-200 hover:shadow-sm
              flex items-center justify-center
              rounded-lg px-10 py-2`;
    case 'dangerous':
      return `border border-red-400 bg-red-400 text-red-900
              hover:text-red-400 hover:bg-transparent
              transition-all transition-gpu
              flex items-center justify-center
              rounded-lg px-10 py-2`;
    case 'small-accent':
      return `bg-gradient-to-r from-indigo-500 to-blue-500 
              border border-blue-600 text-white
              hover:text-blue-600 hover:from-transparent hover:to-transparent
              inline px-4 py-2 rounded-full`;
    default:
      assertUnreachable(style);
  }
};

const Button = React.forwardRef<
  HTMLDivElement,
  AriaButtonProps<'div'> & {
    buttonStyle: ButtonStyle;
  }
>(({ buttonStyle, ...props }, forwardedRef) => {
  let innerRef = useRef<HTMLDivElement>(null);
  const ref = useCombinedRefs(innerRef, forwardedRef);
  let { buttonProps } = useButton({ ...props, elementType: 'div' }, ref);
  let { children } = props;

  return (
    <FocusRing>
      <div
        {...buttonProps}
        className={classNames(
          'appearance-none outline-none',
          classNamesForButtonStyle(
            props.isDisabled ? 'secondary' : buttonStyle,
          ),
          props.isDisabled && 'opacity-60 cursor-not-allowed',
        )}
        ref={ref}
      >
        {children}
        {buttonStyle?.startsWith('small-') && (
          <ArrowRightIcon className="inline ml-3 mb-0.5" />
        )}
      </div>
    </FocusRing>
  );
});

export default Button;
