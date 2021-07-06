const AWS = require('aws-sdk');
const s3 = require('../utils/awsSetup');




const s3Config = {
    accessKey: 'AKIAX2DRX3BIPPPRS67J',
    secretKey: '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',
    bucket: 'moshefirstbucket',
    region: 'eu-central-1'
  };
  
AWS.config.logger = console;


function filesController() {

  function getUrl(req, res) {
      if (req.body.filename) {
          let s3cred = s3.s3Credentials(s3Config, { filename: req.body.filename, contentType: req.body.content_type });
          res.json(s3cred);
      } else {
        res.status(400).send({ msg: 'filename is required' });
      }
  }

  return {
      getUrl
  }

}

module.exports = filesController();