const collectTypes = require('./collectType');

const proName = {
    type: 'input',
    name: 'proName',
    message: '请填写项目名称'
}

const bestName = {
    type: 'input',
    name: 'bestName',
    message: '请填写百世账户名称'
}

const selectPropType = {
    type: 'Select',
    name: 'proType',
    message: '请选择项目类型',
    choices: [
        collectTypes.pc,
        collectTypes.mini,
        collectTypes.mobile
    ]
    // ,
    // correctChoice: 2
};

module.exports = {
    proName,
    bestName,
    selectPropType
}