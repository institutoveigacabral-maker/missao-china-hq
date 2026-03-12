import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { toast } from '@/react-app/components/ui/Toast';

interface SKUData {
  id: number;
  sku_code: string;
  product_name: string;
  product_category: string;
  description?: string;
  technical_specs?: string;
  regulatory_status: string;
  risk_category: string;
  target_markets?: string;
  supplier_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SupplierData {
  id: number;
  supplier_code: string;
  company_name: string;
  country: string;
  overall_score: number;
  quality_rating: number;
  compliance_score: number;
  risk_level: string;
  is_approved: boolean;
  certifications?: string;
  lead_time_days?: number;
  moq?: number;
}

interface RegulationData {
  id: number;
  regulation_code: string;
  regulation_name: string;
  region: string;
  category: string;
  severity_level: string;
  is_mandatory: boolean;
  created_at: string;
}



interface AppStats {
  totalSKUs: number;
  certifiedSKUs: number;
  pendingSKUs: number;
  blockedSKUs: number;
  lowRiskSKUs: number;
  mediumRiskSKUs: number;
  highRiskSKUs: number;
  approvedSuppliers: number;
  activeRegulations: number;
  lastUpdated: string;
}

interface AppContextType {
  // Data
  skus: SKUData[];
  suppliers: SupplierData[];
  regulations: RegulationData[];
  stats: AppStats | null;
  
  // Loading states
  loading: boolean;
  error: string | null;
  
  // Selected items for cross-navigation
  selectedSKU: string | null;
  selectedSupplier: string | null;
  selectedRegulation: string | null;
  
  // Actions
  setSelectedSKU: (skuCode: string | null) => void;
  setSelectedSupplier: (supplierCode: string | null) => void;
  setSelectedRegulation: (regulationCode: string | null) => void;
  refreshData: () => Promise<void>;
  
