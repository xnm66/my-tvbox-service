export function onRequest(context) {
  const url = new URL(context.request.url);
  const ua = context.request.headers.get('user-agent') || '';
  
  // 只对根路径进行TVBox检测
  if (url.pathname === '/' && ua) {
    const isTVBox = /okhttp|tvbox|影视仓|fongmi|easybox|catvod/i.test(ua.toLowerCase());
    
    if (isTVBox) {
      // 直接返回JSON数据，不要重定向！
      const jsonData = {
        "urls": [
          {
            "name": "🏠 主线路",
            "url": "https://xnm66.github.io/my-tvbox-service/data.json"
          }
        ]
      };
      
      return new Response(JSON.stringify(jsonData), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
  
  return context.next();
}