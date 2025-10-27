// password-worker.js - 放置在项目根目录
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 只处理密码验证请求
    if (url.pathname === '/verify-password') {
      return await handlePasswordVerification(request);
    }
    
    return new Response('Not Found', { status: 404 });
  }
}

async function handlePasswordVerification(request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { password } = await request.json();
    
    // 在这里修改密码 - 可以随时更新而不需要修改前端代码
    const CURRENT_PASSWORD = "2025"; // 您的密码
    
    if (password === CURRENT_PASSWORD) {
      // 生成7天有效期的token
      const token = btoa(`verified_${Date.now() + (7 * 24 * 60 * 60 * 1000)}`);
      
      return new Response(JSON.stringify({
        success: true,
        token: token,
        expires: Date.now() + (7 * 24 * 60 * 60 * 1000)
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        message: '密码错误'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: '服务器错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}