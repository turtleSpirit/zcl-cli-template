import path from 'node:path';
import fse from 'fs-extra';
import ora from 'ora';
import {
  pathExistsSync
} from 'path-exists';
import {
  log
} from '@zcl/utils';

// 获取下载文件的路径
function getCacheFilePath(targetPath, template) {
  return path.resolve(targetPath, 'node_modules', template.npmName, 'template');
}
//从缓存目录中拷贝文件
function copyFile(targetPath, template, installDir) {
  const originFile = getCacheFilePath(targetPath, template);
  const fileList = fse.readdirSync(originFile); // 读取这个路径下的文件
  const spinner = ora('正在安装模版...').start();
  // copy文件
  fileList.map(file => {
    fse.copySync(`${originFile}/${file}`, `${installDir}/${file}`); // copy文件需要跟上file
  })
  spinner.stop();
  log.success('安装成功');
}

export default function installTemplate(selectedTemplate, opts) {
  const {
    force = false
  } = opts;
  const {
    targetPath,
    name,
    template
  } = selectedTemplate;
  const rootDir = process.cwd(); // 当前所在的文件目录
  fse.ensureDirSync(targetPath); //确保targetPath目录存在
  const installDir = path.resolve(`${rootDir}/${name}`);

  if (pathExistsSync(installDir)) { //判断安装文件是否存在
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
  copyFile(targetPath, template, installDir);
}