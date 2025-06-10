
export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  description?: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
  };
  rating: number;
  price_range?: string;
  verified: boolean;
  preferred: boolean;
  portfolio_images?: string[];
  website?: string;
  instagram?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface SupplierStats {
  total_suppliers: number;
  verified_suppliers: number;
  preferred_suppliers: number;
  average_rating: number;
}

export interface SupplierSearchFilters {
  category?: string;
  search_query?: string;
  min_rating?: number;
  verified_only?: boolean;
  preferred_only?: boolean;
}
