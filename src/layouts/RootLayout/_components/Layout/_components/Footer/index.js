import { Layout } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { formatMessage } from '@umijs/max';
import styles from './index.less';

export default (props) => {
  const { className, links } = props;

  return (
    <Layout.Footer style={{ padding: 0 }}>
      <footer className={classNames(styles.footer, className)}>
        {links && (
          <div className={styles.links}>
            {links.map((link) => (
              <a
                key={link.title}
                title={link.title}
                target={link.target || '_blank'}
                href={link.href}
              >
                {link.title}
              </a>
            ))}
          </div>
        )}
        &nbsp;
        <div className={styles.main}>
          {`© 2019-${new Date().getFullYear()} Deep Intelligent Pharma`}&nbsp;
          {formatMessage({ id: '版权所有' })}
          &nbsp;
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">
            京ICP备18033733号
          </a>
        </div>
      </footer>
    </Layout.Footer>
  );
};
