#!/usr/bin/env node

import importLocal from "import-local";
import {
    log
} from "@zcl/utils";
import {
    filename
} from 'dirname-filename-esm';
import entry from "../lib/index.js";

const __filename = filename(
    import.meta);

if (importLocal(__filename)) {
    log.info("cli", "使用本次cli-imooc版本");
} else {
    entry(process.argv.slice(2));
}