# useMessage

更方便的表单 message提示

```jsx
import React from 'react';
import { Button, Divider } from 'antd';
import { setLocale, getLocale } from 'umi';
import useMessage from './index.js';

export default () => {
  const message = useMessage();

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          message({
            success: true,
          });
        }}
      >
        操作成功
      </Button>
      <Divider type="vertical" />
      <Button
        type="primary"
        danger
        onClick={() => {
          message({
            success: false,
          });
        }}
      >
        操作失败
      </Button>
      <Divider type="vertical" />
      <Button
        type="primary"
        onClick={() => {
          message({
            success: true,
            mode: 'save'
          });
        }}
      >
        保存成功
      </Button>
      <Divider type="vertical" />
      <Button
        type="primary"
        danger
        onClick={() => {
          message({
            success: false,
            mode: 'save'
          });
        }}
      >
        保存失败
      </Button>
    </>
  );
};
```

## API

```js
const message = useMessage();
```

### Result

| 参数    | 说明     | 类型                   |
| ------- | -------- | ---------------------- |
| message | 提示函数 | `(Options) => Promise` |

### Options

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| success | 是否成功 | `boolean` | `true` |
| mode | 模式 | `action &#124; save` | `action` |
| successText | 成功提示文案 | `ReactNode` | 按照 mode 提示 |
| onSuccess | 成功回调 | `() => void` | - |
| errorText | 失败提示文案 | `ReactNode` | 按照 mode 提示 |
| onError | 失败回调 | `() => void` | - |
| messageConfig | message 配置 | [MessageProps](https://ant.design/components/message-cn/#API) | `{}` |
