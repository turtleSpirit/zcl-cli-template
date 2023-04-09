import path from 'node:path';
import fs from 'node:fs';
import {
    homedir
} from 'node:os';
import {
    pathExistsSync
} from 'path-exists'
import fse from 'fs-extra';
import {
    execa
} from 'execa';
import {
    makePassword
} from '../inquirer.js';
import log from '../log.js';

const TEMP_HOME = '.cli-zcl'; //缓存目录主页
const TEMP_TOKEN = '.token';
const TEMP_PLATFORM = '.git_platform'; // 存储选择git的平台

function createTokenPath() {
    return path.resolve(`${homedir()}/${TEMP_HOME}`, TEMP_TOKEN);
}

function createPlatformPath() {
    return path.resolve(homedir(), TEMP_HOME, TEMP_PLATFORM);
}

function getGitPlatform() {
    if (pathExistsSync(createPlatformPath())) {
        return fse.readFileSync(createPlatformPath()).toString();
    }
    return null;
}

class GitServer {
    constructor() {

    }

    async init() {
        const tokenPath = createTokenPath();
        // 如果token文件不存在，就存入token
        if (pathExistsSync(tokenPath)) {
            this.token = fse.readFileSync(tokenPath).toString();
        } else {
            this.token = await this.getToken();
            fs.writeFileSync(tokenPath, this.token)
        }
        log.verbose('token:', this.token);
    }

    getToken() {
        return makePassword({
            message: '请输入token信息',
            validate(token) { // 验证流程，不通过则会一直在当前流程
                if (token.length > 0) {
                    return true;
                }
                return 'token必须输入'
            }
        });
    }

    removeToken() {
        const tokenPath = createTokenPath();
        // 如果token文件不存在，就存入token
        if (pathExistsSync(tokenPath)) {
            fse.removeSync(tokenPath);
        }
    }

    savePlatform(platform) {
        fs.writeFileSync(createPlatformPath(), platform);
    }

    cloneRepo(targetPath, fullName, tag) {
        if (tag) {
            return execa('git', ['-C', targetPath, 'clone', this.getRepoUrl(fullName), '-b', tag]);
        } else {
            return execa('git', ['-C', targetPath, 'clone', this.getRepoUrl(fullName)]);
        }
    }
}

export {
    getGitPlatform,
    createTokenPath,
    createPlatformPath
}
export default GitServer;