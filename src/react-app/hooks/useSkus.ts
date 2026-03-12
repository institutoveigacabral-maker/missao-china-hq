import { useState, useEffect } from 'react';

export interface Sku {
  id: number;
  sku_code: string;
  product_name: string;
  product_category: string;
  description?: string;
  technical_specs?: string;
  regulatory_status: string;
  supplier_id?: number;
  lab_test_status: string;
  certification_level?: string;
  risk_category: string;
  target_markets?: string;
  compliance_notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  supplier_name?: string;
  supplier_country?: string;
  supplier_score?: number;
  compliance?: any[];
}

interface UseSkus {
  skus: Sku[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createSku: (data: Partial<Sku>) => Promise<void>;
  updateSku: (id: number, data: Partial<Sku>) => Promise<void>;
  deleteSku: (id: number) => Promise<void>;
}

export function useSkus(filters?: {
  search?: string;
  category?: string;
  status?: string;
  riskLevel?: string;
  activeOnly?: boolean;
}): UseSkus {
  const [skus, setSkus] = useState<Sku[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkus = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters?.search) params.set('search', filters.search);
      if (filters?.category) params.set('category', filters.category);
      if (filters?.status) params.set('status', filters.status);
      if (filters?.riskLevel) params.set('riskLevel', filters.riskLevel);
      if (filters?.activeOnly) params.set('activeOnly', 'true');

      const response = await fetch(`/api/skus?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setSkus(data.data);
      } else {
        setError(data.error || 'Failed to fetch SKUs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkus();
  }, [filters?.search, filters?.category, filters?.status, filters?.riskLevel, filters?.activeOnly]);

  const createSku = async (data: Partial<Sku>) => {
    const response = await fetch('/api/skus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to create SKU');
    }

    await fetchSkus();
  };

  const updateSku = async (id: number, data: Partial<Sku>) => {
    const response = await fetch(`/api/skus/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to update SKU');
    }

    await fetchSkus();
  };

  const deleteSku = async (id: number) => {
    const response = await fetch(`/api/skus/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete SKU');
    }

    await fetchSkus();
  };

  return {
    skus,
    loading,
    error,
    refetch: fetchSkus,
    createSku,
    updateSku,
    deleteSku,
  };
}

export function useSkuStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/skus/stats/summary');
        const data = await response.json();

        if (data.success) {
          setStats(data.data);
        } else {
          setError(data.error || 'Failed to fetch stats');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}

export function useSku(id: number) {
  const [sku, setSku] = useState<Sku | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSku = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/skus/${id}`);
        const data = await response.json();

        if (data.success) {
          setSku(data.data);
        } else {
          setError(data.error || 'Failed to fetch SKU');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSku();
    }
  }, [id]);

  return { sku, loading, error };
}
