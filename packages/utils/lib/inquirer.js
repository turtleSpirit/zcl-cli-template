import inquirer from 'inquirer';

// 制作输入项
function make({
    choices,
    defaultValue,
    message = '请选择',
    type = 'list',
    require = true,
    mask = '*',
    validate,
    pageSize,
    loop
}) {
    const options = {
        name: 'name',
        default: defaultValue,
        message,
        type,
        require,
        mask,
        validate,
        pageSize,
        loop
    }
    if (type === 'list') {
        options.choices = choices
    }
    return inquirer.prompt(options).then(answer => answer.name)
}
// 创建选择列表
export function makeList(params) {
    return make({
        ...params
    });
}
// 创建输入框

export function makeInput(params) {
    return make({
        type: 'input',
        ...params
    })
}
// 创建密码输入框
export function makePassword(params) {
    return make({
        type: 'password',
        ...params,
    });
}