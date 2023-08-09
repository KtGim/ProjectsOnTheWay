const getValueType = (value) => {
    switch (typeof value) {
        case 'bigint':
        case 'boolean':
        case 'number':
        case 'undefined':
            return value;
        case 'string':
            return `'${value}'`;
        default:
            return ''
    }
};

/**
 * 
 * @param {
 *  path,
 *  application,
 *  service,
 *  reportList,
 *  reportTypeList
 *  cacheLogList
 * } {
 *  上报地址
 *  应用 id
 *  日志服务 id
 *  允许上报接口列表
 *  允许上报类型列表
 *  换群数据类型列表
 * }
 * @returns 
 */
module.exports = ({path, application, service, reportList, reportTypeList = [], cacheLogKeys = [], cacheReportCount = 50, cacheReportKey }) => {
    if(!path) { // 日志路径不存在报错
        console.error('日志路径不存在！');
        return '';
    }
    // 默认是 LOG
    if(!reportTypeList || !reportTypeList.length || !reportTypeList.includes('LOG')) {
        reportTypeList.push('LOG'); // 
    }

    const reportTypeListObjString = reportTypeList.map((key) => `${key}: ${getValueType(key)}`);
    const reportTypeListObjStrings = reportTypeList.map((key) => `${key}: {
        writable: false,
        configurable: false,
        enumerable: false,
        value: '${key}'
    }`);

    return `<script type = "text/javascript">
                (function() {
                    if (window.handleRecordLog) return;
                    
                    const reportFunc = (path, token, type, service, application, postInfo) => {
                        fetch(path, {
                            method: 'POST',
                            mode:'cors',
                            headers: { 'Authorization': token },
                            credentials:'include',
                            body: JSON.stringify({
                                'parent': {
                                    'hostName': location.hostname,        // 当前操作站点
                                    'application': application,  // 对应应用的 appId
                                    'hostIP': location.origin,        // 当前操作站点
                                    'service': service  // 自定义字段，后续下载日志时需要
                                },
                                'children': [ // 日志主体可以是列表数据
                                    {
                                        'headers': {
                                            'level': type || 'INFO' 
                                        },
                                        'body': JSON.stringify(postInfo) 
                                    }
                                ]
                            })
                        }).catch(err => {
                            console.log('report-log-error', err);
                        });
                    };

                    window.LOG_TYPE = {${reportTypeListObjString.join(',')}};
                    window.CACHE_TYPE = '${cacheLogKeys.join(',')}';
                    window.CACHE_LIST = JSON.parse(localStorage.getItem('CACHE_LIST_INFO') || '{}');

                    window.NEW_CACHE_LIST = JSON.parse(localStorage.getItem('CACHE_LIST_INFO_NEW') || '[]');
                    // 禁止修改对象属性
                    Object.defineProperties(window.LOG_TYPE, {
                        ${reportTypeListObjStrings.join(',')}
                    });
                    Object.preventExtensions(window.LOG_TYPE);   // 禁止对对象添加属性

                    // v3 版本的数据先上报，后续 v4 不需要
                    window.forceReport = () => {
                        Object.keys(window.CACHE_LIST || {}).forEach(reportType => {
                            if(window.CACHE_LIST[reportType] && window.CACHE_LIST[reportType].length) {
                                reportFunc('${path}', window.token, 'INFO', '${service}', '${application}', window.CACHE_LIST[reportType]);
                            }
                        });
                        window.forceReport = undefined;
                        localStorage.removeItem('CACHE_LIST_INFO');
                    };
                    if(window.CACHE_LIST) {
                        window.forceReport();
                    }
                    // v4 版本的数据缓存
                    window.forceReportCacheList = () => {
                        if(window.NEW_CACHE_LIST.length) {
                            reportFunc('${path}', window.token, 'INFO', '${service}', '${application}', {
                                ${cacheReportKey}: window.NEW_CACHE_LIST
                            });
                        }
                    };
                    window.handleRecordLog = (row, reportType = window.LOG_TYPE.LOG) => { // 绑定事件, LOG 上报日志事件， REPORT 上报用户参数
                        const { type,service, application, param, token } = row;
                        // row 为string 时，没有 token 传入，所以存储在window 中
                        window.token = token ? token : window.token;
                        let canReport = false;
                        // 不允许上报的 日志类型 或者接口 直接拦截
                        canReport = '${reportTypeList}'.includes(reportType) || (param && '${reportList}'.includes(param.url)) || window.CACHE_TYPE.includes(reportType);
                        if(!canReport) return;
                        let postInfo = param;
                        if(window.CACHE_TYPE.includes(reportType)) {
                            if(param || row) {
                                window.NEW_CACHE_LIST.push(param || row);
                            }
                            if(window.NEW_CACHE_LIST.length < ${cacheReportCount}) {
                                return;
                            } else {
                                postInfo = {
                                    ${cacheReportKey}: window.NEW_CACHE_LIST
                                };
                                window.NEW_CACHE_LIST = [];
                            }
                        }
                        if(postInfo) {
                            reportFunc('${path}', token || window.token, type || 'INFO', service || '${service}', application || '${application}', postInfo || {});
                        }
                    };

                    window.onbeforeunload = () => {
                        localStorage.setItem('CACHE_LIST_INFO_NEW', JSON.stringify(window.NEW_CACHE_LIST));
                    }
                })();
            </script>`
}
