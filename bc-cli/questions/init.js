const { prompt } = require('enquirer');
const { selectPropType, proName } = require('./collections');

const init = async(projectName) => {
    const qas = [selectPropType];
    if(typeof projectName == 'boolean') {
        qas.unshift(proName);
    }
    return await prompt(qas);
}

module.exports = init;