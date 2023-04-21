import { FormButtonGroup, FormDrawer, Submit } from '@formily/antd';
import { useIntl } from '@umijs/max';
import { Button } from 'antd';
import * as PropTypes from 'prop-types';
import { cloneElement } from 'react';

const propTypes = {
  id: PropTypes.any.isRequired,
  renderFormContent: PropTypes.func.isRequired,
  title: PropTypes.node,
  width: PropTypes.number,
  children: PropTypes.node,
  formProps: PropTypes.object,
  drawerProps: PropTypes.object,
  okText: PropTypes.node,
  cancelText: PropTypes.node,
  okButtonProps: PropTypes.object,
  cancelButtonProps: PropTypes.object,
  checkFormEmpty: PropTypes.bool,
  onShow: PropTypes.func,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  onValidateError: PropTypes.func,
};

const defaultProps = {
  title: null,
  width: 600,
  children: null,
  initialValues: {},
  formProps: {},
  drawerProps: {},
  okText: null,
  cancelText: null,
  okButtonProps: {},
  cancelButtonProps: {},
  checkFormEmpty: true,
  onShow: (show) => show(),
  onOk: (values, close) => close(),
  onCancel: () => {},
  onValidateError: () => {},
};

const Index = (props) => {
  const {
    id,
    title,
    width,
    renderFormContent,
    initialValues,
    children,
    okText,
    cancelText,
    okButtonProps,
    cancelButtonProps,
    formProps,
    drawerProps,
    // checkFormEmpty,
    onShow,
    onOk,
    onCancel,
    onValidateError,
  } = props;
  const { formatMessage } = useIntl();

  const show = () => {
    const formDrawer = FormDrawer(
      {
        title,
        width,
        onClose: onCancel,
        ...drawerProps,
      },
      id,
      (form) => (
        <>
          {renderFormContent(form)}
          <FormDrawer.Footer>
            <FormButtonGroup align="right">
              <Button
                {...cancelButtonProps}
                onClick={() => {
                  formDrawer.close();
                  onCancel();
                }}
              >
                {cancelText || formatMessage({ id: '取消' })}
              </Button>
              <Submit
                {...okButtonProps}
                onSubmit={(values) => onOk(values, form)}
                onSubmitFailed={onValidateError}
              >
                {okText || formatMessage({ id: '确定' })}
              </Submit>
            </FormButtonGroup>
          </FormDrawer.Footer>
        </>
      )
    );

    formDrawer
      .open({
        initialValues,
        ...formProps,
      })
      .finally();
  };

  return (
    <FormDrawer.Portal id={id}>
      {cloneElement(children, {
        onClick: () => {
          onShow(show);
        },
      })}
    </FormDrawer.Portal>
  );
};

Index.propTypes = propTypes;

Index.defaultProps = defaultProps;

Index.displayName = 'DrawerFormily';

export default Index;
