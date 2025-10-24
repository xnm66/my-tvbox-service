exports.handler = async (event, context) => {
  const ua = event.headers['user-agent'] || '';
  const isTVBox = /okhttp|tvbox|catvod|fongmi|影视仓|easybox|androlua/i.test(ua);
  
  console.log('User-Agent:', ua);
  console.log('Is TVBox:', isTVBox);
  
  if (isTVBox) {
    // TVBox访问 - 返回JSON数据
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        urls: [
          {
            name: "FongMi智能解析",
            url: "/data.json"
          }
        ]
      })
    };
  } else {
    // 浏览器访问 - 重定向到index.html
    return {
      statusCode: 302,
      headers: {
        'Location': '/index.html'
      },
      body: ''
    };
  }
};