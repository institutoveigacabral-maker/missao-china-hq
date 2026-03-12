export interface SearchItem {
  id: string;
  title: string;
  description: string;
  subtitle?: string;
  type: 'sku' | 'supplier' | 'regulation' | 'page' | 'feature' | 'logistics' | 'finance';
  url: string;
  category?: string;
  status?: string;
  icon?: string;
  priority?: number;
  keywords?: string[];
}

// Função para preparar dados de SKUs para busca
export const prepareSkuData = (skus: any[]): SearchItem[] => {
  return skus.map(sku => ({
    id: `sku-${sku.sku_code}`,
    title: sku.sku_code,
    subtitle: sku.product_name || 'SKU',
    description: `${sku.product_category || 'Categoria'} • ${sku.regulatory_status || 'Status'} • ${sku.risk_category || 'Risco'}`,
    type: 'sku' as const,
    url: '/playbook',
    category: sku.product_category,
    status: sku.regulatory_status,
    icon: '📦',
    priority: sku.regulatory_status === 'certified' ? 80 : 
              sku.regulatory_status === 'pending' ? 70 : 60,
    keywords: [
      sku.sku_code?.toLowerCase(),
      sku.product_name?.toLowerCase(),
      sku.product_category?.toLowerCase(),
      sku.description?.toLowerCase(),
      sku.target_markets?.toLowerCase(),
      sku.supplier_name?.toLowerCase()
    ].filter(Boolean)
  }));
};

// Função para preparar dados de fornecedores
export const prepareSupplierData = (suppliers: any[]): SearchItem[] => {
  return suppliers.map(supplier => ({
    id: `supplier-${supplier.supplier_code || supplier.id}`,
    title: supplier.company_name || supplier.name,
    subtitle: `${supplier.country || 'País'} • Score: ${supplier.overall_score?.toFixed(1) || 'N/A'}`,
    description: `${supplier.city || 'Localização'} • ${supplier.vertical || 'Vertical'} • ${supplier.contract_status || 'Status'}`,
    type: 'supplier' as const,
    url: '/suppliers',
    category: supplier.vertical || 'Fornecedor',
    status: supplier.is_approved ? 'approved' : 'pending',
    icon: '🏭',
    priority: supplier.is_approved ? (supplier.overall_score || 0) * 10 : 30,
    keywords: [
      supplier.company_name?.toLowerCase(),
      supplier.supplier_code?.toLowerCase(),
      supplier.country?.toLowerCase(),
      supplier.city?.toLowerCase(),
      supplier.vertical?.toLowerCase(),
      supplier.product_lines?.toLowerCase(),
      supplier.contact_person?.toLowerCase()
    ].filter(Boolean)
  }));
};

// Função para preparar dados de regulamentações  
export const prepareRegulationData = (regulations: any[]): SearchItem[] => {
  return regulations.map(regulation => ({
    id: `regulation-${regulation.regulation_code || regulation.id}`,
    title: regulation.regulation_name || regulation.name || regulation.title,
    subtitle: `${regulation.region || 'Região'} • ${regulation.severity_level || 'Severidade'}`,
    description: `${regulation.category || 'Categoria'} • ${regulation.enforcement_authority || 'Autoridade'} • ${regulation.is_mandatory ? 'Obrigatória' : 'Opcional'}`,
    type: 'regulation' as const,
    url: '/regulations',
    category: regulation.category || 'Regulamentação',
    status: regulation.severity_level,
    icon: '⚖️',
    priority: regulation.severity_level === 'critical' ? 90 :
              regulation.severity_level === 'high' ? 80 :
              regulation.severity_level === 'medium' ? 70 : 60,
    keywords: [
      regulation.regulation_code?.toLowerCase(),
      regulation.regulation_name?.toLowerCase(),
      regulation.region?.toLowerCase(),
      regulation.category?.toLowerCase(),
      regulation.description?.toLowerCase(),
      regulation.enforcement_authority?.toLowerCase()
    ].filter(Boolean)
  }));
};

