
export interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  order_index: number | null;
  created_at: string;
  updated_at: string;
}
