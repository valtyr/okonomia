import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
  User,
} from 'firebase/auth';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { useCallback, useEffect, useState } from 'react';
export {
  getAuth,
  sendSignInLinkToEmail,
  signInWithPhoneNumber,
  isSignInWithEmailLink,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';

const TOKEN_COOKIE_KEY = 'token';

if (!getApps().length) {
  initializeApp({
    apiKey: 'AIzaSyDbh2OxC-ZUjkERWCDbe3DuJfD8b_mhbdo',
    authDomain: 'okonomia-dolly.firebaseapp.com',
    projectId: 'okonomia-dolly',
    storageBucket: 'okonomia-dolly.appspot.com',
    messagingSenderId: '434941800297',
    appId: '1:434941800297:web:c86984cb248c7c42b0d7f8',
    measurementId: 'G-FNN1XYDQPS',
  });

  const auth = getAuth();
  auth.languageCode = 'is';

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      destroyCookie(null, TOKEN_COOKIE_KEY);
      return;
    }

    setCookie(null, TOKEN_COOKIE_KEY, await user.getIdToken(), {
      maxAge: 30 * 24 * 60 * 60,
      path: '/users',
    });
  });
}

export const useSignInWithEmailLink = () => {
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInError, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();

    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = router.query['email'];
      if (!email || typeof email !== 'string') {
        setError('No email in url.');
        return;
      }

      (async () => {
        setIsSigningIn(true);
        try {
          const result = await signInWithEmailLink(
            auth,
            email as string,
            window.location.href,
          );
        } catch (e) {
          setError(e.toString());
        }
        router.push('/');
      })();
    }
  }, [router]);

  return { isSigningIn, signInError };
};
