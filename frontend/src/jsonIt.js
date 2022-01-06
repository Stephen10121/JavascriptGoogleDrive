const convertToJson = (theFiles) => {
    const output = {};
    let current;

    for (const path of theFiles) {
        current = output;

        for (const segment of path.split('/')) {
            if (segment !== '') {
                if (!(segment in current)) {
                    current[segment] = {};
                }
                current = current[segment];
            }
        }
    }
    return(output);
}

module.exports = {
    convertToJson
}