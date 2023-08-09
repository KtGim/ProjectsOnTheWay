const getValueType = (value) => {
    switch (typeof value) {
        case 'bigint':
        case 'boolean':
        case 'number':
        case 'undefined':
            return value;
        case 'string':
            return `'${value}'`;
    }
}

module.exports = (appKey, defaultGlobalProps, otherProps) => {
    const entries = Object.entries(defaultGlobalProps).map(([key, value]) => `${key}: ${getValueType(value)}`);
    const otherPropsEntries = Object.entries(otherProps).map(([key, value]) => `${key}: ${getValueType(value)}`);
    return `
<script type = "text/javascript">
    (function() {
        if (window.zhuge) return;
        var addListener = Element.prototype.addEventListener
        window.zgclickhook = true
        function zgListener () {
            if (window.zhuge && window.zhuge.trackClick) window.zhuge.trackClick(arguments[0])
        }
        Element.prototype.addEventListener = function () {
            var etype = arguments[0]
            var listener = arguments[1]
            if (etype === 'click' && listener) {
            this.setAttribute('zgclickable', true)
            this.setAttribute('zghook', parseInt(this.getAttribute('zghook') || 0) + 1)
            if (parseInt(this.getAttribute('zghook')) === 1) addListener.call(this, 'click', zgListener)
            }
            return addListener.apply(this, arguments)
        }
        var removeListener = Element.prototype.removeEventListener
        Element.prototype.removeEventListener = function () {
            var etype = arguments[0]
            this.setAttribute('zghook', parseInt(this.getAttribute('zghook') || 0) - 1)
            if (etype === 'click' && parseInt(this.getAttribute('zghook')) <= 0) {
            this.removeAttribute('zgclickable')
            removeListener.call(this, etype, zgListener)
            }
            removeListener.apply(this, arguments)
        }
        window.zhuge = [];
        window.zhuge.methods = "_init identify track trackRevenue getDid getSid getKey setSuperProperty setUserProperties setWxProperties setPlatform".split(" ");
        window.zhuge.factory = function(b) {
            return function() {
            var a = Array.prototype.slice.call(arguments);
            a.unshift(b);
                window.zhuge.push(a);
                return window.zhuge;
            }
        };
        for (var i = 0; i < window.zhuge.methods.length; i++) {
            var key = window.zhuge.methods[i];
            window.zhuge[key] = window.zhuge.factory(key);
        }
        window.zhuge.load = function(b, x) {
            if (!document.getElementById("zhuge-js")) {
            var a = document.createElement("script");
            var verDate = new Date();
            var verStr = verDate.getFullYear().toString() + verDate.getMonth().toString() + verDate.getDate().toString();

            a.type = "text/javascript";
            a.id = "zhuge-js";
            a.async = !0;
            a.src = 'https://zgsdk.zhugeio.com/zhuge.min.js?v=' + verStr;
            a.onerror = function() {
                window.zhuge.identify = window.zhuge.track = function(ename, props, callback) {
                if(callback && Object.prototype.toString.call(callback) === '[object Function]') {
                    callback();
                } else if (Object.prototype.toString.call(props) === '[object Function]') {
                    props();
                }
                };
            };
            var c = document.getElementsByTagName("script")[0];
            c.parentNode.insertBefore(a, c);
                window.zhuge._init(b, x)
            }
        };
        window.zhuge.load('${appKey}', { //配置应用的AppKey
            superProperty: { //全局的事件属性(选填)
                ${entries.join(',')}
            },
            ${
                otherPropsEntries.join(',')
            }
        });
    })();
</script>`
}