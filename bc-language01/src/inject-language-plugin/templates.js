const flagIconsLinkTemplate = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.6.6/css/flag-icons.min.css"/>';
const styleTemplate = `
<style>
    .best-country-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100px;
        cursor: pointer;
    }
    .best-country-container:hover #best-country-selector {
        display: block!important;
    }
    .best-country-container #best-country-dashboard {
        height: 25px;
        width: 100%;
    }
    .best-country-container #best-country-selector {
        padding-inline-start: 0;
        display: inline-block;
        margin: 0;
        padding: 5px 2px;
        /* padding-top: 0; */
        margin-block-start: 0;
        margin-block-end: 0;
        margin-top: 5px;
        box-shadow: 0px 0px 2px 1px #eee;
    }
    .best-country-container #best-country-selector ol {
        padding-inline-start: 0;
    }
    .best-country-container #best-country-selector ol p {
        margin: 5px;
        padding: 0;
    }
    .best-country-container #best-country-selector ol:hover {
        background-color: #eee;
    }
    .best-country-container #best-country-selector .active {
        background-color: red!important;
        color:antiquewhite;
    }
    .best-country-container .show {
        display: block!important;
    }
    .best-country-container .hide {
        display: none!important;
    }
</style>
`;

const getObjectKeyValueString = (obj) => {
    return Object.entries(obj).map(([key, value]) => `${key}: ${getValueType(value)}`)
}

const getValueType = (value) => {
    switch (typeof value) {
        case 'bigint':
        case 'boolean':
        case 'number':
        case 'undefined':
            return value;
        case 'string':
            return `'${value}'`;
        case 'object':
            return `{${getObjectKeyValueString(value).join(',')}}`
    }
}

const initBestCountrySelectorJsTemplate = (languageKeyInfo, containerKey, localLanKey = 'language') => {
    const languageProps = getObjectKeyValueString(languageKeyInfo);
    let optionsString = '';
    let initKeyValue = 'cn';
    Object.keys(languageKeyInfo).forEach((lanKey, index) => {
        if(index === 0) {
            initKeyValue = languageKeyInfo[lanKey].key
        }
        optionsString += `<ol data-value="${lanKey}"><p class="fi fi-${lanKey} fis"}></p>${languageKeyInfo[lanKey].label}</ol>`;
    })

    return `
<script>
    function setLanguageInfo(key, lan) {
        if(!key || !lan) return null;
        window._lanKey = key;
        localStorage.setItem('${localLanKey}', JSON.stringify({[key]: lan}));
        window.dispatchEvent(new CustomEvent('best_country_selector', {
            bubbles: true,
            detail: {
                value: key,
                localLanKey: '${localLanKey}',
            }
        }));
    }

    function getLanguageInfo() {
        let info = {};
        try {
            const _language = JSON.parse(localStorage.getItem('${localLanKey}') || '{}');
            Object.entries(_language).forEach(([key, value]) => {
                info._lanKey = key;
                info.language = value || {};
            });
        } catch(e) {
            console.error(e);
        }
        return info;
    }

    window._setLanguageInfo = setLanguageInfo;
    window._getLanguageInfo = getLanguageInfo;

    function initLanguage() {
        try {
            const _language = JSON.parse(localStorage.getItem('${localLanKey}') || '{}');
            Object.entries(_language).forEach(([key, value]) => {
                window._lanKey = key;
                window.language = value || {};
            });
        } catch(e) {
            console.error(e);
        }
    
        window.language = window.language || {};
        window._lanKey = window._lanKey || '${initKeyValue}';

        const $bestCountryRootContainer = document.querySelector('${containerKey}');
        if(!$bestCountryRootContainer) {
            console.error('元素不存在，请检查');
            return null;
        }
        const languageKeyInfo = {
            ${languageProps.join(',')}
        };
        $bestCountryRootContainer.innerHTML = ` + '`' + `<div class="best-country-container">
            <div id="best-country-dashboard" class="fi fi-cn"></div>
            <ul name="best-country-selector" id="best-country-selector" class="hide">
                ${optionsString}
            </ul>
        </div>`+ '`' +`;
        const $bestCountryDashboard = document.querySelector('#best-country-dashboard');
        const $bestCountrySelector = document.querySelector('#best-country-selector');
        const $bestCountrySelectorChildren = $bestCountrySelector.querySelectorAll('ol');
        // 初始化
        if(window._lanKey) {
            $bestCountryDashboard.classList.remove($bestCountryDashboard.classList[1]);
            $bestCountryDashboard.classList.add` + "(`fi-${window._lanKey}`)" +`;
            $bestCountrySelectorChildren.forEach(dom => {
                if(window._lanKey == dom.getAttribute('data-value'))
                dom.classList.add('active');
            });
        }

        // 监听点击事件
        $bestCountrySelector.addEventListener('click', (e) => {
            const curValue = e.target.getAttribute('data-value');

            $bestCountrySelectorChildren.forEach(dom => {
                dom.classList.remove('active');
            });
            e.target.classList.add('active');
            // 清空样式重新添加
            $bestCountryDashboard.classList.remove($bestCountryDashboard.classList[1]);
            $bestCountryDashboard.classList.add` + "(`fi-${curValue}`)" +`;
            window.dispatchEvent(new CustomEvent('best_country_selector', {
                bubbles: true,
                detail: {
                    e: e,
                    dom: e.target,
                    value: languageKeyInfo[curValue].key || curValue
                }
            }));
        });
    }
    window._initBcLanguage = initLanguage;
    setTimeout(() => {
        initLanguage();
    }, 1000);
</script>`;
}

module.exports = {
    initBestCountrySelectorJsTemplate,
    styleTemplate,
    flagIconsLinkTemplate
}