import { useMutation } from 'react-query';

export const uploadDP = async (
  file: File,
): Promise<{
  id: string;
}> => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/methods/dp', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw Error("Couldn't upload image");

  const data = await res.json();
  return data;
};

export const useUploadDPMutation = () => useMutation(uploadDP);
