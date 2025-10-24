exports.handler = async (event, context) => {
  const userAgent = event.headers['user-agent'] || '';
  
  console.log('检测到 User-Agent:', userAgent);
  
  // TVBox 检测关键词
  const tvboxKeywords = [
    'okhttp', 'tvbox', 'catvod', '影视仓', 'fongmi', 
    'easybox', 'tv.box', 'androlua', 'tv/', 'box'
  ];

  const isTVBox = tvboxKeywords.some(keyword => 
    userAgent.toLowerCase().includes(keyword.toLowerCase())
  );

  console.log('是否是 TVBox:', isTVBox);

  if (isTVBox) {
    // TVBox访问 - 直接返回JSON数据
    return {
      statusCode: 302,
      headers: {
        'Location': '/data.json'
      }
    };
  } else {
    // 浏览器访问 - 返回HTML页面
    return {
      statusCode: 302,
      headers: {
        'Location': '/index.html'
      }
    };
  }
};