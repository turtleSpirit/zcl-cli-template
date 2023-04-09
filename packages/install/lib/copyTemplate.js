import path from 'node:path';
import {
    ora,
    fse,
    getGitProjectPath,
    pathExists,
    log
} from '@zcl/utils';


export default async function copyFile(opts, projectName, fileName) {
    const {
        force
    } = opts;

    // 获取当前目录创建项目文件夹
    const rootDir = process.cwd();
    const installDir = path.resolve(`${rootDir}/${projectName}`);
    if (pathExists(installDir)) { //判断安装文件是否存在
        if (!force) {
            log.error(`当前目录下已存在${installDir}文件夹`);
            return;
        } else {
            fse.removeSync(installDir);
            fse.ensureDirSync(installDir); // 创建文件夹
        }
    } else {
        fse.ensureDirSync(installDir);
    }

    const originFile = path.resolve(getGitProjectPath(), fileName);
    const fileList = fse.readdirSync(originFile); // 读取这个路径下的文件
    const spinner = ora('正在安装模版...').start();
    // copy文件
    fileList.map(file => {
        fse.copySync(`${originFile}/${file}`, `${installDir}/${file}`); // copy文件需要跟上file
    })
    spinner.stop();
    fse.removeSync(originFile); //删除缓存目录
    log.success('安装成功');
}