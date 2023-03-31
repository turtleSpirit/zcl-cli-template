import path from 'node:path';
import {
  pathExistsSync
} from 'path-exists'; // 判断文件是否存在
import fse from 'fs-extra';
import ora from 'ora';
import {
  execa
} from 'execa';
import {
  log,
  printErrorLog
} from '@zcl/utils';

// 当前目录下创建node_moduless
function getCacheDir(targetPath) {
  return path.resolve(targetPath, 'node_modules'); // npm install时目录下必须存在node_modules文件夹，否则安装不成功
}
// 创建缓存目录
function makeCacheDir(targetPath) {
  const cacheDir = getCacheDir(targetPath); // /Users/zhuchunlai/.cli-zcl/addTemplate/node_modules
  if (!pathExistsSync(cacheDir)) {
    fse.mkdirpSync(cacheDir); // 如果这个路径下任何一个目录不存在就创建一个目录
  }
}
// 下载模版
async function downloadAddTemplate(targetPath, selectedTemplate) {
  const {
    npmName,
    version
  } = selectedTemplate;
  const installCommand = 'npm';
  const installArgs = ['install', `${npmName}@${version}`];
  const cwd = targetPath;
  log.verbose(cwd);
  const subprocess = execa(installCommand, installArgs, {
    cwd
  }) // execa返回一个函数
  await subprocess // 类似 await subprocess()|await execa(installCommand, installArgs, { cwd })
}
export default async function downloadTemplate(selectedTemplate) {
  const {
    targetPath,
    template
  } = selectedTemplate;
  makeCacheDir(targetPath);

  const spinner = ora('正在下载模板...').start();

  try {
    await downloadAddTemplate(targetPath, template);
    spinner.stop();
    log.success('下载模板成功')
  } catch (error) {
    spinner.stop();
    printErrorLog(error, 'error');
  }
}