export function onRequest(context) {
    const url = new URL(context.request.url);
    const ua = context.request.headers.get('user-agent') || '';
    const pathname = url.pathname;

    // 排除静态文件
    if (pathname.includes('.js') || pathname.includes('.css') || 
        pathname.includes('.png') || pathname.includes('.jpg')) {
        return context.next();
    }

    const isTVBox = /okhttp|tvbox|影视@|fongmi|easybox|catvod/i.test(ua.toLowerCase());

    if (isTVBox) {
        // API路径返回实际数据
        if (pathname === '/api') {
            // 读取并返回 data.json 内容
            return context.next();
        }
        // 根路径返回多仓配置
        else if (pathname === '/') {
            const jsonData = {
                "urls": [
                    {
                        "name": "🍎小苹果影视",
                        "url": url.origin + "/api"
                    }
                ]
            };
            return new Response(JSON.stringify(jsonData), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }
    
    // 浏览器访问显示引导页
    if (pathname === '/' && !isTVBox) {
        return context.next();
    }
    
    return context.next();
}