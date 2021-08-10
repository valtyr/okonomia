import { Router } from 'itty-router';
import { Request as CloudflareRequest } from 'miniflare';
import { UserStore } from './lib/kv';
import generatePass from './lib/pass';
import { allUsers, createUser } from './routes/user';

const router = Router();

export type AugmentedEnvironment = Env & {
  kv: { users: ReturnType<typeof UserStore> };
  PASSBOOK_CERT: string;
  PASSBOOK_PRIVATE_KEY: string;
};

// User routes
router.get('/users', allUsers);
router.post('/user/create', createUser);

// Test routes
router.get('/zip', async (request: Request, env: AugmentedEnvironment) => {
  const zip = await generatePass(
    'https://github.com/valtyr/okonomia/blob/master/templates/costco.pkpass?raw=true',
    {
      organizationName: 'Ökonomía',
      backgroundColor: 'rgb(248,243,243)',
      foregroundColor: 'rgb(3,3,3)',
      logoText: 'Ökonomía',
      locations: [
        {
          latitude: 33.947736800000001267108018510043621063232421875,
          longitude: -84.143066000000004578396328724920749664306640625,
          relevantText: 'Your local Costco',
        },
      ],
      barcode: {
        format: 'PKBarcodeFormatPDF417',
        message: '123456789123456789',
        messageEncoding: 'iso-8859-1',
        altText: '123456789123456789',
      },
      generic: {
        primaryFields: [
          {
            key: 'member',
            label: 'MEMBER NAME',
            value: 'Johnny Appleseed',
            // changeMessage: 'Member name changed to %@.',
          },
        ],
        secondaryFields: [
          {
            key: 'membershipNumber',
            label: 'MEMBERSHIP #',
            value: '123456789123456789',
            // changeMessage: 'Changed to %@',
          },
        ],
        auxiliaryFields: [
          {
            key: 'group',
            label: 'BICE RESTAURANT GROUP',
            value: 'W00182',
            changeMessage: 'Changed to %@',
          },
          {
            key: 'memberSince',
            label: 'MEMBER SINCE',
            value: '10/2007',
            changeMessage: 'Changed to %@',
            textAlignment: 'PKTextAlignmentRight',
          },
        ],
        backFields: [
          {
            key: 'info',
            label: 'COSTCO',
            value:
              "We invite you to see for yourself why 50 million people are Costco members. You'll appreciate the quality and value of the products you find at our warehouses. That's our promise to you. If we fail to deliver on that promise, we'll refund your money. It's that simple.",
          },
          {
            key: 'passSourceUpdate',
            label: 'update this pass',
            value:
              'https://www.passsource.com/pass/register.php?hashedSerialNumber=eNortjIysVIKtUj1MbPIL_FL1ffNLgzxNYssrXB3tLVVsgZcMJveCYY,&',
          },
          {
            key: 'passSourceSignature',
            label: 'created by PassSource',
            value:
              'For more information or to create your own passes, visit: https://www.passsource.com\nThis pass may contain trademarks that are not licensed or affiliated with PassSource.  The trademarks are owned by their respective entities.  This pass is for personal convenience and is not guaranteed to function or be usable at a merchant.  Please direct any concerns or questions to support+passback@kudit.com.',
          },
        ],
      },
      serialNumber: '6110757dcaa70',
      formatVersion: 1,
      description: 'Membership card for Ökonomía',
      passTypeIdentifier: 'pass.skirteini.okonomia.hi.is',
      teamIdentifier: 'L5TEPZ8S7Z',
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
});

// Index route
router.get('/', r => {
  const cloudflareInfo = (r as CloudflareRequest).cf || { time: new Date() };

  const document = `
    <h3 style="font-family: monospace;">Ökonomía API 🐑</h3>
    <pre style="font-size: 10px;">${JSON.stringify(
      cloudflareInfo,
      undefined,
      2,
    )}</pre>
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
      console.log(e);
    }
  },
};
