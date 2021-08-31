import { useField, useForm } from '@shopify/react-form';
import { requiredField, validEmail } from './validation';
import { getAuth, sendSignInLinkToEmail } from '../firebase';

const useSignupForm = () => {
  return useForm({
    fields: {
      name: useField({
        value: '',
        validates: requiredField,
      }),
      email: useField({
        value: '',
        validates: [requiredField, validEmail],
      }),
      phone: useField({
        value: '',
        validates: [requiredField],
      }),
      isInEconomics: useField(true),
    },
    onSubmit: async ({ name, email }) => {
      const auth = getAuth();

      console.log(`${location.protocol}//${location.host}/emailLink`);
      await sendSignInLinkToEmail(auth, email, {
        handleCodeInApp: true,
        url: `${location.protocol}//${location.host}/emailLink?email=${email}`,
      });
      return { status: 'success' };
    },
  });
};

export default useSignupForm;
