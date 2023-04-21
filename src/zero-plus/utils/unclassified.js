/**
 * 文件下载
 */
const downloadFile = ({ filename, href, bytes }) => {
  const link = document.createElement('a');
  link.target = '_blank';
  link.download = filename;
  if (href) {
    link.href = href;
    link.click();
  } else {
    const objectURL = URL.createObjectURL(new Blob([bytes]));
    link.href = objectURL;
    link.click();
    URL.revokeObjectURL(objectURL);
  }
};

/**
 * 数组去重
 */
const removeDuplicates = ({ array = [], eq = (a, b) => a === b }) => {
  return array.filter(
    (outerItem, index) => array.findIndex((innerItem) => eq(innerItem, outerItem)) === index,
  );
};

/**
 * 获取文件类型
 */
const getFiletype = (text) => {
  return text.match(/(?<=(^|\.))\w+(?=$)/g)?.[0];
};

/**
 * 依次执行
 * [() => Promise.resolve(1), () => Promise.resolve(2), () => Promise.resolve(3)]
 */
const runOneByOne = async (fnList = []) => {
  for (const fn of fnList) {
    await fn(); // eslint-disable-line
  }
};

/**
 * 比较函数
 */
const compareFunction = (a, b) => {
  if (!a && !b) {
    return 0;
  }
  if (!a || !b) {
    if (!a) {
      return -1;
    }
    return 1;
  }
  if (typeof a === 'string' || typeof b === 'string') {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  }
  if (typeof a === 'number' || typeof b === 'number') {
    return a - b;
  }
  return 0;
};

export { downloadFile, removeDuplicates, getFiletype, runOneByOne, compareFunction };
