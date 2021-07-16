const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient({
    projectId: "effortless-edge-314610",
    credentials: {
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL
    }
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