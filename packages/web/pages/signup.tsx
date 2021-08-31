import { NextPage } from 'next';
import React from 'react';
import Button from '../components/Button';
import { CookieIcon } from '@radix-ui/react-icons';
import Input from '../components/Input';
import useSignupForm from '../lib/forms/signup';
import Label from '../components/Label';

const Signup: NextPage = () => {
  const {
    fields: { email, isInEconomics, name, phone },
    submit,
    submitting,
  } = useSignupForm();

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex flex-col space-y-2">
        <Label label="Nafn" htmlFor="name">
          <Input id="name" className="w-full" {...name} placeholder="Nafn" />
        </Label>

        <Label label="Netfang" htmlFor="email">
          <Input
            id="email"
            type="email"
            className="w-full"
            {...email}
            placeholder="Netfang"
          />
        </Label>

        <Label label="Símanúmer" htmlFor="phone">
          <Input
            id="phone"
            type="phone"
            className="w-full"
            {...phone}
            placeholder="Símanúmer"
          />
        </Label>
      </div>

      <Button
        buttonStyle="accent"
        isDisabled={submitting}
        onPress={() => submit()}
      >
        Áfram
      </Button>
    </div>
  );
};

export default Signup;
