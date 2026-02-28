import { GoogleGenAI, Type } from "@google/genai";
import { EchoVerseData } from '../types';

export const generateMusicData = async (prompt: string, currentData: EchoVerseData): Promise<Partial<EchoVerseData> | null> => {
  if (!process.env.API_KEY) {
    console.error("API Key is missing");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Schema for Gemini 2.5 Structured Output
  const schema = {
    type: Type.OBJECT,
    properties: {
      artists: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            artist_id: { type: Type.STRING },
            name: { type: Type.STRING },
            bio: { type: Type.STRING },
          }
        }
      },
      albums: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            album_id: { type: Type.STRING },
            title: { type: Type.STRING },
            release_year: { type: Type.INTEGER },
            artist_id: { type: Type.STRING, description: "Must match an artist_id in this batch or existing data" },
            label_id: { type: Type.STRING, description: "Must match a label_id" },
          }
        }
      },
      tracks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            track_id: { type: Type.STRING },
            title: { type: Type.STRING },
            duration_seconds: { type: Type.INTEGER },
            album_id: { type: Type.STRING, description: "Must match an album_id in this batch" },
            play_count: { type: Type.INTEGER },
          }
        }
      },
      labels: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            label_id: { type: Type.STRING },
            name: { type: Type.STRING },
          }
        }
      },
      genres: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            genre_id: { type: Type.STRING },
            genre_name: { type: Type.STRING },
          }
        }
      }
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        You are a Database Administrator for 'EchoVerse'.
        Generate realistic music industry data based on this user request: "${prompt}".
        
        Ensure relationships are consistent. For example, if you create a Track, it must belong to an Album in this batch.
        Generate unique IDs (short UUIDs or simple random strings).
        
        Existing Label IDs you can link to: ${currentData.labels.map(l => l.label_id).join(', ')}.
        Existing Artist IDs you can link to: ${currentData.artists.map(a => a.artist_id).join(', ')}.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as Partial<EchoVerseData>;
    }
    return null;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};