import { NextPage } from 'next';
import React, { useRef } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import useSignupForm from '../lib/forms/signup';
import Label from '../components/Label';
import DPUpload from '../components/DPUpload';
import Checkbox from '../components/Checkbox';
import YearInput from '../components/YearInput';
import { useCallback } from 'react';
import Head from 'next/head';

const Signup: NextPage = () => {
  const {
    fields: { email, isInEconomics, name, phone, kennitala, dp, year },
    submit,
    submitting,
  } = useSignupForm();

  const formRef = useRef<HTMLDivElement>(null);

  const scrollFormIntoView = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <>
      <Head>
        <title>Ökonomía - Skráning</title>
      </Head>

      <div className="min-h-screen w-screen bg-gray-100">
        <div className="max-w-5xl mx-auto space-y-4 p-4">
          <div className="sm:grid sm:grid-cols-2 sm:gap-10">
            <div className="py-9 text-sm space-y-4 px-2">
              <h1 className="text-4xl font-hero font-extrabold text-gray-500 leading-[1.3] pb-2">
                Velkomin í<br />
                <div className="inline-block bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
                  Ökonomíu
                </div>
              </h1>
              <p className="sm:hidden pt-2 pb-6">
                <Button onPress={scrollFormIntoView} buttonStyle="small-accent">
                  Skráning
                </Button>
              </p>

              <p>Ökonomía er félag hagfræðinema við Háskóla Íslands.</p>
              <p>
                Stjórnin er búin að skipuleggja stappfulla dagskrá fyrir
                veturinn og Dollý getur ekki beðið eftir því að djamma með
                ykkur.
              </p>

              <p>Með því að skrá þig í Ökonomíu færð þú:</p>
              <ul className="list-disc text-gray-300 pl-8 space-y-1">
                <li>
                  <span className="text-black">
                    Forgang í stórskemmtilegar{' '}
                    <span className="font-semibold text-blue-700">
                      vísindaferðir
                    </span>
                  </span>
                </li>
                <li>
                  <span className="text-black">Frítt inn á minni viðburði</span>
                </li>
                <li>
                  <span className="text-black">
                    Afslátt af{' '}
                    <span className="font-semibold text-blue-700">
                      árshátíð
                    </span>{' '}
                    og skíðaferð
                  </span>
                </li>
                <li>
                  <span className="text-black">Félagsskírteini í símann</span>
                </li>
                <li>
                  <span className="text-black">
                    Frábær{' '}
                    <span className="font-semibold text-blue-700">
                      afsláttarkjör
                    </span>{' '}
                    hjá hinum ýmsu stofununum
                  </span>
                </li>
                <li>
                  <span className="text-black">
                    Kosninga- og framboðsrétt á aðalfundi Ökonomíu
                  </span>
                </li>
                <li>
                  <span className="text-black">
                    Nóg af{' '}
                    <span className="font-semibold text-blue-700">áfengi</span>{' '}
                    🍻
                  </span>
                </li>
              </ul>
              <p>Við hlökkum til að sjá þig í vetur!</p>

              <p className="text-xs max-w-[280px] text-gray-400 pt-2">
                Allir nemendur HÍ eru velkomnir í Ökonomíu óháð því hvort þeir
                séu í Hagfræði.
              </p>
            </div>
            <div
              className="flex flex-col space-y-3 p-5 bg-white shadow-xl rounded-xl"
              ref={formRef}
            >
              <h2 className="font-hero text-lg text-gray-500 pb-4">
                Skráðu þig í{' '}
                <span className="font-extrabold text-black">Ökonomíu</span>
              </h2>

              <Label label="Nafn" htmlFor="name">
                <Input id="name" className="w-full" {...name} />
              </Label>

              <Label label="Netfang" htmlFor="email">
                <Input
                  id="email"
                  inputMode="email"
                  type="email"
                  className="w-full"
                  {...email}
                />
              </Label>

              <Label label="Símanúmer" htmlFor="phone">
                <Input
                  id="phone"
                  inputMode="tel"
                  type="phone"
                  className="w-full"
                  {...phone}
                />
              </Label>

              <Label label="Kennitala" htmlFor="kennitala">
                <Input
                  id="kennitala"
                  inputMode="numeric"
                  className="w-full"
                  {...kennitala}
                />
              </Label>

              <Label label="Mynd á skírteini" htmlFor="dp">
                <DPUpload id="dp" {...dp} />
              </Label>

              <div>
                <hr className="my-5 opacity-60" />
              </div>

              <Label label="Ert þú í hagfræði?" htmlFor="isInEconomics">
                <Checkbox
                  id="isInEconomics"
                  checked={isInEconomics.value}
                  onChange={isInEconomics.onChange}
                  label="Jebbs"
                  className="mt-1"
                />
              </Label>

              {isInEconomics.value && (
                <Label label="Á hvaða ári ertu?" htmlFor="year">
                  <YearInput
                    id="year"
                    value={year.value}
                    onChange={year.onChange}
                  />
                </Label>
              )}

              <div className="pt-8">
                <Button
                  buttonStyle="accent"
                  isDisabled={submitting}
                  onPress={() => submit()}
                >
                  Áfram
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
