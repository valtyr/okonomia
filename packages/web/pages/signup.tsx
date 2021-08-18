import { NextPage } from 'next';
import React from 'react';
import Button from '../components/Button';

const Signup: NextPage = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <h1>Skráning í Ökonomíu 2021-2022</h1>

      <Button buttonStyle="secondary" onPress={() => alert('hey!')}>
        Skráðu þig
      </Button>
    </div>
  );
};

export default Signup;
