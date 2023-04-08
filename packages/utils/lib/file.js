import path from 'node:path';
import {
    homedir
} from 'node:os'; //获取用户当前主目录
import fse from 'fs-extra';
import {
    pathExistsSync
} from 'path-exists';

const TEMP_HOME = '.cli-zcl'; //缓存目录主页
// 创建npm下载模版安装缓存目录
export function makeTargetPath() {
    return path.resolve(`${homedir()}/${TEMP_HOME}`, 'addTemplate');
}
// git项目缓存目录
const TEMP_GIT_PROJECT = 'git_zcl'
export function getGitProjectPath() {
    return path.resolve(`${homedir()}/${TEMP_HOME}`, `${TEMP_GIT_PROJECT}`);
}
// 缓存目录不存在创建缓存目录
export function makeCacheDir(targetPath) {
    if (!pathExistsSync(targetPath)) {
        fse.mkdirpSync(targetPath); // 如果这个路径下任何一个目录不存在就创建一个目录
    }
}
// 删除指定文件
export function removeFile(pathDir) {
    return fse.removeSync(pathDir);
};

// 验证指定文件
export function pathExists(path) {
    return pathExistsSync(path);
};