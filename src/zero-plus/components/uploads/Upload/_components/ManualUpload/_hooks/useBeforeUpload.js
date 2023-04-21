export default (props) => {
  const {
    // eslint-disable-next-line
    onFileComplete = (file) => {
      // Override
    },

    // eslint-disable-next-line
    onAllComplete = (files) => {
      // Override
    },

    beforeUploadAsync,
    beforeUpload = () => true,
    ...rest
  } = props;

  return {
    ...rest,
    // prettier-ignore
    beforeUpload: (file, fileList) => {// NOSONAR
      if (beforeUploadAsync) {
        new Promise((resolve, reject) => {
          beforeUploadAsync({ file, fileList, resolve, reject });
        })
          .then(() => {
            file.success = true;
            onFileComplete(file);
          })
          .catch(() => {
            file.success = false;
          })
          .finally(() => {
            if (fileList.every((item) => item.hasOwnProperty('success'))) {
              onAllComplete(fileList.filter((item) => item.success));

              fileList.forEach(item => {
                delete item.success
              })
            }
          });
        return Promise.reject();
      }

      const success = beforeUpload(file, fileList);
      file.success = success;
      if (success) {
        onFileComplete(file);
        if (fileList.length >= 1 && fileList[fileList.length - 1].uid === file.uid) {
          if (fileList.every((item) => item.hasOwnProperty('success'))) {
            onAllComplete(fileList.filter((item) => item.success));

            fileList.forEach(item => {
              delete item.success
            })
          }
        }
      }
      return false;
    },
  };
};
