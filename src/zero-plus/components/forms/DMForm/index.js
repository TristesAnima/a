import { Form, message } from 'antd';
import { pick } from 'lodash';
import { parse } from 'qs';
import React, { useEffect, useRef, useState } from 'react';
import { formatMessage, useLocation, useSelector } from '@umijs/max';
import usePubSubListener from '../../../hooks/usePubSubListener';
import { getSessionStorageItem, removeSessionStorageItem } from '../../../utils/storage';
import Button from '../../Button';
import Drawer from '../../Drawer';
import Modal from '../../Modal';
import ChildrenWrapper from '../_components/ChildrenWrapper';
import useNormalizedProps from '../_hooks/useNormalizedProps';
import styles from './index.less';

export default (props) => {
  const {
    renderFooter = ({
      form,

      submit,
      reset,

      loading,
    }) => (
      <>
        <Button
          type="primary"
          badge={form.isFieldsTouched()}
          loading={loading}
          style={{
            minWidth: 75,
          }}
          onClick={() => {
            submit();
          }}
        >
          {formatMessage({ id: '保存' })}
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
          {formatMessage({ id: '取消' })}
        </Button>
      </>
    ),

    name,

    form,

    submitAsync,
    reset,

    children,

    renderChildren,

    type = 'Drawer', // Drawer 或 Modal
    trigger,
    // eslint-disable-next-line
    beforeShow = ({ resolve, reject }) => {
      resolve();
    },
    title,
    width = 416,
    closable = true,
    onClose,

    dmConfig = {},

    unsavedWarning = true,

    ...rest
  } = useNormalizedProps(props);

  const [visible, setVisible] = useState(false);

  usePubSubListener({
    name: 'DMForm.destroyAll()',
    callback: () => {
      setVisible(false);
    },
  });

  usePubSubListener({
    name: `${name}.run()`,
    callback: (params) => {
      if (params.hasOwnProperty('visible')) {
        setVisible(params.visible);
      }
    },
  });

  const location = useLocation();
  const query = parse(location.search);

  useEffect(() => {
    if (name) {
      const item = getSessionStorageItem(name);
      if (item) {
        if (item.visible === true) {
          setVisible(true);
          removeSessionStorageItem(name);
        }
      }
    }
  }, [name, query.key]);

  const submit = (submitParams) => {
    return submitAsync(submitParams).then(() => {
      setVisible(false);
    });
  };
  const newReset = (newInitialValues) => {
    reset(newInitialValues);
    setVisible(false);
  };

  const Element = type === 'Modal' ? Modal : Drawer;

  const isWarnedBeforeCloseRef = useRef(false);

  const loading = useSelector((state) => {
    return state.loading.global;
  });

  const config = {
    form,

    submit,
    reset: newReset,

    loading,
  };

  return (
    <>
      {trigger && (
        <span
          onClick={() => {
            new Promise((resolve, reject) => {
              beforeShow({ resolve, reject });
            }).then(() => {
              form.resetFields();
              setVisible(true);
            });
          }}
        >
          {trigger}
        </span>
      )}

      <Element
        title={title}
        width={width}
        closable={closable}
        {...dmConfig}
        visible={visible}
        onClose={(e) => {
          if (
            unsavedWarning &&
            form.isFieldsTouched() &&
            e &&
            e.target.nodeName.toUpperCase() === 'DIV' &&
            !isWarnedBeforeCloseRef.current
          ) {
            message.warning({
              key: 'KEY_FORM',
              content: formatMessage({ id: '数据未保存' }),
              duration: 3,
            });
            isWarnedBeforeCloseRef.current = true;
            setTimeout(() => {
              isWarnedBeforeCloseRef.current = false;
            }, 1500);
          } else {
            newReset();

            if (onClose) {
              onClose();
            }
          }
        }}
        footer={null}
      >
        <Form {...rest} form={form}>
          {visible && (
            <ChildrenWrapper
              form={form}
              {...pick(props, ['initialValues', 'requestInitialValues', 'requestDeps'])}
            >
              {renderChildren ? (
                renderChildren(config)
              ) : (
                <>
                  {children}
                  {renderFooter && (
                    <Form.Item shouldUpdate noStyle>
                      {() => (
                        <>
                          <div style={{ position: 'relative', height: 30, width: '100%' }}></div>
                          <div className={styles.footer}>{renderFooter(config)}</div>
                        </>
                      )}
                    </Form.Item>
                  )}
                </>
              )}
            </ChildrenWrapper>
          )}
        </Form>
      </Element>
    </>
  );
};
