// password-worker.js
// 本地密码验证模块 - 部署在根目录

const VALID_PASSWORD = "2025"; // 4位数字密码
const TOKEN_EXPIRY_DAYS = 7;

// 密码验证函数
export function verifyPassword(inputPassword) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (inputPassword === VALID_PASSWORD) {
                const expiry = Date.now() + (TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
                const tokenData = {
                    valid: true,
                    expiry: expiry,
                    created: Date.now()
                };
                const token = btoa(JSON.stringify(tokenData));
                
                resolve({
                    success: true,
                    token: token,
                    message: "验证成功"
                });
            } else {
                resolve({
                    success: false,
                    message: "密码错误"
                });
            }
        }, 500); // 模拟网络延迟
    });
}