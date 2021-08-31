import { parseJwt } from '@cfworker/jwt';

const GOOGLE_CERT_URL =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
// const DAYS = 60 * 60 * 24;

const getCertificate = async () => {
  const res = await fetch(GOOGLE_CERT_URL, {
    cf: {
      // cacheTtl: 5 * DAYS,
      cacheEverything: true,
    },
  });
  return await res.json();
};
