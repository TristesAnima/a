import React from 'react';
import { Badge, Button } from 'antd';
import useChildren from './_hooks/useChildren';

export default (props) => {
  const { badge, ...rest } = useChildren(props);

  if (badge) {
    return (
      <Badge dot status="warning" {...badge}>
        <Button {...rest} />
      </Badge>
    );
  }

  return <Button {...rest} />;
};
