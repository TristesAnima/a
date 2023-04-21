import React, { useState } from 'react';
import { Space, Input, Form } from 'antd';
import { useControllableValue, useDebounceFn, useUpdateEffect } from 'ahooks';
import { SearchOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import Item from './Item';

const { Item: FormItem } = Form;

interface Props {
  // 数据源
  options: { value: any; children: React.ReactNode }[];
  // 受控value
  value?: any;
  showSearch?: boolean;
  // 指定过滤的属性
  optionFilterProp?: 'value' | 'children';
  height?: string | number;
  // 是否可以单击取消
  cancelable?: boolean;
  // 自定义搜索布局
  renderSearcher?: (dom: React.ReactNode) => React.ReactNode;
  onChange?: (value: any, row: { value: any; children: React.ReactNode }) => void;
}

const Index: React.FC<Props> = (props) => {
  const {
    options: rawDataSource,
    showSearch = false,
    optionFilterProp = 'children',
    height = 'auto',
    cancelable = true,
    renderSearcher = (dom) => dom,
    onChange,
    ...rest
  } = props;

  const [dataSource, setDataSource] = useState(rawDataSource);
  const [value, setValue] = useControllableValue<any>(rest, {
    defaultValue: null,
  });
  const { formatMessage } = useIntl();

  useUpdateEffect(() => {
    setDataSource(rawDataSource || []);
  }, [rawDataSource]);

  const search = (searchValue: string | null) => {
    if (!searchValue) {
      setDataSource(rawDataSource);
      return;
    }
    setDataSource(
      rawDataSource.filter((item) =>
        typeof item[optionFilterProp] === 'string'
          ? item[optionFilterProp].includes(searchValue)
          : true
      )
    );
  };

  const { run: runSearch } = useDebounceFn(search, { wait: 250 });

  // search组件
  const searchDom = (
    <FormItem status="success">
      <Input
        allowClear
        disabled={!rawDataSource.length}
        suffix={<SearchOutlined />}
        placeholder={formatMessage({ id: '树搜索placeholder' })}
        onChange={(e) => {
          runSearch(e.target.value);
        }}
      />
    </FormItem>
  );

  return (
    <Space style={{ width: '100%' }} direction="vertical" size={0}>
      {showSearch && renderSearcher(searchDom)}
      <div style={{ height, overflowY: 'auto' }}>
        {dataSource.map((item) => {
          const { value: valueItem, children } = item;
          return (
            <Item
              key={valueItem}
              checked={valueItem === value}
              onChange={(checked) => {
                if (cancelable) {
                  const newValue = checked ? valueItem : null;
                  setValue(newValue);
                  if (onChange) {
                    onChange(newValue, item);
                  }
                } else {
                  setValue(valueItem);
                  if (onChange) {
                    onChange(valueItem, item);
                  }
                }
              }}
            >
              {children}
            </Item>
          );
        })}
      </div>
    </Space>
  );
};

Index.displayName = 'RadioList';

export default Index;
