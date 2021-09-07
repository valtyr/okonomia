import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import React from 'react';
import classNames from '../lib/classNames';
import FocusRing from './FocusRing';

const Checkbox: React.FC<{
  id?: string;
  checked?: boolean | 'indeterminate';
  onChange?: (checked: boolean) => void;
  label?: string;
  className?: string;
}> = ({ id, checked, onChange, label, className }) => (
  <div
    className={classNames('flex flex-row space-x-2 items-center', className)}
  >
    <FocusRing>
      <RadixCheckbox.Root
        onCheckedChange={(state) => onChange && onChange(state === true)}
        checked={checked}
        id={id}
        tabIndex={0}
        className="w-6 h-6 bg-gray-200 rounded-md flex items-center justify-center"
        aria-label={label}
      >
        <RadixCheckbox.Indicator>
          {checked === true && <CheckIcon />}
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
    </FocusRing>
    <div className="text-sm">{label}</div>
  </div>
);

export default Checkbox;
