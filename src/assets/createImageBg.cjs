const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

const srcDir = path.resolve(__dirname, 'imgsrc/');
const destDir = path.resolve(__dirname, 'imgBg/');

function createImageBg(srcDir, destDir) {
    fs.readdir(srcDir, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }

        files.forEach((file, index) => {
            console.log(`Processing file ${file}`);
            const srcPath = path.join(srcDir, file);
            const fileExtension = path.extname(file);
            const fileNameWithoutExtension = path.basename(file, fileExtension);
            const destPath = path.join(destDir, `${fileNameWithoutExtension}-${index + 1}${fileExtension}`);

            sharp(srcPath)
            .metadata()
            .then(metadata => {
                const originalHeight = metadata.height;
                const originalWidth = metadata.width;

                const targetWidth = Math.floor(originalHeight / 3);
                const slicesCount = Math.floor(originalWidth / targetWidth);

                for (let i = 0; i < slicesCount; i++) {
                    const leftOffset = i * targetWidth;
                    sharp(srcPath)
                    .extract({
                        left: leftOffset,
                        top: 0,
                        width: targetWidth,
                        height: originalHeight
                    })
                    .toFile(path.join(destDir, `${fileNameWithoutExtension}-${index + 1}-${i + 1}${fileExtension}`))
                    .then(() => {
                        console.log(`Extracted and saved slice ${i + 1} of ${file}`);
                    })
                    .catch(err => {
                        console.error(`Error processing slice ${i + 1} of ${file}:`, err);
                    });
                }
                
            })
        })
    });

}

createImageBg(srcDir, destDir);