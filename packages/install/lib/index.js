'use strict';
import path from 'node:path';
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
    printErrorLog,
    getGitProjectPath,
    makeCacheDir,
    fse,
    GitServer
} from "@zcl/utils";
import copyFile from "./copyTemplate.js";

class InstallCommand extends Command {
    get command() {
        return 'install [name]'
    }

    get description() {
        return 'install project'
    }

    get options() {
        return [
            ['-f --force', '是否强制更新', false],
            ['-r --reset', '重置git相关信息？', false],
            ['-rt --resetToken', '重置git token信息？', false],
            ['-rp --resetPlatform', '重置git平台信息？', false]
        ]
    }

    /** 
     * 此处参数获取，和command中设置息息相关 
     * 例：install [name] action中参数第一个为name 
     * install action中参数第一个为options
     */
    async action([name, opts]) {
        // #region 下载默认git仓库
        let projectName = name;
        if (!projectName) {
            projectName = await this.inputName();
        }
        this.gitAPI = new Gitee();
        const fileName = await this.downloadRepo(opts);
        copyFile(opts, projectName, fileName);

        //#endregion

        // #region 根据git接口获取
        // await this.generateGitAPI(opts);
        // // await this.searchGitAPI();
        // const fileName = await this.downloadRepo(opts);
        // copyFile(opts, fileName);
        //#endregion

    }

    async inputName() {
        return makeInput({
            message: '请输入创建项目的名称',
            validate: name => {
                if (name.length > 0) {
                    return true;
                }
                return false;
            }
        })
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

    async downloadRepo(opts) {
        const {
            force
        } = opts;
        const targetPath = getGitProjectPath();
        makeCacheDir(targetPath);

        const fullName = 'panjiachen/vue-element-admin';

        const fileName = fullName.split('/')[1];
        const filePath = path.resolve(targetPath, fileName);

        if (pathExists(filePath)) { //判断安装文件是否存在
            if (!force) {
                log.error(`当前目录下已存在${filePath}文件夹`);
                return;
            } else {
                fse.removeSync(filePath);
            }
        }
        const spinner = ora(`正在下载${fullName}仓库...`).start();
        try {
            await this.gitAPI.cloneRepo(targetPath, fullName);
            spinner.stop();
            log.success('下载成功');
            return fileName;
        } catch (error) {
            spinner.stop();
            printErrorLog(error);
            return null;
        }
    }
}

export default function Install(instance) {
    return new InstallCommand(instance);
}