import { Hono } from 'hono';
import { sign, verify } from 'hono/jwt';
import { Env } from '../../shared/types';
import { LoginSchema, MFASetupSchema } from '../../schemas/mentoradoSchema';
import { db } from '../lib/mentoradoDB';

const auth = new Hono<{ Bindings: Env }>();

// JWT secret helper
const getJWTSecret = (env: Env): string => {
  return env.JWT_SECRET || 'development-secret-key-change-in-production';
};

// Login endpoint
auth.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = LoginSchema.safeParse(body);
    
    if (!parsed.success) {
      return c.json({ 
        error: 'Validation failed',
        details: parsed.error.issues 
      }, 400);
    }

    const { email, code } = parsed.data;
    const database = db(c.env);

    // Validate user exists
    const user = await database.getUserByEmail(email);
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    const userRecord = user as any;

    // Demo authentication logic
    const validCodes = ['123456', '654321', '111111'];
    if (!validCodes.includes(code) && !/^\d{6}$/.test(code)) {
      return c.json({ error: 'Invalid code. Use 123456, 654321, or 111111 for demo.' }, 401);
    }

    const secret = getJWTSecret(c.env);

    // Generate JWT
    const payload = {
      sub: userRecord.id,
      email: userRecord.email,
      role: userRecord.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (12 * 60 * 60) // 12 hours
    };

    const token = await sign(payload, secret);

    // Log login event
    await database.logEvent(userRecord.id, 'login', { email, ip: c.req.header('cf-connecting-ip') });

    // Generate refresh token
    const refreshPayload = {
      sub: userRecord.id,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
    };

    const refreshToken = await sign(refreshPayload, secret);

    return c.json({ 
      success: true,
      accessToken: token,
      refreshToken,
      user: {
        id: userRecord.id,
        email: userRecord.email,
        name: userRecord.name,
        role: userRecord.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Send login code
auth.post('/send-code', async (c) => {
  try {
    const { email } = await c.req.json();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return c.json({ error: 'Valid email required' }, 400);
    }

    const database = db(c.env);
    const user = await database.getUserByEmail(email);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // For demo, log the code
    console.log(`[DEMO] Login code for ${email}: ${code}`);

    return c.json({ 
      success: true,
      message: 'Code sent to your email. Check console for demo code.'
    });
  } catch (error) {
    console.error('Send code error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Setup MFA
auth.post('/mfa/setup', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = MFASetupSchema.safeParse(body);
    
    if (!parsed.success) {
      return c.json({ 
        error: 'Validation failed',
        details: parsed.error.issues 
      }, 400);
    }

    return c.json({ 
      success: true,
      message: `MFA setup initiated for ${parsed.data.method}` 
    });
  } catch (error) {
    console.error('MFA setup error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Token verification endpoint
auth.get('/verify', async (c) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Authorization token required' }, 401);
  }

  try {
    const token = authHeader.substring(7);
    const secret = getJWTSecret(c.env);
    
    const payload = await verify(token, secret) as any;
    
    return c.json({ 
      success: true,
      userId: payload.sub,
      role: payload.role
    });
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
});

// Refresh token endpoint
auth.post('/refresh', async (c) => {
  try {
    const { refreshToken } = await c.req.json();
    
    if (!refreshToken) {
      return c.json({ error: 'Refresh token required' }, 400);
    }

    const secret = getJWTSecret(c.env);
    const payload = await verify(refreshToken, secret) as any;
    
    if (payload.type !== 'refresh') {
      return c.json({ error: 'Invalid refresh token' }, 401);
    }

    const database = db(c.env);
    const user = await database.getUserById(payload.sub);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    const userRecord = user as any;

    // Generate new access token
    const accessPayload = {
      sub: userRecord.id,
      email: userRecord.email,
      role: userRecord.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (12 * 60 * 60) // 12 hours
    };

    const newAccessToken = await sign(accessPayload, secret);

    // Generate new refresh token
    const refreshPayload = {
      sub: userRecord.id,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
    };

    const newRefreshToken = await sign(refreshPayload, secret);

    return c.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: userRecord.id,
        email: userRecord.email,
        name: userRecord.name,
        role: userRecord.role
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return c.json({ error: 'Invalid refresh token' }, 401);
  }
});

// JWT verification middleware for protected routes
export const authMiddleware = async (c: any, next: () => Promise<void>) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Authorization token required' }, 401);
  }

  try {
    const token = authHeader.substring(7);
    const secret = getJWTSecret(c.env);
    
    try {
      const payload = await verify(token, secret) as any;
      c.set('userId', payload.sub);
      c.set('userRole', payload.role);
      await next();
    } catch (jwtError) {
      // For development/demo, provide fallback with demo user
      if (token === 'demo-token' || token === 'demo-jwt-token') {
        console.log('[DEMO] Using demo user fallback');
        c.set('userId', 'u_demo');
        c.set('userRole', 'mentorado');
        await next();
      } else {
        console.error('JWT verification failed:', jwtError);
        return c.json({ error: 'Invalid or expired token' }, 401);
      }
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return c.json({ error: 'Authentication failed' }, 401);
  }
};

export { auth as mentoradoAuth };
