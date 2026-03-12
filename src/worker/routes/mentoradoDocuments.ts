import { Hono } from 'hono';
import { Env } from '../../shared/types';
import { db } from '../lib/mentoradoDB';
import { authMiddleware } from './mentoradoAuth';

const documents = new Hono<{ Bindings: Env, Variables: { userId: string, userRole: string } }>();

// Apply auth middleware
documents.use('*', authMiddleware);

// Get all documents for mentorado
documents.get('/', async (c) => {
  try {
    const userId = c.get('userId') || 'u_demo';
    const database = db(c.env);
    
    const profile = await database.getMentoradoByUser(userId);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const profileRecord = profile as any;
    const documentsData = await database.listDocuments(profileRecord.id);
    
    return c.json({ 
      success: true, 
      data: documentsData 
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get specific document
documents.get('/:id', async (c) => {
  try {
    const documentId = c.req.param('id');
    const userId = c.get('userId') || 'u_demo';
    const database = db(c.env);
    
    const profile = await database.getMentoradoByUser(userId);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const profileRecord = profile as any;
    const document = await database.getDocument(documentId);
    
    if (!document) {
      return c.json({ error: 'Document not found' }, 404);
    }

    const documentRecord = document as any;
    
    // Verify document belongs to user
    if (documentRecord.mentorado_id !== profileRecord.id) {
      return c.json({ error: 'Document not found' }, 404);
    }

    return c.json({ 
      success: true, 
      data: document 
    });
  } catch (error) {
    console.error('Error fetching document:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Upload document
documents.post('/upload', async (c) => {
  try {
    const userId = c.get('userId') || 'u_demo';
    const database = db(c.env);
    
    const profile = await database.getMentoradoByUser(userId);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const profileRecord = profile as any;
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'other';

    if (!file) {
      return c.json({ error: 'No file uploaded' }, 400);
    }

    // Upload to R2 bucket
    const fileKey = `mentorado/${profileRecord.id}/documents/${Date.now()}-${file.name}`;
    
    if (!c.env.R2_BUCKET) {
      return c.json({ error: 'Storage not available' }, 500);
    }
    
    try {
      await c.env.R2_BUCKET.put(fileKey, file.stream(), {
        httpMetadata: {
          contentType: file.type,
          contentDisposition: `attachment; filename="${file.name}"`,
        },
      });
    } catch (uploadError) {
      console.error('R2 upload error:', uploadError);
      return c.json({ error: 'File upload failed' }, 500);
    }

    // Generate file hash (simplified)
    const hash = btoa(fileKey + Date.now()).substring(0, 16);
    
    // Save document metadata to database
    const documentId = await database.createDocument({
      mentorado_id: profileRecord.id,
      type,
      url: `https://storage.mocha.app/${fileKey}`,
      hash,
      file_name: file.name,
      file_size: file.size,
    });

    // Log event
    await database.logEvent(userId, 'document_uploaded', {
      document_id: documentId,
      type,
      file_name: file.name,
    });

    return c.json({ 
      success: true, 
      data: { id: documentId } 
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Download document
documents.get('/:id/download', async (c) => {
  try {
    const documentId = c.req.param('id');
    const userId = c.get('userId') || 'u_demo';
    const database = db(c.env);
    
    const profile = await database.getMentoradoByUser(userId);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const profileRecord = profile as any;
    const document = await database.getDocument(documentId);
    
    if (!document) {
      return c.json({ error: 'Document not found' }, 404);
    }

    const documentRecord = document as any;
    
    // Verify document belongs to user
    if (documentRecord.mentorado_id !== profileRecord.id) {
      return c.json({ error: 'Document not found' }, 404);
    }

    // Extract file key from URL
    const fileKey = documentRecord.url.replace('https://storage.mocha.app/', '');
    
    if (!c.env.R2_BUCKET) {
      return c.json({ error: 'Storage not available' }, 500);
    }
    
    try {
      const object = await c.env.R2_BUCKET.get(fileKey);
      
      if (!object) {
        return c.json({ error: 'File not found' }, 404);
      }

      const headers = new Headers();
      if (object.httpMetadata?.contentType) {
        headers.set('content-type', object.httpMetadata.contentType);
      }
      if (object.httpMetadata?.contentDisposition) {
        headers.set('content-disposition', object.httpMetadata.contentDisposition);
      }
      headers.set('etag', object.httpEtag);

      return new Response(object.body, {
        headers,
      });
    } catch (downloadError) {
      console.error('R2 download error:', downloadError);
      return c.json({ error: 'File download failed' }, 500);
    }
  } catch (error) {
    console.error('Error downloading document:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Delete document
documents.delete('/:id', async (c) => {
  try {
    const documentId = c.req.param('id');
    const userId = c.get('userId') || 'u_demo';
    const database = db(c.env);
    
    const profile = await database.getMentoradoByUser(userId);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const profileRecord = profile as any;
    const document = await database.getDocument(documentId);
    
    if (!document) {
      return c.json({ error: 'Document not found' }, 404);
    }

    const documentRecord = document as any;
    
    // Verify document belongs to user
    if (documentRecord.mentorado_id !== profileRecord.id) {
      return c.json({ error: 'Document not found' }, 404);
    }

    // Delete from R2 bucket
    const fileKey = documentRecord.url.replace('https://storage.mocha.app/', '');
    
    if (c.env.R2_BUCKET) {
      try {
        await c.env.R2_BUCKET.delete(fileKey);
      } catch (deleteError) {
        console.warn('R2 delete error (continuing):', deleteError);
      }
    }

    // Delete from database
    if (!c.env.DB) {
      return c.json({ error: 'Database not available' }, 500);
    }
    
    try {
      await database.deleteDocument(documentId);
    } catch (dbError) {
      console.error('Database delete error:', dbError);
      return c.json({ error: 'Database delete failed' }, 500);
    }

    // Log event
    await database.logEvent(userId, 'document_deleted', {
      document_id: documentId,
      type: documentRecord.type,
    });

    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export { documents as mentoradoDocuments };
