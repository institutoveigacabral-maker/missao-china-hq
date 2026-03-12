import { useState, useEffect } from 'react';

export interface DashboardStats {
  skus: {
    total: number;
    active: number;
    categories: number;
  };
  suppliers: {
    total: number;
    approved: number;
    avgRating: number;
    avgCompliance: number;
  };
  regulations: {
    total: number;
    mandatory: number;
    regions: number;
    categories: number;
  };
  compliance: {
    breakdown: Array<{ compliance_status: string; count: number }>;
    pending: number;
    approved: number;
    failed: number;
  };
  activity: {
    newSkusLastWeek: number;
  };
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/stats/dashboard');
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      const data = await response.json();
      setStats(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    refetch: fetchDashboardStats
  };
}
