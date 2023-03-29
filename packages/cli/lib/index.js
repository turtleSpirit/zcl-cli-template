'use strict';

import createInitCommand from '@zcl/init';
import createCli from './createCli.js';
import './exception.js';

export default function cli(args) {
    const program = createCli();
    createInitCommand(program);

    program.parse(process.argv)
}