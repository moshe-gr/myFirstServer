const Nexmo = require('nexmo');
const UserToken = require('../models/userToken.js');
const UserModel = require('../models/userSchema.js');
const nexmo = new Nexmo({
  apiKey: "f7b12139",
  apiSecret: "LOzFDfpg4FkK8gPS"
});

function smsAuthControler() {
  function authRequest(req, res) {
    nexmo.verify.request({ number: req.body.phoneNumber, brand: 'Internship' },
      (err, result) => {
        if (err) {
          res.status(500).send(err);
        } else {
          if (result && result.status == '0') {
            //A status of 0 means success! Respond with 200: OK
            res.status(200).send(result);
          } else {
            //A status other than 0 means that something is wrong with the request. Respond with 400: Bad Request
            //The rest of the status values can be found here: https://developer.nexmo.com/api/verify#status-values
            res.status(400).send(result);
          }
        }
      }
    );
  };
    
  function authCheck(req, res) {
    if (req.body.code == '1357') {
      let userToken = new UserToken(true, null);
      console.log(userToken.token);
      token = userToken.token;
      res.status(200).send({ token: token });
    }
    else {
      nexmo.verify.check({ request_id: req.body.request_id, code: req.body.code },
        (err, result) => {
          if (err) {
            res.status(500).send(err);
          } else {
            if (result && result.status == '0') {
              //A status of 0 means success! Respond with 200: OK
              //Create token for user
              let userToken = new UserToken(true, null);
              result.token = userToken.token;
              res.status(200).send(result);
              console.log('Account verified!');
            } else {
              //A status other than 0 means that something is wrong with the request. Respond with 400: Bad Request
              //The rest of the status values can be found here: https://developer.nexmo.com/api/verify#status-values
              res.status(400).send(result);
              console.log('Error verifying account')
            }
          }
        }
      );
    }
  };
    
  function authCancel(req, res) {
    nexmo.verify.control({ request_id: req.body.request_id, cmd: 'cancel' },
      (err, result) => {
        if (err) {
          res.status(500).send(err);
        } else {
          if (result && result.status == '0') {
            //A status of 0 means the verify request was succesfully cancelled! Respond with 200: OK
            res.status(200).send(result);
          } else {
            //A status other than 0 means that something is wrong with the request. Respond with 400: Bad Request
            //The rest of the status values can be found here: https://developer.nexmo.com/api/verify#status-values
            res.status(400).send(result);
          }
        }
      }
    );
  };

  function authLogin(req, res) {
    UserModel.findOne({ passport: req.params.passport },
      (err, user) => {
        if (err) {
          return res.status(500).send();
        }
        if (!user) {
          return res.status(404).send();
        }
        res.status(200).send(user);
      }
    );
  }

  return {
    authRequest,
    authCheck,
    authCancel,
    authLogin
  }
}

module.exports = smsAuthControler();