import { history } from '@umijs/max';
import { RouteContext } from '@ant-design/pro-layout';
import React from 'react';
import PageLoading from '@/components/PageLoading';

const findAccessibleMenuItem = (menuItems) => {
  const menuItem = menuItems?.find((item) => {
    return item.unaccessible === false && item.hideInMenu !== true && item.name;
  });
  if (menuItem) {
    return menuItem.children ? findAccessibleMenuItem(menuItem.children) : menuItem;
  }
  return null;
};

const getMainPage = (menuItems) => {
  const accessibleMenuItem = findAccessibleMenuItem(menuItems);
  if (accessibleMenuItem) {
    return accessibleMenuItem.path;
  }
  return process.env.DEFAULT_MAIN_PAGE;
};

export default () => {
  return (
    <RouteContext.Consumer>
      {(value) => {
        const { menuData } = value;

        history.push(getMainPage(menuData));

        return <PageLoading />;
      }}
    </RouteContext.Consumer>
  );
};
