import type { FormListFieldData, FormListOperation } from 'antd';
import { useIntl } from '@umijs/max';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Empty, message, Popconfirm, Tabs, Form } from 'antd';
import { get, last } from 'lodash';
import { CloseOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { isTruth } from '@/utils/Independent';
import type { Props as TabsFormProps } from './index';
import DraggableTabs from './DraggableTabs';

type Props = TabsFormProps & {
  fields: FormListFieldData[];
  action: FormListOperation;
};

const LIMIT = 50;

function Index(props: Props) {
  const {
    fields,
    action: { add, remove, move },
    children,
    entity,
    least = 0,
    isSort = false,
    isCopy = false,
    readonly = false,
    initialRecord = {},
    tabPaneProps = {},
    interceptDelete,
    renderDelete = () => null,
    renderAdd = () => null,
    delText,
    renderTab,
    onDelete,
    onAdd,
    onCopy,
    filterCopyData,
    changeKey,
    onActiveKeyChange,
    ...restProps
  } = props;
  const { formatMessage } = useIntl();
  const keyRef = useRef<{ type: 'add' | 'remove'; field?: FormListFieldData }>();
  const [activeKey, setActiveKey] = useState<string>();
  const form = Form.useFormInstance();

  const onAddPro = (newRecord: Record<string, any> = {}) => {
    keyRef.current = {
      type: 'add',
    };
    if (fields.length >= LIMIT) {
      message.warning(formatMessage({ id: '最多可以添加提示语' }, { num: LIMIT }));
      return;
    }
    add({
      ...(typeof initialRecord === 'function' ? initialRecord(fields) : initialRecord),
      ...newRecord,
    });
    if (onAdd) {
      onAdd();
    }
  };

  const onRemovePro = (field: FormListFieldData) => {
    const removePro = () => {
      keyRef.current = {
        type: 'remove',
        field,
      };
      remove(field.name);
      if (onDelete) {
        onDelete(field);
      }
    };

    if (interceptDelete) {
      interceptDelete(fields, field, removePro);
    } else {
      removePro();
    }
  };

  // 复制
  const onCopyPro = (field: FormListFieldData) => {
    const { getFieldsValue } = form;
    keyRef.current = {
      type: 'add',
    };
    const { name: index } = field;
    if (fields.length >= LIMIT) {
      message.warning(formatMessage({ id: '最多可以添加提示语' }, { num: LIMIT }));
      return;
    }
    const values: Record<string, any>[] = get(getFieldsValue(), entity);
    add(filterCopyData?.(values[index], values) || values[index]);
    if (onCopy) {
      onCopy();
    }
  };

  // 自定义右上角内容
  const getTabBarExtraContent = () => {
    if (readonly) {
      return null;
    }
    return (
      renderAdd?.((newRecord = {}) => onAddPro(newRecord), fields) || (
        // @ts-ignore
        <a disabled={fields.length >= LIMIT} onClick={() => onAddPro(fields, add)}>
          <PlusSquareOutlined
            style={{
              fontSize: 20,
              margin: '0 10px',
            }}
          />
        </a>
      )
    );
  };

  // 渲染Tab tab
  const getTab = (field: FormListFieldData) => {
    const { key: fieldKey } = field;
    const tab = renderTab(field);
    if (readonly) {
      return tab;
    }
    const title = delText?.(field) || formatMessage({ id: '删除提示' });
    const deleteComponent = (
      <a className="ant-tabs-tab-remove">
        <CloseOutlined className="anticon anticon-close" />
      </a>
    );

    const deleteDom = renderDelete?.(() => onRemovePro(field), fields, field, deleteComponent);
    const closable =
      deleteDom === null ? (
        <Popconfirm
          title={title}
          onConfirm={(e) => {
            onRemovePro(field);
            if (e) {
              e.stopPropagation();
            }
          }}
          onCancel={(e) => {
            if (e) {
              e.stopPropagation();
            }
          }}
        >
          {deleteComponent}
        </Popconfirm>
      ) : (
        deleteDom
      );

    if (isCopy) {
      return (
        <ContextMenuTrigger id={`tab-context-${entity}-${fieldKey}`} holdToDisplay={-1}>
          <span title={formatMessage({ id: '右键复制' })}>{tab}</span>
          {fields.length > least && closable}
        </ContextMenuTrigger>
      );
    }
    return (
      <>
        <span>{tab}</span>
        {fields.length > least && closable}
      </>
    );
  };

  useEffect(() => {
    if (!keyRef.current) {
      return;
    }
    const { type, field } = keyRef.current;
    if (!type) {
      return;
    }
    if (type === 'add') {
      // 添加
      const lastKey = last(fields)?.key;
      if (lastKey) {
        keyRef.current = undefined;
        setActiveKey(lastKey.toString());
        if (onActiveKeyChange) {
          onActiveKeyChange(lastKey.toString(), 'add');
        }
      }
      return;
    }
    // 删除
    if (activeKey !== field?.key.toString()) {
      return;
    }
    // 如果是删除当前选中的，则需要选中第一个
    const firstKey = fields[0]?.key;
    if (isTruth(firstKey)) {
      keyRef.current = undefined;
      setActiveKey(firstKey.toString());
      if (onActiveKeyChange) {
        onActiveKeyChange(firstKey.toString(), 'remove');
      }
    }
  }, [fields.length, activeKey]);

  useEffect(() => {
    if (changeKey) {
      keyRef.current = undefined;
      setActiveKey(changeKey);
      if (onActiveKeyChange) {
        onActiveKeyChange(changeKey, 'changeKey');
      }
    }
  }, [changeKey]);

  const WrapTabs = isSort && !readonly ? DraggableTabs : Tabs;

  return (
    <>
      {isCopy &&
        !readonly &&
        fields.map((field) => (
          <ContextMenu
            id={`tab-context-${entity}-${field.key}`}
            key={field.key}
            style={{ zIndex: 1 }}
          >
            <MenuItem onClick={() => onCopyPro(field)}>
              <Button>{formatMessage({ id: '复制' })}</Button>
            </MenuItem>
          </ContextMenu>
        ))}
      <WrapTabs
        type={readonly ? 'card' : 'editable-card'}
        activeKey={activeKey || fields[0]?.key.toString()}
        hideAdd
        tabBarExtraContent={getTabBarExtraContent()}
        onChange={(currentActiveKey) => {
          keyRef.current = undefined;
          setActiveKey(currentActiveKey);
          if (onActiveKeyChange) {
            onActiveKeyChange(currentActiveKey, 'manual');
          }
        }}
        items={fields.map((field) => ({
          label: getTab(field),
          key: field.key.toString(),
          closable: false,
          forceRender: true,
          children: React.cloneElement(children, {
            field,
            fields,
          }),
          ...tabPaneProps,
        }))}
        onSort={
          isSort
            ? (oldIndex, newIndex) => {
                move(oldIndex, newIndex);
              }
            : undefined
        }
        {...restProps}
      />
      {fields.length <= 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : null}
    </>
  );
}

export default Index;
