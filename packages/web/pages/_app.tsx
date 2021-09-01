import React from 'react';
import 'tailwindcss/tailwind.css';
import '../public/global.css';
import { IdProvider } from '@radix-ui/react-id';
import { AuthProvider } from '../lib/contexts/AuthContext';

const App: React.FC<{
  Component: React.FC;
  pageProps: any;
}> = ({ Component, pageProps }) => {
  return (
    <IdProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </IdProvider>
  );
};

export default App;
