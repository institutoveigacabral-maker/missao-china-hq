import { Hono } from 'hono';
import { Env } from '../../shared/types';

const auth = new Hono<{ Bindings: Env }>();

// Mock authentication for demo purposes
auth.get('/check', async (c) => {
  const authHeader = c.req.header('Authorization');
  const cookieToken = c.req.header('Cookie')?.includes('demo_token');
  
  // Check for demo token in localStorage (via cookie simulation)
  if (authHeader?.startsWith('Bearer ') || cookieToken) {
    return c.json({
      authenticated: true,
      user: {
        id: 'user_demo',
        email: 'admin@chinahq.com',
        name: 'China HQ Admin',
        avatar: null,
        role: 'admin'
      }
    });
  }

  return c.json({ authenticated: false }, 401);
});

auth.get('/users/me', async (c) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Authorization required' }, 401);
  }

  // For demo, return a mock user
  return c.json({
    id: 'user_demo',
    email: 'admin@chinahq.com',
    name: 'China HQ Admin',
    avatar: null,
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
});

// Mock Google OAuth callback
auth.get('/google/callback', async (c) => {
  // Simulate successful OAuth callback
  return c.json({
    user: {
      id: 'user_demo',
      email: 'admin@chinahq.com',
      name: 'China HQ Admin',
      avatar: null,
      role: 'admin'
    },
    token: 'demo-jwt-token'
  });
});

// Mock Google OAuth redirect
auth.get('/google', async (c) => {
  // For demo, simulate immediate login
  const user = {
    id: 'user_demo',
    email: 'admin@chinahq.com',
    name: 'China HQ Admin',
    avatar: null,
    role: 'admin'
  };
  
  // Return HTML that sets localStorage and redirects
  return c.html(`
    <!DOCTYPE html>
    <html>
    <head><title>Autenticando...</title></head>
    <body>
      <script>
        localStorage.setItem('demo_token', 'demo-jwt-token');
        localStorage.setItem('demo_user', JSON.stringify(${JSON.stringify(user)}));
        window.location.href = '/';
      </script>
      <p>Autenticando com Google...</p>
    </body>
    </html>
  `);
});

// Mock login endpoint
auth.post('/login', async (c) => {
  const { email } = await c.req.json();
  
  // Demo credentials - accept any login for demo
  return c.json({
    user: {
      id: 'user_demo',
      email: email || 'admin@chinahq.com',
      name: 'China HQ Admin',
      avatar: null,
      role: 'admin'
    },
    token: 'demo-jwt-token'
  });
});

// Mock logout endpoint
auth.post('/logout', async (c) => {
  return c.json({ success: true });
});

export default auth;
