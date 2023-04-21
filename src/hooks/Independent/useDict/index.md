# useDict

优雅的管理字典的 hook

```jsx
import React from 'react';
import useDict from './index.js';

export default () => {
  const [list, map, ENUM] = useDict([
    {
      label: '中文',
      enum: 'CN',
      value: 'CN',
    },
    {
      label: '英文',
      enum: 'EN',
      value: 'EN',
    },
  ]);
  return <pre>{JSON.stringify({ list, map, ENUM }, null, 2)}</pre>;
};
```

## API

```js
const [list, map, ENUM] = useDict(dictionaries, options);
```

### Dict

| 参数  | 说明                     | 类型                   |
| ----- | ------------------------ | ---------------------- |
| label | 文本（可自定义字段名称） | `string`               |
| enum  | 枚举名称                 | `string`               |
| value | 值（可自定义字段名称）   | `string &#124; number` |

### Result

| 参数 | 说明         | 类型              |
| ---- | ------------ | ----------------- |
| list | 数组类型字典 | `Dict[]`          |
| map  | Map 类型字典 | `{ value: Dict }` |
| ENUM | 枚举类型字典 | `{ enum: value }` |

### Params

| 参数         | 说明             | 类型      | 默认值 |
| ------------ | ---------------- | --------- | ------ |
| dictionaries | 字典             | `Dict[]`  | `[]`   |
| options      | [配置](#options) | `Options` | `{}`   |

### Options

| 参数          | 说明                 | 类型      | 默认值  |
| ------------- | -------------------- | --------- | ------- |
| deps          | 依赖                 | `array`   | `[]`    |
| labelPropName | label 的属性名称     | `string`  | `label` |
| valuePropName | value 的属性名称     | `string`  | `value` |
| intl          | label 是否需要国际化 | `boolean` | `false` |
