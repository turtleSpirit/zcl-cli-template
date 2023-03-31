'use strict';

import {
    log
} from '@zcl/utils';
import Command from "@zcl/command";
import createTemplate from './createTemplate.js';
import downloadTemplate from './downloadTemplate.js';
import installTemplate from './installTemplate.js';

/**
 * examples: cli-zcl-test init
 * cli-zcl-test init aaa -t project -tp template-vue3
 * 
 */
class InitCommand extends Command {
    get command() {
        return 'init [name]'
    }

    get description() {
        return 'init command'
    }

    get options() {
        return [
            ['-f --force', '是否强制更新', false],
            ['-t,--type <type>', '项目类型(值：project/page)'], // type的string值，需要<type>
            ['-tp,--template <template>', '模版名称']
        ]
    }

    async action([name, opts]) {
        log.verbose('init', name, opts)
        // 1.选择项目模版，生成项目信息
        // 需求增加，获取name为文件名称
        const selectedTemplate = await createTemplate(name, opts);
        log.verbose('selectedTemplate', selectedTemplate);
        // 2.下载项目模版只缓存目录
        await downloadTemplate(selectedTemplate);
        // 3.安装项目模版至项目目录
        installTemplate(selectedTemplate, opts)
    }
}

function Init(instance) {
    return new InitCommand(instance);
}
export default Init;