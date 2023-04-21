import { useEffect, useState, useMemo } from 'react';
import { immerLoop } from '../../../utils/loop';

export default (props) => {
  const {
    defaultExpandAll = true,
    treeNodes,
    normalizeTreeNode = (item) => {
      return {
        key: item.key || `${item.id}`,
        title: item.title,
        children: item.children,
      };
    },
    ...rest
  } = props;

  const renderTreeNodes = (nodes) => {
    if (nodes?.length) {
      return immerLoop({
        array: nodes,
        callback: ({ item, array, index }) => {
          const data = {
            ...item,
          };
          const treeNode = normalizeTreeNode(data, { array, index });
          if (treeNode) {
            array[index] = {
              ...treeNode,
              data,
            };
          } else {
            array.splice(index, 1);
            return 'continue';
          }
        },
      });
    }
    return [];
  };

  const memoizedValue = useMemo(() => {
    if (defaultExpandAll) {
      return {
        defaultExpandAll,
        key: `key_${Date.now()}`,
      };
    }
    return null;
  }, [treeNodes]);

  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    if (treeNodes) {
      const newTreeData = renderTreeNodes(treeNodes);
      setTreeData(newTreeData);
    }
  }, [treeNodes]);

  return {
    blockNode: true,

    treeData,
    ...memoizedValue,
    ...rest,

    onTreeChange: (newTreeData) => {
      setTreeData(newTreeData);
    },
  };
};
