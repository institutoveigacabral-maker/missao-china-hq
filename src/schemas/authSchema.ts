import { z } from 'zod';

// =====================================================
// AUTHENTICATION SCHEMAS
// =====================================================

// Mocha Users Service OAuth
export const OAuthCallbackSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
  state: z.string().optional()
});

// Mentorado Hub JWT Authentication
export const MentoradoLoginSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .min(1, 'Email is required'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password too long'),
  mfaCode: z.string()
    .regex(/^\d{6}$/, 'MFA code must be 6 digits')
    .optional(),
  rememberMe: z.boolean().default(false)
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string()
    .min(1, 'Refresh token is required')
});

export const PasswordChangeSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'New password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number and special character'
    )
});

// =====================================================
// MFA SCHEMAS
// =====================================================

export const MFASetupSchema = z.object({
  method: z.enum(['totp', 'sms', 'email'], {
    errorMap: () => ({ message: 'Invalid MFA method' })
  }),
  phoneNumber: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional(),
  email: z.string()
    .email('Invalid email format')
    .optional()
});

export const MFAVerifySchema = z.object({
  code: z.string()
    .regex(/^\d{6}$/, 'MFA code must be 6 digits'),
  method: z.enum(['totp', 'sms', 'email'])
});

// =====================================================
// RBAC SCHEMAS  
// =====================================================

export const RoleAssignSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: z.enum(['admin', 'manager', 'mentorado', 'viewer', 'user'], {
    errorMap: () => ({ message: 'Invalid role' })
  }),
  expiresAt: z.number().optional(), // Unix timestamp
  grantedBy: z.string().optional()
});

export const PermissionCheckSchema = z.object({
  permission: z.string()
    .min(1, 'Permission is required')
    .regex(/^[a-z]+:[a-z_]+$/, 'Permission must be in format "action:resource"'),
  resourceId: z.string().optional()
});

// =====================================================
// SECURITY SCHEMAS
// =====================================================

export const SecurityEventSchema = z.object({
  eventType: z.enum([
    'login_attempt',
    'login_success',
    'login_failure', 
    'password_change',
    'mfa_setup',
    'mfa_disable',
    'token_refresh',
    'logout',
    'permission_denied',
    'suspicious_activity'
  ]),
  userId: z.string().optional(),
  sourceIp: z.string().ip().optional(),
  userAgent: z.string().optional(),
  details: z.record(z.any()).optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('medium')
});

export const RateLimitConfigSchema = z.object({
  windowMs: z.number().min(1000).default(15 * 60 * 1000), // 15 minutes
  maxAttempts: z.number().min(1).default(5),
  blockDurationMs: z.number().min(60000).default(60 * 60 * 1000) // 1 hour
});

// =====================================================
// API RESPONSE SCHEMAS
// =====================================================

export const AuthSuccessSchema = z.object({
  success: z.literal(true),
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string().optional(),
    user: z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      role: z.string(),
      permissions: z.array(z.string()).optional()
    }),
    expiresIn: z.number().optional(),
    requiresMfa: z.boolean().default(false)
  })
});

export const AuthErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  code: z.string().optional(),
  details: z.any().optional(),
  requiresMfa: z.boolean().default(false),
  rateLimited: z.boolean().default(false)
});

// =====================================================
// TYPE EXPORTS
// =====================================================

export type OAuthCallback = z.infer<typeof OAuthCallbackSchema>;
export type MentoradoLogin = z.infer<typeof MentoradoLoginSchema>;
export type RefreshToken = z.infer<typeof RefreshTokenSchema>;
export type PasswordChange = z.infer<typeof PasswordChangeSchema>;
export type MFASetup = z.infer<typeof MFASetupSchema>;
export type MFAVerify = z.infer<typeof MFAVerifySchema>;
export type RoleAssign = z.infer<typeof RoleAssignSchema>;
export type PermissionCheck = z.infer<typeof PermissionCheckSchema>;
export type SecurityEvent = z.infer<typeof SecurityEventSchema>;
export type RateLimitConfig = z.infer<typeof RateLimitConfigSchema>;
export type AuthSuccess = z.infer<typeof AuthSuccessSchema>;
export type AuthError = z.infer<typeof AuthErrorSchema>;