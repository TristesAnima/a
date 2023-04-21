const fixTwoCNChar = (text) => {
  if (/^[\u4e00-\u9fa5]{2}$/.test(text)) {
    return text.split('').join(' ');
  }
  return text;
};

export default (props) => {
  const {
    type,

    addonBefore,
    children,
    addonAfter,
    ...rest
  } = props;

  if (typeof children !== 'string' || ['text', 'link'].includes(type)) {
    return props;
  }

  return {
    ...rest,
    type,
    children: (
      <>
        {addonBefore}
        {fixTwoCNChar(children)}
        {addonAfter}
      </>
    ),
  };
};
