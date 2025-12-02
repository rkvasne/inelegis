const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../src/js');
const MODULES_DIR = path.join(ROOT, 'modules');

const STRUCTURE = {
    'services': ['search-logic.js', 'analytics.js', 'storage.js', 'search-history.js'],
    'utils': ['constants.js', 'core-utils.js', 'formatters.js', 'exceptions.js', 'sanitizer.js'],
    'components': ['components.js', 'article-builder.js', 'theme-manager.js', 'modal-manager.js', 'theme-bootstrap.js'],
    'ui': ['dom-manipulation.js', 'ui-events.js', 'history-page.js', 'terms-gate.js']
};

const FILE_MAP = {}; // filename -> newRelativePath (e.g., '../utils/constants.js')

function moveFiles() {
    // 1. Create Dirs
    Object.keys(STRUCTURE).forEach(dir => {
        const fullPath = path.join(ROOT, dir);
        if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
    });

    // 2. Move Files & Build Map
    Object.entries(STRUCTURE).forEach(([dir, files]) => {
        files.forEach(file => {
            const oldPath = path.join(MODULES_DIR, file);
            const newPath = path.join(ROOT, dir, file);

            if (fs.existsSync(oldPath)) {
                fs.renameSync(oldPath, newPath);
                console.log(`Moved ${file} -> ${dir}/${file}`);
                FILE_MAP[file] = { dir, name: file };
            } else {
                console.warn(`Skipping missing file: ${file}`);
            }
        });
    });

    // 3. Move README if exists in modules
    const readmeOld = path.join(MODULES_DIR, 'README.md');
    if (fs.existsSync(readmeOld)) {
        fs.renameSync(readmeOld, path.join(ROOT, 'README-modules.md'));
    }

    // 4. Remove empty modules dir
    try {
        if (fs.existsSync(MODULES_DIR) && fs.readdirSync(MODULES_DIR).length === 0) {
            fs.rmdirSync(MODULES_DIR);
        }
    } catch (e) { console.error('Could not remove modules dir', e); }
}

function updateImportsInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Regex to capture imports: import ... from './modules/X.js' or './X.js'
    // Logic depends on where the file IS.

    const fileDir = path.dirname(filePath);
    const isRoot = fileDir === ROOT; // script.js

    // Iterate over all known files
    Object.keys(FILE_MAP).forEach(fileName => {
        const fileInfo = FILE_MAP[fileName];

        // Patterns to look for:
        // 1. './modules/fileName' (from root script.js)
        // 2. './fileName' (from sibling in old modules dir)

        if (isRoot) {
            // script.js context: replace './modules/search-logic.js' with './services/search-logic.js'
            const oldImport = `./modules/${fileName}`;
            const newImport = `./${fileInfo.dir}/${fileName}`;
            if (content.includes(oldImport)) {
                content = content.replaceAll(oldImport, newImport);
                changed = true;
            }
        } else {
            // Sibling context (e.g. search-logic.js importing constants.js)
            // Was: import ... from './constants.js'
            // Now: search-logic is in `services`, constants is in `utils`.
            // Rel path: `../utils/constants.js`

            const oldImport = `./${fileName}`;

            // Calculate relative path from Current File Dir to Target File Dir
            const currentDirName = path.basename(fileDir); // e.g., 'services'
            const targetDirName = fileInfo.dir;

            let newRelPath = '';
            if (currentDirName === targetDirName) {
                newRelPath = `./${fileName}`;
            } else {
                newRelPath = `../${targetDirName}/${fileName}`;
            }

            // Replace exact matches of `from './filename.js'` or `from "./filename.js"`
            // Note: simple string replace might be dangerous if not precise. Use regex.
            const regex = new RegExp(`from ['"]\\.\\/${fileName}['"]`, 'g');
            if (regex.test(content)) {
                content = content.replace(regex, `from '${newRelPath}'`);
                changed = true;
            }
        }
    });

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated imports in ${path.basename(filePath)}`);
    }
}

function updateAllFiles() {
    // Update script.js
    const scriptPath = path.join(ROOT, 'script.js');
    if (fs.existsSync(scriptPath)) updateImportsInFile(scriptPath);

    // Update all moved files
    Object.keys(FILE_MAP).forEach(fileName => {
        const info = FILE_MAP[fileName];
        const filePath = path.join(ROOT, info.dir, fileName);
        if (fs.existsSync(filePath)) updateImportsInFile(filePath);
    });
}

// Execute
moveFiles();
updateAllFiles();
