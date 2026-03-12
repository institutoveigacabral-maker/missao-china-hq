import { Hono } from 'hono';
import { Env } from '../../shared/types';
import { authMiddleware } from './mentoradoAuth';

const notifications = new Hono<{ Bindings: Env, Variables: { userId: string, userRole: string } }>();

// Apply auth middleware
notifications.use('*', authMiddleware);

// Get all notifications for user
notifications.get('/', async (c) => {
  try {
    // For now, return mock notifications
    // In production, these would come from a notifications table
    const mockNotifications = [
      {
        id: 'n_1',
        type: 'success',
        title: 'Deal Aprovado',
        message: 'Seu deal com Guangzhou Tech Co. foi aprovado!',
        timestamp: Date.now() - 3600000,
        read: false,
        actionUrl: '/mentorado/deals/d_1'
      },
      {
        id: 'n_2',
        type: 'warning',
        title: 'Certificação Vencendo',
        message: 'A certificação do fornecedor Shanghai Industries vence em 30 dias',
        timestamp: Date.now() - 7200000,
        read: false,
        actionUrl: '/mentorado/suppliers/f_3'
      },
      {
        id: 'n_3',
        type: 'info',
        title: 'Novo Documento',
        message: 'Relatório QA foi adicionado ao sistema',
        timestamp: Date.now() - 86400000,
        read: true,
        actionUrl: '/mentorado/documents'
      },
    ];

    return c.json({ 
      success: true, 
      data: mockNotifications 
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Mark notification as read
notifications.post('/:id/read', async (c) => {
  try {
    // In production, update notification in database
    // For now, just return success
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Mark all notifications as read
notifications.post('/read-all', async (c) => {
  try {
    // In production, update all notifications in database
    // For now, just return success
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Delete notification
notifications.delete('/:id', async (c) => {
  try {
    // In production, delete notification from database
    // For now, just return success
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export { notifications as mentoradoNotifications };
