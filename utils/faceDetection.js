const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient({
    keyFilename: "./effortless-edge-314610-4fd8e556e26f.json"
});

async function detectFaces(inputFile) {
    // Make a call to the Vision API to detect the faces
    const request = { image: {content: inputFile} };
    const results = await client.faceDetection(request);
    const faces = results[0].faceAnnotations;
    const numFaces = faces.length;
    console.log(`Found ${numFaces} face${numFaces === 1 ? '' : 's'}.`);
    return numFaces;
}
module.exports = detectFaces;