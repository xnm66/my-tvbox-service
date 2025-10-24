export function onRequest(context) {
  const url = new URL(context.request.url);
  const ua = context.request.headers.get('user-agent') || '';
  
  console.log('请求路径:', url.pathname);
  
  // 重要：排除data.json和其他静态文件
  if (url.pathname.includes('data.json') || 
      url.pathname.includes('.js') || 
      url.pathname.includes('.css') ||
      url.pathname !== '/') {
    return context.next();
  }
  
  // 只对根路径进行TVBox检测
  const isTVBox = /okhttp|tvbox|影视仓|fongmi|easybox|catvod/i.test(ua.toLowerCase());
  console.log('TVBox检测结果:', isTVBox);
  
  if (isTVBox) {
    // 重定向到data.json
    return Response.redirect(url.origin + '/data.json', 302);
  }
  
  return context.next();
}