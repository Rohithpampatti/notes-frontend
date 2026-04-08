import { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Clock, FileText, RefreshCw } from 'lucide-react';
import API from '../api';
import { useAuth } from '../contexts/AuthContext';

interface Note {
  _id: string;
  title: string;
  content: string;
  updatedAt: string;
  createdAt: string;
}

export const History = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchNotes();
  }, [user]);

  const fetchNotes = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await API.get('/notes');
      // Sort by most recently updated first
      const sortedNotes = response.data.sort((a: Note, b: Note) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setNotes(sortedNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getPreview = (text: string) => {
    const plainText = text.replace(/<[^>]*>/g, '');
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0f172a]">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Note History</h1>
          <p className="text-gray-400 mb-8">View your recent notes and edit history</p>

          {notes.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-xl">
              <Clock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No history yet</h3>
              <p className="text-gray-400">Create or edit notes to see history</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note._id} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <h3 className="text-white font-semibold text-lg">{note.title || 'Untitled'}</h3>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Updated: {formatDate(note.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-3">{getPreview(note.content)}</p>
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-gray-500 text-xs">Created: {formatDate(note.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};