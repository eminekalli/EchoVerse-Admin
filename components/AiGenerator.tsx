import React, { useState } from 'react';
import { generateMusicData } from '../services/geminiService';
import { EchoVerseData } from '../types';
import { Sparkles, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface AiGeneratorProps {
  currentData: EchoVerseData;
  onDataAdd: (newData: Partial<EchoVerseData>) => void;
}

const AiGenerator: React.FC<AiGeneratorProps> = ({ currentData, onDataAdd }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await generateMusicData(prompt, currentData);
      
      if (result) {
        onDataAdd(result);
        setSuccess(`Successfully generated: ${result.artists?.length || 0} Artists, ${result.albums?.length || 0} Albums, ${result.tracks?.length || 0} Tracks.`);
        setPrompt('');
      } else {
        setError("AI returned no data. Try a more specific prompt.");
      }
    } catch (err) {
      setError("Failed to generate data. Ensure your API Key is valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-indigo-500/10 rounded-full text-indigo-400 mb-4">
          <Sparkles size={32} />
        </div>
        <h2 className="text-3xl font-bold text-white">AI Data Seeder</h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          Describe the data you want to add to EchoVerse. Gemini will generate consistent relational data for Artists, Albums, and Tracks automatically.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="space-y-4 relative z-10">
          <label className="block text-sm font-medium text-slate-300">Generation Prompt</label>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none h-32 resize-none"
            placeholder="e.g., Create a 90s Grunge band called 'Dusty Roads' with 2 albums and 5 hit tracks each. Also add a Pop label called 'Star Dust'."
          />
          
          <div className="flex justify-end pt-2">
             <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              {loading ? 'Thinking...' : 'Generate Data'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle size={20} />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {['Generate a K-Pop group with 1 album', 'Add a Jazz Trio with long tracks', 'Create a heavy metal label and band'].map((s) => (
            <button 
                key={s} 
                onClick={() => setPrompt(s)}
                className="text-xs p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-indigo-300 border border-transparent hover:border-indigo-500/30 transition-all text-left"
            >
                "{s}"
            </button>
        ))}
      </div>
    </div>
  );
};

export default AiGenerator;