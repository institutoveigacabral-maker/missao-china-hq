/**
 * Auto-refresh interceptor for expired JWT tokens
 */

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: string) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  
  failedQueue = [];
};

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch('/api/mentorado-auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('mentorado_user', JSON.stringify(data.user));
      return data.accessToken;
    } else {
      // Refresh token is invalid, clear all auth data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('mentorado_user');
      return null;
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const accessToken = localStorage.getItem('accessToken');
  
  // Add auth header
  const headers = new Headers(options.headers);
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  
  const requestOptions = {
    ...options,
    headers
  };

  // Make initial request
  let response = await fetch(url, requestOptions);

  // If 401, try to refresh token
  if (response.status === 401 && !url.includes('/refresh')) {
    if (!isRefreshing) {
      isRefreshing = true;
      
      try {
        const newToken = await refreshAccessToken();
        
        if (newToken) {
          processQueue(null, newToken);
          
          // Retry original request with new token
          headers.set('Authorization', `Bearer ${newToken}`);
          response = await fetch(url, { ...options, headers });
        } else {
          processQueue(new Error('Failed to refresh token'), null);
          // Redirect to login
          window.location.href = '/mentorado/login';
        }
      } catch (error) {
        processQueue(error, null);
        throw error;
      } finally {
        isRefreshing = false;
      }
    } else {
      // Wait for the token refresh to complete
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            headers.set('Authorization', `Bearer ${token}`);
            resolve(fetch(url, { ...options, headers }));
          },
          reject: (error: any) => {
            reject(error);
          }
        });
      });
    }
  }

  return response;
};
