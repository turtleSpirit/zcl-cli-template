'use strict';

import createInitCommand from '@zcl/init';
import createInstallCommand from '@zcl/install';
import createCli from './createCli.js';
import './exception.js';

export default function cli(args) {
    const program = createCli();
    createInitCommand(program);
    createInstallCommand(program);
    program.parse(process.argv)
}