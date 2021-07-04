const Encrypt = require ("../utils/encryptUtil.js")
const split = "_!_";
const ttl = 1000 *  60 * 20; //20 minuts time to live

function UserToken(isNew, token, role_number, _id) {
    //come to get new token
    if (isNew) {
        this.role_number = role_number;
        this.expirationTime = Date.now() + ttl;
        this.token = Encrypt.getEncrypt(
            role_number + split +
            _id + split +
            this.expirationTime
        );
    }
    //come with token
    else {
        this.token = token;
        let tokenStr = Encrypt.getDecrypt(token).split(split);
        this.role_number = tokenStr[0];
        this._id = tokenStr[1];
        this.expirationTime = tokenStr[2];
    }
    //use to check if token not expired
    this.isNotExpired = function () {
        if(this.expirationTime && parseInt(this.expirationTime) > Date.now()){
            return true;
        }
        return false;
    }
}

module.exports = UserToken;