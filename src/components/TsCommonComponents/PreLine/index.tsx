import React from 'react';

interface Props {
  children: string;
}

const Index: React.FC<Props> = (props) => {
  const { children } = props;
  return <span style={{ whiteSpace: 'pre-line' }}>{children}</span>;
};

export default Index;
