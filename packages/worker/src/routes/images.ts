import { nanoid } from 'nanoid';
import { API400, API404, APIRequestHandler, APIResponse } from '../lib/route';

export const imageKey = (id: string, format: 'png' | 'jpg') =>
  `IMAGE:${format}:${id}`;

export const uploadImage: APIRequestHandler = async (request, env) => {
  if (request.headers.get('Content-Type') !== 'image/jpconcat') return API400();

  if (!request.headers.get('X-PNG-Length')) return API400();
  const pngLength = Number(request.headers.get('X-PNG-Length'));

  const body = await request.arrayBuffer();

  if (body.byteLength >= 1000000) return API400();

  const png = body.slice(0, pngLength);
  const jpg = body.slice(pngLength);

  const id = nanoid();
  await env.BUCKET.put(imageKey(id, 'png'), png);
  await env.BUCKET.put(imageKey(id, 'jpg'), jpg);

  return APIResponse({
    data: { id },
  });
};

export const getJpeg: APIRequestHandler = async (request, env) => {
  const id = request.params?.id;
  if (!id) return API400();

  const image = await env.BUCKET.get(imageKey(id, 'jpg'), 'arrayBuffer');
  if (!image) return API404();

  return new Response(image, {
    headers: {
      'Content-Type': 'image/jpeg',
    },
  });
};

export const getPng: APIRequestHandler = async (request, env) => {
  const id = request.params?.id;
  if (!id) return API400();

  const image = await env.BUCKET.get(imageKey(id, 'png'), 'arrayBuffer');
  if (!image) return API404();

  return new Response(image, {
    headers: {
      'Content-Type': 'image/png',
    },
  });
};
