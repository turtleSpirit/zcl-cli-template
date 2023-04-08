import fse from 'fs-extra';
import {
    pathExistsSync
} from 'path-exists';

export function removeFile(pathDir) {
    return fse.removeSync(pathDir);
};
export function pathExists(path) {
    return pathExistsSync(path);
};