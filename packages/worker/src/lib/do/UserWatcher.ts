import { AugmentedEnvironment } from '../..';

async function handleErrors(request: Request, func: () => Promise<Response>) {
  try {
    return await func();
  } catch (err) {
    if (request.headers.get('Upgrade') == 'websocket') {
      // Annoyingly, if we return an HTTP error in response to a WebSocket request, Chrome devtools
      // won't show us the response body! So... let's send a WebSocket response with an error
      // frame instead.
      const pair = new WebSocketPair();
      pair[1].accept();
      pair[1].send(JSON.stringify({ error: err.stack }));
      pair[1].close(1011, 'Uncaught exception during session setup');
      return new Response(null, { status: 101, webSocket: pair[0] });
    } else {
      return new Response(err.stack, { status: 500 });
    }
  }
}

class UserWatcher {
  env: AugmentedEnvironment;
  sockets: WebSocket[];

  constructor(controller: DurableObjectState, env: AugmentedEnvironment) {
    this.env = env;

    // We will put the WebSocket objects for each client, along with some metadata, into
    // `sessions`.
    this.sockets = [];
  }

  // The system will call fetch() whenever an HTTP request is sent to this Object. Such requests
  // can only be sent from other Worker code, such as the code above; these requests don't come
  // directly from the internet. In the future, we will support other formats than HTTP for these
  // communications, but we started with HTTP for its familiarity.
  async fetch(request: Request) {
    return await handleErrors(request, async () => {
      const url = new URL(request.url);

      switch (url.pathname) {
        case '/websocket': {
          // The request is to `/api/room/<name>/websocket`. A client is trying to establish a new
          // WebSocket session.
          if (request.headers.get('Upgrade') != 'websocket') {
            return new Response('expected websocket', { status: 400 });
          }

          // To accept the WebSocket request, we create a WebSocketPair (which is like a socketpair,
          // i.e. two WebSockets that talk to each other), we return one end of the pair in the
          // response, and we operate on the other end. Note that this API is not part of the
          // Fetch API standard; unfortunately, the Fetch API / Service Workers specs do not define
          // any way to act as a WebSocket server today.
          const pair = new WebSocketPair();

          // We're going to take pair[1] as our end, and return pair[0] to the client.
          await this.handleSession(pair[1]);

          // Now we return the other end of the pair to the client.
          return new Response(null, { status: 101, webSocket: pair[0] });
        }

        case '/update': {
          this.broadcast('update');
          console.log('UPDATE', this.sockets.length);
          return new Response(null, { status: 200 });
        }

        default:
          return new Response('Not found', { status: 404 });
      }
    });
  }

  // handleSession() implements our WebSocket-based chat protocol.
  async handleSession(webSocket: WebSocket) {
    // Accept our end of the WebSocket. This tells the runtime that we'll be terminating the
    // WebSocket in JavaScript, not sending it elsewhere.
    webSocket.accept();

    console.log('WS ACCEPTED');

    this.sockets.push(webSocket);

    console.log('WS PUSHED');
    console.log(webSocket);

    // On "close" and "error" events, remove the WebSocket from the sessions list and broadcast
    // a quit message.
    const closeOrErrorHandler = () => {
      this.sockets = this.sockets.filter((s) => s !== webSocket);
    };
    webSocket.addEventListener('close', closeOrErrorHandler);
    webSocket.addEventListener('error', closeOrErrorHandler);
  }

  // broadcast() broadcasts a message to all clients.
  broadcast(message: string | { [_x: string]: unknown }) {
    // Apply JSON if we weren't given a string to start with.

    const preparedMessage =
      typeof message !== 'string' ? JSON.stringify(message) : message;

    // Iterate over all the sessions sending them messages.
    this.sockets = this.sockets.filter((socket) => {
      try {
        socket.send(preparedMessage);
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    });
  }
}

export default UserWatcher;
