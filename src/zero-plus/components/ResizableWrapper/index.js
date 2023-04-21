import classNames from 'classnames';
import React from 'react';
import styles from './index.less';
import DefaultBox from './_components/DefaultBox';
import DefaultWrapper from './_components/DefaultWrapper';

export default (props) => {
  const {
    className,

    renderChildren = ({ Wrapper, Box }) => {
      return (
        <Wrapper>
          <Box width={300}>床前明月光，疑是地上霜。</Box>

          <Box width={300}>举头望明月，低头思故乡。</Box>

          <div style={{ width: 'auto' }}>静夜思</div>
        </Wrapper>
      );
    },
    ...rest
  } = props;

  return (
    <div className={classNames(styles.main, className)} {...rest}>
      {renderChildren({
        Wrapper: DefaultWrapper,
        Box: DefaultBox,
      })}
    </div>
  );
};
