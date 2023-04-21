import React from 'react';
import CompatibleUpload from '../_components/CompatibleUpload';
import useBeforeUpload from './_hooks/useBeforeUpload';

export default (props) => {
  const newProps = useBeforeUpload(props);

  return <CompatibleUpload {...newProps} />;
};
