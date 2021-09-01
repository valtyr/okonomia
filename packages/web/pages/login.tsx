import { NextPage } from 'next';
import React from 'react';
import Button from '../components/Button';
import { CookieIcon } from '@radix-ui/react-icons';
import Input from '../components/Input';
import useSignupForm from '../lib/forms/signup';
import Label from '../components/Label';
import { useField, useForm } from '@shopify/react-form';
import { requiredField, validEmail } from '../lib/forms/validation';
import {
  getAuth,
  fetchSignInMethodsForEmail,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  useSignInWithEmailLink,
} from '../lib/firebase';
import { useState } from 'react';
import { useRouter } from 'next/dist/client/router';

const Signup: NextPage = () => {
  const [linkSent, setLinkSent] = useState(false);
  const router = useRouter();

  const { isSigningIn, signInError } = useSignInWithEmailLink();

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

      setLinkSent(true);

      return { status: 'success' };
    },
  });

  if (isSigningIn) {
    return <progress />;
  }

  if (signInError) {
    return <div>{signInError}</div>;
  }

  if (linkSent) {
    return <div>Link sent</div>;
  }

  return (
    <div className="min-h-screen max-w-sm mx-auto space-y-4 flex flex-col justify-center pb-24">
      <div className="flex flex-col space-y-10">
        <div className="flex flex-col items-center">
          <div className="text-[70px]">🐑</div>
          <div className="font-semibold text-xl font-serif">Ökonomía</div>
          <div className="text-gray-400 text-sm">Innskráning</div>
        </div>
        <hr className="mx-20" />

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
      </div>

      <Button
        buttonStyle="accent"
        isDisabled={submitting}
        onPress={() => submit()}
      >
        Skrá inn
      </Button>

      <div className="leading-6 text-center text-xs text-gray-400 pt-4">
        Þú færð tölvupóst með hlekk til að skrá þig inn. <br />
        Við notum kökur
        <CookieIcon className="ml-1 inline" />
      </div>
    </div>
  );
};

export default Signup;
