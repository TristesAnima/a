import { useState, useEffect } from 'react';

export default (props) => {
  const { loading = false, ...rest } = props;

  const [eagerLoading, setEagerLoading] = useState(false);

  useEffect(() => {
    if (loading) {
      setEagerLoading(true);
    } else {
      setTimeout(() => {
        setEagerLoading(false);
      }, 1000);
    }
  }, [loading]);

  return {
    ...rest,
    loading: eagerLoading,
  };
};
