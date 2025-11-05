import { verifyAdmin, corsHeaders, handleOptions } from '../../auth.js'

export async function onRequest(context) {
    const { request, env } = context
    
    if (request.method === 'OPTIONS') {
        return handleOptions()
    }
    
    if (!await verifyAdmin(request, env)) {
        return new Response(JSON.stringify({ 
            success: false,
            error: '未授权访问' 
        }), {
            status: 401,
            headers: corsHeaders
        })
    }
    
    const url = new URL(request.url)
    const action = url.pathname.split('/').pop()
    
    try {
        switch (action) {
            case 'stats':
                return await getStats(env)
            case 'complaints':
                return await getComplaints(env)
            default:
                return new Response(JSON.stringify({ 
                    success: false,
                    error: '操作不存在' 
                }), {
                    status: 404,
                    headers: corsHeaders
                })
        }
    } catch (error) {
        return new Response(JSON.stringify({ 
            success: false,
            error: error.message 
        }), {
            status: 500,
            headers: corsHeaders
        })
    }
}

async function getStats(env) {
    const [visits, downloads, complaints] = await Promise.all([
        env.KV.get('site_visits', 'json'),
        env.KV.get('download_stats', 'json'),
        env.KV.get('complaints', 'json')
    ])
    
    const stats = {
        visits: (visits || []).length,
        downloads: Object.values(downloads || {}).reduce((a, b) => a + b, 0),
        pendingComplaints: (complaints || []).filter(c => c.status === 'pending').length,
        totalComplaints: (complaints || []).length
    }
    
    return new Response(JSON.stringify({
        success: true,
        data: stats
    }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
}

async function getComplaints(env) {
    const complaints = await env.KV.get('complaints', 'json') || []
    return new Response(JSON.stringify({
        success: true,
        data: complaints
    }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
}