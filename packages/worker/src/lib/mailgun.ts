import { AugmentedEnvironment } from '..';
import { User } from './schema';

export const sendPass = async (user: User, env: AugmentedEnvironment) => {
  if (!env.MAILGUN_API_KEY) throw new Error('Mailgun API key needed');

  const basic = btoa(`api:${env.MAILGUN_API_KEY}`);

  const data = new FormData();
  data.append('from', 'Ökonomía <postmaster@mg.okonomia.club>');
  data.append('to', `${user.name} <${user.email}>`);
  data.append('subject', 'Skírteinið þitt - Ökonomia');
  data.append('template', 'skirteini');
  data.append(
    'h:X-Mailgun-Variables',
    JSON.stringify({
      name: user.name,
      passUrl: `https://okonomia.club/api/user/pass/${user.id}`,
    }),
  );

  await fetch('https://api.eu.mailgun.net/v3/mg.okonomia.club/messages', {
    body: data,
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
    },
  });
};
