// password-worker.js
// 部署到 Cloudflare Workers - 密码验证后端

// ===== 在这里设置你的密码 =====
const VALID_PASSWORD = "TV2025"; // 改成你想要的密码

// Token 有效期（天）
const TOKEN_EXPIRY_DAYS = 7;

async function handleRequest(request) {
    const origin = request.headers.get('Origin') || '*';
    
    // 设置 CORS 头
    const corsHeaders = {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    // 处理预检请求
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    if (request.method === 'POST') {
        try {
            const { password } = await request.json();
            
            if (password === VALID_PASSWORD) {
                // 生成加密 token
                const expiry = Date.now() + (TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
                const tokenData = {
                    valid: true,
                    expiry: expiry,
                    created: Date.now()
                };
                
                // Base64 编码
                const token = btoa(JSON.stringify(tokenData));
                
                return new Response(JSON.stringify({ 
                    success: true, 
                    token: token,
                    message: "验证成功"
                }), { 
                    headers: corsHeaders 
                });
            } else {
                return new Response(JSON.stringify({ 
                    success: false, 
                    message: "密码错误" 
                }), { 
                    headers: corsHeaders 
                });
            }
        } catch (error) {
            return new Response(JSON.stringify({ 
                success: false, 
                message: "请求格式错误" 
            }), { 
                headers: corsHeaders,
                status: 400 
            });
        }
    }

    return new Response(JSON.stringify({ 
        success: false, 
        message: "方法不允许" 
    }), { 
        headers: corsHeaders,
        status: 405 
    });
}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});