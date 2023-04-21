import { FooterToolbar } from '@ant-design/pro-layout';
import { useIntl } from '@umijs/max';
import { Button } from 'antd';
import * as PropTypes from 'prop-types';
import { useContext } from 'react';
import Context from '../../context';

const propTypes = {
  prevActions: PropTypes.node,
  onPrev: PropTypes.func,
  onNext: PropTypes.func,
};

const defaultProps = {
  prevActions: null,
  onPrev: (prev) => prev(),
  onNext: (next) => next(),
};

const Index = (props) => {
  const { prevActions, onPrev, onNext } = props;
  const { formatMessage } = useIntl();
  const { current, stepsLength, prev, next } = useContext(Context);

  return (
    <FooterToolbar>
      {prevActions}
      {current !== 0 && (
        <Button
          type="primary"
          onClick={() => {
            onPrev(prev);
          }}
        >
          {formatMessage({ id: '上一步' })}
        </Button>
      )}
      {current === stepsLength - 1 ? (
        <Button type="primary">{formatMessage({ id: '完成' })}</Button>
      ) : (
        <Button
          type="primary"
          onClick={() => {
            onNext(next);
          }}
        >
          {formatMessage({ id: '下一步' })}
        </Button>
      )}
    </FooterToolbar>
  );
};

Index.propTypes = propTypes;

Index.defaultProps = defaultProps;

Index.displayName = 'FooterToolbar';

export default Index;
