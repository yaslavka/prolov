const { writeFile } = require("fs");

async function SveMedia(filePath, base64String) {
  return new Promise((resolve, reject) => {
    writeFile(filePath, Buffer.from(base64String, "base64"), (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
module.exports = {
  SveMedia,
};
