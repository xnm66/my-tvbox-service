export function onRequest(context) {
    const url = new URL(context.request.url);
    const ua = context.request.headers.get('user-agent') || '';
    console.log('请求路径:', url.pathname);

    // 排除静态文件
    if (url.pathname.includes('.js') ||
        url.pathname.includes('.css') ||
        url.pathname.includes('.png') ||
        url.pathname.includes('.jpg') ||
        url.pathname.includes('data.json')) {
        return context.next();
    }

    const isTVBox = /okhttp|tvbox|影视@|fongmi|easybox|catvod/i.test(ua.toLowerCase());
    console.log('TVBox检测结果:', isTVBox);

    if (isTVBox) {
        // 检查是否是第一次请求（多仓配置请求）
        const isConfigRequest = !url.pathname.includes('/data.json') && url.pathname === '/';
        
        if (isConfigRequest) {
            // 返回多仓配置
            const jsonData = {
                "urls": [
                    {
                        "name": "🍎小苹果影视",
                        "url": url.origin + "/data.json"
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