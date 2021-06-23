const Encrypt = require ("../utils/encryptUtil.js")
var split = "_!_";
var ttl = 1000 *  60 * 20;

function UserToken (isNew, token, role_number) {
    if (isNew) {
        this.role_number = role_number;
        this.expirationTime = Date.now() + ttl;
        this.token = Encrypt.getEncrypt(
            role_number + split +
            this.expirationTime
        );
    } else {        
        this.token = token;
        var tokenStr = Encrypt.getDecrypt(token).split(split);
        this.role_number = tokenStr[0];
        this.expirationTime = tokenStr[1];
    }

    this.isNotExpired = function () {
        if(this.expirationTime && parseInt(this.expirationTime) > Date.now()){
            return true;
        }
        return false;
    }
}

module.exports = UserToken;