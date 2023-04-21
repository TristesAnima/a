import React from 'react';

export default (props) => {
  const { children } = props;

  return <div dangerouslySetInnerHTML={{ __html: children }} />;
};
