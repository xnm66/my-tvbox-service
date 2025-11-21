// 多账号轮询 - 支持夸克、阿里、123、UC、百度网盘
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const platform = url.pathname.split('/').pop(); // 获取平台类型
  
  // CORS 头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };
  
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }
  
  // ==================== 账号池配置 ====================
  
  // 夸克网盘 - 多账号轮询
  const quarkAccounts = [
    {
      id: 1,
      name: "夸克主力账号",
      cookie: "_UP_A4A_11_=wb9ce10be8494e7c88f31718bd67d77c; _UP_335_2B_=1; web-grey-id=8d9d13c3-41b4-6ef8-c599-6dd3a9f973ba; web-grey-id.sig=RRzYKTM_C96jYC0q9W82ZShseqw2Yzrz-QSAOiX8LHI; _UP_D_=pc; _UP_F7E_8D_=i74i77uRTztUEsHZ9vBoBCT%2BIV9Pu1rG5LWOnQf6ZRavedlPA5KycLcbQK4Gg2juTKG5xjgNbnhLHpvA%2Fhicy1HUTu2LBlCP7iSu6h7rwWURR7PkP6bIT5JCgtq0CedXq%2ByKzMDFQ4%2Fu60lxZuUY21tf5rwS7zMCkzpNsBL26JBQn8AHdbyGVJuGysUvOCrLrBPpSAl%2B19250nvnyjN2b9lGaLFNgjzvtSKvOiTvZ5%2B5rnZJesBZ2G4R7jPsYkALDesbwHAjtUGpEEVkRJHrSq%2FFufEPvHRf%2BTWJwwrgkSoGRq%2F1DpN7C3tZAoK5PsvMPNL3cTgkDDej%2Bhm3mVYTBUo6%2BhNj2Brxs1YxLzJs52mICuiPI2PVlc4oCTgvjBzfs1YxLzJs52mV0QP5E5cDiwUzKge2mfdZ6ftiEKZOtyls2i%2BxKaGo8Xjef0zUpNsX; _UP_30C_6A_=st9cf620112tvkw2m3dly0fma7tvwfzv; _UP_TS_=sg1aa1acdf5b529d078a4b81fc209fa139d; _UP_E37_B7_=sg1aa1acdf5b529d078a4b81fc209fa139d; _UP_TG_=st9cf620112tvkw2m3dly0fma7tvwfzv; __pus=ca30fd76cd192d88d704b58fc7166376AARop41vsgbmbRbsB2fkP1nNgQu9Kh/1JlAd2pCUZo1ZCVaUfMBEAgZExMl6Be4I7bkgNf4N5lHJ/nqqvdLoJxrs; __kp=50c9ff10-bd3f-11f0-8d3e-d9dc60c2e573; __kps=AAQTCbdFmsDEyeU7bzA/wK4W; __ktd=0KYOwMjUnfpgJjjGKOzTpQ==; __uid=AAQTCbdFmsDEyeU7bzA/wK4W; tfstk=glEEe_jrDDJPlpR1A5ny3WwVNKbK405b-uGSE82odXcndDwu78wVpYNQEbzrs7BpADfpqb2Y62G3NDOP45onyyGSObozeSW1GisbpJn-xs1fcDSf69ixEbckNcjip0kneu3hfJn-q11Lc7uQpWguJQnnqOoieY-oq3VosActeYAnEHXaIfhiEYYHxGmipYKKq7mlQRctE0cuZ2XaIfHoqbAaL7Vfgv3hCVC8mdjV42c0Kf-kmLkq-YjxG3xubVrsiJYDq3qZL2EGPP4az0zuHzoob_8-Zlhzx8FlahlmoPg8X5bWWgPJwAvJOuER2U0nBAlfQO8YN_CccbslGUL-JVHZGOYDyU3nBAlfQO8Jy26SQj6Mo; __puus=f2301ee7b580ede566f60eb5176acff4AAS/jl+v22u+U7bWvkZYT6EfFJW7g99aizLbaJw4qMp2zzs0A4VZxfgFxCieHIssCQDnoSkm7ucQAkzcMc4IHUADh24S54/t8U9t0EzwIdcxjLCW/VJVHz7fcfnzcaLGofz2KLm1ADJhF4nG8mFvmxF53rDGbeDcN8kseME0iZuMIImBStQHpAUrZESuiTq9Az2uWpI66zKiqRm23Q33vapI",
      usage: 0,
      weight: 3
    }
  ];
  
  // 阿里云盘 - 多账号轮询
  const aliAccounts = [
    {
      id: 1,
      name: "阿里云盘-xpg", 
      token: "8d107b3e707347e68753397aa287e526",
      usage: 0,
      weight: 3
    }
    // 可以继续添加更多阿里云盘账号
  ];
  
  // 123网盘 - 多账号轮询
  const wangpan123Accounts = [
    {
      id: 1,
      name: "123网盘-xpg",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NjQzMDExODcsImlhdCI6MTc2MzY5NjM4NywiaWQiOjE4MTUwMzIwMjksIm1haWwiOiIiLCJuaWNrbmFtZSI6Ik1pc3Mg6ZmIIiwic3VwcGVyIjpmYWxzZSwidXNlcm5hbWUiOjEzMjE1MTUzNjY3LCJ2IjowfQ.x3aPYkG44wQoSj3GScsU6SCTyFpkpeIOJf7oltfII04",
      usage: 0, 
      weight: 2
    }
  ];
  
  // UC网盘 - 多账号轮询 (使用你刚提供的账号)
  const ucAccounts = [
    {
      id: 1,
      name: "UC网盘-xpg",
      cookie: "ctoken=8NZinTAk0G2zz6DknWfjome9;__pus=f5d0c2b86e601b30167573937681be8cAATEPZAZ10fF1h88blsWuekiHf8HJQ2eqW0gBQaykT4XGGvoN57m0Im+Qx0NvM2DrZmctA1kwOuHPf8RuiQNF/ov;__kp=8c9c5010-c690-11f0-b21a-a3a2d6d0ebb6;__kps=AASAnExcyS1xp72OZfcQ8ubr;__ktd=lEeIvWceoagXDbh4ZSAEnA==;__uid=AASAnExcyS1xp72OZfcQ8ubr;UDRIVE_TRANSFER_SESS=9CyxWfnrEDQLl6LGHhSIdEacKGzNj6GsdX-B37xM4Oo_YAuxwuiGMXwgCZEdS55HvUshnGmWRcU6J2hpwNjJsH9nXEA-qC_IerCDI7x8VtNzY8cN8oz1EAFUo3d3jTEQQ1CfzRMuaOzdEGpxAFCPyJwgYOtoWpOK1RYWsYL31sVqP7XorFuFZI8b7OJC-xDH;",
      usage: 0,
      weight: 2
    }
  ];
  
  // 百度网盘 - 多账号轮询 (暂时留空，有账号时可以添加)
  const baiduAccounts = [
    // {
    //   id: 1,
    //   name: "百度网盘账号", 
    //   cookie: "你的百度Cookie粘贴在这里",
    //   usage: 0,
    //   weight: 1
    // }
  ];
  
  // ==================== 智能轮询算法 ====================
  function getSmartAccount(accounts) {
    if (!accounts || accounts.length === 0) return null;
    
    // 选择 (使用次数/权重) 最小的账号
    const scoredAccounts = accounts.map(acc => ({
      ...acc,
      score: acc.usage / acc.weight
    }));
    
    const selected = scoredAccounts.sort((a, b) => a.score - b.score)[0];
    selected.usage++; // 更新使用次数
    
    console.log(`[${platform}] 使用账号: ${selected.name}, 使用次数: ${selected.usage}`);
    
    return selected;
  }
  
  // ==================== 路由处理 ====================
  
  // 状态检查
  if (platform === 'status') {
    return new Response(JSON.stringify({
      success: true,
      data: {
        quark: { 
          accounts: quarkAccounts.length, 
          active: quarkAccounts.length,
          names: quarkAccounts.map(acc => acc.name)
        },
        ali: { 
          accounts: aliAccounts.length, 
          active: aliAccounts.length,
          names: aliAccounts.map(acc => acc.name)
        },
        wangpan123: { 
          accounts: wangpan123Accounts.length, 
          active: wangpan123Accounts.length,
          names: wangpan123Accounts.map(acc => acc.name)
        },
        uc: { 
          accounts: ucAccounts.length, 
          active: ucAccounts.length,
          names: ucAccounts.map(acc => acc.name)
        },
        baidu: { 
          accounts: baiduAccounts.length, 
          active: baiduAccounts.length,
          names: baiduAccounts.map(acc => acc.name)
        },
        time: new Date().toLocaleString()
      }
    }), { headers });
  }
  
  // 夸克网盘
  if (platform === 'quark') {
    const account = getSmartAccount(quarkAccounts);
    if (account) {
      return new Response(JSON.stringify({
        success: true,
        platform: 'quark',
        account_id: account.id,
        account_name: account.name,
        usage: account.usage,
        data: { cookie: account.cookie }
      }), { headers });
    }
  }
  
  // 阿里云盘
  if (platform === 'ali') {
    const account = getSmartAccount(aliAccounts);
    if (account) {
      return new Response(JSON.stringify({
        success: true,
        platform: 'ali', 
        account_id: account.id,
        account_name: account.name,
        usage: account.usage,
        data: { token: account.token }
      }), { headers });
    }
  }
  
  // 123网盘
  if (platform === 'wangpan123') {
    const account = getSmartAccount(wangpan123Accounts);
    if (account) {
      return new Response(JSON.stringify({
        success: true,
        platform: 'wangpan123',
        account_id: account.id,
        account_name: account.name, 
        usage: account.usage,
        data: { token: account.token }
      }), { headers });
    }
  }
  
  // UC网盘
  if (platform === 'uc') {
    const account = getSmartAccount(ucAccounts);
    if (account) {
      return new Response(JSON.stringify({
        success: true,
        platform: 'uc',
        account_id: account.id,
        account_name: account.name,
        usage: account.usage,
        data: { cookie: account.cookie }
      }), { headers });
    }
  }
  
  // 百度网盘
  if (platform === 'baidu') {
    const account = getSmartAccount(baiduAccounts);
    if (account) {
      return new Response(JSON.stringify({
        success: true, 
        platform: 'baidu',
        account_id: account.id,
        account_name: account.name,
        usage: account.usage,
        data: { cookie: account.cookie }
      }), { headers });
    }
  }
  
  // 不支持的平台
  return new Response(JSON.stringify({
    success: false,
    message: '不支持的平台',
    supported_platforms: ['quark', 'ali', 'wangpan123', 'uc', 'baidu', 'status']
  }), { status: 404, headers });
}