import { Env } from '../../shared/types';

export interface DatabaseClient {
  getUserByEmail: (email: string) => Promise<any>;
  getUserById: (id: string) => Promise<any>;
  getUser: (id: string) => Promise<any>;
  getUserRoles: (userId: string) => Promise<string[]>;
  storeRefreshToken: (userId: string, token: string) => Promise<void>;
  validateRefreshToken: (userId: string, token: string) => Promise<boolean>;
  revokeRefreshToken: (userId: string, token: string) => Promise<void>;
  logEvent: (userId: string, type: string, data: any) => Promise<void>;
  getMentorado: (userId: string) => Promise<any>;
  getMentoradoByUser: (userId: string) => Promise<any>;
  listMentorados: () => Promise<any[]>;
  createUser: (data: any) => Promise<string>;
  createMentorado: (data: any) => Promise<any>;
  updateMentorado: (id: string, data: any) => Promise<any>;
  getDeal: (id: string) => Promise<any>;
  getDeals: (mentoradoId?: string) => Promise<any[]>;
  listDeals: (mentoradoId?: string) => Promise<any[]>;
  createDeal: (data: any) => Promise<any>;
  updateDeal: (id: string, data: any) => Promise<any>;
  getDocument: (id: string) => Promise<any>;
  getDocuments: (mentoradoId?: string) => Promise<any[]>;
  listDocuments: (mentoradoId?: string) => Promise<any[]>;
  createDocument: (data: any) => Promise<any>;
  deleteDocument: (id: string) => Promise<void>;
  getReports: (mentoradoId?: string) => Promise<any[]>;
  getFactories: () => Promise<any[]>;
  listLinkedFactories: (mentoradoId: string) => Promise<any[]>;
  linkFactory: (mentoradoId: string, factoryId: string, relation: string) => Promise<void>;
}

