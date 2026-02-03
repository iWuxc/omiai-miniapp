export const config = {
  // API Base URL
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:10131/api',
  
  // H5 Domain for invitations
  h5Domain: import.meta.env.VITE_H5_DOMAIN || 'http://localhost:5173/#', 
  
  // Static Assets Base URL
  assetsUrl: import.meta.env.VITE_ASSETS_URL || 'http://localhost:10131',
};
