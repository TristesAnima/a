import { BranchesOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Space, Tooltip } from 'antd';
import React from 'react';
import { useIntl, history, useModel } from '@umijs/max';
import { SelectLang } from '@/zero-plus';

export default () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser = {} } = initialState;
  const { formatMessage } = useIntl();

  if (!currentUser.username) {
    history.push('/g/logout');
  }

  return (
    <Space>
      <Tooltip
        placement="bottomRight"
        title={`${formatMessage({ id: '版本' })}：${process.env.PROJECT_VERSION}`}
      >
        <span rel="noopener noreferrer" className="rc-action">
          <BranchesOutlined />
          <span style={{ position: 'relative', marginLeft: 6 }}>{process.env.PROJECT_VERSION}</span>
        </span>
      </Tooltip>

      <SelectLang className="rc-action" />

      <Dropdown
        menu={{
          items: [
            {
              label: formatMessage({
                id: '个人设置',
                defaultMessage: '个人设置',
              }),
              icon: <SettingOutlined />,
              key: '/user-setting',
            },
            {
              label: formatMessage({
                id: '退出登录',
                defaultMessage: '退出登录',
              }),
              icon: <LogoutOutlined />,
              key: '/g/logout',
            },
          ],
          selectedKeys: [],
          onClick: ({ key }) => {
            history.push(key);
          },
        }}
      >
        <span className="rc-action">
          {currentUser.avatar ? (
            <Avatar size="small" src={currentUser.avatar} />
          ) : (
            <Avatar size="small" icon={<UserOutlined />} />
          )}
          <a style={{ color: 'inherit' }}>
            &nbsp;{currentUser.name}&nbsp;({currentUser.username})
          </a>
        </span>
      </Dropdown>
    </Space>
  );
};