// Função para preparar dados de logística
export const prepareLogisticsData = (routes?: any[]): SearchItem[] => {
  const logisticsItems: SearchItem[] = [
    {
      id: 'logistics-routes',
      title: 'Rotas CN→BR/PT',
      subtitle: 'Logística',
      description: 'Rotas otimizadas China para Brasil e Portugal',
      type: 'logistics',
      url: '/logistics',
      category: 'Logística',
      icon: '🚢',
      priority: 60,
      keywords: ['rotas', 'logistica', 'china', 'brasil', 'portugal', 'transporte', 'frete']
    },
    {
      id: 'logistics-costs',
      title: 'Calculadora de Custos',
      subtitle: 'Logística',
      description: 'Simulação de custos de transporte e lead times',
      type: 'logistics',
      url: '/logistics',
      category: 'Logística',
      icon: '💰',
      priority: 55,
      keywords: ['custos', 'calculadora', 'frete', 'lead time', 'simulacao']
    },
    {
      id: 'logistics-incoterms',
      title: 'Incoterms 2020',
      subtitle: 'Logística',
      description: 'Matriz de responsabilidades e custos por Incoterm',
      type: 'logistics',
      url: '/incoterms',
      category: 'Logística',
      icon: '📋',
      priority: 50,
      keywords: ['incoterms', 'responsabilidades', 'contratos', 'fob', 'cif']
    }
  ];

  if (routes?.length) {
    routes.forEach(route => {
      logisticsItems.push({
        id: `route-${route.id}`,
        title: `${route.origin} → ${route.destination}`,
        subtitle: 'Rota',
        description: `${route.mode} • ${route.lead_time_days} dias • ${route.cost_usd} USD`,
        type: 'logistics',
        url: '/logistics',
        category: 'Rotas',
        status: route.status,
        icon: route.mode === 'Air' ? '✈️' : route.mode === 'Sea' ? '🚢' : '🚛',
        priority: 45,
        keywords: [route.origin?.toLowerCase(), route.destination?.toLowerCase(), route.mode?.toLowerCase()]
      });
    });
  }

  return logisticsItems;
};

// Função para preparar dados financeiros
export const prepareFinanceData = (): SearchItem[] => {
  return [
    {
      id: 'finance-simulation',
      title: 'Simulador Landed Cost',
      subtitle: 'Financeiro',
      description: 'Simulação de custo final BR/PT com impostos',
      type: 'finance',
      url: '/finance',
      category: 'Tributação',
      icon: '🧮',
      priority: 65,
      keywords: ['simulador', 'landed cost', 'impostos', 'tributacao', 'brasil', 'portugal']
    },
    {
      id: 'finance-taxes-br',
      title: 'Impostos Brasil',
      subtitle: 'Financeiro',
      description: 'II, IPI, PIS, COFINS, ICMS, AFRMM por NCM',
      type: 'finance',
      url: '/finance',
      category: 'Tributação',
      icon: '🇧🇷',
      priority: 60,
      keywords: ['impostos', 'brasil', 'ncm', 'ii', 'ipi', 'pis', 'cofins', 'icms', 'afrmm']
    },
    {
      id: 'finance-taxes-pt',
      title: 'Impostos Portugal',
      subtitle: 'Financeiro',
      description: 'Direitos aduaneiros e IVA por código TARIC',
      type: 'finance',
      url: '/finance',
      category: 'Tributação',
      icon: '🇵🇹',
      priority: 60,
      keywords: ['impostos', 'portugal', 'taric', 'direitos', 'iva', 'aduaneiros']
    },
    {
      id: 'finance-exchange',
      title: 'Câmbio e Hedge',
      subtitle: 'Financeiro',
      description: 'Taxas de câmbio e estratégias de proteção',
      type: 'finance',
      url: '/finance',
      category: 'Câmbio',
      icon: '💱',
      priority: 55,
      keywords: ['cambio', 'hedge', 'dolar', 'euro', 'protecao', 'taxa']
    }
  ];
};

