import { User } from 'firebase/auth';
import React from 'react';
import { useEffect, useState } from 'react';
import { getAuth } from '../firebase';

const AuthContext = React.createContext<User | null>(null);
export const useUser = () => React.useContext(AuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    return auth.onAuthStateChanged((user) => {
      setUser(user);

      (async () => {
        if (!user) return;
        const token = await user.getIdToken();
        (window as any).fbtoken = token;
        (window as any).signout = () => {
          auth.signOut();
        };
      })();
    });
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
