import { z } from "zod";
import { ReactNode, ComponentType } from "react";

// Base schemas
export const MetricSchema = z.object({
  id: z.string(),
  title: z.string(),
  value: z.union([z.string(), z.number()]),
  change: z.string().optional(),
  changeType: z.enum(['positive', 'negative', 'neutral', 'warning', 'info']).optional(),
  trend: z.enum(['up', 'down', 'stable']).optional(),
});

export const AlertSchema = z.object({
  id: z.string(),
  type: z.enum(['warning', 'danger', 'info', 'success']),
  title: z.string(),
  description: z.string(),
  createdAt: z.string(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
});

export const StatusIndicatorSchema = z.object({
  status: z.enum(['success', 'warning', 'danger', 'info']),
  text: z.string(),
});

export const ModuleStatusSchema = z.object({
  moduleId: z.string(),
  moduleName: z.string(),
  status: z.enum(['active', 'pending', 'inactive', 'maintenance']),
  progress: z.number().min(0).max(100),
  lastUpdated: z.string(),
});

// IoT Playbook schemas
export const IoTSkuSchema = z.object({
  id: z.number(),
  sku_code: z.string(),
  product_name: z.string(),
  product_category: z.string(),
  description: z.string().optional(),
  technical_specs: z.string().optional(),
  regulatory_status: z.string(),
  supplier_id: z.number().optional(),
  
  certification_level: z.string().optional(),
  risk_category: z.string(),
  target_markets: z.string().optional(),
  compliance_notes: z.string().optional(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const RegulationSchema = z.object({
  id: z.number(),
  regulation_code: z.string(),
  regulation_name: z.string(),
  region: z.string(),
  category: z.string(),
  description: z.string().optional(),
  official_link: z.string().optional(),
  validity_start_date: z.string().optional(),
  validity_end_date: z.string().optional(),
  last_update_date: z.string().optional(),
  severity_level: z.string(),
  is_mandatory: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const SupplierSchema = z.object({
  id: z.number(),
  supplier_code: z.string(),
  company_name: z.string(),
  supplier_type: z.string(),
  country: z.string(),
  city: z.string().optional(),
  contact_person: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  quality_rating: z.number(),
  certification_status: z.string(),
  compliance_score: z.number(),
  last_audit_date: z.string().optional(),
  next_audit_date: z.string().optional(),
  risk_level: z.string(),
  is_approved: z.boolean(),
  notes: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const TestReportSchema = z.object({
  id: z.number(),
  report_code: z.string(),
  sku_id: z.number(),
  lab_id: z.number(),
  regulation_id: z.number().optional(),
  test_type: z.string(),
  test_status: z.string(),
  test_start_date: z.string().optional(),
  test_completion_date: z.string().optional(),
  test_result: z.string(),
  report_url: z.string().optional(),
  certificate_url: z.string().optional(),
  cost_amount: z.number().optional(),
  currency: z.string(),
  notes: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// API Response schemas
export const DashboardDataSchema = z.object({
  metrics: z.array(MetricSchema),
  alerts: z.array(AlertSchema),
  moduleStatuses: z.array(ModuleStatusSchema),
  operationalStatus: z.record(z.string(), StatusIndicatorSchema),
});

export const PlaybookDataSchema = z.object({
  skus: z.array(IoTSkuSchema),
  regulations: z.array(RegulationSchema),
  suppliers: z.array(SupplierSchema),
  testReports: z.array(TestReportSchema),
});

// Types derived from schemas
export type Metric = z.infer<typeof MetricSchema>;
export type Alert = z.infer<typeof AlertSchema>;
export type StatusIndicator = z.infer<typeof StatusIndicatorSchema>;
export type ModuleStatus = z.infer<typeof ModuleStatusSchema>;
export type DashboardData = z.infer<typeof DashboardDataSchema>;

export type IoTSku = z.infer<typeof IoTSkuSchema>;
export type Regulation = z.infer<typeof RegulationSchema>;
export type Supplier = z.infer<typeof SupplierSchema>;

export type TestReport = z.infer<typeof TestReportSchema>;
export type PlaybookData = z.infer<typeof PlaybookDataSchema>;

// Component prop types
export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral' | 'warning' | 'info';
  icon?: ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'stable';
}

export interface StatusIndicatorProps {
  status: 'success' | 'warning' | 'danger' | 'info';
  text: string;
}

export interface LayoutProps {
  children: ReactNode;
}

// Navigation types
export interface NavigationModule {
  id: string;
  name: string;
  icon: ComponentType<{ className?: string }>;
  path: string;
  description?: string;
}

// App Statistics interface
export interface AppStats {
  totalSKUs: number;
  certifiedSKUs: number;
  pendingSKUs: number;
  totalSuppliers: number;
  approvedSuppliers: number;
  pendingSuppliers: number;
  totalRegulations: number;
  complianceRate: number;
  lowRiskSKUs: number;
  mediumRiskSKUs: number;
  highRiskSKUs: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
}

// Mission progress tracking
export interface MissionProgress {
  overall: number;
  modules: Record<string, number>;
  lastUpdated: string;
}

// Database types (for D1)
export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  exec(query: string): Promise<D1ExecResult>;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  dump(): Promise<ArrayBuffer>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run(): Promise<D1Result>;
  all<T = unknown>(): Promise<D1Result<T>>;
  raw<T = unknown>(): Promise<T[]>;
}

export interface D1Result<T = Record<string, unknown>> {
  results?: T[];
  success: boolean;
  meta: {
    served_by?: string;
    duration?: number;
    changes?: number;
    last_row_id?: number;
    changed_db?: boolean;
    size_after?: number;
    rows_read?: number;
    rows_written?: number;
  };
}

export interface D1ExecResult {
  count: number;
  duration: number;
}

// R2 Bucket types
export interface R2Bucket {
  head(key: string): Promise<R2Object | null>;
  get(key: string, options?: R2GetOptions): Promise<R2ObjectBody | null>;
  put(key: string, value: ReadableStream | ArrayBuffer | ArrayBufferView | string | null | Blob, options?: R2PutOptions): Promise<R2Object>;
  delete(key: string | string[]): Promise<void>;
  list(options?: R2ListOptions): Promise<R2Objects>;
}

export interface R2Object {
  key: string;
  version: string;
  size: number;
  etag: string;
  httpEtag: string;
  uploaded: Date;
  httpMetadata?: R2HTTPMetadata;
  customMetadata?: Record<string, string>;
  range?: R2Range;
}

export interface R2ObjectBody extends R2Object {
  body: ReadableStream;
  bodyUsed: boolean;
  arrayBuffer(): Promise<ArrayBuffer>;
  text(): Promise<string>;
  json<T = unknown>(): Promise<T>;
  blob(): Promise<Blob>;
}

export interface R2GetOptions {
  onlyIf?: R2Conditional;
  range?: R2Range;
}

export interface R2PutOptions {
  onlyIf?: R2Conditional;
  httpMetadata?: R2HTTPMetadata;
  customMetadata?: Record<string, string>;
  md5?: ArrayBuffer | string;
  sha1?: ArrayBuffer | string;
  sha256?: ArrayBuffer | string;
  sha384?: ArrayBuffer | string;
  sha512?: ArrayBuffer | string;
}

export interface R2ListOptions {
  limit?: number;
  prefix?: string;
  cursor?: string;
  delimiter?: string;
  startAfter?: string;
  include?: ('httpMetadata' | 'customMetadata')[];
}

export interface R2Objects {
  objects: R2Object[];
  truncated: boolean;
  cursor?: string;
  delimitedPrefixes: string[];
}

export interface R2HTTPMetadata {
  contentType?: string;
  contentLanguage?: string;
  contentDisposition?: string;
  contentEncoding?: string;
  cacheControl?: string;
  cacheExpiry?: Date;
}

export interface R2Range {
  offset?: number;
  length?: number;
  suffix?: number;
}

export interface R2Conditional {
  etagMatches?: string;
  etagDoesNotMatch?: string;
  uploadedBefore?: Date;
  uploadedAfter?: Date;
}

// Environment bindings for Cloudflare Workers
export interface Env {
  DB: D1Database;
  R2_BUCKET?: R2Bucket;
  MOCHA_USERS_SERVICE_API_URL: string;
  MOCHA_USERS_SERVICE_API_KEY: string;
  CHQ_API_BASE?: string;
  CHQ_API_KEY?: string;
  JWT_SECRET?: string;
  [key: string]: unknown;
}
