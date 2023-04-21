import { formatMessage } from '@umijs/max';
import { Form, message } from 'antd';

export default (props) => {
  const {
    form: outerForm,

    onSubmit,
    onOk,

    onReset,

    ...rest
  } = props;

  const [innerForm] = Form.useForm();
  const form = outerForm || innerForm;

  const setInitialValues = (newInitialValues) => {
    if (newInitialValues) {
      const fields = Object.entries(newInitialValues).map(([k, v]) => ({
        name: k,
        value: v,
        touched: false,
      }));

      form.setFields(fields);

      form.currentInitialValues = newInitialValues;
    }
  };

  const resetInitialValues = () => {
    const currentInitialValues = form.currentInitialValues || {};

    const keys = Object.keys(form.getFieldsValue() || {});
    if (keys.length) {
      const fields = keys.map((item) => ({
        name: item,
        value: currentInitialValues[item] || undefined,
        touched: false,
      }));

      form.setFields(fields);
    }
  };

  form.setInitialValues = setInitialValues;
  form.resetInitialValues = resetInitialValues;

  return {
    labelWrap: true,

    form,

    submitAsync: (submitParams = {}) => {
      return new Promise((resolve, reject) => {
        form
          .validateFields()
          .then((newRecord) => {
            form.submit(); // 兼容 onFinish

            const push =
              onSubmit ||
              onOk ||
              ((newValue, { success }) => {
                console.log('Submit:', newValue);
                success();
              });
            push(
              newRecord,
              {
                success: (content, { initialValues: newInitialValues } = {}) => {
                  if (content !== null) {
                    message.success({
                      key: 'KEY_FORM',
                      content: content || formatMessage({ id: '操作成功' }),
                      duration: 3,
                    });
                  }

                  setInitialValues(newInitialValues || newRecord); // 复位 form.isFieldsTouched()

                  resolve();
                },
                error: (content) => {
                  if (content !== null) {
                    message.error({
                      key: 'KEY_FORM',
                      content: content || formatMessage({ id: '操作失败' }),
                      duration: 5,
                    });
                  }

                  reject();
                },
                form,
              },
              submitParams,
            );
          })
          .catch((rejectedReason) => {
            if (rejectedReason.errorFields) {
              form.scrollToField(rejectedReason.errorFields[0]?.name);
            } else {
              console.log(rejectedReason);
            }
          });
      });
    },

    reset: (newInitialValues) => {
      if (newInitialValues) {
        setInitialValues(newInitialValues);
      } else {
        resetInitialValues();
      }

      if (onReset) {
        onReset();
      }
    },

    ...rest,
  };
};
