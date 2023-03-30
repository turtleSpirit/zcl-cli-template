import path from 'node:path';
import fse from 'fs-extra';
import {
  pathExistsSync
} from 'path-exists';
import {
  log
} from '@zcl/utils';

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
}