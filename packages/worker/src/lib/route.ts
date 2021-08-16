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
