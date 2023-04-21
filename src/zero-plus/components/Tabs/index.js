import { Tabs } from 'antd';
import { parse } from 'qs';
import React, { useEffect } from 'react';
import { useLocation } from '@umijs/max';
import { getSessionStorageItem, removeSessionStorageItem } from '../../utils/storage';
import useNormalizedProps from './_hooks/useNormalizedProps';

const defaultRenderTabPanes = (tabPanes, { activeKey }) =>
  tabPanes.map((tabPane) => {
    const { key, children, ...rest } = tabPane;
    return (
      <Tabs.TabPane key={key} {...rest}>
        {key === activeKey && children}
      </Tabs.TabPane>
    );
  });

const Index = (props) => {
  const {
    onInit,

    renderTabPanes = defaultRenderTabPanes,

    tabPanes,
    firstTabPaneKey,
    activeKey,

    name,

    // eslint-disable-next-line
    beforeChange = ({ resolve, reject }) => {
      resolve();
    },
    onChange,

    ...rest
  } = useNormalizedProps(props);

  useEffect(() => {
    if (onInit && firstTabPaneKey) {
      onInit(firstTabPaneKey);
    }
  }, [firstTabPaneKey]);

  const beforeChange_onChange = (newActiveKey) => {
    return new Promise((resolve, reject) => {
      beforeChange({ resolve, reject, activeKey: newActiveKey });
    }).then(() => {
      if (onChange) {
        onChange(newActiveKey);
      }
    });
  };

  const location = useLocation();
  const query = parse(location.search);

  useEffect(() => {
    if (name) {
      const item = getSessionStorageItem(name);
      if (item) {
        if (item.activeKey) {
          beforeChange_onChange(item.activeKey).then(() => {
            setTimeout(() => {
              removeSessionStorageItem(name);
            }, 1000);
          });
        }
      }
    }
  }, [name, query.key]);

  return (
    <Tabs
      destroyInactiveTabPane
      animated={false}
      type="line"
      {...rest}
      activeKey={activeKey}
      onChange={beforeChange_onChange}
    >
      {renderTabPanes(tabPanes, {
        activeKey,
      })}
    </Tabs>
  );
};

Object.keys(Tabs).forEach((item) => {
  if (item !== 'defaultProps') {
    Index[item] = Tabs[item];
  }
});
export default Index;
