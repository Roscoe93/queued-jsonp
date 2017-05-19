# queued-jsonp

提供jsonp功能,包括如下特性:

1. 多次固定相同callback的请求防冲突
2. 开启/关闭随机参数
3. 默认的随机回调函数名
4. 只支持promise,配合async/await使用效果更佳
5. 并没有经过编译发布到NPM,请复制到项目中使用

## Usage

**需要全局的Promise polyfill**

```javascript
import { fetch as jsonpFetch } from 'queued-jsonp';
jsonpFetch({
   url,
   callback,
   cbFunctionName,
   cache
  }).then(successHandler).catch(failedHandler);
```
最终发送的请求地址为 `${url}?|&${callback}=${cbFunctionName}`  
会根据url中有无query用?或&拼接

## Options

- `url` 请求的URL，后面无需callback
- `callback` 接口接收的回调字段,默认为`callback`
- `callbackFuntionName` window下放置的回调函数名，默认为`callback_${someRandomNumber}`
- `cache` 是否加随机串防止缓存，默认为`true`