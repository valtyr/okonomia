import { AugmentedEnvironment } from '..';

interface HandlerResponse {
  /**
   * Data will be treated as JSON
   */
  data?: any;

  /**
   * Optional dynamic headers
   */
  headers?: { [_: string]: string };

  /**
   * Optional status (200 is default)
   */
  status?: number;
}

export type APIRequestHandler = (
  request: Request,
  env: AugmentedEnvironment,
) => Promise<Response>;

export const APIResponse = (response: HandlerResponse) => {
  const data = response.data ? JSON.stringify(response.data) : '';
  return new Response(data, {
    headers: {
      'Content-Type': 'application/json',
      ...response.headers,
    },
  });
};

export const API400 = () =>
  new Response('400 Bad Request', {
    status: 400,
    statusText: 'Bad Request',
  });

export const API404 = () =>
  new Response('404 Not Found', {
    status: 404,
    statusText: 'Not Found',
  });
