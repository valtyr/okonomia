import React from 'react';
import 'tailwindcss/tailwind.css';
import '../public/global.css';

const App: React.FC<{
  Component: React.FC;
  pageProps: any;
}> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default App;
