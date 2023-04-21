import { useState } from 'react';

const normalizeProps = (props) => {
  const {
    tabPanes,
    activeKey,

    ...rest
  } = props;

  const newTabPanes = tabPanes || [];

  const firstTabPaneKey = newTabPanes[0]?.key;

  return {
    ...rest,
    tabPanes: newTabPanes,
    firstTabPaneKey,
    activeKey: activeKey || firstTabPaneKey,
  };
};

export default (props) => {
  if (props.hasOwnProperty('activeKey')) {
    return normalizeProps(props);
  }

  const [activeKey, setActiveKey] = useState();

  const { onChange, ...rest } = props;

  return normalizeProps({
    activeKey,
    onChange: (newActiveKey) => {
      setActiveKey(newActiveKey);
      if (onChange) {
        onChange(newActiveKey);
      }
    },
    ...rest,
  });
};
