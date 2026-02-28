import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { EchoVerseData } from '../types';
import { TrendingUp, Users, Disc, Music } from 'lucide-react';

interface DashboardProps {
  data: EchoVerseData;
}

const StatCard = ({ title, value, sub, icon: Icon }: any) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
      </div>
      <div className="p-3 bg-slate-800 rounded-lg text-green-400">
        <Icon size={24} />
      </div>
    </div>
    {sub && <p className="text-xs text-slate-500 mt-4">{sub}</p>}
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  
  const stats = useMemo(() => {
    const totalStreams = data.tracks.reduce((sum, t) => sum + t.play_count, 0);
    const totalArtists = data.artists.length;
    const totalAlbums = data.albums.length;
    
    // Top Artist Logic
    const artistStreams: Record<string, number> = {};
    data.tracks.forEach(track => {
      const album = data.albums.find(a => a.album_id === track.album_id);
      if (album) {
        artistStreams[album.artist_id] = (artistStreams[album.artist_id] || 0) + track.play_count;
      }
    });
    
    // Format for Chart
    const artistChartData = Object.entries(artistStreams)
      .map(([id, streams]) => ({
        name: data.artists.find(a => a.artist_id === id)?.name || 'Unknown',
        streams: streams
      }))
      .sort((a, b) => b.streams - a.streams)
      .slice(0, 5); // Top 5

    // Genre Distribution Logic
    const genreCounts: Record<string, number> = {};
    data.trackGenres.forEach(tg => {
        const genreName = data.genres.find(g => g.genre_id === tg.genre_id)?.genre_name || 'Unknown';
        genreCounts[genreName] = (genreCounts[genreName] || 0) + 1;
    });
    
    // Fallback if no genre relations
    if (data.trackGenres.length === 0 && data.genres.length > 0) {
        data.genres.forEach(g => genreCounts[g.genre_name] = 1);
    }

    const genreChartData = Object.entries(genreCounts).map(([name, count]) => ({ name, value: count }));

    return {
      totalStreams: totalStreams.toLocaleString(),
      totalArtists,
      totalAlbums,
      totalTracks: data.tracks.length,
      artistChartData,
      genreChartData
    };
  }, [data]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Platform Overview</h2>
        <p className="text-slate-400">Real-time metrics from the EchoVerse database.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Streams" value={stats.totalStreams} icon={TrendingUp} sub="Aggregated across all tracks" />
        <StatCard title="Active Artists" value={stats.totalArtists} icon={Users} sub="Signed talents" />
        <StatCard title="Albums Released" value={stats.totalAlbums} icon={Disc} sub="Catalog size" />
        <StatCard title="Total Tracks" value={stats.totalTracks} icon={Music} sub="Individual songs" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Streamed Artists Chart */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-6">Most Streamed Artists</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.artistChartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                <Tooltip 
                  cursor={{fill: '#1e293b'}}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                />
                <Bar dataKey="streams" radius={[4, 4, 0, 0]}>
                  {stats.artistChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#22c55e' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Genre Distribution */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-6">Genre Distribution</h3>
          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.genreChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.genreChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;