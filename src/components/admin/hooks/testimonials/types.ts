
export interface Testimonial {
  id: string;
  name: string;
  email: string;
  role: string;
  quote: string;
  image_url: string | null;
  order_index: number | null;
  status: 'pending' | 'approved' | 'rejected';
}

// Form data type for creating/updating testimonials
export interface TestimonialFormData {
  name: string;
  email: string;
  role: string;
  quote: string;
  image_url?: string | null;
  status?: 'pending' | 'approved' | 'rejected';
}

// Response type (same as Testimonial for now)
export type TestimonialData = Testimonial;
