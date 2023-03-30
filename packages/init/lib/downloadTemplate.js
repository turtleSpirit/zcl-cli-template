import path from 'node:path';
import {
  pathExistsSync
} from 'path-exists'; // 判断文件是否存在
import fse from 'fs-extra';
import ora from 'ora';
import {
  log,
  printErrorLog
} from '@zcl/utils';

// 获取缓存目录
function getCacheDir(targetPath) {
  return path.resolve(targetPath, 'node_modules'); // npm install时目录下必须存在node_modules文件夹，否则安装不成功
}
// 创建缓存目录
function makeCacheDir(targetPath) {
  const cacheDir = getCacheDir(targetPath);
  if (!pathExistsSync(cacheDir)) {
    fse.mkdirpSync(cacheDir); // 如果这个路径下任何一个目录不存在就创建一个目录
  }
}
export default function downloadTemplate(selectedTemplate) {
  const {
    targetPath,
    template
  } = selectedTemplate;
  makeCacheDir(targetPath);

  const spinner = ora('正在下载模板...').start();

  try {
    setTimeout(() => {
      spinner.stop();
      log.success('下载模板成功')
    }, 2000)
  } catch (error) {
    spinner.stop();
    printErrorLog(error, 'error');
  }
}