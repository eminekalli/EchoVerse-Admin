import { EchoVerseData, Artist, Label, Album, Track, Genre, Writer, TrackWriter, TrackGenre } from '../types';

// --- Data Generation Helpers ---

const sample = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const uuid = () => Math.random().toString(36).substring(2, 9);

// --- Source Vocabulary for Generation ---

const GENRES_LIST = [
  'Synthwave', 'Indie Pop', 'Alternative Rock', 'Jazz Fusion', 'Deep House', 
  'Neo-Soul', 'Cyberpunk', 'Lo-Fi', 'Metalcore', 'K-Pop', 'Classical Crossover', 
  'Techno', 'Turkish Rock', 'Anatolian Psychedelic', 'Arabesque Pop'
];

const ROLES = ['Lyricist', 'Composer', 'Arranger', 'Producer', 'Engineer'];

// English Vocabulary
const ENG_ADJECTIVES = [
  'Silent', 'Neon', 'Digital', 'Broken', 'Lost', 'Electric', 'Velvet', 'Midnight', 
  'Solar', 'Lunar', 'Crystal', 'Future', 'Retro', 'Crimson', 'Golden', 'Dark', 
  'Hollow', 'Rapid', 'Infinite', 'Forgotten', 'Analog', 'Virtual'
];

const ENG_NOUNS = [
  'Dreams', 'Echoes', 'Waves', 'Hearts', 'Souls', 'Horizons', 'Memories', 'Shadows', 
  'Lights', 'Visions', 'Systems', 'Codes', 'Stars', 'Skies', 'Fires', 'Ghosts', 
  'Signals', 'Reflections', 'Currents', 'Phases', 'Circuits', 'Dimensions'
];

const ENG_FIRST_NAMES = [
  'James', 'Sarah', 'Michael', 'Emma', 'David', 'Olivia', 'Robert', 'Sophia', 
  'William', 'Ava', 'John', 'Isabella', 'Chris', 'Mia', 'Alex', 'Chloe', 'Daniel'
];

const ENG_LAST_NAMES = [
  'Smith', 'Johnson', 'Brown', 'Williams', 'Jones', 'Garcia', 'Miller', 
  'Davis', 'Rodriguez', 'Martinez', 'Taylor', 'Anderson', 'Thomas'
];

// Turkish Vocabulary
const TR_ADJECTIVES = [
  'Sessiz', 'Mavi', 'Karanlık', 'Derin', 'Eski', 'Yalnız', 'Gizli', 'Sonsuz', 
  'Parlak', 'Soğuk', 'Deli', 'Son', 'Kayıp', 'Yasak', 'Hüzünlü', 'Renkli'
];

const TR_NOUNS = [
  'Liman', 'Gece', 'Yolcu', 'Rüya', 'Şehir', 'Deniz', 'Gölge', 'Yağmur', 
  'Rüzgar', 'Hayal', 'Melodi', 'Duman', 'Masal', 'Mevsim', 'Sokak', 'Yıldız'
];

const TR_FIRST_NAMES = [
  'Ahmet', 'Mehmet', 'Mustafa', 'Ayşe', 'Fatma', 'Zeynep', 'Emre', 'Burak', 
  'Can', 'Elif', 'Selin', 'Cem', 'Deniz', 'Barış', 'Leyla', 'Hakan', 'Ece'
];

const TR_LAST_NAMES = [
  'Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Öztürk', 'Aydın', 
  'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Koç', 'Kurt', 'Erdoğan'
];

const LABEL_NAMES = [
  'Future Wave Records', 'Vintage Sound', 'Nebula Music', 'Quantum Beats', 
  'Starlight Studios', 'Underground Vibes', 'Crystal Clear Audio', 'Blue Horizon',
  'Sonic Boom', 'Red Planet Records', 'Anadolu Sesleri', 'İstanbul Plak', 'Ege Müzik'
];

// --- Generators ---

const generateArtists = (count: number): Artist[] => {
  return Array.from({ length: count }).map((_, i) => {
    // Strategy: 
    // 30% English Band
    // 20% Turkish Band
    // 25% International Solo
    // 25% Turkish Solo
    
    const type = Math.random();
    let name = "";
    let bioContext = "";

    if (type < 0.30) {
        // English Band
        name = `${sample(ENG_ADJECTIVES)} ${sample(ENG_NOUNS)}`;
        bioContext = "An international band";
    } else if (type < 0.50) {
        // Turkish Band
        name = `${sample(TR_ADJECTIVES)} ${sample(TR_NOUNS)}`;
        bioContext = "A popular group from Istanbul";
    } else if (type < 0.75) {
        // English Solo
        name = `${sample(ENG_FIRST_NAMES)} ${sample(ENG_LAST_NAMES)}`;
        bioContext = "A chart-topping solo artist";
    } else {
        // Turkish Solo
        name = `${sample(TR_FIRST_NAMES)} ${sample(TR_LAST_NAMES)}`;
        bioContext = "One of Turkey's leading voices";
    }

    return {
      artist_id: `art_${i + 1}`,
      name: name,
      bio: `${bioContext} known for their unique ${sample(GENRES_LIST)} style. Established in ${randomInt(1995, 2023)}.`
    };
  });
};

