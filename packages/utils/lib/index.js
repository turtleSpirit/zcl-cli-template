'use strict';
import {
    execa
} from 'execa';
import ora from 'ora';
import fse from 'fs-extra';
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
import {
    getGitPlatform,
    createTokenPath,
    createPlatformPath
} from './git/GitServer.js';
import {
    removeFile,
    pathExists,
    getGitProjectPath,
    makeTargetPath
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
    log,
    isDebug,
    makeList,
    makeInput,
    getLatestVersion,
    GitHub,
    Gitee,
    getGitPlatform,
    // 文件及路径处理相关
    removeFile,
    pathExists,
    createTokenPath,
    createPlatformPath,
    getGitProjectPath,
    makeTargetPath
};