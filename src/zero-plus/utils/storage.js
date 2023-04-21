/**
 * sessionStorage
 */
const getSessionStorageItem = (key) => {
  const text = sessionStorage.getItem(key);
  return JSON.parse(text)?.value;
};
const setSessionStorageItem = (key, value) => {
  const text = JSON.stringify({
    type: typeof value,
    value,
  });
  sessionStorage.setItem(key, text);
};
const removeSessionStorageItem = (key) => {
  sessionStorage.removeItem(key);
};

/**
 * localStorage
 */
const getLocalStorageItem = (key) => {
  const text = localStorage.getItem(`${process.env.PROJECT_CODE}_${key}`);
  return JSON.parse(text)?.value;
};
const setLocalStorageItem = (key, value) => {
  const text = JSON.stringify({
    type: typeof value,
    value,
  });
  localStorage.setItem(`${process.env.PROJECT_CODE}_${key}`, text);
};
const removeLocalStorageItem = (key) => {
  localStorage.removeItem(`${process.env.PROJECT_CODE}_${key}`);
};

/**
 * token
 */
const getToken = () => {
  return getLocalStorageItem('token');
};
const setToken = (value) => {
  return setLocalStorageItem('token', value);
};
const removeToken = () => {
  return removeLocalStorageItem('token');
};

/**
 * 数据字典
 */
const getDict = () => {
  return getLocalStorageItem('dict') || {};
};
const setDict = (value) => {
  return setLocalStorageItem('dict', value);
};

export {
  getSessionStorageItem,
  setSessionStorageItem,
  removeSessionStorageItem,
  getLocalStorageItem,
  setLocalStorageItem,
  removeLocalStorageItem,
  getToken,
  setToken,
  removeToken,
  getDict,
  setDict,
};
