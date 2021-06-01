const crypto_js = require('crypto-js');
const key = "asfcrsADSFreghyrvsdpl";

function token() {
    function getEncrypt(input) {
        const encrypt = crypto_js.AES.encrypt(input, key);
        return encrypt.toString();
    }
    function getDecrypt(input) {
        const decrypt = crypto_js.AES.decrypt(input, key);
        return decrypt.toString(crypto_js.enc.Utf8);
    }
    return {
        getEncrypt,
        getDecrypt
    }
}

module.exports = token();