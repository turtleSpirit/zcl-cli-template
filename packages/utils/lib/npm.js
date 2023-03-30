import axios from 'axios';
import urlJoin from 'url-join'; // 拼接url地址
import ora from 'ora';

// 获取npm包的信息
function getNpmInfo(npmName) {
  // cnpm源：https://registry.npm.taobao.org/
  const registry = 'https://registry.npmjs.org/';
  const url = urlJoin(registry, npmName);
  return axios.get(url).then(response => {
    try {
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  })
}
// 获取最新npm包的最新版本
export function getLatestVersion(npmName) {
  const spinner = ora('正在获取信息').start();
  return getNpmInfo(npmName).then(data => {
    spinner.stop();
    if (!data['dist-tags'] || !data['dist-tags'].latest) {
      log.error('没有latest版本号');
      return Promise.reject(new Error('没有latest版本号'));
    }
    return data['dist-tags'].latest;
  })
}