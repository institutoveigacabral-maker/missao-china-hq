import { useState, useEffect } from 'react';

export interface SkuAnalysisData {
  sku: {
    id: string;
    sku_code: string;
    product_name: string;
    category: string;
    description?: string;
    technical_specs?: string;
    regulatory_status: string;
    risk_category: string;
    target_markets?: string;
    is_active: boolean;
  };
  regulations: {
    id: number;
    regulation_code: string;
    regulation_name: string;
    region: string;
    category: string;
    severity_level: string;
    is_mandatory: boolean;
    compliance_status: string;
    deadline_date?: string;
    requirements: string[];
  }[];
  suppliers: {
    id: number;
    supplier_code: string;
    company_name: string;
    country: string;
    overall_score: number;
    quality_rating: number;
    compliance_score: number;
    risk_level: string;
    lead_time_days: number;
    moq: number;
    certifications: string;
    is_approved: boolean;
  }[];
  taxation: {
    brazil: {
      ncm_code: string;
      ii_rate: number;
      ipi_rate: number;
      icms_rate: number;
      total_tax_rate: number;
      afrmm_applicable: boolean;
      landed_cost_estimate: number;
    };
    portugal: {
      hs_code: string;
      duty_rate: number;
      iva_rate: number;
      total_tax_rate: number;
      landed_cost_estimate: number;
    };
  };
  
  compliance_score: number;
  risk_assessment: {
    overall_risk: 'low' | 'medium' | 'high' | 'critical';
    regulatory_risk: number;
    supplier_risk: number;
    market_risk: number;
    financial_risk: number;
    risk_factors: string[];
    mitigation_actions: string[];
  };
  timeline_estimate: {
    t_60_45: string[];
    t_44_30: string[];
    t_29_15: string[];
    t_14_0: string[];
    total_days: number;
    critical_path: string[];
  };
  financial_projections: {
    fob_estimate_range: { min: number; max: number };
    brazil_landed_cost: number;
    portugal_landed_cost: number;
    break_even_volume: number;
    roi_projection: number;
  };
}

export const useSkuAnalysis = (skuCode?: string) => {
  const [analysisData, setAnalysisData] = useState<SkuAnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSkuAnalysis = async (sku_code: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/sku-analysis/${sku_code}`);
      if (response.ok) {
        const data = await response.json();
        setAnalysisData(data);
      } else {
        throw new Error(`Failed to fetch SKU analysis: ${response.statusText}`);
      }

    } catch (err) {
      console.error('Error fetching SKU analysis:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setAnalysisData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (skuCode) {
      fetchSkuAnalysis(skuCode);
    }
  }, [skuCode]);

  return {
    analysisData,
    loading,
    error,
    fetchSkuAnalysis
  };
};
