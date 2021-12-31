const fs = require('fs').promises;

async function getFiles(directoryPath) {
    let allFiles = [];

    const files = await fs.readdir(directoryPath, { withFileTypes: true });

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

module.exports = {
    getFiles
}