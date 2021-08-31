import React from 'react';

const FormError: React.FC = ({ children }) => (
  <div className="mt-1 text-sm text-red-400">{children}</div>
);

export default FormError;
