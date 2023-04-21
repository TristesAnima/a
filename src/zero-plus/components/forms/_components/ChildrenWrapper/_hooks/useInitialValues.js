import { useRequest } from 'ahooks';

const normalizeProps = (props) => {
  const { initialValues, ...rest } = props;

  const newInitialValues = initialValues || {};

  return {
    loading: false,
    initialValues: newInitialValues,
    ...rest,
  };
};

export default (props) => {
  if (props.hasOwnProperty('initialValues')) {
    return normalizeProps(props);
  }

  const {
    // eslint-disable-next-line
    requestInitialValues = ({ resolve, reject }) => {
      resolve();
    },
    requestDeps = [],

    ...rest
  } = props;

  const { loading, data: initialValues } = useRequest(
    () => {
      return new Promise((resolve, reject) => {
        requestInitialValues({ resolve, reject });
      });
    },
    {
      refreshDeps: requestDeps,
    },
  );

  return normalizeProps({
    loading,
    initialValues,
    ...rest,
  });
};