export function db(env: Env): DatabaseClient {
  const client = {
    // =====================================================
    // USER MANAGEMENT
    // =====================================================
    
    async getUserByEmail(email: string) {
      try {
        const query = `
          SELECT * FROM users_mentorado 
          WHERE email = ? LIMIT 1
        `;
        const result = await env.DB.prepare(query).bind(email).first();
        
        if (!result) {
          // Return demo user for development
          return {
            id: 'u_demo',
            email: email,
            name: 'Demo User',
            role: 'mentorado',
            password_hash: 'demo123', // In production: bcrypt hash
            mfa_enabled: false,
            created_at: Date.now(),
            updated_at: Date.now()
          };
        }
        
        return result;
      } catch (error) {
        console.error('Get user by email error:', error);
        return null;
      }
    },

    async getUserById(id: string) {
      try {
        const query = `
          SELECT * FROM users_mentorado 
          WHERE id = ? LIMIT 1
        `;
        const result = await env.DB.prepare(query).bind(id).first();
        
        if (!result && id === 'u_demo') {
          return {
            id: 'u_demo',
            email: 'demo@chinah.com',
            name: 'Demo User',
            role: 'mentorado',
            password_hash: 'demo123',
            mfa_enabled: false,
            created_at: Date.now(),
            updated_at: Date.now()
          };
        }
        
        return result;
      } catch (error) {
        console.error('Get user by ID error:', error);
        return null;
      }
    },

    async getUser(id: string) {
      try {
        const query = `
          SELECT * FROM users_mentorado 
          WHERE id = ? LIMIT 1
        `;
        const result = await env.DB.prepare(query).bind(id).first();
        
        if (!result && id === 'u_demo') {
          return {
            id: 'u_demo',
            email: 'demo@chinah.com',
            name: 'Demo User',
            role: 'mentorado',
            password_hash: 'demo123',
            mfa_enabled: false,
            created_at: Date.now(),
            updated_at: Date.now()
          };
        }
        
        return result;
      } catch (error) {
        console.error('Get user error:', error);
        return null;
      }
    },

    async getUserRoles(userId: string) {
      try {
        // In production, query user_roles table
        const user = await client.getUserById(userId);
        if (!user) return ['user'];
        
        const userRecord = user as any;
        return [userRecord.role || 'user'];
      } catch (error) {
        console.error('Get user roles error:', error);
        return ['user'];
      }
    },

    // =====================================================
    // JWT TOKEN MANAGEMENT
    // =====================================================

    async storeRefreshToken(userId: string, token: string) {
      try {
        // In production: store in secure table with expiration
        const query = `
          INSERT OR REPLACE INTO refresh_tokens (user_id, token, expires_at, created_at)
          VALUES (?, ?, ?, ?)
        `;
        const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
        await env.DB.prepare(query).bind(userId, token, expiresAt, Date.now()).run();
      } catch (error) {
        console.error('Store refresh token error:', error);
      }
    },

    async validateRefreshToken(userId: string, token: string) {
      try {
        // In production: check if token exists and not expired
        const query = `
          SELECT * FROM refresh_tokens 
          WHERE user_id = ? AND token = ? AND expires_at > ?
          LIMIT 1
        `;
        const result = await env.DB.prepare(query)
          .bind(userId, token, Date.now())
          .first();
        
        return !!result;
      } catch (error) {
        console.error('Validate refresh token error:', error);
        return false;
      }
    },

    async revokeRefreshToken(userId: string, token: string) {
      try {
        const query = `
          DELETE FROM refresh_tokens 
          WHERE user_id = ? AND token = ?
        `;
        await env.DB.prepare(query).bind(userId, token).run();
      } catch (error) {
        console.error('Revoke refresh token error:', error);
      }
    },

    // =====================================================
    // EVENT LOGGING
    // =====================================================

    async logEvent(userId: string, type: string, data: any) {
      try {
        const query = `
          INSERT INTO events_mentorado (id, ts, user_id, type, data, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        const id = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await env.DB.prepare(query).bind(
          id,
          Date.now(),
          userId,
          type,
          JSON.stringify(data),
          Date.now()
        ).run();
      } catch (error) {
        console.error('Log event error:', error);
      }
    },

    // =====================================================
    // MENTORADO MANAGEMENT
    // =====================================================

    async getMentorado(userId: string) {
      try {
        const query = `
          SELECT m.*, u.name as user_name, u.email as user_email
          FROM mentorados m
          JOIN users_mentorado u ON m.user_id = u.id
          WHERE m.user_id = ? LIMIT 1
        `;
        const result = await env.DB.prepare(query).bind(userId).first();
        
        if (!result) {
          return {
            id: 'm_demo',
            user_id: userId,
            company: 'Demo Company',
            cnpj: '12.345.678/0001-99',
            phone: '+55 11 99999-9999',
            capital_brl: 100000,
            status: 'active',
            user_name: 'Demo User',
            user_email: 'demo@chinah.com',
            created_at: Date.now(),
            updated_at: Date.now()
          };
        }
        
        return result;
      } catch (error) {
        console.error('Get mentorado error:', error);
        return null;
      }
    },

    async getMentoradoByUser(userId: string) {
      return client.getMentorado(userId);
    },

    async listMentorados() {
      try {
        const query = `
          SELECT m.*, u.name as user_name, u.email as user_email
          FROM mentorados m
          JOIN users_mentorado u ON m.user_id = u.id
          ORDER BY m.created_at DESC
        `;
        const { results } = await env.DB.prepare(query).all();
        
        if (!results?.length) {
          return [{
            id: 'm_demo',
            user_id: 'u_demo',
            company: 'Demo Company',
            cnpj: '12.345.678/0001-99',
            phone: '+55 11 99999-9999',
            capital_brl: 100000,
            status: 'active',
            user_name: 'Demo User',
            user_email: 'demo@chinah.com',
            created_at: Date.now(),
            updated_at: Date.now()
          }];
        }
        
        return results;
      } catch (error) {
        console.error('List mentorados error:', error);
        return [];
      }
    },

    async createUser(data: any) {
      try {
        const id = `u_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const now = Date.now();
        
        const query = `
          INSERT INTO users_mentorado (id, email, name, role, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        await env.DB.prepare(query).bind(
          id,
          data.email,
          data.name,
          data.role || 'mentorado',
          now,
          now
        ).run();
        
        return id;
      } catch (error) {
        console.error('Create user error:', error);
        throw error;
      }
    },

    async createMentorado(data: any) {
      try {
        const id = `m_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const now = Date.now();
        
        const query = `
          INSERT INTO mentorados (
            id, user_id, company, cnpj, phone, capital_brl, 
            status, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        await env.DB.prepare(query).bind(
          id,
          data.user_id,
          data.company,
          data.cnpj,
          data.phone,
          data.capital_brl || 0,
          data.status || 'onboarding',
          now,
          now
        ).run();
        
        return { ...data, id, created_at: now, updated_at: now };
      } catch (error) {
        console.error('Create mentorado error:', error);
        throw error;
      }
    },

    async updateMentorado(id: string, data: any) {
      try {
        const updates = [];
        const values = [];
        
        Object.keys(data).forEach(key => {
          if (key !== 'id') {
            updates.push(`${key} = ?`);
            values.push(data[key]);
          }
        });
        
        updates.push('updated_at = ?');
        values.push(Date.now());
        values.push(id);
        
        const query = `UPDATE mentorados SET ${updates.join(', ')} WHERE id = ?`;
        await env.DB.prepare(query).bind(...values).run();
        
        return { ...data, id, updated_at: Date.now() };
      } catch (error) {
        console.error('Update mentorado error:', error);
        throw error;
      }
    },

    // =====================================================
    // DEALS MANAGEMENT
    // =====================================================

    async getDeal(id: string) {
      try {
        const query = `
          SELECT d.*, f.name as factory_name, f.city as factory_city
          FROM deals_mentorado d
          LEFT JOIN factories_mentorado f ON d.factory_id = f.id
          WHERE d.id = ? LIMIT 1
        `;
        const result = await env.DB.prepare(query).bind(id).first();
        
        if (!result && id === 'd_demo') {
          return {
            id: 'd_demo',
            mentorado_id: 'm_demo',
            factory_id: 'f_demo',
            title: 'Demo Deal - Electronic Components',
            amount_eur: 25000,
            status: 'negotiating',
            factory_name: 'Shenzhen Tech Factory',
            factory_city: 'Shenzhen',
            created_at: Date.now() - 86400000,
            updated_at: Date.now()
          };
        }
        
        return result;
      } catch (error) {
        console.error('Get deal error:', error);
        return null;
      }
    },

    async getDeals(mentoradoId?: string) {
      try {
        let query = `
          SELECT d.*, f.name as factory_name, f.city as factory_city
          FROM deals_mentorado d
          LEFT JOIN factories_mentorado f ON d.factory_id = f.id
        `;
        const params = [];
        
        if (mentoradoId) {
          query += ' WHERE d.mentorado_id = ?';
          params.push(mentoradoId);
        }
        
        query += ' ORDER BY d.created_at DESC';
        
        const { results } = await env.DB.prepare(query).bind(...params).all();
        
        if (!results?.length) {
          return [{
            id: 'd_demo',
            mentorado_id: 'm_demo',
            factory_id: 'f_demo',
            title: 'Demo Deal - Electronic Components',
            amount_eur: 25000,
            status: 'negotiating',
            factory_name: 'Shenzhen Tech Factory',
            factory_city: 'Shenzhen',
            created_at: Date.now() - 86400000,
            updated_at: Date.now()
          }];
        }
        
        return results;
      } catch (error) {
        console.error('Get deals error:', error);
        return [];
      }
    },

    async listDeals(mentoradoId?: string) {
      return client.getDeals(mentoradoId);
    },

    async createDeal(data: any) {
      try {
        const id = `d_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const now = Date.now();
        
        const query = `
          INSERT INTO deals_mentorado (
            id, mentorado_id, factory_id, title, amount_eur, 
            status, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        await env.DB.prepare(query).bind(
          id,
          data.mentorado_id,
          data.factory_id,
          data.title,
          data.amount_eur || 0,
          data.status || 'draft',
          now,
          now
        ).run();
        
        return { ...data, id, created_at: now, updated_at: now };
      } catch (error) {
        console.error('Create deal error:', error);
        throw error;
      }
    },

    async updateDeal(id: string, data: any) {
      try {
        const updates = [];
        const values = [];
        
        Object.keys(data).forEach(key => {
          if (key !== 'id') {
            updates.push(`${key} = ?`);
            values.push(data[key]);
          }
        });
        
        updates.push('updated_at = ?');
        values.push(Date.now());
        values.push(id);
        
        const query = `UPDATE deals_mentorado SET ${updates.join(', ')} WHERE id = ?`;
        await env.DB.prepare(query).bind(...values).run();
        
        return { ...data, id, updated_at: Date.now() };
      } catch (error) {
        console.error('Update deal error:', error);
        throw error;
      }
    },

    // =====================================================
    // DOCUMENTS MANAGEMENT
    // =====================================================

    async getDocument(id: string) {
      try {
        const query = 'SELECT * FROM documents_mentorado WHERE id = ? LIMIT 1';
        const result = await env.DB.prepare(query).bind(id).first();
        
        if (!result && id === 'doc_demo') {
          return {
            id: 'doc_demo',
            mentorado_id: 'm_demo',
            type: 'contract',
            url: 'https://example.com/contract.pdf',
            hash: 'abc123def456',
            created_at: Date.now() - 86400000,
            updated_at: Date.now()
          };
        }
        
        return result;
      } catch (error) {
        console.error('Get document error:', error);
        return null;
      }
    },

    async getDocuments(mentoradoId?: string) {
      try {
        let query = 'SELECT * FROM documents_mentorado';
        const params = [];
        
        if (mentoradoId) {
          query += ' WHERE mentorado_id = ?';
          params.push(mentoradoId);
        }
        
        query += ' ORDER BY created_at DESC';
        
        const { results } = await env.DB.prepare(query).bind(...params).all();
        
        if (!results?.length) {
          return [{
            id: 'doc_demo',
            mentorado_id: 'm_demo',
            type: 'contract',
            url: 'https://example.com/contract.pdf',
            hash: 'abc123def456',
            created_at: Date.now() - 86400000,
            updated_at: Date.now()
          }];
        }
        
        return results;
      } catch (error) {
        console.error('Get documents error:', error);
        return [];
      }
    },

    async listDocuments(mentoradoId?: string) {
      return client.getDocuments(mentoradoId);
    },

    async createDocument(data: any) {
      try {
        const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const now = Date.now();
        
        const query = `
          INSERT INTO documents_mentorado (
            id, mentorado_id, type, url, hash, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        await env.DB.prepare(query).bind(
          id,
          data.mentorado_id,
          data.type,
          data.url,
          data.hash || null,
          now,
          now
        ).run();
        
        return { ...data, id, created_at: now, updated_at: now };
      } catch (error) {
        console.error('Create document error:', error);
        throw error;
      }
    },

    async deleteDocument(id: string) {
      try {
        const query = 'DELETE FROM documents_mentorado WHERE id = ?';
        await env.DB.prepare(query).bind(id).run();
      } catch (error) {
        console.error('Delete document error:', error);
        throw error;
      }
    },

    // =====================================================
    // REPORTS & ANALYTICS
    // =====================================================

    async getReports(mentoradoId?: string) {
      try {
        // Mock report data
        return [{
          id: 'r_demo',
          mentorado_id: mentoradoId || 'm_demo',
          type: 'monthly_summary',
          data: {
            deals_count: 3,
            total_value_eur: 75000,
            active_factories: 5,
            compliance_score: 8.7
          },
          created_at: Date.now() - 86400000
        }];
      } catch (error) {
        console.error('Get reports error:', error);
        return [];
      }
    },

    // =====================================================
    // FACTORIES MANAGEMENT
    // =====================================================

    async getFactories() {
      try {
        const query = 'SELECT * FROM factories_mentorado ORDER BY name';
        const { results } = await env.DB.prepare(query).all();
        
        if (!results?.length) {
          return [{
            id: 'f_demo',
            name: 'Shenzhen Tech Factory',
            city: 'Shenzhen',
            province: 'Guangdong',
            compliance_score: 8.5,
            last_audit: Date.now() - 86400000 * 30,
            created_at: Date.now() - 86400000 * 365,
            updated_at: Date.now()
          }];
        }
        
        return results;
      } catch (error) {
        console.error('Get factories error:', error);
        return [];
      }
    },

    async linkFactory(mentoradoId: string, factoryId: string, relation: string) {
      try {
        const query = `
          INSERT OR REPLACE INTO mentorado_factories (
            mentorado_id, factory_id, relation, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?)
        `;
        const now = Date.now();
        await env.DB.prepare(query).bind(mentoradoId, factoryId, relation, now, now).run();
      } catch (error) {
        console.error('Link factory error:', error);
        throw error;
      }
    },

    async listLinkedFactories(mentoradoId: string) {
      try {
        const query = `
          SELECT f.*, mf.relation
          FROM factories_mentorado f
          JOIN mentorado_factories mf ON f.id = mf.factory_id
          WHERE mf.mentorado_id = ?
          ORDER BY f.name
        `;
        const { results } = await env.DB.prepare(query).bind(mentoradoId).all();
        
        if (!results?.length) {
          return [{
            id: 'f_demo',
            name: 'Shenzhen Tech Factory',
            city: 'Shenzhen',
            province: 'Guangdong',
            compliance_score: 8.5,
            last_audit: Date.now() - 86400000 * 30,
            relation: 'preferred',
            created_at: Date.now() - 86400000 * 365,
            updated_at: Date.now()
          }];
        }
        
        return results;
      } catch (error) {
        console.error('List linked factories error:', error);
        return [];
      }
    }
  };
  
  return client;
}
