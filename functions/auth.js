// 管理员认证工具
export async function verifyAdmin(request, env) {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false
    }
    
    const token = authHeader.slice(7)
    const adminToken = env.ADMIN_TOKEN || '8888' // 默认管理员密码
    
    return token === adminToken
}

// CORS 头信息
export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// 处理 OPTIONS 请求
export function handleOptions(request) {
    if (request.headers.get('Origin') !== null &&
        request.headers.get('Access-Control-Request-Method') !== null &&
        request.headers.get('Access-Control-Request-Headers') !== null) {
        return new Response(null, {
            headers: corsHeaders
        })
    } else {
        return new Response(null, {
            headers: {
                'Allow': 'GET, POST, PUT, DELETE, OPTIONS',
            }
        })
    }
}