import type { DrawerProps } from 'antd';
import { Button, Col, Descriptions, Drawer, Row } from 'antd';
import type { DescriptionsProps } from 'antd/lib/descriptions';
import type { DescriptionsItemProps } from 'antd/lib/descriptions/Item';
import type { RowProps } from 'antd/lib/grid';
import type { ReactElement } from 'react';
import React, { cloneElement, useState } from 'react';

interface Props {
  children: ReactElement;
  drawerOptions?: DrawerProps;
  rowOptions?: RowProps;
  descriptionsProps?: DescriptionsProps;

  /**
   *
   * @param close 关闭抽屉方法
   *
   * 自定义页脚
   */
  renderFooter?: (close: () => void) => React.ReactNode;

  /**
   *
   * @param open 打开抽屉方法
   *
   * 在打开前做点什么 ?
   */
  onShowBefore?: (open: () => void) => void;

  /**
   *
   * @param close 关闭抽屉方法
   *
   * 在关闭前做点什么 ?
   */
  onCloseBefore?: (close: () => void) => void;
  renderDescriptionsItem?: () => DescriptionsItemProps[];
}

const Index: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const {
    children,
    drawerOptions = {},
    descriptionsProps = {},
    onShowBefore,
    onCloseBefore,
    renderFooter = (close) => (
      <Row justify="end" gutter={[8, 8]}>
        <Col>
          <Button
            onClick={() => {
              if (onCloseBefore) {
                onCloseBefore(close);
              } else {
                close();
              }
            }}
          >
            取消
          </Button>
        </Col>
      </Row>
    ),
    renderDescriptionsItem = () => [],
  } = props;
  const items = renderDescriptionsItem();

  return (
    <>
      {cloneElement(children, {
        onClick: () => {
          if (onShowBefore) {
            onShowBefore(() => setOpen(true));
          } else {
            setOpen(true);
          }
        },
      })}

      <Drawer
        title="预览"
        width={900}
        placement="right"
        open={open}
        onClose={() => {
          if (onCloseBefore) {
            onCloseBefore(() => setOpen(false));
          } else {
            setOpen(false);
          }
        }}
        footer={renderFooter(() => setOpen(false))}
        {...drawerOptions}
      >
        <Descriptions size="small" {...descriptionsProps}>
          {items.map((item, index) => (
            <Descriptions.Item key={index} label={item.label} {...item}>
              {item.children}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </Drawer>
    </>
  );
};

export default Index;
