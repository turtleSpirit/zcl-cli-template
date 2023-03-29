import path from 'node:path'; // esm导入node内置库path，需要
import {
    program
} from 'commander';
import semver from 'semver';
import {
    dirname
} from 'dirname-filename-esm';
import fse from 'fs-extra';
import {
    log
} from '@zcl/utils';

const __dirname = dirname(
    import.meta);
const pkgPath = path.resolve(__dirname, '../package.json');
const pkg = fse.readJSONSync(pkgPath);

const LOWEST_NODE_VERSION = '14.0.0'

function checkNodeVersion() {
    log.verbose('node version', process.version);
    if (!semver.gte(process.version, LOWEST_NODE_VERSION)) {
        throw new Error(`zcl-cli,需要安装${LOWEST_NODE_VERSION}以上版本的node.jss`)
    }
}

function preAction() {
    // 检查node版本
    checkNodeVersion();
}

export default function createCli() {
    log.info('version', pkg.version);
    program
        .name(Object.keys(pkg.bin)[0])
        .usage('<command> [options]')
        .version(pkg.version)
        .option('-d --debug', '是否开启调试模式', false)
        .hook('preAction', preAction);
    program.on('option:debug', () => {
        log.verbose('debug')
    })
    program.on('command:*', (e) => {
        log.error(`${e[0]} 是未知的命令`)
    })
    return program;
}