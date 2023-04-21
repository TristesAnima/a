import { useState } from 'react';

export default () => {
  const [readOnly, setReadOnly] = useState(true);

  return {
    autoComplete: 'off',
    readOnly,
    onFocus: () => {
      if (readOnly) {
        setReadOnly(false);
      }
    },
  };
};
