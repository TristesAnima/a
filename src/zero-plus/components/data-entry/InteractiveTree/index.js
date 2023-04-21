import React from 'react';
import SelectableTree from './_components/SelectableTree';
import CheckableTree from './_components/CheckableTree';

export default (props) => {
  const {
    checkable,

    normalizeValue = ({ value }) => {
      const newValue = value?.map((item) => item && `${item}`)?.filter((item) => item);

      return newValue;
    },
    value,
    ...rest
  } = props;

  const newValue = normalizeValue({
    value,
  });

  if (checkable) {
    return <CheckableTree {...rest} value={newValue} />;
  }
  return <SelectableTree {...rest} value={newValue} />;
};
