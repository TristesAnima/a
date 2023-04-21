import React, { useState } from 'react';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { formatMessage } from '@umijs/max';
import { Button, Input, Row, Col } from 'antd';
import Form from '../Form';

export default (props) => {
  const {
    renderChildren = ({
      submit,
      reset,

      toggleTrigger,
      isExpanded,
    }) => {
      return (
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="名称0" name="name0">
              <Input />
            </Form.Item>
          </Col>

          {isExpanded && (
            <>
              <Col span={8}>
                <Form.Item label="名称1" name="name1">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="名称2" name="name2">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="名称3" name="name3">
                  <Input />
                </Form.Item>
              </Col>
            </>
          )}

          <Col span={8}>
            <Button
              type="primary"
              style={{
                minWidth: 75,
              }}
              onClick={() => {
                submit();
              }}
            >
              {formatMessage({ id: '查询' })}
            </Button>

            <Button
              style={{
                minWidth: 75,
                marginLeft: 15,
              }}
              onClick={() => {
                reset();
              }}
            >
              {formatMessage({ id: '重置' })}
            </Button>

            <span
              style={{
                marginLeft: 15,
              }}
            >
              {toggleTrigger}
            </span>
          </Col>
        </Row>
      );
    },

    ...rest
  } = props;

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleTrigger = isExpanded ? (
    <a
      onClick={() => {
        setIsExpanded(false);
      }}
    >
      {formatMessage({ id: '收起' })} <UpOutlined />
    </a>
  ) : (
    <a
      onClick={() => {
        setIsExpanded(true);
      }}
    >
      {formatMessage({ id: '展开' })} <DownOutlined />
    </a>
  );

  return (
    <Form
      {...rest}
      renderChildren={(params) =>
        renderChildren({
          ...params,
          toggleTrigger,
          isExpanded,
          setIsExpanded,
        })
      }
    />
  );
};
