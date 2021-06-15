const fs = require('fs');
const aws = require('aws-sdk');
const s3 = new aws.S3({
    accessKeyId: 'AKIAX2DRX3BIPPPRS67J',
    secretAccessKey: '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'
});
const uploadFile = (fileName) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: 'moshefirstbucket',
        Key: 'nogo.jpg', // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};

s3.getObject({
    Bucket: 'moshefirstbucket',
    Key: 'nogo.jpg' // File name you want to save as in S3
}, (err, data) => {
    if (err) {
        throw err;
    }
    fs.appendFile("C:/Users/LENOVO/Desktop/New folder/logo.jpg", data.Body, (err)=>{console.log(err);});
})

//uploadFile('logo.jpg');