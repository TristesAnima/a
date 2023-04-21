import React, { useState } from 'react';
import { Select, Button, Space } from 'antd';
import { useIntl } from '@umijs/max';
import { useRequest, useUpdateEffect, useDebounceEffect } from 'ahooks';
import { getRelationUsers } from '@/services/contacts';
import { getUsers } from '@/services/user';
import { formatResponseData, parseUsername } from '@/utils/Project';
import type { SystemUser } from '@/typings/project';

interface Props {
  id?: string;
  visible: boolean;
  value: number | null;
  disabled?: boolean;
  currentData: Record<string, any>;
  onChange?: (value: number | null, user: SystemUser | null) => void;
}

const Index: React.FC<Props> = (props) => {
  const { id, visible, value, disabled = false, currentData = {}, onChange } = props;
  const [userId, setUserId] = useState<number | null>(value);
  const { formatMessage } = useIntl();
  const {
    run: runQueryUsers,
    data: users = [],
    loading: queryUsersLoading,
  } = useRequest(async () => formatResponseData<SystemUser[]>(await getUsers()), {
    manual: true,
  });
  const {
    run: runGetRelationUsers,
    data: relationUsers = [],
    loading: getRelationUsersLoading,
  } = useRequest(async () => formatResponseData<number[]>(await getRelationUsers()), {
    manual: true,
  });

  useDebounceEffect(
    () => {
      if (visible) {
        runQueryUsers();
        runGetRelationUsers();
      }
    },
    [visible],
    {
      wait: 300,
    }
  );

  useUpdateEffect(() => {
    setUserId(value);
  }, [value]);

  return (
    <Space.Compact block>
      <Select
        id={id}
        placeholder={formatMessage({ id: '请选择' })}
        allowClear={false}
        disabled={disabled}
        showSearch
        optionFilterProp="children"
        loading={queryUsersLoading || getRelationUsersLoading}
        options={users
          .filter((item) => item.id === currentData.userId || !relationUsers.includes(item.id))
          .map((item) => ({
            label: parseUsername(item),
            value: item.id,
          }))}
        value={userId}
        onChange={(v) => {
          setUserId(v);
        }}
      />
      <Button
        disabled={disabled || !userId || currentData.userId === userId || value === userId}
        type="primary"
        onClick={() => {
          if (onChange) {
            const user = users.find((item) => item.id === userId) || null;
            onChange(userId, user);
          }
        }}
      >
        {formatMessage({ id: 'contacts.同步' })}
      </Button>
      <Button
        disabled={disabled || !userId}
        danger
        type="primary"
        onClick={() => {
          if (onChange) {
            onChange(null, null);
          }
        }}
      >
        {formatMessage({ id: 'contacts.解除' })}
      </Button>
    </Space.Compact>
  );
};

Index.displayName = 'ContactsSync';

export default Index;
