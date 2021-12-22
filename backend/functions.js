const crypto = require("crypto");

function createHash() {
    const bytes = crypto.randomBytes(16);
    const hash = crypto.createHash('sha256').update(bytes).digest("hex");
    return hash;
}

module.exports = {
    createHash
}