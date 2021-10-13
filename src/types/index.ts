export type Episode = {
  id: string;
  title: string;
  members: string;
  published_at: string;
  publishedAt: string;
  durationAsString: string;
  thumbnail: string;
  description: string;
  file: {
    url: string;
    type: string;
    duration: number;
  }
}