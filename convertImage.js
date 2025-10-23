const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");

async function convertImagesInDirectory(directoryPaths) {
  for (const directoryPath of directoryPaths) {
    try {
      const files = await fs.readdir(directoryPath, { withFileTypes: true });
      for (const file of files) {
        if (file.isDirectory()) {
          // If it's a directory, recursively call the function
          await convertImagesInDirectory([path.join(directoryPath, file.name)]);
        } else if (path.extname(file.name).toLowerCase() === ".png") {
          const inputPath = path.join(directoryPath, file.name);
          const outputPath = path.join(
            directoryPath,
            path.basename(file.name, ".png") + ".webp",
          );
          await sharp(inputPath).toFile(outputPath);
          console.warn(`Converted ${inputPath} to ${outputPath}`);
        }
      }
      console.warn(`Image conversion complete in ${directoryPath}!`);
    } catch (error) {
      console.error(`Error converting images in ${directoryPath}:`, error);
    }
  }
}

const args = process.argv.slice(2);
const directoryPaths = args;

if (directoryPaths.length === 0) {
  console.error("Please provide a directory path as an argument.");
} else {
  convertImagesInDirectory(directoryPaths);
}
