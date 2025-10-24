exports.handler = async (event, context) => {
  const userAgent = event.headers['user-agent'] || '';
  
  console.log('User-Agent:', userAgent);
  
  // TVBox 检测关键词
  const tvboxKeywords = [
    'okhttp', 'tvbox', 'catvod', '影视仓', 'fongmi', 
    'easybox', 'tv.box', 'androlua', 'tv/'
  ];

  const isTVBox = tvboxKeywords.some(keyword => 
    userAgent.toLowerCase().includes(keyword.toLowerCase())
  );

  if (isTVBox) {
    console.log('TVBox detected, redirecting to JSON');
    // 直接返回JSON数据，不要重定向
    try {
      // 这里直接返回你的JSON数据
      const jsonData = {
        "urls": [
          {
            "name": "🏠 主线路",
            "url": "https://my-tvbox-service.netlify.app/data.json"
          }
        ]
      };
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(jsonData)
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'JSON parse error' })
      };
    }
  } else {
    console.log('Browser detected, serving HTML');
    // 返回HTML页面
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      },
      body: `<!DOCTYPE html><html><body><h1>引导页面</h1><p>这是浏览器看到的页面</p></body></html>`
    };
  }
};