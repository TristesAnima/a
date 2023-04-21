import React, { useMemo } from 'react';
import type { TransferProps } from 'antd';
import { Transfer, Tree, Spin } from 'antd';

type Props = TransferProps<any> & {
  loading?: boolean;
  value: string[];
  onChange: (value: string[]) => void;
};

// Customize Table Transfer
const isChecked = (selectedKeys: string[], eventKey: string) =>
  selectedKeys.indexOf(eventKey) !== -1;

const generateTree = (treeNodes: any[] = [], checkedKeys: string[] = []): any[] =>
  treeNodes.map(({ children, ...props }) => ({
    ...props,
    disabled: props.disabled || checkedKeys.includes(props.key),
    children: generateTree(children, checkedKeys),
  }));

function Index(props: Props) {
  const { loading, dataSource, value, onChange, ...restProps } = props;
  const newDataSource = useMemo(() => {
    const transferDataSource: any[] = [];

    function flatten(list: any[] = []) {
      list.forEach((item) => {
        transferDataSource.push(item);
        flatten(item.children);
      });
    }

    flatten(dataSource);

    return transferDataSource;
  }, [dataSource]);

  return (
    <Spin spinning={loading}>
      <Transfer
        {...restProps}
        listStyle={{
          height: 400,
          width: '50%',
        }}
        targetKeys={value}
        dataSource={newDataSource}
        render={(item) => item.title}
        showSelectAll={false}
      >
        {({ direction, onItemSelect, selectedKeys }) => {
          if (direction === 'left') {
            const checkedKeys = [...selectedKeys, ...value];
            return (
              <Tree
                blockNode
                checkable
                checkStrictly
                checkedKeys={checkedKeys}
                treeData={generateTree(dataSource, value)}
                titleRender={(node) => {
                  const { title } = node as { title: string };
                  return title;
                }}
                onCheck={(_, { node: { key } }) => {
                  onItemSelect(key, !isChecked(checkedKeys, key));
                }}
                onSelect={(_, { node: { key } }) => {
                  onItemSelect(key, !isChecked(checkedKeys, key));
                }}
              />
            );
          }
          return null;
        }}
      </Transfer>
    </Spin>
  );
}

export default Index;
