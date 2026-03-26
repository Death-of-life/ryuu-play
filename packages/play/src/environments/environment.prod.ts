const apiUrl = typeof window !== 'undefined'
  ? window.location.origin
  : 'http://212.52.0.192:12021';

export const environment = {
  apiUrl,
  timeout: 5000,
  production: true,
  apiVersion: 4,
  defaultPageSize: 50,
  allowServerChange: true,
  refreshTokenInterval: 60 * 60 * 1000,
  enableImageCache: false,
  defaultLanguage: 'zh',
  languages: { en: 'English', zh: '中文' }
};
