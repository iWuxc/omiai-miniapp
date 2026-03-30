export const config = {
  // API Base URL
  // 开发环境使用空字符串走 Vite 代理，生产环境使用实际地址
  baseUrl: import.meta.env.PROD
    ? (import.meta.env.VITE_API_BASE_URL || 'http://localhost:10131/api')
    : '/api',
  
  // H5 Domain for invitations
  h5Domain: import.meta.env.VITE_H5_DOMAIN || 'http://localhost:5173/#',

  // Static Assets Base URL
  assetsUrl: import.meta.env.PROD
    ? (import.meta.env.VITE_ASSETS_URL || 'http://localhost:10131')
    : '/api',
};
