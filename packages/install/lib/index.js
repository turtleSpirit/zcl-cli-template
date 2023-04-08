'use strict';

import Command from "@zcl/command";
import {
    makeList,
    GitHub,
    Gitee,
    getGitPlatform,
    log,
    removeFile,
    pathExists,
    createTokenPath,
    createPlatformPath
} from "@zcl/utils";

class InstallCommand extends Command {
    get command() {
        return 'install'
    }

    get description() {
        return 'install project'
    }

    get options() {
        return [
            ['-r --reset', '是否重置git相关信息？', false],
            ['-rt --resetToken', '是否重置git token信息？', false],
            ['-rp --resetPlatform', '是否重置git平台信息？', false]
        ]
    }

    /** 
     * 此处参数获取，和command中设置息息相关 
     * 例：install [name] action中参数第一个为name 
     * install action中参数第一个为options
     */
    async action([opts]) {
        log.verbose('install opts:', opts);
        const tokenPath = createTokenPath();
        const platformPath = createPlatformPath();

        // 重置git信息
        const {
            reset,
            resetToken,
            resetPlatform
        } = opts;
        if (reset) {
            if (pathExists(tokenPath)) {
                removeFile(tokenPath);
            }
            if (pathExists(platformPath)) {
                removeFile(platformPath);
            }
        }
        if (!reset && resetToken && pathExists(resetToken)) {
            removeFile(tokenPath);
        }
        if (!reset && resetPlatform) {
            removeFile(tokenPath);
        }

        let platform = getGitPlatform();
        if (!platform) {
            platform = await makeList({
                message: '请选择git平台',
                choices: [{
                        name: 'GitHub',
                        value: 'github'
                    },
                    {
                        name: 'Gitee',
                        value: 'gitee'
                    }
                ]
            })
        }
        log.verbose('platform:', platform);
        let gitAPI;
        if (platform === 'github') {
            gitAPI = new GitHub();
        } else {
            gitAPI = new Gitee();
        }
        gitAPI.savePlatform(platform);
        await gitAPI.init();
    }
}

export default function Install(instance) {
    return new InstallCommand(instance);
}