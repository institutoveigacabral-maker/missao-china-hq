import { Hono } from 'hono';
import { Env } from '../../shared/types';
import { db } from '../lib/mentoradoDB';

const seedRoutes = new Hono<{ Bindings: Env }>();

// Seed mentorado data
seedRoutes.post('/mentorado', async (c) => {
  try {
    const database = db(c.env);
    
    // Create demo user and mentorado if they don't exist
    const userId = 'u_demo';
    const mentoradoId = 'm_demo';
    
    // Create user
    try {
      await c.env.DB.prepare(`
        INSERT OR REPLACE INTO users_mentorado (id, email, name, role, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        userId,
        'mentorado@demo.com',
        'João Silva',
        'mentorado',
        Date.now(),
        Date.now()
      ).run();
    } catch (e) {
      console.log('User already exists or error:', e);
    }

    // Create mentorado profile
    try {
      await c.env.DB.prepare(`
        INSERT OR REPLACE INTO mentorados (id, user_id, company, cnpj, phone, capital_brl, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        mentoradoId,
        userId,
        'ImportaCorp Ltda',
        '12.345.678/0001-99',
        '+55 11 98765-4321',
        500000,
        'active',
        Date.now() - 180 * 24 * 60 * 60 * 1000, // 6 months ago
        Date.now()
      ).run();
    } catch (e) {
      console.log('Mentorado already exists or error:', e);
    }

    // Create demo factories
    const factories = [
      {
        id: 'f_guangzhou1',
        name: 'Guangzhou Electronics Co.',
        city: 'Guangzhou',
        province: 'Guangdong',
        compliance_score: 95,
        last_audit: Date.now() - 30 * 24 * 60 * 60 * 1000
      },
      {
        id: 'f_shenzhen1',
        name: 'Shenzhen Tech Manufacturing',
        city: 'Shenzhen',
        province: 'Guangdong',
        compliance_score: 92,
        last_audit: Date.now() - 45 * 24 * 60 * 60 * 1000
      },
      {
        id: 'f_dongguan1',
        name: 'Dongguan Precision Industries',
        city: 'Dongguan',
        province: 'Guangdong',
        compliance_score: 88,
        last_audit: Date.now() - 60 * 24 * 60 * 60 * 1000
      },
      {
        id: 'f_ningbo1',
        name: 'Ningbo Smart Products Ltd',
        city: 'Ningbo',
        province: 'Zhejiang',
        compliance_score: 90,
        last_audit: Date.now() - 20 * 24 * 60 * 60 * 1000
      }
    ];

    for (const factory of factories) {
      try {
        await c.env.DB.prepare(`
          INSERT OR REPLACE INTO factories_mentorado (
            id, name, city, province, compliance_score, last_audit, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          factory.id,
          factory.name,
          factory.city,
          factory.province,
          factory.compliance_score,
          factory.last_audit,
          Date.now() - 365 * 24 * 60 * 60 * 1000,
          Date.now()
        ).run();

        // Link first 2 factories to mentorado
        if (factory.id === 'f_guangzhou1' || factory.id === 'f_shenzhen1') {
          await database.linkFactory(
            mentoradoId, 
            factory.id, 
            factory.id === 'f_guangzhou1' ? 'preferred' : 'partner'
          );
        }
      } catch (e) {
        console.log(`Factory ${factory.id} error:`, e);
      }
    }

    // Create demo deals
    const deals = [
      {
        id: 'd_deal1',
        title: 'Importação de Smart Watches - 5000 unidades',
        factory_id: 'f_guangzhou1',
        amount_eur: 45000,
        status: 'in_production',
        created_at: Date.now() - 60 * 24 * 60 * 60 * 1000
      },
      {
        id: 'd_deal2',
        title: 'Wireless Earbuds - Pedido Piloto',
        factory_id: 'f_shenzhen1',
        amount_eur: 28000,
        status: 'negotiating',
        created_at: Date.now() - 30 * 24 * 60 * 60 * 1000
      },
      {
        id: 'd_deal3',
        title: 'Power Banks - 10000 unidades',
        factory_id: 'f_guangzhou1',
        amount_eur: 62000,
        status: 'approved',
        created_at: Date.now() - 15 * 24 * 60 * 60 * 1000
      },
      {
        id: 'd_deal4',
        title: 'Bluetooth Speakers - Linha Premium',
        factory_id: 'f_shenzhen1',
        amount_eur: 38500,
        status: 'shipped',
        created_at: Date.now() - 90 * 24 * 60 * 60 * 1000
      },
      {
        id: 'd_deal5',
        title: 'USB Cables Type-C - 20000 peças',
        factory_id: 'f_dongguan1',
        amount_eur: 15000,
        status: 'delivered',
        created_at: Date.now() - 120 * 24 * 60 * 60 * 1000
      }
    ];

    for (const deal of deals) {
      try {
        await c.env.DB.prepare(`
          INSERT OR REPLACE INTO deals_mentorado (
            id, mentorado_id, factory_id, title, amount_eur, status, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          deal.id,
          mentoradoId,
          deal.factory_id,
          deal.title,
          deal.amount_eur,
          deal.status,
          deal.created_at,
          Date.now()
        ).run();
      } catch (e) {
        console.log(`Deal ${deal.id} error:`, e);
      }
    }

    // Create demo documents
    const documents = [
      {
        id: 'doc_contract1',
        type: 'contract',
        url: 'https://example.com/contracts/deal1-contract.pdf',
        hash: 'abc123def456789'
      },
      {
        id: 'doc_commitment1',
        type: 'commitment',
        url: 'https://example.com/docs/termo-compromisso.pdf',
        hash: 'xyz789abc123def'
      },
      {
        id: 'doc_qa1',
        type: 'qa_report',
        url: 'https://example.com/qa/report-guangzhou-2024.pdf',
        hash: 'qwe456rty789uio'
      }
    ];

    for (const doc of documents) {
      try {
        await c.env.DB.prepare(`
          INSERT OR REPLACE INTO documents_mentorado (
            id, mentorado_id, type, url, hash, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(
          doc.id,
          mentoradoId,
          doc.type,
          doc.url,
          doc.hash,
          Date.now() - 30 * 24 * 60 * 60 * 1000,
          Date.now()
        ).run();
      } catch (e) {
        console.log(`Document ${doc.id} error:`, e);
      }
    }

    return c.json({ 
      success: true, 
      message: 'Mentorado demo data seeded successfully',
      data: {
        user_id: userId,
        mentorado_id: mentoradoId,
        factories_created: factories.length,
        deals_created: deals.length,
        documents_created: documents.length
      }
    });
  } catch (error) {
    console.error('Seed mentorado error:', error);
    return c.json({ 
      success: false,
      error: 'Failed to seed mentorado data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

export { seedRoutes };