// Função principal para combinar todos os dados
export const prepareSearchData = (data: {
  skus?: any[];
  suppliers?: any[];
  regulations?: any[];
  routes?: any[];
}): SearchItem[] => {
  const searchItems: SearchItem[] = [];

  // Adicionar SKUs
  if (data.skus?.length) {
    searchItems.push(...prepareSkuData(data.skus));
  }

  // Adicionar fornecedores
  if (data.suppliers?.length) {
    searchItems.push(...prepareSupplierData(data.suppliers));
  }

  // Adicionar regulamentações
  if (data.regulations?.length) {
    searchItems.push(...prepareRegulationData(data.regulations));
  }

  // Adicionar dados de logística
  searchItems.push(...prepareLogisticsData(data.routes));

  // Adicionar dados financeiros
  searchItems.push(...prepareFinanceData());

  // Adicionar páginas estáticas importantes
  const staticPages: SearchItem[] = [
    {
      id: 'home',
      title: 'Command Center',
      subtitle: 'Navegar',
      description: 'Dashboard principal com métricas e alertas críticos',
      type: 'page',
      url: '/',
      category: 'Dashboard',
      icon: '🏠',
      priority: 100,
      keywords: ['dashboard', 'home', 'inicio', 'metricas', 'alertas', 'command center']
    },
    {
      id: 'playbook',
      title: 'Playbook Técnico MUNDÃO',
      subtitle: 'Navegar',
      description: 'Catálogo completo de SKUs IoT com especificações',
      type: 'page',
      url: '/playbook',
      category: 'Produtos',
      icon: '📚',
      priority: 95,
      keywords: ['playbook', 'skus', 'iot', 'produtos', 'especificacoes', 'catalogo']
    },
    {
      id: 'suppliers',
      title: 'Fornecedores OEM/ODM',
      subtitle: 'Navegar',
      description: 'Gestão de fornecedores qualificados com scores',
      type: 'page',
      url: '/suppliers',
      category: 'Supply Chain',
      icon: '🏭',
      priority: 90,
      keywords: ['fornecedores', 'suppliers', 'oem', 'odm', 'gestao', 'scores']
    },
    {
      id: 'regulations',
      title: 'Compêndio Normas 2025',
      subtitle: 'Navegar',
      description: 'Regulamentações críticas BR/UE com deadlines',
      type: 'page',
      url: '/regulations',
      category: 'Compliance',
      icon: '⚖️',
      priority: 85,
      keywords: ['regulamentacoes', 'normas', 'compliance', 'anatel', 'ce', 'deadlines']
    },
    {
      id: 'canton-fair',
      title: 'Canton Fair 138ª',
      subtitle: 'Navegar',
      description: 'Mapa interativo com SKUs por fase e área',
      type: 'page',
      url: '/canton-fair',
      category: 'Eventos',
      icon: '🗺️',
      priority: 80,
      keywords: ['canton fair', 'mapa', 'fases', 'areas', 'guangzhou', 'feira']
    },
    {
      id: 'logistics-page',
      title: 'Logística CN→BR/PT',
      subtitle: 'Navegar',
      description: 'Rotas multimodais e otimização de custos',
      type: 'page',
      url: '/logistics',
      category: 'Logística',
      icon: '🚢',
      priority: 75,
      keywords: ['logistica', 'rotas', 'china', 'brasil', 'portugal', 'transporte']
    },
    {
      id: 'finance-page',
      title: 'Tributação & Custos',
      subtitle: 'Navegar',
      description: 'Simulador landed cost e impostos',
      type: 'page',
      url: '/finance',
      category: 'Financeiro',
      icon: '💰',
      priority: 70,
      keywords: ['tributacao', 'custos', 'impostos', 'simulador', 'financeiro']
    },
    {
      id: 'wfoe',
      title: 'WFOE China',
      subtitle: 'Navegar',
      description: 'Estrutura societária e operacional',
      type: 'page',
      url: '/wfoe-structure',
      category: 'Societário',
      icon: '🏢',
      priority: 65,
      keywords: ['wfoe', 'china', 'estrutura', 'societaria', 'operacional']
    },
    {
      id: 'risk-register',
      title: 'Risk Register',
      subtitle: 'Navegar',
      description: 'Gestão de riscos operacionais e estratégicos',
      type: 'page',
      url: '/risk-register',
      category: 'Gestão',
      icon: '⚠️',
      priority: 65,
      keywords: ['risk', 'riscos', 'gestao', 'operacionais', 'estrategicos']
    }
  ];

  searchItems.push(...staticPages);

  // Adicionar funcionalidades especiais
  const specialFeatures: SearchItem[] = [
    {
      id: 'neural-analysis',
      title: 'Análise Neural TensorChain',
      subtitle: 'Funcionalidade',
      description: 'IA avançada para análise de SKUs e compliance',
      type: 'feature',
      url: '/playbook',
      category: 'IA',
      icon: '🧠',
      priority: 40,
      keywords: ['neural', 'ia', 'tensorchain', 'analise', 'artificial intelligence']
    },
    {
      id: 'export-reports',
      title: 'Exportar Relatórios',
      subtitle: 'Funcionalidade',
      description: 'Download de dados em TXT, Excel e PDF',
      type: 'feature',
      url: '/playbook',
      category: 'Exportação',
      icon: '📊',
      priority: 35,
      keywords: ['exportar', 'relatorios', 'download', 'txt', 'excel', 'pdf']
    },
    {
      id: 'global-view',
      title: 'Visão 360° MUNDÃO',
      subtitle: 'Funcionalidade',
      description: 'Dashboard executivo com visão completa',
      type: 'feature',
      url: '/',
      category: 'Dashboard',
      icon: '🌍',
      priority: 30,
      keywords: ['visao', '360', 'executivo', 'completa', 'global']
    }
  ];

  searchItems.push(...specialFeatures);

  // Ordenar por prioridade
  return searchItems.sort((a, b) => (b.priority || 0) - (a.priority || 0));
};

// Função utilitária para filtrar itens por tipo
export const filterSearchItemsByType = (items: SearchItem[], type: string): SearchItem[] => {
  if (type === 'all') return items;
  return items.filter(item => item.type === type);
};

// Função utilitária para buscar por categoria
export const filterSearchItemsByCategory = (items: SearchItem[], category: string): SearchItem[] => {
  if (category === 'all') return items;
  return items.filter(item => item.category?.toLowerCase().includes(category.toLowerCase()));
};

// Função para obter estatísticas de busca
export const getSearchStats = (items: SearchItem[]) => {
  const stats = {
    total: items.length,
    byType: {} as Record<string, number>,
    byCategory: {} as Record<string, number>,
    highPriority: items.filter(item => (item.priority || 0) >= 80).length
  };

  items.forEach(item => {
    stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;
    if (item.category) {
      stats.byCategory[item.category] = (stats.byCategory[item.category] || 0) + 1;
    }
  });

  return stats;
};

// Export type already done above
