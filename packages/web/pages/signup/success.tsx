import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';

const Success: NextPage = () => {
  const router = useRouter();

  return (
    <div>
      <h1>Næs</h1>
      <p>Nú þarftu að borga...</p>
      <p>{router.query['a'] === 'true' ? 'afsláttur' : 'ekki afsláttur'}</p>
    </div>
  );
};

export default Success;
