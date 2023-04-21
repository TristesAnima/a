import { useState } from 'react';
import { history } from '@umijs/max';
import usePubSubListener from './usePubSubListener';

export default () => {
  const [count, setCount] = useState(0);

  const refresh = () => {
    history.replace({
      query: {
        key: `${Date.now()}`,
      },
    });
    setCount((prevCount) => {
      return prevCount + 1;
    });
  };

  usePubSubListener({
    name: 'manualRefresh()',
    callback: refresh,
  });

  return [`${count}`, refresh];
};
