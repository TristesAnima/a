import React from 'react';
import SortableTable from '../../tables/SortableTable';

export default (props) => {
  const {
    value,
    onChange,

    onTableChange,

    ...rest
  } = props;

  return (
    <SortableTable
      type="react-sortable-hoc"
      bordered
      pagination={false}
      {...rest}
      dataSource={value}
      onSortChange={(newValue) => {
        if (onChange) {
          onChange(newValue);
        }
      }}
      onChange={onTableChange}
    />
  );
};
