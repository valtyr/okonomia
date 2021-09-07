import { useField, useForm } from '@shopify/react-form';
import {
  max4MBFile,
  requiredField,
  validEmail,
  validKennitala,
} from './validation';
import { getAuth, sendSignInLinkToEmail } from '../firebase';
import { YearValue } from '../../components/YearInput';
import { useUploadDPMutation } from '../uploadDP';
import { useCreateUserMutation } from '../queries';
import { useRouter } from 'next/dist/client/router';

import kt from 'kennitala';

const useSignupForm = () => {
  const router = useRouter();
  const uploadDPMutation = useUploadDPMutation();
  const createUserMutation = useCreateUserMutation();

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
      kennitala: useField({
        value: '',
        validates: [requiredField, validKennitala],
      }),
      dp: useField<File | null>({
        value: null,
        validates: [requiredField, max4MBFile],
      }),
      isInEconomics: useField(true),
      year: useField<YearValue>(YearValue.First),
    },
    onSubmit: async ({
      name,
      email,
      phone,
      isInEconomics,
      kennitala,
      year,
      dp,
    }) => {
      // const auth = getAuth();

      // Upload image
      let imageKey: string;
      try {
        const res = await uploadDPMutation.mutateAsync(dp!);
        imageKey = res.id;
      } catch {
        return {
          status: 'fail',
          errors: [
            {
              field: ['dp'],
              message: 'Það kom upp villa við að hlaða upp myndinni',
            },
          ],
        };
      }

      // Create user in Worker
      await createUserMutation.mutateAsync({
        name,
        email,
        phone,
        kennitala: kt.clean(kennitala),
        isInEconomics,
        year,
        imageKey,
      });

      router.push(
        `/signup/success${isInEconomics && year !== 'first' ? '?a' : ''}`,
      );

      return { status: 'success' };
    },
  });
};

export default useSignupForm;
