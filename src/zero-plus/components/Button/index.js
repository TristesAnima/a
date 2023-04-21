import React from 'react';
import { Popconfirm } from 'antd';
import { useDebounceFn } from 'ahooks';
import ClassicButton from './_components/ClassicButton';

export default (props) => {
  const {
    popconfirm,

    onClick = () => {
      // Override
    },

    debounceOptions,

    ...rest
  } = props;

  const { run } = useDebounceFn(onClick, {
    wait: 1000,
    ...debounceOptions,
  });

  if (popconfirm) {
    return (
      <Popconfirm {...popconfirm} onConfirm={run}>
        <ClassicButton {...rest} />
      </Popconfirm>
    );
  }

  return <ClassicButton {...rest} onClick={run} />;
};
