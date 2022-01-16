const fs = require('fs');

async function getTFiles(directoryPath) {
    let allFiles = [];

    const files = await fs.promises.readdir(directoryPath, { withFileTypes: true });

    for (const item of files) {
        if (item.isDirectory()) {
            allFiles.push(`${directoryPath}/${item.name}`);
            allFiles = allFiles.concat(await getFiles(`${directoryPath}/${item.name}`));
        } else {
            allFiles.push(`${directoryPath}/${item.name}`);
        }
    }
    return allFiles;
}

async function getFiles(directoryPath) {
    fs.access(directoryPath, (error) => {
        if (error) {
            fs.mkdir(directoryPath, { recursive: true }, (err) => {
                if (err) {
                    throw err;
                }
                return getTFiles(directoryPath);
            });
        }
    });
    return getTFiles(directoryPath);
}

module.exports = {
    getFiles
}