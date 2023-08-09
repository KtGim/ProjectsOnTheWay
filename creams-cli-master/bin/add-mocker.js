const http = require('http');
const httpProxy = require('http-proxy');
const fs = require('fs');
const Mock = require('mockjs');

const path = require('path');
const {green, red} = require('chalk');


const {log} = console;

const ParseMocker = require('../lib/ParseMockData/index').default;

const {formatPropModel} = require('../lib/ParseMockData/formatData')

module.exports = function(rootPath, configPath) {
  const { port, apiPrefix, target, mockApis } = require(configPath);

  const urlObj = require(configPath);

  if (!urlObj.outputPath) {
    log(red(`outputPath 不存在, 请设置`));
    process.exit(3);
  }

  const outputPath = path.isAbsolute(urlObj.outputPath) ? urlObj.outputPath : path.join(rootPath, urlObj.outputPath);
  
  if (!path.isAbsolute(outputPath)) {
    log(red(`outputPath: ${outputPath} 不是正确的路径名, 请设置`));
    process.exit(3);
  }

  const urlArr = [];
  const hasUrls = urlObj.urls && Object.keys(urlObj.urls).length > 0;
  let parser = null;
  if (hasUrls) {
    Object.keys(urlObj.urls).forEach((key) => {
      urlArr.push(key)
    })
    parser = new ParseMocker(urlArr);
    parser.formatData();
  } else {
    log(red(`未配置 请求url 参数`));
    process.exit(3);
  }

  // 创建代理服务器
  const proxy = httpProxy.createProxyServer({
    ssl: {
      key: fs.readFileSync(path.join(__dirname, '../privkey.pem'), 'utf8'),
      cert: fs.readFileSync(path.join(__dirname, '../server.pem'), 'utf8')
    },
    protocolRewrite: "https",
    changeOrigin: true,
  });

  const server = http.createServer(function(req, res) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', '*');
    
    // 404异常处理
    delete req.headers.host;
    let method = req.method || 'get';
    /**
     * 复杂请求发出之前需要先向服务器发送 options 请求方式来确认 请求或者相应是否是一致， 并且确认请求是否具有权限
     * 目前 cli 中 只处理 get,post,delete,put 四种类型接口的数据
     */
    const isOptions = method === 'OPTIONS';
    // 截取 请求的 url 
    const requestUrl = req.url.split('?')[0];
    !isOptions && mockApis && mockApis.forEach(api => {
      if (requestUrl === `${apiPrefix}${api}`) {
        
        log(req.method ,method, `${method.toLowerCase()}Paths`)
        const paths = parser[`${method.toLowerCase()}Paths`];
        const responseMockModel = {};
        paths && Object.keys(paths).forEach(pathRegStr => {
          // 正则匹配 url
          if (new RegExp(pathRegStr).test(api)) {
            log()
            log(`${red('命中接口正则：')}${green(pathRegStr)}`);
            log()
            log(paths[pathRegStr]);
            const responseModel = paths[pathRegStr] && paths[pathRegStr].properties;
            if (responseModel) {
              Object.keys(responseModel).forEach(prop => {
                formatPropModel(responseMockModel, prop, responseModel[prop]);
              })
            }
          }
        })
  
        const mockSchema = {};
        log(green('mock 数据模型原型： '));
        log(responseMockModel, '\n');
        responseMockModel && Object.values(responseMockModel).forEach(propValue => {
          if (!propValue) return
          const {ref, type, key, value} = propValue;
          if (type === 'ref') {
            mockSchema[key] = [];
            mockSchema[key][0] = {};
            parser.mockDataSchema[ref] && Object.values(parser.mockDataSchema[ref]).forEach(valU => {
              if (!valU) return
              if (valU.type === 'ref') {
                // 只递归生成一层数据
                mockSchema[key][0][valU.key] = [];
                mockSchema[key][0][valU.key][0] = {};
                parser.mockDataSchema[ref] && Object.values(parser.mockDataSchema[ref]).forEach(val => {
                  if (val.type === 'ref') {
                    mockSchema[key][0][valU.key][0][val.key] = []
                  } else {
                    mockSchema[key][0][valU.key][0][val.key] = val.value;
                  }
                })
              } else {
                mockSchema[key][0][valU.key]= valU.value;
              }
            })
          } else {
            mockSchema[key] = value
          }
        })
  
        let data = responseMockModel ? Mock.mock(mockSchema) : undefined;
  
        log(green('生成mock schema \n'))
        log(mockSchema)
        log()
        log(green('生成mock data \n'))
        log(data)
        log()
  
        res.writeHead(200, { 'Content-Type': (req && req.headers && req.headers["content-type"]) || 'application/json' });
        res.end(JSON.stringify(data));
  
      }
    })

    proxy.web(req, res, { target });
  });
  
  log(`mock 代理服务器 ${port}\n`)
  server.listen(port);
  
}