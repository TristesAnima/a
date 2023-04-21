import React, { useMemo, useState } from 'react';
import type { TreeProps } from 'antd';
import { Tree, Spin, Space, Empty, Input } from 'antd';
import { omit } from 'lodash';
import { SearchOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { useDebounceFn } from 'ahooks';

type Props = TreeProps & {
  // 是否显示搜索框
  showSearch?: boolean;
  loading?: boolean;
  // 自定义渲染搜索框
  renderSearch?: (dom: React.ReactNode) => React.ReactNode;
  onSearch?: (expandedKeys: any[]) => void;
  // 自定义渲染title
  renderTitle?: (dom: React.ReactNode, item: Record<string, any>) => React.ReactNode;
  // 受控选择
  value?: string[];
  onChange?: (value: string[]) => void;
  // 自定义node key
  treeNodeKey?: string;
  // 自定义title key
  titleKey?: string;
  // 自定义children key
  childrenKey?: string;
  // 是否显示目录树
  isDirectory?: boolean;
};

function getParentKey(
  key: string,
  tree: any[],
  { treeNodeKey = 'key', childrenKey = 'children' }
): string {
  let parentKey = '';
  for (let i = 0; i < tree.length; i += 1) {
    const node = tree[i];
    const children: any[] = node[childrenKey];
    if (children) {
      if (children.some((item) => item[treeNodeKey] === key)) {
        parentKey = node[treeNodeKey];
      } else if (getParentKey(key, children, { treeNodeKey, childrenKey })) {
        parentKey = getParentKey(key, children, { treeNodeKey, childrenKey });
      }
    }
  }
  return parentKey;
}

function flatten(tree: any[] = []): any[] {
  return tree.reduce((previousValue, currentValue) => {
    previousValue.push(omit(currentValue, ['children']), ...flatten(currentValue.children || []));
    return previousValue;
  }, []);
}

function Index(props: Props) {
  const {
    showSearch = false,
    loading = false,
    renderSearch = (dom) => dom,
    onSearch,
    renderTitle = (title) => title,
    treeData,
    value,
    onChange,
    treeNodeKey = 'key',
    titleKey = 'title',
    childrenKey = 'children',
    disabled,
    isDirectory = false,
    ...restProps
  } = props;
  const { formatMessage } = useIntl();
  const [searchValue, setSearchValue] = useState<string>();

  /**
   * 渲染title
   */
  const renderTitlePro = (title: string, item: Record<string, any>) => {
    if (!searchValue || !title?.includes(searchValue)) {
      return renderTitle(title, item);
    }
    const searchIndex = title.indexOf(searchValue);
    const beforeStr = title.substring(0, searchIndex);
    const afterStr = title.substring(searchIndex + searchValue.length, title.length);
    return renderTitle(
      <>
        {beforeStr && <span>{beforeStr}</span>}
        <span style={{ color: '#f50' }}>{searchValue}</span>
        {afterStr && <span>{afterStr}</span>}
      </>,
      item
    );
  };

  /**
   * 解析树数据
   */
  const parseTreeDataSource = (dataSource: any[] = []): any[] =>
    dataSource.map((dataItem) => {
      const { [treeNodeKey]: keyPlus, [titleKey]: title, [childrenKey]: children } = dataItem;
      return {
        ...dataItem,
        key: keyPlus,
        title: renderTitlePro(title, dataItem),
        children: children && parseTreeDataSource(children),
      };
    });

  const newTreeData = useMemo(() => parseTreeDataSource(treeData), [treeData]);

  /**
   * 搜索
   */
  const search = (text: string) => {
    if (!text) {
      return;
    }
    const expandedKeys = flatten(treeData)
      .map((item) => {
        if (item[titleKey]?.indexOf(text) > -1) {
          return getParentKey(item[treeNodeKey], treeData || [], { treeNodeKey, childrenKey });
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i) as string[];
    if (onSearch) {
      onSearch(expandedKeys);
    }
  };

  const { run: runSearch } = useDebounceFn(search, { wait: 250 });

  // search组件
  const SearchDom = (
    <Input
      allowClear
      disabled={!treeData?.length}
      suffix={<SearchOutlined />}
      placeholder={formatMessage({ id: '树搜索placeholder' })}
      value={searchValue}
      onChange={(e) => {
        setSearchValue(e.target.value);
        runSearch(e.target.value);
      }}
    />
  );

  const TreeElement = isDirectory ? Tree.DirectoryTree : Tree;

  return (
    <Spin spinning={loading}>
      <Space style={{ width: '100%' }} direction="vertical" size="middle">
        {showSearch && renderSearch(SearchDom)}
        <TreeElement
          treeData={newTreeData}
          checkedKeys={value}
          onCheck={(checkedKeys) => {
            const keys = Array.isArray(checkedKeys) ? checkedKeys : checkedKeys.checked;
            if (onChange) {
              onChange(keys as string[]);
            }
          }}
          {...restProps}
        />
        {!treeData?.length && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      </Space>
    </Spin>
  );
}

export default Index;
