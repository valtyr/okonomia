import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
export {
  getAuth,
  sendSignInLinkToEmail,
  signInWithPhoneNumber,
} from 'firebase/auth';

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

  getAuth().languageCode = 'is';
}
