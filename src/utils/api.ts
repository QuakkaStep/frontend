import { API_BASE } from '../context/AppContext';

const defaultHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

// 重试等待函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchWithHeaders = async (
  endpoint: string,
  options: RequestInit = {},
  maxRetries = 30,
  retryDelay = 5000 // 毫秒
): Promise<any> => {
  const url = `${API_BASE}${endpoint}`;
  console.log('[fetchWithHeaders] url', url);

  const headers = {
    ...defaultHeaders,
    'ngrok-skip-browser-warning': 'true',
    ...options.headers
  };

  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.warn(`[fetchWithHeaders] Attempt ${attempt + 1} failed:`, err);
      attempt++;
      if (attempt >= maxRetries) {
        throw err;
      }
      await delay(retryDelay);
    }
  }
};
