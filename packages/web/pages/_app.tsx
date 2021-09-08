import React from 'react';
import 'tailwindcss/tailwind.css';
import '../public/global.css';
import { IdProvider } from '@radix-ui/react-id';
import { AuthProvider } from '../lib/contexts/AuthContext';
import { QueryClientProvider } from 'react-query';
import { queryClient } from '../lib/queries';

const App: React.FC<{
  Component: React.FC;
  pageProps: any;
}> = ({ Component, pageProps }) => {
  // Wrap with providers
  return (
    <IdProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </AuthProvider>
    </IdProvider>
  );
};

export default App;
