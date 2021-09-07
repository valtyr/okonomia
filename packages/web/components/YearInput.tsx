import { CaretSortIcon } from '@radix-ui/react-icons';
import React from 'react';
import FocusRing from './FocusRing';

export enum YearValue {
  First = 'first',
  Second = 'second',
  Third = 'third',
  Other = 'other',
}

const YearInput: React.FC<{
  id?: string;
  value: YearValue;
  onChange: (value: YearValue) => void;
}> = ({ id, value, onChange }) => (
  <FocusRing>
    <div className="relative rounded-md">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as YearValue)}
        className="w-full appearance-none bg-gray-100 px-2 py-1 rounded-md text-gray-600"
      >
        <option value={YearValue.First}>1. ári</option>
        <option value={YearValue.Second}>2. ári</option>
        <option value={YearValue.Third}>3. ári</option>
        <option value={YearValue.Other}>Annað</option>
      </select>
      <div className="absolute right-1 inset-y-0 flex items-center text-gray-500">
        <CaretSortIcon />
      </div>
    </div>
  </FocusRing>
);

export default YearInput;
