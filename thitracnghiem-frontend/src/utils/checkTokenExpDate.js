// src/utils/authUtils.js

// Hàm kiểm tra thời gian hết hạn của token
export function checkTokenExpDate(token) {
  if (!token) return true;

  const payload = JSON.parse(atob(token.split(".")[1])); // Giải mã phần payload của token
  const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại (tính bằng giây)

  return payload.exp < currentTime; // Kiểm tra token có hết hạn chưa
}
