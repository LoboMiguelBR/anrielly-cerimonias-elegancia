
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
