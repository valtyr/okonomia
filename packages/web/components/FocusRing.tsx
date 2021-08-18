import { FocusRing as AriaFR } from '@react-aria/focus';
import React from 'react';

const FocusRing: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => (
  <AriaFR within focusRingClass="ring-2 ring-blue-400 ring-offset-2">
    {children}
  </AriaFR>
);

export default FocusRing;
