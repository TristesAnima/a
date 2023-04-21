import CryptoJS from 'crypto-js';

/**
 * key && iv
 */
const defaultKey = '1234567887654321';
const defaultIv = '8765432112345678';

/**
 * 加密
 */
const encrypt = (originalContent, key = defaultKey, iv = defaultIv) => {
  const strContent = JSON.stringify(originalContent);
  const encryptContent = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(strContent),
    CryptoJS.enc.Utf8.parse(key),
    {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  ).ciphertext.toString();
  return encryptContent;
};

/**
 * 解密
 */
const decrypt = (encryptContent, key = defaultKey, iv = defaultIv) => {
  const strContent = CryptoJS.AES.decrypt(
    CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(encryptContent)),
    CryptoJS.enc.Utf8.parse(key),
    {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  )
    .toString(CryptoJS.enc.Utf8)
    .toString();
  const originalContent = JSON.parse(strContent);
  return originalContent;
};

export { encrypt, decrypt };
