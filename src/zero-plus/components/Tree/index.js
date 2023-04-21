import React from 'react';
import { Tree } from 'antd';
import Empty from '../../components/Empty';
import useTreeData from './_hooks/useTreeData';
import useDraggable from './_hooks/useDraggable';

const { DirectoryTree } = Tree;

const Index = (props) => {
  const {
    type = 'Tree',

    treeData,

    ...rest
  } = useDraggable(useTreeData(props));

  const Element = type === 'DirectoryTree' ? DirectoryTree : Tree;

  if (treeData.length === 0) {
    return <Empty />;
  }

  return (
    <Element showLine expandAction="doubleClick" {...rest} multiple={false} treeData={treeData} />
  );
};

Object.keys(Tree).forEach((item) => {
  if (item !== 'defaultProps') {
    Index[item] = Tree[item];
  }
});
export default Index;
