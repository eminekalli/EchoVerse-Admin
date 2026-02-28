import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DataView from './components/DataView';
import AiGenerator from './components/AiGenerator';
import { initialData } from './services/mockData';
import { EchoVerseData, Artist, Album, Track } from './types';
import { Download } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState<EchoVerseData>(initialData);

  const handleDataAdd = (newData: Partial<EchoVerseData>) => {
    setData(prev => ({
      ...prev,
      artists: [...prev.artists, ...(newData.artists || [])],
      albums: [...prev.albums, ...(newData.albums || [])],
      tracks: [...prev.tracks, ...(newData.tracks || [])],
      labels: [...prev.labels, ...(newData.labels || [])],
      genres: [...prev.genres, ...(newData.genres || [])],
      // Junctions are complex to auto-generate perfectly without strict ID mapping, 
      // but simplistic appending works for this demo level.
      trackWriters: [...prev.trackWriters, ...(newData.trackWriters || [])],
      trackGenres: [...prev.trackGenres, ...(newData.trackGenres || [])],
    }));
  };

  const exportData = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = "echoverse_db_export.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard data={data} />;
      case 'artists':
        return (
          <DataView<Artist> 
            title="Artists Registry" 
            data={data.artists} 
            columns={[
              { header: 'ID', accessor: (a) => <span className="font-mono text-xs text-slate-500">{a.artist_id}</span> },
              { header: 'Name', accessor: (a) => <span className="font-medium text-white">{a.name}</span> },
              { header: 'Bio', accessor: (a) => <span className="text-slate-500 truncate max-w-xs">{a.bio || '-'}</span> },
              { header: 'Albums', accessor: (a) => data.albums.filter(alb => alb.artist_id === a.artist_id).length },
            ]} 
          />
        );
      case 'albums':
        return (
           <DataView<Album> 
            title="Album Catalog" 
            data={data.albums} 
            columns={[
              { header: 'Title', accessor: (a) => <span className="font-medium text-white">{a.title}</span> },
              { header: 'Artist', accessor: (a) => data.artists.find(art => art.artist_id === a.artist_id)?.name || 'Unknown' },
              { header: 'Year', accessor: (a) => a.release_year },
              { header: 'Label', accessor: (a) => data.labels.find(l => l.label_id === a.label_id)?.name || 'Indie' },
              { header: 'Track Count', accessor: (a) => data.tracks.filter(t => t.album_id === a.album_id).length },
            ]} 
          />
        );
      case 'tracks':
        return (
          <DataView<Track> 
            title="Track Database" 
            data={data.tracks} 
            columns={[
              { header: 'Title', accessor: (t) => <span className="font-medium text-white">{t.title}</span> },
              { header: 'Duration', accessor: (t) => `${Math.floor(t.duration_seconds / 60)}:${(t.duration_seconds % 60).toString().padStart(2, '0')}` },
              { header: 'Album', accessor: (t) => data.albums.find(a => a.album_id === t.album_id)?.title || 'Unknown' },
              { header: 'Plays', accessor: (t) => <span className="text-green-400 font-mono">{t.play_count.toLocaleString()}</span> },
            ]} 
          />
        );
      case 'data':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Raw Data Management</h2>
                    <p className="text-slate-400">Export your database state for GitHub processing.</p>
                </div>
                <button 
                    onClick={exportData}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors border border-slate-700"
                >
                    <Download size={18} />
                    Export JSON
                </button>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-400 h-[600px] overflow-auto">
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          </div>
        );
      case 'generator':
        return <AiGenerator currentData={data} onDataAdd={handleDataAdd} />;
      default:
        return <Dashboard data={data} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;