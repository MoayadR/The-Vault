const CryptoJS = require('crypto-js');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY; // this is not working for now

const encrypt = (text) => {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
}
const decrypt = (encryptedText) => {
    return CryptoJS.AES.decrypt(encryptedText, secretKey).toString(CryptoJS.enc.Utf8);
}


module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
}