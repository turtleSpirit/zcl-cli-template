import {
    printErrorLog
} from '@zcl/utils';

process.on('uncaughtException', (e) => printErrorLog(e, 'error')); // 捕获错误信息
process.on('unhandledRejection', (e) => printErrorLog(e, 'promise')); // 捕获Promise.reject时的信息