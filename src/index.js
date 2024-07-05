const Koa = require('koa');
const app = new Koa();
const os = require('os');
const http = require('http');
const server = http.createServer(app.callback());
const { router } = require('./routers/base/index.js');
const { koaBody } = require('koa-body');

const port = 3002;

app.use(koaBody());

app.use(router.routes());

// 获取本机IP地址
const getLocalIp = () => {
  // 获取本机的网络接口列表
  const networkInterfaces = os.networkInterfaces();
  // 遍历网络接口列表，找到非回环地址的IPv4地址
  let localIPAddress;
  Object.keys(networkInterfaces).forEach((interfaceName) => {
    networkInterfaces[interfaceName].forEach((interfaceInfo) => {
      if (!interfaceInfo.internal && interfaceInfo.family === 'IPv4') {
        localIPAddress = interfaceInfo.address;
      }
    });
  });
  return localIPAddress;
};

server.listen(port, () => {
  console.log(`Open in Browser: http://${getLocalIp()}:${port}`);
});
