function getComponent() {
    return import(/* webpackPreload: true */ 'lodash').then(({ default: _}) => {
        const element = document.createElement('div');
        
        element.innerHTML = _.join(['Hello', 'Word']);

        return element;
    }).catch(err => 'error occurred')
}

getComponent().then(com => {
    document.body.appendChild(com);
})