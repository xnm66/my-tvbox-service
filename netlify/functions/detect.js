exports.handler = async (event, context) => {
  const userAgent = event.headers['user-agent'] || '';
  
  // TVBox 检测关键词
  const tvboxKeywords = [
    'okhttp', 'tvbox', 'catvod', 'tang', '影视仓',
    'androlua', 'lua', 'p2p', 'tv.player', 'tv/',
    'android.tv', 'tvos', 'smarttv', 'fongmi', 'easybox',
    'dalvik', 'tv.box', 'catbox'
  ];

  // 检查是否是 TVBox 客户端
  const isTVBoxClient = tvboxKeywords.some(keyword => 
    userAgent.toLowerCase().includes(keyword.toLowerCase())
  );

  if (isTVBoxClient) {
    // TVBox访问 - 重定向到 data.json
    return {
      statusCode: 302,
      headers: {
        'Location': '/data.json'
      }
    };
  } else {
    // 浏览器访问 - 重定向到 index.html
    return {
      statusCode: 302,
      headers: {
        'Location': '/index.html'
      }
    };
  }
};