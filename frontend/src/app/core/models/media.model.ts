export type MediaType = 'VIDEO' | 'ARTICLE' | 'MAGAZINE' | 'TV' | 'REEL';
export const MEDIA_TYPES: MediaType[] = ['VIDEO', 'ARTICLE', 'MAGAZINE', 'TV', 'REEL'];

export type MediaStatus = 'DRAFT' | 'PUBLISHED';

export interface MediaItem {
  id: number;
  type: MediaType;
  title: string;
  source: string;
  url: string;
  youtubeVideoId: string | null;
  thumbnailUrl: string | null;
  summary: string | null;
  publishedAt: string | null;
  isFeatured: boolean;
  status: MediaStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItemInput {
  type: MediaType;
  title: string;
  source: string;
  url: string;
  thumbnailUrl: string | null;
  summary: string | null;
  publishedAt: string | null;
  isFeatured: boolean;
  status: MediaStatus;
  sortOrder: number;
}
