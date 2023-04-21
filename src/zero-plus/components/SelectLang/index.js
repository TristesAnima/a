import React from 'react';
import { formatMessage, setLocale, getLocale } from '@umijs/max';
import { GlobalOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';

export default (props) => {
  const {
    // eslint-disable-next-line
    onSelect = ({ resolve, reject, value }) => {
      resolve();
    },
    langs = [
      { value: 'zh-CN', label: '简体中文' },
      { value: 'en-US', label: 'English' },
    ],
    ...rest
  } = props;

  return (
    <Dropdown
      menu={{
        items: langs.map((item) => ({
          label: item.label,
          key: item.value,
        })),
        selectedKeys: [getLocale()],
        onClick: ({ key }) => {
          new Promise((resolve, reject) => {
            onSelect({ resolve, reject, value: key });
          }).then(() => {
            setLocale(key);
          });
        },
      }}
    >
      <span {...rest}>
        <GlobalOutlined />
        <span style={{ position: 'relative', top: 0, marginLeft: 6 }}>
          {formatMessage({ id: '语言' })}
        </span>
      </span>
    </Dropdown>
  );
};
