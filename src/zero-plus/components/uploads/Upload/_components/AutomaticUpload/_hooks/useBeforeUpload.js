export default (props) => {
  const { beforeUploadAsync, beforeUpload = () => true, ...rest } = props;

  return {
    ...rest,
    beforeUpload: (file, fileList) => {
      if (beforeUploadAsync) {
        return new Promise((resolve, reject) => {
          beforeUploadAsync({ file, fileList, resolve, reject });
        });
      }
      return beforeUpload(file, fileList);
    },
  };
};
