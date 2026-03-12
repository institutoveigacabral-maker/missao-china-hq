import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { Env } from '../shared/types';

// Import route handlers
import authRoutes from './routes/auth';
import { skuRoutes } from './routes/skus';
import { supplierRoutes } from './routes/suppliers';
import { regulationRoutes } from './routes/regulations';
import { skuAnalysisRoutes } from './routes/skuAnalysis';
import { batchRoutes } from './routes/batch';
import { webVitalsRoutes } from './routes/webVitals';
import { pingRoutes } from './routes/ping';
import { statsRoutes } from './routes/stats';
import { mentoradoAuth } from './routes/mentoradoAuth';
import { mentorado } from './routes/mentorado';
import { mentoradoSuppliers } from './routes/mentoradoSuppliers';
import { mentoradoNotifications } from './routes/mentoradoNotifications';
import { mentoradoDeals } from './routes/mentoradoDeals';
import { mentoradoDocuments } from './routes/mentoradoDocuments';
import { mentoradoReports } from './routes/mentoradoReports';
import { seedRoutes } from './routes/seed';

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());
app.use('*', logger());

// Error handler
app.onError((err: Error, c) => {
  console.error('Worker error:', err);
  return c.json({ 
    success: false,
    message: 'Internal server error',
    error: err.message 
  }, 500);
});

// Health check
app.get('/', (c) => {
  return c.json({ message: 'China HQ API is running' });
});

// Mount route handlers
app.route('/api', authRoutes);
app.route('/api/auth', authRoutes);
app.route('/api/skus', skuRoutes);
app.route('/api/suppliers', supplierRoutes);
app.route('/api/regulations', regulationRoutes);
app.route('/api/sku-analysis', skuAnalysisRoutes);
app.route('/api/batch', batchRoutes);
app.route('/api/web-vitals', webVitalsRoutes);
app.route('/api/ping', pingRoutes);
app.route('/api/stats', statsRoutes);
app.route('/api/mentorado-auth', mentoradoAuth);
app.route('/api/mentorado', mentorado);
app.route('/api/mentorado/deals', mentoradoDeals);
app.route('/api/mentorado/suppliers', mentoradoSuppliers);
app.route('/api/mentorado/notifications', mentoradoNotifications);
app.route('/api/mentorado/documents', mentoradoDocuments);
app.route('/api/mentorado/reports', mentoradoReports);
app.route('/api/seed', seedRoutes);

export default app;
