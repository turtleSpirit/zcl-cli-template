'use strict';
import path from 'node:path';
import {
    execa
} from 'execa';

const CLI = path.join(__dirname, '../bin/cli.js');
const bin = () => (...args) => execa(CLI, args);

// 运行错误的命令
test('run error command', async() => {
    const {
        stderr
    } = await bin()('iii');
    expect(stderr).toContain('iii 是未知的命令');
})

// 测试help命令不报错
test('should not throw error when use --help', async() => {
    let error = null;
    try {
        await bin()('--help')
    } catch (e) {
        error = e
    }
    expect(error).toBe(null);
})

// 测试version正确显示

test('show current version', async() => {
    const ret = await bin()('-V');
    const {
        stdout
    } = ret;
    expect(stdout).toContain(require('../package.json').version)
        // console.log(ret)
})