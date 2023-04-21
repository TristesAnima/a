# useLocaleConfig

优雅管理各个国际化配置的hook

```jsx
import React from 'react';
import { Button, Divider } from 'antd';
import { setLocale, getLocale } from 'umi';
import useLocaleConfig from './index.js';

export default () => {
  const text = useLocaleConfig('中文的配置', '英文的配置', '日文的配置');
  return (
    <>
      <p>当前配置:<b>{text}</b>（尝试切换语言看看变化）</p>
      <Button disabled={getLocale() === 'zh-CN'} onClick={() => setLocale('zh-CN')}>切换中文</Button>
      <Divider type="vertical" />
      <Button disabled={getLocale() === 'en-US'} onClick={() => setLocale('en-US')}>切换英文</Button>
    </>
  );
};
```

## API

```js
const currentConfig = useLocaleConfig(zh, en, jp);
```

### Result

| 参数          | 说明         | 类型 |
| ------------- | ------------ | ---- |
| currentConfig | 当前语言配置 | `any` |

### Params

| 参数 | 说明     | 类型  | 默认值 |
| ---- | -------- | ----- | ------ |
| zh   | 中文配置 | `any` | -      |
| en   | 英文配置 | `any` | -      |
| fn   | 日文配置 | `any` | -      |
