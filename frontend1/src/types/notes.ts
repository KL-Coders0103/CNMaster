export interface Chapter {
  id: string;
  title: string;
  description?: string | null;
}

export interface Note {
  id: string;
  title: string;
  description?: string | null;
  views: number;
  downloads: number;
  chapter: string;
}

export interface NoteDetail {
  id: string;
  title: string;
  description?: string | null;
  pdfUrl: string;
  views: number;
  downloads: number;
  chapter: string; 
  isBookmarked: boolean;
}
export interface RecentNote {
  id: string;
  currentPage: number;
  totalPages: number;
  lastOpenedAt: string;
  note: {
    id: string;
    title: string;
    description?: string | null;
  };
}