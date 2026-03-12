import { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import { useHotkeys } from 'react-hotkeys-hook';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/react-app/contexts/AppContext';
import { toast } from '@/react-app/components/ui/Toast';

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  subtitle?: string;
  type: 'sku' | 'supplier' | 'regulation' | 'page' | 'feature';
  url: string;
  category?: string;
  status?: string;
  icon?: string;
  priority?: number;
}

interface UseGlobalSearchProps {
  searchData?: SearchItem[];
}

export const useGlobalSearch = ({ searchData: searchDataProp }: UseGlobalSearchProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { skus, suppliers, regulations, setSelectedSKU, setSelectedSupplier, setSelectedRegulation } = useAppContext();

  // Build comprehensive search data from app context
  const allSearchData = useMemo(() => {
    // Use provided searchData if available, otherwise build from app context
    if (searchDataProp && Array.isArray(searchDataProp)) {
      return searchDataProp;
    }
    
    // Build basic search data from context
    const searchItems: SearchItem[] = [];
    
    // Add page items
    const pages = [
      { id: 'page-home', title: 'Command Center', description: 'Dashboard principal', url: '/', type: 'page' as const },
      { id: 'page-playbook', title: 'Playbook Técnico', description: 'Gestão de SKUs e produtos', url: '/playbook', type: 'page' as const },
      { id: 'page-suppliers', title: 'Fornecedores', description: 'Gestão de fornecedores', url: '/suppliers', type: 'page' as const },
      { id: 'page-regulations', title: 'Normas', description: 'Regulamentações e compliance', url: '/regulations', type: 'page' as const },
      { id: 'page-finance', title: 'Tributação', description: 'Gestão fiscal e tributária', url: '/finance', type: 'page' as const },
      { id: 'page-logistics', title: 'Logística', description: 'Gestão logística', url: '/logistics', type: 'page' as const },
      { id: 'page-canton-fair', title: 'Canton Fair', description: 'Feira de Canton', url: '/canton-fair', type: 'page' as const }
    ];
    
    searchItems.push(...pages);
    
    // Add SKUs if available
    if (skus && Array.isArray(skus)) {
      const skuItems = skus.map(sku => ({
        id: `sku-${sku.sku_code}`,
        title: sku.product_name,
        description: sku.description || `${sku.product_category} - ${sku.regulatory_status}`,
        subtitle: sku.sku_code,
        url: '/playbook',
        type: 'sku' as const,
        status: sku.regulatory_status,
        category: sku.product_category
      }));
      searchItems.push(...skuItems);
    }
    
    // Add suppliers if available
    if (suppliers && Array.isArray(suppliers)) {
      const supplierItems = suppliers.map(supplier => ({
        id: `supplier-${supplier.supplier_code}`,
        title: supplier.company_name,
        description: `${supplier.country} - Fornecedor ${supplier.is_approved ? 'Aprovado' : 'Pendente'}`,
        subtitle: supplier.supplier_code,
        url: '/suppliers',
        type: 'supplier' as const,
        status: supplier.is_approved ? 'approved' : 'pending',
        category: 'Supplier'
      }));
      searchItems.push(...supplierItems);
    }
    
    // Add regulations if available
    if (regulations && Array.isArray(regulations)) {
      const regulationItems = regulations.map(regulation => ({
        id: `regulation-${regulation.regulation_code}`,
        title: regulation.regulation_name,
        description: `${regulation.region} - ${regulation.category}`,
        subtitle: regulation.regulation_code,
        url: '/regulations',
        type: 'regulation' as const,
        status: regulation.is_mandatory ? 'mandatory' : 'optional',
        category: regulation.category
      }));
      searchItems.push(...regulationItems);
    }
    
    return searchItems;
  }, [skus, suppliers, regulations, searchDataProp]);

  // Configuração do Fuse.js para busca fuzzy inteligente
  const fuse = useMemo(() => {
    return new Fuse(allSearchData, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'description', weight: 0.3 },
        { name: 'category', weight: 0.2 },
        { name: 'id', weight: 0.1 }
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 2,
      ignoreLocation: true,
      getFn: (obj, path) => {
        const value = Fuse.config.getFn(obj, path);
        if (typeof value === 'string') {
          return value.toLowerCase();
        }
        return value;
      }
    });
  }, [allSearchData]);

  // Hotkeys para abrir search (Cmd+K / Ctrl+K)
  useHotkeys('meta+k', (e) => {
    e.preventDefault();
    setIsOpen(true);
  }, {
    enableOnContentEditable: true,
    enableOnFormTags: true
  });

  useHotkeys('ctrl+k', (e) => {
    e.preventDefault();
    setIsOpen(true);
  }, {
    enableOnContentEditable: true,
    enableOnFormTags: true
  });

  // ESC para fechar
  useHotkeys('escape', () => {
    if (isOpen) {
      closeSearch();
    }
  }, {
    enabled: isOpen
  });

  // Executar busca quando query muda
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    let isCancelled = false;
    
    const searchTimeout = setTimeout(() => {
      if (!isCancelled) {
        const searchResults = fuse.search(query);
        const sortedResults = searchResults
          .map(result => ({
            ...result.item,
            score: result.score || 0
          }))
          .sort((a, b) => {
            const typeOrder: Record<string, number> = { page: 0, sku: 1, regulation: 2, supplier: 3, feature: 4 };
            const aTypeScore = typeOrder[a.type] || 5;
            const bTypeScore = typeOrder[b.type] || 5;
            
            if (aTypeScore !== bTypeScore) {
              return aTypeScore - bTypeScore;
            }
            
            return a.score - b.score;
          })
          .slice(0, 10);

        if (!isCancelled) {
          setResults(sortedResults);
          setIsSearching(false);
        }
      }
    }, 150);

    return () => {
      isCancelled = true;
      clearTimeout(searchTimeout);
    };
  }, [query, fuse]);

  const openSearch = () => setIsOpen(true);
  
  const closeSearch = () => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    setIsSearching(false);
  };

  const selectResult = (item: SearchItem) => {
    // Handle specific actions based on item type
    switch (item.type) {
      case 'sku':
        const skuCode = item.id.replace('sku-', '');
        setSelectedSKU(skuCode);
        navigate('/playbook');
        toast.success(`SKU ${skuCode} selecionado`);
        break;
        
      case 'supplier':
        const supplierCode = item.id.replace('supplier-', '');
        setSelectedSupplier(supplierCode);
        navigate('/suppliers');
        toast.success(`Fornecedor selecionado`);
        break;
        
      case 'regulation':
        const regulationCode = item.id.replace('regulation-', '');
        setSelectedRegulation(regulationCode);
        navigate('/regulations');
        toast.success(`Regulamentação selecionada`);
        break;
        
      case 'page':
        navigate(item.url);
        toast.success(`Navegando para ${item.title}`);
        break;
        
      case 'feature':
        navigate(item.url);
        toast.success(`Acessando ${item.title}`);
        break;
        
      default:
        if (item.url) {
          navigate(item.url);
        }
    }
    
    closeSearch();
  };

  return {
    isOpen,
    query,
    results,
    isSearching,
    setQuery,
    openSearch,
    closeSearch,
    selectResult,
    totalItems: allSearchData.length
  };
};

export default useGlobalSearch;
