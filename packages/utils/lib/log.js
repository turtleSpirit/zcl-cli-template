import log from 'npmlog';
import isDebug from './isDebug.js';

if (isDebug()) {
    log.level = 'verbose'
} else {
    log.level = 'info'
}

log.heading = '@zcl-cli';

log.addLevel('success', 2000, {
    fg: 'g',
    bold: true
})



export default log