# 前端日志插件
使用方法
- 1.npm install @best/web-log-loader
- 2.webpack里面添加 
```
// webpack.config.js
const RecordWebLogPlugin = require('@best/web-log-loader');

new RecordWebLogPlugin({
    HtmlWebpackPlugin
})

// weblog.js

module.exports = {
    path: 'service/webLog/transit',
    application: 'gwms-front-end',
    service: 'gwms-front-end',
    // 需要定义上报的日志类型，否则不能调用日志接口
    reportTypeList: [
        'LOG', 'REPORT_USER_INFO', 'PACK', 'SORT_PACK', 'WAVE',
        'SHIP', 'PET_SEND', 'petSendList', 'PAGE_ERROR', 'COMPONENT_ERROR',
        'CATCH_ERROR', 'PACK_COMBINE', 'QUICK_PICK', 'COMMON_FUNC'
    ],
    // 不立即上报，缓存一定数量再上报
    cacheLogInfo: {
        'PACK': 30,
        'WAVE': 30,
        'SORT_PACK': 30,
        PACK_COMBINE: 30,
        QUICK_PICK: 30,
        COMMON_FUNC: 30
    },
    // 接口上数据实时上报
    reportList: [
        // Pack
        '/service/ob/packGroup/create',
        '/service/ob/pack/confirm',
        '/service/ob/pack/batch/confirm',
        '/service/ob/track/order/apply',
        '/service/ob/pack/applyBox/byBoxIdList',
        '/service/ob/pack/enterTracking',
        '/service/ob/pack/editTracking',
        '/service/ob/exception/pack/record',
        '/service/ob/exception/pack/close',
        '/service/ob/singleOrder/pack/batch/confirm',
        '/service/ob/order/release',
        '/service/ob/order/header/batch/release',
        // Sort And Pack
        '/service/ob/pack/sort/data',
        '/service/saas/ob/sort/pack/sku/scan',
        '/service/saas/ob/sort/pack/confirm',
        '/service/sass/sort/pack/complete',
        '/service/saas/ob/order/tracking/enter',
        // Wave
        '/service/ob/wave/batch/allocate',
        '/service/ob/wave/allocate',
        '/service/task/header/batch/generatePickTaskByWave',
        '/service/task/header/generatePickTaskByWave',
        // Pick && Pack 面单打印
        '/service/ob/track/orderList/preApply',
        '/service/print/task/label/picking/ticket',
        '/service/print/data/getSortingByTaskIdList',
        '/service/print/task/label/shipping/label',
        '/service/ob/track/order/apply ',
        // weigh & ship
        '/service/ob/ship/box',
        '/service/ob/pack/shipBoxes'
    ]
};
```
- 3.执行之后项目中使用
window.handlRecordLog(param)

- 4. 查看具体文件
https://best-inc.feishu.cn/wiki/wikcnVq9Wrp5XE98SKP2pjuTkQh