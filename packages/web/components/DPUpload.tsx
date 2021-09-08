import React from 'react';
import { Field } from '@shopify/react-form';
import FocusRing from './FocusRing';
import FormError from './FormError';

const DPUpload: React.FC<Field<File | null> & { id?: string }> = ({
  error,
  allErrors,
  value,
  defaultValue,
  setError,
  reset,
  runValidation,
  newDefaultValue,
  dirty,
  touched,
  onChange,
}) => (
  <div>
    <div className="border border-gray-100 p-4 rounded-lg">
      <FocusRing>
        <input
          className="outline-none"
          onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
          type="file"
          accept="image/*"
          multiple={false}
        />
      </FocusRing>

      <div className="bg-gray-100 h-px my-4" />
      <p className="text-sm text-gray-500 leading-6">
        Vinsamlegast sendu inn skýra mynd, þar sem andlitið þitt sést vel. Allar
        myndir eru yfirfarnar af stjórn Ökonomíu.
      </p>
    </div>
    {error && <FormError>{error}</FormError>}
  </div>
);

export default DPUpload;
