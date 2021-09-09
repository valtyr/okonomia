import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import classNames from '../../lib/classNames';

const Success: NextPage = () => {
  const router = useRouter();

  const discount = router.query['a'] != null;

  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center bg-gray-100 px-4">
      <h1 className="text-4xl font-hero font-extrabold text-gray-500 leading-[1.3] pb-2">
        <div className="inline-block bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent mb-2">
          Ökonomía
        </div>
      </h1>
      <div className="w-full max-w-sm bg-white p-6 drop-shadow-xl rounded-xl space-y-5 mb-30">
        <h1 className="font-hero text-lg">Takk fyrir að skrá þig</h1>
        <p>
          Til að staðfesta skráninguna þarft þú að leggja félagsgjald inn á
          reikning Ökonomíu.
        </p>

        <div className="flex flex-row space-x-4 text-center py-4 px-5">
          <div className="flex-1">
            {!discount && (
              <p className="uppercase text-xs font-semibold text-gray-500">
                Verð:
              </p>
            )}
            <span className="font-semibold">6500 kr</span>
            {discount && (
              <div className="text-xs text-gray-400">
                {' '}
                ef þú varst ekki skráð/ur í fyrra
              </div>
            )}
          </div>

          {discount && (
            <div className="flex-1">
              <p>
                <span className="font-semibold">5500 kr</span>
              </p>
              <div className="text-xs text-gray-400">
                {' '}
                ef þú skráðir þig í fyrra
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-[140px,1fr] gap-2 bg-gray-100 p-4 my-4 rounded-lg">
          <div className="text-gray-500">Kennitala: </div>
          <pre>481288-3049</pre>
          <div className="text-gray-500">Reikningsnúmer: </div>
          <pre>0311-26-003991</pre>
        </div>

        <p className="text-center text-sm px-4 py-3 text-gray-400">
          Stjórn Ökonomíu mun staðfesta greiðsluna þína og láta þig vita þegar
          skírteinin eru tilbúin.
        </p>
      </div>
    </div>
  );
};

export default Success;
