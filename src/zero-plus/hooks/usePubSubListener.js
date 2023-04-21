import { useEffect } from 'react';
import PubSub from 'pubsub-js';

export default ({
  name,
  callback = (data) => {
    console.log(data);
  },
  deps = [],
}) => {
  if (name?.includes('undefined')) {
    return;
  }

  useEffect(() => {
    const token = PubSub.subscribe(name, (_, data) => {
      callback(data);
    });
    return () => {
      if (token) {
        PubSub.unsubscribe(token);
      }
    };
  }, deps.concat(name));
};