  // Cross-references
  getSuppliersBySKU: (skuCode: string) => SupplierData[];
  getRegulationsBySKU: (skuCode: string) => RegulationData[];
  getSKUsBySupplier: (supplierCode: string) => SKUData[];
  
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [skus, setSKUs] = useState<SKUData[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
  const [regulations, setRegulations] = useState<RegulationData[]>([]);
  
  const [stats, setStats] = useState<AppStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Selected items for cross-navigation
  const [selectedSKU, setSelectedSKU] = useState<string | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [selectedRegulation, setSelectedRegulation] = useState<string | null>(null);

  // Fixed infinite loop by removing dependencies that change on every render
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel with timeout
      const timeoutMs = 15000;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const [skusRes, suppliersRes, regulationsRes] = await Promise.all([
          fetch('/api/skus', { signal: controller.signal }),
          fetch('/api/suppliers', { signal: controller.signal }),
          fetch('/api/regulations', { signal: controller.signal })
        ]);

        clearTimeout(timeoutId);

        // Check if all requests were successful
        if (!skusRes.ok) throw new Error(`SKUs API error: ${skusRes.status}`);
        if (!suppliersRes.ok) throw new Error(`Suppliers API error: ${suppliersRes.status}`);
        if (!regulationsRes.ok) throw new Error(`Regulations API error: ${regulationsRes.status}`);

        // Parse responses with error handling
        const [skusData, suppliersData, regulationsData] = await Promise.all([
          skusRes.json().catch(() => []),
          suppliersRes.json().catch(() => []),
          regulationsRes.json().catch(() => [])
        ]);

        // Validate and set data
        const validSkus = Array.isArray(skusData) ? skusData.filter(sku => sku && sku.sku_code) : [];
        const validSuppliers = Array.isArray(suppliersData) ? suppliersData.filter(supplier => supplier && supplier.supplier_code) : [];
        const validRegulations = Array.isArray(regulationsData) ? regulationsData.filter(regulation => regulation && regulation.regulation_code) : [];
        
        setSKUs(validSkus);
        setSuppliers(validSuppliers);
        setRegulations(validRegulations);
        
        // Calculate real stats from validated data
        const realStats: AppStats = {
          totalSKUs: validSkus.length,
          certifiedSKUs: validSkus.filter((s: any) => s.regulatory_status === 'certified').length,
          pendingSKUs: validSkus.filter((s: any) => s.regulatory_status === 'pending').length,
          blockedSKUs: validSkus.filter((s: any) => s.regulatory_status === 'blocked').length,
          lowRiskSKUs: validSkus.filter((s: any) => s.risk_category === 'low').length,
          mediumRiskSKUs: validSkus.filter((s: any) => s.risk_category === 'medium').length,
          highRiskSKUs: validSkus.filter((s: any) => s.risk_category === 'high').length,
          approvedSuppliers: validSuppliers.filter((s: any) => s.is_approved).length,
          activeRegulations: validRegulations.filter((r: any) => r.is_mandatory).length,
          lastUpdated: new Date().toISOString()
        };
        
        setStats(realStats);
        
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
      
    } catch (err) {
      console.error('Error fetching app data:', err);
      
      let errorMessage = 'Failed to load data';
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'Request timeout - please try again';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      toast.error('Erro ao carregar dados do sistema');
      
      // Set default stats on error
      setStats({
        totalSKUs: 0,
        certifiedSKUs: 0,
        pendingSKUs: 0,
        blockedSKUs: 0,
        lowRiskSKUs: 0,
        mediumRiskSKUs: 0,
        highRiskSKUs: 0,
        approvedSuppliers: 0,
        activeRegulations: 0,
        lastUpdated: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependencies to prevent infinite loops

  const refreshData = useCallback(async () => {
    await fetchAllData();
    toast.success('Dados atualizados com sucesso');
  }, []); // Empty dependencies - fetchAllData is stable

  // Memoized cross-reference functions for better performance
  const getSuppliersBySKU = useMemo(() => {
    return (skuCode: string): SupplierData[] => {
      if (!skuCode || !skus.length || !suppliers.length) return [];
      
      const sku = skus.find(s => s.sku_code === skuCode);
      if (!sku) return [];
      
      // Filter suppliers by category and approval status
      return suppliers
        .filter(supplier => 
          supplier.is_approved && 
          (supplier.country === 'China' || supplier.country === 'Taiwan')
        )
        .sort((a, b) => (b.overall_score || 0) - (a.overall_score || 0))
        .slice(0, 3); // Top 3 suppliers by score
    };
  }, [skus, suppliers]);

  const getRegulationsBySKU = useMemo(() => {
    return (skuCode: string): RegulationData[] => {
      if (!skuCode || !skus.length || !regulations.length) return [];
      
      const sku = skus.find(s => s.sku_code === skuCode);
      if (!sku) return [];
      
      // Filter regulations by target markets and category
      return regulations.filter(regulation => {
        const targetMarkets = sku.target_markets || '';
        
        // Match by region
        if (targetMarkets.includes('Brasil') && regulation.region === 'Brasil') return true;
        if (targetMarkets.includes('Portugal') && regulation.region === 'União Europeia') return true;
        if (regulation.region === 'Global') return true;
        
        // Match by category
        if (regulation.category === sku.product_category) return true;
        if (regulation.category === 'IoT' && sku.sku_code.startsWith('IOT')) return true;
        
        return false;
      });
    };
  }, [skus, regulations]);

  const getSKUsBySupplier = useMemo(() => {
    return (supplierCode: string): SKUData[] => {
      if (!supplierCode || !suppliers.length || !skus.length) return [];
      
      const supplier = suppliers.find(s => s.supplier_code === supplierCode);
      if (!supplier) return [];
      
      // Filter SKUs that could be supplied by this supplier
      return skus
        .filter(sku => {
          // Basic matching logic - could be enhanced with actual relationships
          return sku.is_active && (
            sku.product_category.includes('IoT') ||
            sku.product_category.includes('Electronics') ||
            sku.product_category.includes('Sensor')
          );
        })
        .sort((a, b) => a.sku_code.localeCompare(b.sku_code))
        .slice(0, 10); // Top 10 SKUs
    };
  }, [skus, suppliers]);

  

  // Load data on mount - Fixed to prevent infinite loops
  useEffect(() => {
    fetchAllData();
  }, []); // Only run once on mount

  // Memoize context value to prevent unnecessary re-renders
  const contextValue: AppContextType = useMemo(() => ({
    // Data
    skus,
    suppliers,
    regulations,
    stats,
    
    // Loading states
    loading,
    error,
    
    // Selected items
    selectedSKU,
    selectedSupplier,
    selectedRegulation,
    
    // Actions
    setSelectedSKU,
    setSelectedSupplier,
    setSelectedRegulation,
    refreshData,
    
    // Cross-references
    getSuppliersBySKU,
    getRegulationsBySKU,
    getSKUsBySupplier
  }), [
    skus,
    suppliers, 
    regulations,
    stats,
    loading,
    error,
    selectedSKU,
    selectedSupplier,
    selectedRegulation,
    refreshData,
    getSuppliersBySKU,
    getRegulationsBySKU,
    getSKUsBySupplier
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
