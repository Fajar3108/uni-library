export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  coverUrl: string;
  coverColor: string;
  videoUrl: string;
  summary: string;
  isLoaned?: boolean;
  createdAt: Date | null;
}
