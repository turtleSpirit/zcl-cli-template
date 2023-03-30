import path from 'node:path';
import {
  homedir
} from 'node:os'; //获取用户当前主目录
import {
  log,
  makeList,
  makeInput,
  getLatestVersion
} from '@zcl/utils';

const ADD_TYPE_PROJECT = 'project';
const ADD_TYPE_PAGE = 'page';
const ADD_TEMPLATE = [{
  name: 'vue3项目模版',
  value: 'template-vue3',
  npmName: '@imooc.com/template-vue3',
  version: '1.0.1'
}, {
  name: 'react18项目模版',
  value: 'template-react18',
  npmName: '@imooc.com/template-react18',
  version: '1.0.0'
}];
const ADD_TYPE = [{
  name: '项目',
  value: ADD_TYPE_PROJECT
}, {
  name: '页面',
  value: ADD_TYPE_PAGE
}];
const TEMP_HOME = '.cli-zcl'; //缓存目录主页

// 获取创建类型
function getAddType() {
  return makeList({
    choices: ADD_TYPE,
    message: " 请选择初始化类型",
    defaultValue: ADD_TYPE_PROJECT
  })
}
// 获取创建name
function getAddName() {
  return makeInput({
    message: '请输入项目名称',
    defaultValue: '',
    validate(name) { // 验证流程，不通过则会一直在当前流程
      if (name.length > 0) {
        return true;
      }
      return '项目名称必须输入'
    }
  })
}
// 获取创建的模版
function getAddTemplate() {
  return makeList({
    choices: ADD_TEMPLATE,
    message: "请选择模版"
  })
}

// 安装缓存目录
function makeTargetPath() {
  return path.resolve(`${homedir()}/${TEMP_HOME}`, 'addTemplate');
}

export default async function createTemplate(name, opts) {
  const addType = await getAddType();
  log.verbose('addType', addType)
  if (addType === ADD_TYPE_PROJECT) {
    const addName = await getAddName();
    log.verbose('addName', addName)
    const addTemplate = await getAddTemplate();
    log.verbose('addTemplate', addTemplate);
    const selectedTemplate = ADD_TEMPLATE.find(item => item.value === addTemplate);
    log.verbose('selectedTemplate', selectedTemplate);
    // 获取最新版本
    const latestVersion = await getLatestVersion(selectedTemplate.npmName);
    log.verbose('latestVersion', latestVersion);
    // 设置模版的最新版本号
    selectedTemplate.version = latestVersion;

    // 获取缓存目录
    const targetPath = makeTargetPath();
    return {
      type: addType,
      name: addName,
      template: selectedTemplate,
      targetPath
    }
  }
}