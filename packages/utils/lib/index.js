'use strict';
import {
    execa
} from 'execa';
import ora from 'ora';
import fse from 'fs-extra';
import ejs from 'ejs'; // 动态模版渲染
import glob from 'glob'; // 获取文件夹下排除之外的文件
import log from './log.js';
import isDebug from './isDebug.js';
import {
    makeList,
    makeInput
} from './inquirer.js';
import {
    getLatestVersion
} from './npm.js';
import GitHub from './git/Github.js';
import Gitee from './git/Gitee.js';
import GitServer, {
    getGitPlatform,
    createTokenPath,
    createPlatformPath
} from './git/GitServer.js';
import {
    removeFile,
    pathExists,
    getGitProjectPath,
    makeTargetPath,
    makeCacheDir
} from './file.js';

export function printErrorLog(e, type) {
    if (isDebug()) {
        log.error(type, e)
    } else {
        log.error(type, e.message)
    }
}

export {
    execa,
    ora,
    fse,
    ejs,
    glob,
    log,
    isDebug,
    makeList,
    makeInput,
    getLatestVersion,
    GitServer,
    GitHub,
    Gitee,
    getGitPlatform,
    // 文件及路径处理相关
    removeFile,
    pathExists,
    createTokenPath,
    createPlatformPath,
    getGitProjectPath,
    makeTargetPath,
    makeCacheDir
};