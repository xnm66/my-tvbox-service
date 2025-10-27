// password-worker.js - 网站密码配置文件
// 放置于网站根目录，用于存储密码配置信息

const PASSWORD_CONFIG = {
  // === 密码设置 ===
  // 在这里修改访问密码，建议4位数字
  currentPassword: "2029",
  
  // === 安全设置 ===
  tokenExpiry: 7,      // 令牌有效期（天）
  maxAttempts: 5,      // 最大尝试次数
  allowNumbersOnly: true, // 只允许数字密码
  
  // === 网站配置 ===
  siteName: "私人影院 - 智能影视聚合平台",
  version: "1.0.0",
  
  // === 维护模式 ===
  maintenanceMode: false,
  maintenanceMessage: "网站维护中，请稍后访问"
};

// 配置信息结束

/*
使用说明：
1. 修改 currentPassword 的值来更改访问密码
2. 修改 tokenExpiry 来调整记住登录的天数
3. 设置 maintenanceMode 为 true 可以开启维护模式

注意：
- 修改密码后，用户需要刷新页面才能使用新密码
- 现有登录用户的令牌会在过期后自动失效
- 维护模式开启时，所有用户都需要重新验证密码
*/

// 控制台提示
console.log('密码配置文件已加载 - 私人影院系统');