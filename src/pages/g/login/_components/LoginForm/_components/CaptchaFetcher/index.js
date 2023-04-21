import React, { PureComponent } from 'react';
import { formatMessage } from '@umijs/max';

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  runGetCaptchaCountDown = (count) => {
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  render() {
    const {
      getCaptchaSecondText = formatMessage({ id: '秒' }),
      getCaptchaButtonText = formatMessage({ id: '获取验证码' }),

      type = 'default', // 可选 default, button 类型
      countDown = 300,
      onGetCaptcha = () =>
        new Promise((resolve, reject) => {
          reject();
        }),

      ...rest // 剩余参数
    } = this.props;

    const { count } = this.state;

    return (
      <a
        {...rest}
        {...(type === 'button' ? { className: 'ant-btn' } : {})}
        style={{ display: 'block', width: '100%', textAlign: 'center' }}
        disabled={count}
        onClick={() => {
          const result = onGetCaptcha ? onGetCaptcha() : null;
          if (result === false) {
            return;
          }
          if (result instanceof Promise) {
            result.then(() => this.runGetCaptchaCountDown(countDown));
          } else {
            this.runGetCaptchaCountDown(countDown);
          }
        }}
      >
        {count ? `${count} ${getCaptchaSecondText}` : getCaptchaButtonText}
      </a>
    );
  }
}

Index.displayName = 'CaptchaFetcher';
export default Index;
