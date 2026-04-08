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
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchNotes();
  }, [user]);

  const fetchNotes = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await API.get('/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getPreview = (text: string) => {
    const plainText = text.replace(/<[^>]*>/g, '');
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  };

  const handleRestore = async (note: Note) => {
    if (!confirm(`Restore "${note.title}" to current version?`)) return;
    
    try {
      // Get current version as history (you can implement version history in backend)
      await API.put(`/notes/${note._id}`, {
        title: note.title,
        content: note.content
      });
      alert('Note restored successfully!');
      fetchNotes();
    } catch (error) {
      console.error('Error restoring note:', error);
      alert('Failed to restore note');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Note History</h1>
              <p className="text-gray-400">View all your notes and their edit history</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-4">
                  <Clock className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No notes yet</h3>
                <p className="text-gray-400">Create your first note to see history</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div
                    key={note._id}
                    className="backdrop-blur-xl bg-white/5 rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <FileText className="w-5 h-5 text-blue-400" />
                          <h3 className="text-white font-semibold text-lg">
                            {note.title || 'Untitled Note'}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center text-gray-400 text-sm">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>Created: {formatDate(note.createdAt)}</span>
                          </div>
                          <div className="flex items-center text-gray-400 text-sm">
                            <RefreshCw className="w-4 h-4 mr-1" />
                            <span>Last edited: {formatDate(note.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRestore(note)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm transition-colors"
                      >
                        Restore
                      </button>
                    </div>
                    <p className="text-gray-400 text-sm">{getPreview(note.content)}</p>
                    
                    {/* Version info */}
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-gray-500 text-xs">
                        Version: {formatDate(note.updatedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};