import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const toData = (item) => {
  try {
    return JSON.parse(item);
  } catch (e) {
    return item;
  }
};

export default (props) => {
  const {
    url,
    listeners = [],
    deps = [],

    debug = false,

    ...rest
  } = props;

  const [context, setContext] = useState({
    connected: false,
  });

  useEffect(() => {
    const client = new Client(rest);

    client.webSocketFactory = () => (url.startsWith('http') ? new SockJS(url) : new WebSocket(url));

    if (debug) {
      client.debug = (text) => {
        console.log(text);
      };
    }

    client.onConnect = () => {
      const subscriptions = listeners.map((item) => {
        const {
          name,
          callback = (data) => {
            console.log(data);
          },
          headers,
        } = item;

        return client.subscribe(
          name,
          (message) => {
            const data = toData(message.body);
            callback(data);
          },
          headers,
        );
      });

      setContext({
        connected: true,
        client,
        subscriptions,
      });
    };

    client.onStompError = (frame) => {
      console.log(frame);
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, deps);

  return context;
};
