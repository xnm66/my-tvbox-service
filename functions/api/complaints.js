import { corsHeaders, handleOptions } from '../auth.js'

export async function onRequest(context) {
    const { request, env } = context
    
    if (request.method === 'OPTIONS') {
        return handleOptions()
    }
    
    try {
        switch (request.method) {
            case 'GET':
                return await getComplaints(env)
            case 'POST':
                return await createComplaint(request, env)
            default:
                return new Response('Method not allowed', { 
                    status: 405,
                    headers: corsHeaders
                })
        }
    } catch (error) {
        return new Response(JSON.stringify({ 
            error: error.message,
            success: false 
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
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

async function createComplaint(request, env) {
    const data = await request.json()
    
    if (!data.email || !data.content) {
        return new Response(JSON.stringify({ 
            success: false,
            error: '邮箱和内容不能为空' 
        }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
    
    const complaint = {
        id: Date.now(),
        email: data.email,
        content: data.content.substring(0, 500),
        status: 'pending',
        timestamp: new Date().toLocaleString('zh-CN'),
        ip: request.headers.get('CF-Connecting-IP') || 'unknown'
    }
    
    let complaints = await env.KV.get('complaints', 'json') || []
    complaints.unshift(complaint)
    
    if (complaints.length > 50) {
        complaints = complaints.slice(0, 50)
    }
    
    await env.KV.put('complaints', JSON.stringify(complaints))
    
    return new Response(JSON.stringify({ 
        success: true, 
        id: complaint.id
    }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
}