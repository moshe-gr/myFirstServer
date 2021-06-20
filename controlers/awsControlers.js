const AWS = require('aws-sdk');
const crypto = require('crypto');
const s3 = require('../utils/awsSetup');
var path = require('path');




var s3Config = {
    accessKey: 'AKIAX2DRX3BIPPPRS67J',
    secretKey: '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',
    bucket: 'moshefirstbucket',
    region: 'eu-central-1'
  };
  
AWS.config.logger = console;


var filesController = function () {

    function getUrl(req, res) {
        if (req.body.filename) {
            // var filename =
            //     crypto.randomBytes(16).toString('hex') +
            //     path.extname(req.body.filename);
            //     if (req.body.filepath) {
            //       filename = req.body.filepath + '/' + filename;
            //     }
            //     console.log('filename ' + filename);

            let s3cred = s3.s3Credentials(s3Config, { filename: req.body.filename, contentType: req.body.content_type });
            res.json(s3cred);
        } else {
            res.status(400).send('filename is required');
        }

    }
    function getHtmlUrl(req, res) {
        
        console.log('getHtmlUrl')
        if (req.body.filename) {
            var filename =
                crypto.randomBytes(16).toString('hex') +
                path.extname(req.body.filename);
            let s3cred = s3.s3Credentials(s3Config, { filename: filename, contentType: req.body.content_type });
            console.log('/server_s3_credentials2')
            console.log(s3cred)
            console.log('/server_s3_credentials3')
            res.json(s3cred);
        } else {
            res.status(400).send('filename is required');
        }

    }

    function downloadFileFromAws(req, res) {          
        var axios = require('axios');
        var data = '{\n    "url":"' + req.params.mUrl + '",\n    "viewportWidth": 1280\n}';
        
        var config = {
          method: 'post',
          url: 'https://api.sejda.com/v2/html-pdf',
          headers: { 
            'content-type': ' application/json', 
            'Authorization': ' Token: api_public_cd6a7f2321514c7aab0447fa1dfa3c79', 
            'Cookie': 'JSESSIONID=D73F07C8A7A67094B67986F7C9412539'
          },
          data : data,
          responseType: 'stream'
        };
        
        axios(config)
        .then(function (response) {
          // console.log(JSON.stringify(response.data));
          console.log(response.headers);
          console.log(response.code);
          res.set({
            'Content-Type': response.headers['content-type'],
            'Content-Length': response.headers['content-length']
          })
          
          response.data.pipe(res);
        })
        .catch(function (error) {
          console.log(error);
        });
                  
          
    }


    return {
        getUrl,
        downloadFileFromAws,
        getHtmlUrl,
    }

}

module.exports = filesController();