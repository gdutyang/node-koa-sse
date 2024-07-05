const Router = require('koa-router');
const { PassThrough } = require('stream');
const router = new Router({});

router.get('/', async (ctx) => {
  ctx.body = {
    data: 'Hello World'
  };
});

router.get('/sse', async (ctx) => {
  // 设置超时时间为0,禁止超时
  ctx.request.socket.setTimeout(0);
  ctx.req.socket.setNoDelay(true);
  ctx.req.socket.setKeepAlive(true);

  // 设置响应头
  ctx.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });

  // 创建一个可写流
  const stream = new PassThrough();

  ctx.status = 200;
  ctx.body = stream;

  const res = {
    count: 1
  };

  // 将结果转换为字符串,并发送给客户端
  const interval = setInterval(() => {
    stream.write(`data: ${JSON.stringify(res)}\n\n`);
    res.count++;
  }, 1000);

  // 当客户端重新加载或关闭时，关闭流
  stream.on('close', () => {
    clearInterval(interval);
  });
});

module.exports = { router };
