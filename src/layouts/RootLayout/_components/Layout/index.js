import ProLayout, { RouteContext } from '@ant-design/pro-layout';
import { Image, Result } from 'antd';
import classNames from 'classnames';
import React from 'react';
import {
  history,
  Link,
  Outlet,
  useAccessMarkedRoutes,
  useAppData,
  useLocation,
  useRouteData,
  useIntl,
} from '@umijs/max';
import { getLocalStorageItem, getToken, Icon } from '@/zero-plus';
import ProjectLayout from '@/layouts/ProjectLayout';
import styles from './index.less';
import Footer from './_components/Footer';
import RightContent from './_components/RightContent';

const getLayoutConfig = (type) => {
  switch (type) {
    case 'top':
      return {
        layout: 'top',
        navTheme: 'dark',
      };
    case 'mix':
      return {
        layout: 'mix',
        splitMenus: true,
        navTheme: 'light',
        headerTheme: 'light',
      };
    default:
      return {
        layout: 'side',
        navTheme: 'dark',
      };
  }
};

const findAccessibleMenuItem = (menuItems) => {
  const menuItem = menuItems?.find(
    (item) => item.unaccessible === false && item.hideInMenu !== true && item.name
  );
  if (menuItem) {
    return menuItem.children ? findAccessibleMenuItem(menuItem.children) : menuItem;
  }
  return null;
};

const Index = (props) => {
  const {
    layoutType = getLocalStorageItem('layout_type') || process.env.DEFAULT_LAYOUT_TYPE,
    ...rest
  } = props;
  const { formatMessage } = useIntl();

  const layoutConfig = getLayoutConfig(layoutType);

  const location = useLocation(); // 临时方案，解决切换菜单后，菜单选中状态无法自动更新问题

  const { clientRoutes } = useAppData();
  const markedRoutes = useAccessMarkedRoutes(clientRoutes);

  const { route } = useRouteData();
  const currentRoute = markedRoutes.find((item) => item.id === route.id);

  return (
    <ProLayout
      {...layoutConfig}
      collapsedButtonRender={() => null}
      fixSiderbar
      logo={
        <Image
          src={`/sso/api/products/logo/${process.env.CLOUD_CODE}?token=${getToken()}`}
          fallback="/images/logo.png"
          preview={false}
          alt="logo"
          style={{ display: 'inline-block', width: 32, height: 32, marginBottom: 6 }}
        />
      }
      title={formatMessage({
        id: 'project.name',
        defaultMessage: process.env.PROJECT_CODE,
      })}
      onMenuHeaderClick={() => history.push('/')}
      formatMessage={formatMessage}
      menu={{ locale: true }}
      menuItemRender={(itemProps) => {
        if (layoutType === 'mix') {
          const { icon, name, id, path } = itemProps;

          const accessibleMenuItem = findAccessibleMenuItem(
            currentRoute.routes.find((item) => item.id === id)?.routes
          );

          return (
            <Link to={accessibleMenuItem?.path || path}>
              <Icon type={icon} style={{ marginRight: 10 }} />
              {formatMessage({ id: name })}
            </Link>
          );
        }

        const { icon, name, path } = itemProps;
        return (
          <Link to={path}>
            <Icon type={icon} style={{ marginRight: 10 }} />
            {formatMessage({ id: name })}
          </Link>
        );
      }}
      subMenuItemRender={(itemProps) => {
        const { icon, name, children } = itemProps;
        const accessibleMenuItem = findAccessibleMenuItem(children);
        return (
          <Link to={accessibleMenuItem?.path} style={{ color: 'inherit' }}>
            <Icon type={icon} />
            &nbsp;{formatMessage({ id: name })}
          </Link>
        );
      }}
      itemRender={(item) => item.breadcrumbName}
      route={currentRoute}
      footerRender={() => <Footer />}
      rightContentRender={() => (
        <div
          className={classNames({
            [styles.right]: true,
            [styles.dark]: layoutConfig.navTheme === 'dark' && layoutConfig.layout === 'top',
          })}
        >
          <RightContent {...props} />
        </div>
      )}
      {...rest}
    >
      <RouteContext.Consumer>
        {(value) => {
          const { currentMenu } = value;
          if (currentMenu.unaccessible) {
            return <Result status="403" title="403" subTitle={formatMessage({ id: '403提示' })} />;
          }
          if (location.pathname.includes('/study-item/')) {
            return (
              <ProjectLayout>
                <Outlet />
              </ProjectLayout>
            );
          }
          return <Outlet />;
        }}
      </RouteContext.Consumer>
    </ProLayout>
  );
};

export default Index;
