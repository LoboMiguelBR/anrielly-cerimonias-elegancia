
export interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
}

export interface DisplayImage {
  id: string;
  url: string;
  title: string;
  description: string | null;
}
