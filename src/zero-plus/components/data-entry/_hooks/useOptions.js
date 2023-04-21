import { useRequest } from 'ahooks';

const normalizeProps = (props) => {
  const { options, value, ...rest } = props;

  const newOptions = options || [];

  return {
    loading: false,
    options: newOptions,
    value: newOptions.length ? value : null,
    ...rest,
  };
};

export default (props) => {
  if (props.hasOwnProperty('options')) {
    return normalizeProps(props);
  }

  const {
    // eslint-disable-next-line
    requestOptions = ({ resolve, reject }) => {
      resolve();
    },
    requestDeps = [],

    ...rest
  } = props;

  const { loading, data: options } = useRequest(
    () => {
      return new Promise((resolve, reject) => {
        requestOptions({ resolve, reject });
      });
    },
    {
      refreshDeps: requestDeps,
    },
  );

  return normalizeProps({
    loading,
    options,
    ...rest,
  });
};
