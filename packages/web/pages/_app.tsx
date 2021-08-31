import React from 'react';
import 'tailwindcss/tailwind.css';
import '../public/global.css';
import { IdProvider } from '@radix-ui/react-id';

const App: React.FC<{
  Component: React.FC;
  pageProps: any;
}> = ({ Component, pageProps }) => {
  return (
    <IdProvider>
      <Component {...pageProps} />
    </IdProvider>
  );
};

export default App;
