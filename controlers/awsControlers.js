const { S3 } = require('aws-sdk');
const AWS = require('aws-sdk');
const awsSetup = require('../utils/awsSetup');


const s3Config = {
    accessKey: process.env.AWS_ACCESS_KEY_ID,
    secretKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: 'moshefirstbucket',
    region: 'eu-central-1'
  };
  
AWS.config.logger = console;


function filesController() {

  function getUrl(req, res) {
    if (req.body.filename) {
      let s3cred = awsSetup.s3Credentials(
        s3Config,
        { filename: req.body.filename, contentType: req.body.content_type }
      );
        res.json(s3cred);
    } else {
      res.status(400).send({ msg: 'filename is required' });
    }
  }

  function deleteFile(req, res) {
    if (req.user > 2) {
      return res.status(403).send({ msg: 'request denied' });
    }
    new S3(s3Config).deleteObject(
      { Key: req.params.name, Bucket: 'moshefirstbucket' },
      (err, data) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(200).send(data);
      }
    );
  }

  return {
    getUrl,
    deleteFile
  }

}

module.exports = filesController();