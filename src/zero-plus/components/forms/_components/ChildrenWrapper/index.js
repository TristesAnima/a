import React, { useEffect } from 'react';
import Spin from '../../../../components/Spin';
import useInitialValues from './_hooks/useInitialValues';

export default (props) => {
  const {
    loading,
    initialValues,

    form,
    children,
  } = useInitialValues(props);

  useEffect(() => {
    if (loading === false) {
      setTimeout(() => {
        form.setInitialValues(initialValues);
      }, 0);
    }
  }, [loading, initialValues]);

  if (loading) {
    return <Spin />;
  }

  return children;
};
