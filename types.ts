// Core Entities based on PDF

export interface Artist {
  artist_id: string;
  name: string;
  bio?: string;
}

export interface Label {
  label_id: string;
  name: string;
}

export interface Album {
  album_id: string;
  title: string;
  release_year: number;
  artist_id: string;
  label_id: string;
}

export interface Track {
  track_id: string;
  title: string;
  duration_seconds: number;
  album_id: string;
  play_count: number;
}

export interface Genre {
  genre_id: string;
  genre_name: string;
}

export interface Writer {
  writer_id: string;
  name: string;
}

// Junctions / Relationships
export interface TrackWriter {
  track_id: string;
  writer_id: string;
  role: 'Lyricist' | 'Composer' | 'Arranger' | string;
}

export interface TrackGenre {
  track_id: string;
  genre_id: string;
}

// Complete Database State
export interface EchoVerseData {
  artists: Artist[];
  labels: Label[];
  albums: Album[];
  tracks: Track[];
  genres: Genre[];
  writers: Writer[];
  trackWriters: TrackWriter[];
  trackGenres: TrackGenre[];
}

// Stats for Dashboard
export interface DashboardStats {
  totalStreams: number;
  topArtist: string;
  topGenre: string;
  activeLabel: string;
}