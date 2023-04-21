import React from 'react';
import ConfigProvider from '../_components/ConfigProvider';
import SortableTableHOC from './_components/SortableTableHOC';
import SortableTableDND from './_components/SortableTableDND';
import useNormalizedProps from '../_hooks/useNormalizedProps';

export default (props) => {
  const { header, type = 'react-dnd', ...rest } = useNormalizedProps(props);

  return (
    <ConfigProvider>
      <div style={{ textAlign: 'right' }}>{header}</div>
      {type === 'react-sortable-hoc' && <SortableTableHOC {...rest} />}
      {type === 'react-dnd' && <SortableTableDND {...rest} />}
    </ConfigProvider>
  );
};
