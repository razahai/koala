const path = require("path");
const fsSync = require("fs");
const fs = require("fs/promises");

const DATA_DIRECTORY = path.join(__dirname, "data");

async function createFile(filename) {
    if (!fsSync.existsSync(DATA_DIRECTORY)) {
        await fs.mkdir(DATA_DIRECTORY);
    }

    await fs.writeFile(path.join(DATA_DIRECTORY, filename), "");
}

async function readFile(filename) {
    if (!fsSync.existsSync(path.join(DATA_DIRECTORY, filename))) {
        return "";
    }
    const content = await fs.readFile(path.join(DATA_DIRECTORY, filename), "utf-8");
    return content;
}

async function updateFile(filename, content) {
    if (!fsSync.existsSync(path.join(DATA_DIRECTORY, filename)))
        return;
    await fs.writeFile(path.join(DATA_DIRECTORY, filename), content, "utf-8");
}

async function deleteFile(filename) {
    if (!fsSync.existsSync(path.join(DATA_DIRECTORY, filename)))
        return;
    await fs.unlink(path.join(DATA_DIRECTORY, filename));
}

module.exports = {
    createFile,
    updateFile,
    readFile,
    deleteFile
}