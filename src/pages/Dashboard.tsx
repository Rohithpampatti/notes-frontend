import { useState, useEffect } from 'react';
import { 
  Plus, Search, Grid, List, Filter, TrendingUp, Calendar, Tag, Star, 
  Sparkles, Clock, Loader2, X, FileText 
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { NoteCard } from '../components/NoteCard';
import { NoteModal } from '../components/NoteModal';
import API from '../api';
import { useAuth } from '../contexts/AuthContext';

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
  isPublic?: boolean;
}

export const Dashboard = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'az' | 'za'>('newest');
  const [stats, setStats] = useState({ total: 0, recent: 0, tags: 0 });
  const [showAISummary, setShowAISummary] = useState(false);
  const [aiInsight, setAiInsight] = useState('');
  const [insightLoading, setInsightLoading] = useState(false);
  const { user } = useAuth();

  // Get all unique tags from notes
  const allTags = ['all', ...new Set(notes.flatMap(note => note.tags || []))];

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    filterAndSortNotes();
  }, [searchQuery, notes, selectedTag, sortBy]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await API.get('/notes');
      setNotes(res.data);
      setFilteredNotes(res.data);
      // Update stats
      const recentNotes = res.data.filter((note: Note) => {
        const daysOld = (Date.now() - new Date(note.updatedAt || note.createdAt || '').getTime()) / (1000 * 60 * 60 * 24);
        return daysOld <= 7;
      });
      setStats({
        total: res.data.length,
        recent: recentNotes.length,
        tags: new Set(res.data.flatMap((n: Note) => n.tags || [])).size
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortNotes = () => {
    let filtered = [...notes];

    if (searchQuery) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTag !== 'all') {
      filtered = filtered.filter((note) => note.tags?.includes(selectedTag));
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.updatedAt || b.createdAt || '').getTime() - new Date(a.updatedAt || a.createdAt || '').getTime();
        case 'oldest':
          return new Date(a.updatedAt || a.createdAt || '').getTime() - new Date(b.updatedAt || b.createdAt || '').getTime();
        case 'az':
          return a.title.localeCompare(b.title);
        case 'za':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    setFilteredNotes(filtered);
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleAddNote = () => {
    setSelectedNote(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
    fetchNotes();
  };

  const getRecentActivity = () => {
    const recentNotes = [...notes].sort((a, b) => 
      new Date(b.updatedAt || b.createdAt || '').getTime() - new Date(a.updatedAt || a.createdAt || '').getTime()
    ).slice(0, 3);
    return recentNotes;
  };

  // AI Insights - Calls backend to analyze ALL notes
  const getAIInsights = async () => {
    if (notes.length === 0) {
      setAiInsight('You don\'t have any notes yet. Create some notes to get AI insights!');
      setShowAISummary(true);
      return;
    }

    setInsightLoading(true);
    setShowAISummary(true);
    
    try {
      // Prepare notes data for backend
      const notesData = notes.slice(0, 15).map(note => ({
        title: note.title || 'Untitled',
        content: (note.content || '').substring(0, 500),
        tags: note.tags || []
      }));
      
      console.log('Sending to AI:', { count: notesData.length });
      
      const response = await API.post('/notes/ai/analyze-all', { notes: notesData });
      
      if (response.data.insight) {
        setAiInsight(response.data.insight);
      } else {
        setAiInsight(`📊 You have ${notes.length} notes! Keep up the great work.`);
      }
    } catch (error: any) {
      console.error('AI Insights error:', error);
      console.error('Response:', error.response?.data);
      
      // Fallback message that always works
      setAiInsight(`✨ You have ${notes.length} notes! ${notes.length > 5 ? 'Great productivity! Keep writing.' : 'Create more notes to get detailed AI insights.'}`);
    } finally {
      setInsightLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header with Stats */}
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">My Notes</h1>
                  <p className="text-gray-400">Organize your thoughts and ideas</p>
                </div>
                <button
                  onClick={getAIInsights}
                  disabled={insightLoading}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {insightLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  AI Insights
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div className="backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Notes</p>
                      <p className="text-2xl font-bold text-white">{stats.total}</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-400 opacity-50" />
                  </div>
                </div>
                <div className="backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Recent (7 days)</p>
                      <p className="text-2xl font-bold text-white">{stats.recent}</p>
                    </div>
                    <Clock className="w-8 h-8 text-green-400 opacity-50" />
                  </div>
                </div>
                <div className="backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Unique Tags</p>
                      <p className="text-2xl font-bold text-white">{stats.tags}</p>
                    </div>
                    <Tag className="w-8 h-8 text-purple-400 opacity-50" />
                  </div>
                </div>
                <div className="backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Productivity</p>
                      <p className="text-2xl font-bold text-white">{Math.min(100, Math.floor((stats.recent / Math.max(1, stats.total)) * 100))}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-yellow-400 opacity-50" />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights Modal */}
            {showAISummary && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/70 p-4 z-50">
                <div className="w-full max-w-lg bg-[#1e293b] rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      AI Insights
                    </h2>
                    <button onClick={() => setShowAISummary(false)} className="text-gray-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {insightLoading ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                      <p className="text-gray-400">Analyzing your notes...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-gray-300 leading-relaxed whitespace-pre-line">{aiInsight}</p>
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-gray-500 text-xs">
                          🤖 Powered by Google Gemini AI • {notes.length} notes analyzed
                        </p>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setShowAISummary(false)}
                    className="mt-4 w-full py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex gap-4 flex-wrap">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notes by title or content..."
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="az">A to Z</option>
                  <option value="za">Z to A</option>
                </select>
              </div>

              {/* Tags Filter */}
              {allTags.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  <Filter className="w-5 h-5 text-gray-400 mt-2" />
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        selectedTag === tag
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {tag === 'all' ? 'All Notes' : `#${tag}`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity Section */}
            {notes.length > 0 && (
              <div className="mb-6 backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  Recent Activity
                </h3>
                <div className="space-y-2">
                  {getRecentActivity().map(note => (
                    <div key={note._id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">{note.title || 'Untitled'}</span>
                      <span className="text-gray-500 text-xs">
                        {new Date(note.updatedAt || note.createdAt || '').toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes Grid/List */}
            {loading ? (
              <div className="flex justify-center mt-10 text-white">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="text-center py-16 backdrop-blur-xl bg-white/5 rounded-xl border border-white/10">
                <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No notes found</h3>
                <p className="text-gray-400">
                  {searchQuery ? 'Try a different search term' : 'Create your first note to get started'}
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    id={note._id}
                    title={note.title}
                    content={note.content}
                    tags={note.tags}
                    createdAt={note.createdAt}
                    updatedAt={note.updatedAt}
                    onClick={() => handleNoteClick(note)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotes.map((note) => (
                  <div
                    key={note._id}
                    onClick={() => handleNoteClick(note)}
                    className="backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{note.title || 'Untitled'}</h3>
                      <p className="text-gray-400 text-sm line-clamp-1">{note.content}</p>
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {note.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-xs text-blue-400">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-xs">
                        {new Date(note.updatedAt || note.createdAt || '').toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={handleAddNote}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full text-white shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center group"
        >
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
        </button>
      </main>

      {isModalOpen && (
        <NoteModal note={selectedNote} onClose={handleCloseModal} />
      )}
    </div>
  );
};