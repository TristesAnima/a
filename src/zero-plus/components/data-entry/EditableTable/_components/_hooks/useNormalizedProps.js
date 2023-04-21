import { immerLoop } from '../../../../../utils/loop';

export default (props) => {
  const {
    expandable,

    rowKey = 'id',

    columns,
    value,
    onChange = () => {
      // Override
    },

    ...rest
  } = props;

  const childrenColumnName = expandable?.childrenColumnName || 'children';

  const newColumns = columns || [];

  const newValue =
    immerLoop({
      array: value,
      callback: ({ item }) => {
        item.key = item.key || `${item[rowKey]}`;

        if (item[childrenColumnName] && item[childrenColumnName].length === 0) {
          item[childrenColumnName] = null;
        }
      },
      childrenKey: childrenColumnName,
    }) || [];

  const dataSource = immerLoop({
    array: newValue,
    callback: ({ item, array, index }) => {
      if (item.data_deleted === true) {
        array.splice(index, 1);
        return 'continue';
      }
      return false;
    },
    childrenKey: childrenColumnName,
  });

  return {
    expandable,
    childrenColumnName,

    rowKey,

    columns: newColumns,
    value: newValue,
    onChange,

    dataSource,

    ...rest,
  };
};
