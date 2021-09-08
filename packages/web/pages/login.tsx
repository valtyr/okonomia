import { NextPage } from 'next';
import React from 'react';
import Button from '../components/Button';
import {
  CheckCircledIcon,
  CookieIcon,
  CrossCircledIcon,
  EnvelopeClosedIcon,
  ExclamationTriangleIcon,
  GearIcon,
  UpdateIcon,
} from '@radix-ui/react-icons';
import Input from '../components/Input';
import Label from '../components/Label';
import { useField, useForm } from '@shopify/react-form';
import { requiredField, validEmail } from '../lib/forms/validation';
import {
  getAuth,
  fetchSignInMethodsForEmail,
  sendSignInLinkToEmail,
  useSignInWithEmailLink,
} from '../lib/firebase';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Head from 'next/head';

const variants = {
  enter: {
    x: 200,
    opacity: 0,
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: {
    zIndex: 0,
    x: -200,
    opacity: 0,
  },
};

const StepWrapper: React.FC<{ stepKey: string }> = ({ children, stepKey }) => (
  <motion.div
    key={stepKey}
    variants={variants}
    initial="enter"
    animate="center"
    exit="exit"
    transition={{ type: 'spring', damping: 20 }}
  >
    {children}
  </motion.div>
);

const StepOne: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const {
    fields: { email },
    submitting,
    submit,
  } = useForm({
    fields: {
      email: useField({
        value: '',
        validates: [requiredField, validEmail],
      }),
    },
    onSubmit: async ({ email }) => {
      const auth = getAuth();

      try {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length === 0)
          return {
            status: 'fail',
            errors: [
              {
                field: ['email'],
                message: 'Það fannst enginn notandi með þetta netfang',
              },
            ],
          };

        await sendSignInLinkToEmail(auth, email, {
          handleCodeInApp: true,
          url: `${location.protocol}//${location.host}/login?email=${email}`,
        });
      } catch (e) {
        console.error(e);
        return {
          status: 'fail',
          errors: [
            {
              message: e.toString(),
            },
          ],
        };
      }

      onComplete();

      return { status: 'success' };
    },
  });

  return (
    <StepWrapper stepKey="stepOne">
      <div className="space-y-5">
        <Label label="Netfang" htmlFor="email">
          <Input
            id="email"
            type="email"
            className="w-full"
            onKeyPress={(e) => {
              if (e.key === 'Enter') submit();
            }}
            {...email}
            placeholder="jon@jonsson.is"
          />
        </Label>

        <Button
          buttonStyle="accent"
          isDisabled={submitting}
          onPress={() => submit()}
        >
          Skrá inn
        </Button>
      </div>

      <div className="leading-6 text-center text-xs text-gray-400 pt-4">
        Þú færð tölvupóst með hlekk til að skrá þig inn. <br />
        Við notum kökur
        <CookieIcon className="ml-1 inline" />
      </div>
    </StepWrapper>
  );
};

const LogIn: NextPage = () => {
  const [linkSent, setLinkSent] = useState(false);
  const { isSigningIn, signInError } = useSignInWithEmailLink();

  const renderSection = () => {
    if (isSigningIn) {
      return (
        <StepWrapper stepKey="isSigningIn">
          <div className="text-center mt-3">
            <UpdateIcon className="inline animate-spin mb-0.5 mr-1" />{' '}
            Innskráning í gangi
          </div>
        </StepWrapper>
      );
    }

    if (signInError) {
      return (
        <StepWrapper stepKey="error">
          <div className="text-center mt-3">
            <ExclamationTriangleIcon className="inline mb-0.5 mr-1 text-red-500" />{' '}
            Villa kom upp
          </div>
          <div className="leading-6 text-center text-xs text-gray-400 pt-4">
            Einhverra hluta vegna gekk ekki að skrá þig inn <br />
            <pre className="text-sm bg-gray-100 p-4 mt-4">{signInError}</pre>
          </div>
        </StepWrapper>
      );
    }

    if (linkSent) {
      return (
        <StepWrapper stepKey="linkSent">
          <div className="text-center mt-3">
            <CheckCircledIcon className="inline mb-0.5 mr-1 text-green-500" />{' '}
            Kíktu í pósthólfið þitt
          </div>

          <div className="leading-6 text-center text-xs text-gray-400 pt-4">
            Við höfum sent þér tölvupóst með hlekk til að skrá þig inn. <br />
            Þegar þú ýtir á hlekkinn verður þér sent áfram inn á síðuna.
          </div>
        </StepWrapper>
      );
    }

    return <StepOne onComplete={() => setLinkSent(true)} />;
  };

  return (
    <>
      <Head>
        <title>Ökonomía – Innskráning</title>
      </Head>
      <div className="min-h-screen max-w-sm mx-auto space-y-4 flex flex-col justify-center">
        <div className="min-h-[500px]">
          <div className="flex flex-col space-y-10">
            <div className="flex flex-col items-center">
              <div className="text-[70px]">🐑</div>
              <div className="font-semibold text-xl font-serif">Ökonomía</div>
              <div className="text-gray-400 text-sm">Innskráning</div>
            </div>
            <hr className="mx-20 pb-5" />
          </div>

          <AnimatePresence initial={false}>{renderSection()}</AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default LogIn;
