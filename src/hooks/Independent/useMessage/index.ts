import { useIntl } from '@umijs/max';
import { message } from 'antd';
import type { MessageArgsProps } from 'antd';
import type { ResponseType } from '@/typings/api';
import { ab2str } from '@/utils/Independent';

export enum MESSAGE_MODE {
  ACTION = 'action',
  SAVE = 'save',
  DOWNLOAD = 'download',
  LOADING = 'loading',
}

type Mode = MESSAGE_MODE.ACTION | MESSAGE_MODE.SAVE | MESSAGE_MODE.DOWNLOAD | MESSAGE_MODE.LOADING;

interface Options {
  response?: ResponseType<{
    message?: string;
    content?: {
      message?: string;
      [key: string]: any;
    };
  }>;
  success?: boolean;
  mode?: Mode;
  successText?: string;
  onSuccess?: () => void;
  onError?: () => void;
  errorText?: string;
  messageConfig?: MessageArgsProps;
}

export default function useMessage(): (options: Options) => Promise<any> {
  const { formatMessage } = useIntl();

  const getText: (
    mode: Mode,
    textConfig: { successText?: string; errorText?: string }
  ) => string[] = (mode, { successText, errorText }) => {
    const textArr = [];
    switch (mode) {
      case MESSAGE_MODE.ACTION:
        textArr.push(
          successText || formatMessage({ id: '操作成功' }),
          errorText || formatMessage({ id: '操作失败' })
        );
        break;
      case MESSAGE_MODE.SAVE:
        textArr.push(
          successText || formatMessage({ id: '保存成功' }),
          errorText || formatMessage({ id: '保存失败' })
        );
        break;
      default:
        textArr.push(
          successText || formatMessage({ id: '操作成功' }),
          errorText || formatMessage({ id: '操作失败' })
        );
        break;
    }
    return textArr;
  };

  return async (options) => {
    const {
      response,
      success = response?.success,
      mode = MESSAGE_MODE.ACTION,
      successText,
      onSuccess,
      onError,
      errorText = response?.data?.message,
      messageConfig,
    } = options;

    const [successTextPlus, errorTextPlus] = getText(mode, {
      successText,
      errorText,
    });

    if (success) {
      // 成功
      if (typeof onSuccess === 'function') {
        onSuccess();
      }
      return message.success({
        content: successTextPlus,
        ...messageConfig,
      });
    } // 失败
    if (typeof onError === 'function') {
      onError();
    }
    if (mode === MESSAGE_MODE.DOWNLOAD) {
      const msg = await ab2str(response!.data);
      return message.error({
        content: msg,
        ...messageConfig,
      });
    }
    return message.error({
      content: errorTextPlus,
      ...messageConfig,
    });
  };
}
