import { parseJwt, importKey, JsonWebKeyset } from '@cfworker/jwt';
import { parse as parseCookie } from 'worktop/cookie';
import { AugmentedEnvironment } from '..';
import { UserStore } from './kv';

const GOOGLE_JWK_URL =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const AUDIENCE = 'okonomia-dolly';
const ISSUER = `https://securetoken.google.com/${AUDIENCE}`;
const DAYS = 60 * 60 * 24;

const getJWKs = async (): Promise<JsonWebKeyset> => {
  const res = await fetch(GOOGLE_JWK_URL, {
    cf: {
      cacheTtl: 5 * DAYS,
      cacheEverything: true,
    },
  });
  return await res.json();
};

export const validateSession = async (
  request: Request,
  env: AugmentedEnvironment,
  needsAdmin = true,
) => {
  // Request JWKs from google and import them
  const jwks = await getJWKs();
  await Promise.all(jwks.keys.map((jwk) => importKey(ISSUER, jwk)));

  // Attempt to find token in headers + cookie
  const cookie = parseCookie(request.headers.get('Cookie') || '');
  const token = request.headers.get('Authorization') || cookie['token'];
  if (!token) throw 'Token header missing';

  // Parse the JWT
  const result = await parseJwt(token, ISSUER, AUDIENCE);
  if (!result.valid) {
    throw result.reason;
  }

  const email: string | undefined = (result.payload as any).email;
  if (needsAdmin) {
    if (email == null) throw 'No email in payload';
    if (!(await UserStore(env).checkIsAdmin(email)))
      throw "You don't have the necessary privileges";
  }

  return result.payload;
};
