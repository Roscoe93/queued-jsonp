# queued-jsonp

提供 jsonp 功能,包括如下特性:

1.  多次固定相同 callback 的请求防冲突
1.  开启/关闭随机参数
1.  默认的随机回调函数名
1.  只支持 promise,配合 async/await 使用效果更佳

## Usage

```javascript
import { fetch as jsonpFetch } from "@newap/queued-jsonp";
jsonpFetch({
  url,
  callback,
  cbFunctionName,
  cache,
  noCacheParam,
  timeout
})
  .then(successHandler)
  .catch(failedHandler);
```

最终发送的请求地址为
`${url}?|&${callback}=${cbFunctionName}` (如果开启缓存)
`${url}?|&${callback}=${cbFunctionName}_rnd_${someRandomNumber}` (如果禁止缓存且消除额外参数)
`${url}?|&${callback}=${cbFunctionName}&__rnd=${someRandomNumber}` (如果禁止缓存且不消除额外参数)
会根据 url 中有无 query 用?或&拼接

## Options

* `url` 请求的 URL，后面无需 callback
* `callback` 接口接收的回调字段,默认为`callback`
* `callbackFuntionName` window 下放置的回调函数名，默认为`callback_${someRandomNumber}`
* `cache` 是否缓存（不添加随机参数），默认为`false`
* `noCacheParam` 避免缓存时不添加额外请求参数，默认为`false`
* `timeout` 超时，默认为 10000ms，如果超时则会 reject
