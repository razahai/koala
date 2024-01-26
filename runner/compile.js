const fs = require("fs/promises");
const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const DATA_DIRECTORY = path.join(__dirname, "data");
const FLUTTER_DIRECTORY = path.join(__dirname, "tmp/flutter_runner");

async function compileFlutter(filename) {
    await fs.copyFile(path.join(DATA_DIRECTORY, filename), path.join(FLUTTER_DIRECTORY, "lib/main.dart"));
    
    const flutterCommand = "flutter build web --web-renderer html";
    const { stdout, stderr } = await exec(flutterCommand, { cwd: FLUTTER_DIRECTORY });

    if (stderr)
        return {
            "success": false,
            "error": stderr
        }

    const flutterJS = await fs.readFile(path.join(FLUTTER_DIRECTORY, "build/web/flutter.js"), "utf-8");
    const mainDartJS = await fs.readFile(path.join(FLUTTER_DIRECTORY, "build/web/main.dart.js"), "utf-8");
    
    return {
        "success": true,
        "flutterJS": flutterJS,
        "mainDartJS": mainDartJS
    }
}

module.exports = {
    compileFlutter
}