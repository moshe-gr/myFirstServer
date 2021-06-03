async function quickstart(pic) {
    // Imports the Google Cloud client library
    const vision = require('@google-cloud/vision');

    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    //const fileName = './resources/WIN_20210526_20_47_22_Pro.jpg';

    const [result] = await client.faceDetection(pic);
    const faces = result.faceAnnotations;
    console.log('Faces:');
    faces.forEach((face, i) => {
    console.log(`  Face #${i + 1}:`);
    console.log(`    Joy: ${face.joyLikelihood}`);
    console.log(`    Anger: ${face.angerLikelihood}`);
    console.log(`    Sorrow: ${face.sorrowLikelihood}`);
    console.log(`    Surprise: ${face.surpriseLikelihood}`);
    });
    return faces.length;
}

module.exports = quickstart();