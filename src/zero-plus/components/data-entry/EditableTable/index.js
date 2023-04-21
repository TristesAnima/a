import React from 'react';
import ClassicEditableTable from './_components/ClassicEditableTable';
import InlineEditableTable from './_components/InlineEditableTable';

export default (props) => {
  const { type = 'classic', ...rest } = props;

  return type === 'inline' ? <InlineEditableTable {...rest} /> : <ClassicEditableTable {...rest} />;
};
