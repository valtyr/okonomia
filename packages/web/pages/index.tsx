import Head from 'next/head';
import { useUser } from '../lib/contexts/AuthContext';

export default function Home() {
  const user = useUser();

  return (
    <div className="bg-red-200">
      <Head>
        <title>Ökonomia</title>
      </Head>

      {user && user.email}
    </div>
  );
}
