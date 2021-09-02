import React from 'react';
import * as RadixLabel from '@radix-ui/react-label';
import classNames from '../lib/classNames';

const Label: React.FC<{ label: string; htmlFor: string; className?: string }> =
  ({ label, htmlFor, className, children }) => (
    <RadixLabel.Root htmlFor={htmlFor}>
      <RadixLabel.Label
        className={classNames('text-gray-500 text-sm', className)}
      >
        {label}
      </RadixLabel.Label>
      {children}
    </RadixLabel.Root>
  );

export default Label;
