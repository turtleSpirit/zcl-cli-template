'use strict';

import Command from "@zcl/command";
import {
    ora,
    makeInput,
    makeList,
    GitHub,
    Gitee,
    getGitPlatform,
    log,
    removeFile,
    pathExists,
    createTokenPath,
    createPlatformPath,
    printErrorLog
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
        await this.generateGitAPI(opts);
        // await this.searchGitAPI();
        this.downloadRepo();
    }

    async generateGitAPI(opts) {
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
        // 
        if (!reset && resetToken && pathExists(tokenPath)) {
            removeFile(tokenPath);
        }
        if (!reset && resetPlatform && pathExists(platformPath)) {
            removeFile(platformPath);
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
        this.gitAPI = gitAPI;
        gitAPI.savePlatform(platform);
        await gitAPI.init();


    }

    async searchGitAPI() {
        const query = await makeInput({
            message: "请输入搜索关键词",
            validate(value) {
                if (value.length > 0) {
                    return true;
                }
                return "请输入搜索关键词";
            }
        })
        const res = await this.gitAPI.searchRepositories({
            q: query,
            per_page: 10
        });
    }

    async downloadRepo() {
        const fullName = 'panjiachen/vue-element-admin';
        const spinner = ora(`正在下载${fullName}仓库...`).start();

        try {
            await this.gitAPI.cloneRepo(fullName);
            spinner.stop();
            log.success('下载成功');
        } catch (error) {
            spinner.stop();
            printErrorLog(error);
        }
    }
}

export default function Install(instance) {
    return new InstallCommand(instance);
}