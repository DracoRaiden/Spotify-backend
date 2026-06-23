const { ImageKit } = require("@imagekit/nodejs");
const dotenv = require("dotenv");
dotenv.config();

const ImageKitClient = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadFile(file) {
  const result = await ImageKitClient.files.upload({
    file,
    fileName: "music" + Date.now(),
    folder: "yt-complete-backend/music",
  });
  return result;
}

module.exports = {
  uploadFile,
};
