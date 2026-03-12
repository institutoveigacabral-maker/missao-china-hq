import { useState, useEffect } from 'react';

export interface Regulation {
  id: number;
  regulation_code: string;
  regulation_name: string;
  region: string;
  category: string;
  description?: string;
  official_link?: string;
  validity_start_date?: string;
  validity_end_date?: string;
  last_update_date?: string;
  severity_level: string;
  is_mandatory: boolean;
  jurisdiction_id?: number;
  category_id?: number;
  implementation_date?: string;
  enforcement_authority?: string;
  penalty_description?: string;
  testing_standards?: string;
  certification_body?: string;
  annual_maintenance: boolean;
  documentation_retention_years: number;
  created_at: string;
  updated_at: string;
  requirements?: any[];
  deadlines?: any[];
  checklist?: any[];
}

interface UseRegulations {
  regulations: Regulation[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createRegulation: (data: Partial<Regulation>) => Promise<void>;
  updateRegulation: (id: number, data: Partial<Regulation>) => Promise<void>;
  deleteRegulation: (id: number) => Promise<void>;
}

export function useRegulations(filters?: {
  search?: string;
  region?: string;
  category?: string;
  severity?: string;
  mandatoryOnly?: boolean;
}): UseRegulations {
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegulations = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters?.search) params.set('search', filters.search);
      if (filters?.region) params.set('region', filters.region);
      if (filters?.category) params.set('category', filters.category);
      if (filters?.severity) params.set('severity', filters.severity);
      if (filters?.mandatoryOnly) params.set('mandatoryOnly', 'true');

      const response = await fetch(`/api/regulations?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setRegulations(data.data);
      } else {
        setError(data.error || 'Failed to fetch regulations');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegulations();
  }, [filters?.search, filters?.region, filters?.category, filters?.severity, filters?.mandatoryOnly]);

  const createRegulation = async (data: Partial<Regulation>) => {
    const response = await fetch('/api/regulations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to create regulation');
    }

    await fetchRegulations();
  };

  const updateRegulation = async (id: number, data: Partial<Regulation>) => {
    const response = await fetch(`/api/regulations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to update regulation');
    }

    await fetchRegulations();
  };

  const deleteRegulation = async (id: number) => {
    const response = await fetch(`/api/regulations/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete regulation');
    }

    await fetchRegulations();
  };

  return {
    regulations,
    loading,
    error,
    refetch: fetchRegulations,
    createRegulation,
    updateRegulation,
    deleteRegulation,
  };
}

export function useRegulationStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/regulations/stats/summary');
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

export function useRegulation(id: number) {
  const [regulation, setRegulation] = useState<Regulation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegulation = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/regulations/${id}`);
        const data = await response.json();

        if (data.success) {
          setRegulation(data.data);
        } else {
          setError(data.error || 'Failed to fetch regulation');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRegulation();
    }
  }, [id]);

  return { regulation, loading, error };
}
