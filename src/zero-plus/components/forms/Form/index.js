import React from 'react';
import { Form } from 'antd';
import { formatMessage, useSelector } from '@umijs/max';
import { pick } from 'lodash';
import Button from '../../Button';
import ChildrenWrapper from '../_components/ChildrenWrapper';
import useNormalizedProps from '../_hooks/useNormalizedProps';

const Index = (props) => {
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
          {formatMessage({ id: '重置' })}
        </Button>
      </>
    ),

    form,

    submitAsync,
    reset,

    children,

    renderChildren,

    ...rest
  } = useNormalizedProps(props);

  const loading = useSelector((state) => {
    return state.loading.global;
  });

  const config = {
    form,

    submit: submitAsync,
    reset,

    loading,
  };

  return (
    <Form {...rest} form={form}>
      <ChildrenWrapper
        form={form}
        {...pick(props, ['initialValues', 'requestInitialValues', 'requestDeps'])}
      >
        {renderChildren ? (
          renderChildren(config)
        ) : (
          <>
            {children}
            {renderFooter && <Form.Item shouldUpdate>{() => renderFooter(config)}</Form.Item>}
          </>
        )}
      </ChildrenWrapper>
    </Form>
  );
};

Object.keys(Form).forEach((item) => {
  if (item !== 'defaultProps') {
    Index[item] = Form[item];
  }
});
export default Index;
