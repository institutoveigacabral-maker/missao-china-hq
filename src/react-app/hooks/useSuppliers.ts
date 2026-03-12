import { useState, useEffect } from 'react';

export interface Supplier {
  id: number;
  supplier_code: string;
  company_name: string;
  supplier_type: string;
  country: string;
  city: string | null;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  quality_rating: number;
  certification_status: string;
  compliance_score: number;
  last_audit_date: string | null;
  next_audit_date: string | null;
  risk_level: string;
  is_approved: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  vertical: string | null;
  product_lines: string | null;
  certifications: string | null;
  moq: number | null;
  lead_time_days: number | null;
  preferred_incoterm: string;
  payment_terms: string | null;
  price_range_fob_usd: string | null;
  monthly_capacity: number | null;
  fair_booth: string | null;
  overall_score: number;
}

export interface SuppliersFilters {
  search?: string;
  country?: string;
  supplier_type?: string;
  vertical?: string;
  is_approved?: boolean;
  min_quality_rating?: number;
  min_compliance_score?: number;
}

export function useSuppliers(filters?: SuppliersFilters) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, [JSON.stringify(filters)]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.country) params.append('country', filters.country);
      if (filters?.supplier_type) params.append('supplier_type', filters.supplier_type);
      if (filters?.vertical) params.append('vertical', filters.vertical);
      if (filters?.is_approved !== undefined) params.append('is_approved', String(filters.is_approved));
      if (filters?.min_quality_rating) params.append('min_quality_rating', String(filters.min_quality_rating));
      if (filters?.min_compliance_score) params.append('min_compliance_score', String(filters.min_compliance_score));

      const response = await fetch(`/api/suppliers?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch suppliers');
      }

      const data = await response.json();
      setSuppliers(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching suppliers:', err);
    } finally {
      setLoading(false);
    }
  };

  const createSupplier = async (supplierData: Partial<Supplier>) => {
    try {
      const response = await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplierData)
      });

      if (!response.ok) {
        throw new Error('Failed to create supplier');
      }

      const data = await response.json();
      await fetchSuppliers(); // Refresh list
      return data;
    } catch (err) {
      console.error('Error creating supplier:', err);
      throw err;
    }
  };

  const updateSupplier = async (id: number, supplierData: Partial<Supplier>) => {
    try {
      const response = await fetch(`/api/suppliers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplierData)
      });

      if (!response.ok) {
        throw new Error('Failed to update supplier');
      }

      const data = await response.json();
      await fetchSuppliers(); // Refresh list
      return data;
    } catch (err) {
      console.error('Error updating supplier:', err);
      throw err;
    }
  };

  const deleteSupplier = async (id: number) => {
    try {
      const response = await fetch(`/api/suppliers/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete supplier');
      }

      await fetchSuppliers(); // Refresh list
    } catch (err) {
      console.error('Error deleting supplier:', err);
      throw err;
    }
  };

  return {
    suppliers,
    loading,
    error,
    refetch: fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier
  };
}
