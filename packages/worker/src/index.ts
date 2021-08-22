import { Router } from 'itty-router';
import { Request as CloudflareRequest } from 'miniflare';
import { fetchAsset } from './lib/assets';
import { UserStore } from './lib/kv';
import generatePass from './lib/pass';
import { log } from './lib/sentry';
import { allUsers, createUser } from './routes/user';

const router = Router();

export type AugmentedEnvironment = Env & {
  kv: { users: ReturnType<typeof UserStore> };
};

// User routes
router.get('/users', allUsers);
router.post('/user/create', createUser);

// Test routes
router.get(
  '/zip',
  async (request: CloudflareRequest, env: AugmentedEnvironment) => {
    if (!env.PASSBOOK_CERT || !env.PASSBOOK_PRIVATE_KEY)
      throw new Error(
        'PASSBOOK_CERT and PASSBOOK_PRIVATE_KEY should be provided as environment variables',
      );

    const template = await fetchAsset('meee.pktemplate', env);
    const zip = await generatePass(
      template,
      {
        organizationName: 'Ökonomía',
        backgroundColor: 'rgb(248,243,243)',
        foregroundColor: 'rgb(3,3,3)',
        logoText: 'Ökonomía',
        // locations: [
        //   {
        //     latitude: 33.947736800000001267108018510043621063232421875,
        //     longitude: -84.143066000000004578396328724920749664306640625,
        //     relevantText: 'Your local Costco',
        //   },
        // ],
        // barcode: {
        //   format: 'PKBarcodeFormatPDF417',
        //   message: '123456789123456789',
        //   messageEncoding: 'iso-8859-1',
        //   altText: '123456789123456789',
        // },
        generic: {
          primaryFields: [
            {
              key: 'member',
              label: 'Nafn',
              value: 'Elín Halla Kjartansdóttir',
              // changeMessage: 'Member name changed to %@.',
            },
          ],
          secondaryFields: [],
          auxiliaryFields: [
            {
              key: 'membershipNumber',
              label: 'Meðlimsnúmer',
              value: '123456789123456789',
              // changeMessage: 'Changed to %@',
            },
            {
              key: 'memberSince',
              label: 'Gildistími',
              value: 'Ágúst 2020 - Júlí 2021',
            },
          ],
          backFields: [
            {
              key: 'info',
              label: 'Afslættir',
              value:
                'Þetta kort veitir þér afslætti á drykkjum á eftirfarandi stöðum: \n • Sæta Svínið - 20% \n • Jólahúsið Akureyri - 20%',
            },
          ],
        },
        serialNumber: '6110757dcaa7dfa0',
        formatVersion: 1,
        description: 'Membership card for Ökonomía',
        passTypeIdentifier: 'pass.skirteini.okonomia.hi.is',
        teamIdentifier: 'L5TEPZ8S7Z',
        barcodes: [
          {
            format: 'PKBarcodeFormatPDF417',
            message: '6110757dcaa70',
            messageEncoding: 'iso-8859-1',
          },
        ],
      },
      env.PASSBOOK_CERT,
      env.PASSBOOK_PRIVATE_KEY,
    );
    return new Response(zip, {
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': 'attachment; filename="okonomia.pkpass"',
      },
    });
  },
);

// Index route
router.get('/', (r) => {
  const cloudflareInfo = (r as CloudflareRequest).cf || { time: new Date() };

  const document = `
    <h3 style="font-family: monospace;">Ökonomía API 🐑</h3>
    <small style="font-family: monospace; margin-bottom: 20px; display: block;"><em>Revision:</em> <strong>${GIT_HASH}</strong></small>

    <details>
      <summary style="font-family: monospace; font-weight: 600; cursor: pointer;">
        CF request info
      </summary>
      <pre style="font-size: 10px;">${JSON.stringify(
        cloudflareInfo,
        undefined,
        2,
      )}</pre>
    </details>
  `;

  return new Response(document, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
});

export default {
  async fetch(req: CloudflareRequest, env: Env) {
    const augmentedEnvironment: AugmentedEnvironment = {
      ...env,
      kv: {
        users: UserStore(env),
      },
    };

    try {
      return await router.handle(req, augmentedEnvironment);
    } catch (e) {
      // log(e as Error, req);
      throw e;
    }
  },
};