const generateLabels = (count: number): Label[] => {
  return Array.from({ length: count }).map((_, i) => ({
    label_id: `lbl_${i + 1}`,
    name: LABEL_NAMES[i % LABEL_NAMES.length] || `Label ${i}`
  }));
};

const generateWriters = (count: number): Writer[] => {
  const allFirstNames = [...ENG_FIRST_NAMES, ...TR_FIRST_NAMES];
  const allLastNames = [...ENG_LAST_NAMES, ...TR_LAST_NAMES];
  
  return Array.from({ length: count }).map((_, i) => ({
    writer_id: `wrt_${i + 1}`,
    name: `${sample(allFirstNames)} ${sample(allLastNames)}`
  }));
};

const generateGenres = (): Genre[] => {
  return GENRES_LIST.map((g, i) => ({
    genre_id: `gnr_${i + 1}`,
    genre_name: g
  }));
};

// --- Main Data Factory ---

const createMockData = (): EchoVerseData => {
  // 1. Core Definitions
  const artists = generateArtists(100); // 100 Artists requested
  const labels = generateLabels(13);
  const writers = generateWriters(50);
  const genres = generateGenres();

  const albums: Album[] = [];
  const tracks: Track[] = [];
  const trackWriters: TrackWriter[] = [];
  const trackGenres: TrackGenre[] = [];

  let trackCounter = 0;
  let albumCounter = 0;

  // 2. Relational Data Construction
  artists.forEach(artist => {
    // Each artist has 1-3 albums
    const albumCount = randomInt(1, 3);
    
    for (let j = 0; j < albumCount; j++) {
      albumCounter++;
      const albumId = `alb_${albumCounter}`;
      const releaseYear = randomInt(2010, 2024);
      
      // Determine if album title should be Turkish based on artist name likelihood (simple heuristic or random)
      const isTurkishContext = Math.random() > 0.6; 
      const titleAdj = isTurkishContext ? sample(TR_ADJECTIVES) : sample(ENG_ADJECTIVES);
      const titleNoun = isTurkishContext ? sample(TR_NOUNS) : sample(ENG_NOUNS);

      albums.push({
        album_id: albumId,
        title: `${titleAdj} ${titleNoun}`,
        release_year: releaseYear,
        artist_id: artist.artist_id,
        label_id: sample(labels).label_id
      });

      // Each album has 8-14 tracks
      const trackCount = randomInt(8, 14);
      
      for (let k = 0; k < trackCount; k++) {
        trackCounter++;
        const trackId = `trk_${trackCounter}`;
        const duration = randomInt(160, 320);
        
        const trackTitleAdj = Math.random() > 0.5 ? sample(TR_ADJECTIVES) : sample(ENG_ADJECTIVES);
        const trackTitleNoun = Math.random() > 0.5 ? sample(TR_NOUNS) : sample(ENG_NOUNS);
        
        tracks.push({
          track_id: trackId,
          title: `${trackTitleAdj} ${trackTitleNoun}`,
          duration_seconds: duration,
          album_id: albumId,
          play_count: randomInt(5000, 2500000)
        });

        // Assign Genres (1-2 per track)
        const numGenres = randomInt(1, 2);
        const usedGenres = new Set<string>();
        for(let g=0; g<numGenres; g++) {
           const genre = sample(genres);
           if (!usedGenres.has(genre.genre_id)) {
             usedGenres.add(genre.genre_id);
             trackGenres.push({
               track_id: trackId,
               genre_id: genre.genre_id
             });
           }
        }

        // Assign Writers (1-3 per track)
        const numWriters = randomInt(1, 3);
        const usedWriters = new Set<string>();
        for(let w=0; w<numWriters; w++) {
            const writer = sample(writers);
            if (!usedWriters.has(writer.writer_id)) {
                usedWriters.add(writer.writer_id);
                trackWriters.push({
                    track_id: trackId,
                    writer_id: writer.writer_id,
                    role: sample(ROLES)
                });
            }
        }
      }
    }
  });

  return {
    artists,
    labels,
    albums,
    tracks,
    genres,
    writers,
    trackWriters,
    trackGenres
  };
};

export const initialData: EchoVerseData = createMockData();