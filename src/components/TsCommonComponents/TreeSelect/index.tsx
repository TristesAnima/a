import { useMemo } from 'react';
import type { TreeSelectProps } from 'antd';
import { TreeSelect } from 'antd';

type Props = TreeSelectProps & {
  treeNodeKey?: string;
  titleKey?: string;
  childrenKey?: string;
}

function Index(props: Props) {
  const { treeNodeKey = 'key', titleKey = 'title', childrenKey = 'children', treeData, ...rest } = props;

  const formatTreeData = (data: any[]): any[] => data.map((item) => {
    const { [childrenKey]: children, [treeNodeKey]: key, [titleKey]: title, ...restItem } = item;
    return {
      ...restItem,
      key,
      title,
      children: children && formatTreeData(children),
    };
  });

  const newTreeData = useMemo(() => formatTreeData(treeData || []), [treeData]);

  return (
    <TreeSelect
      {...rest}
      treeData={newTreeData}
    />
  );
}

export default Index;
