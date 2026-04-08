import { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { NoteCard } from '../components/NoteCard';
import { NoteModal } from '../components/NoteModal';
import { Lock, Unlock } from 'lucide-react';
import API from '../api';
import { useAuth } from '../contexts/AuthContext';

interface Note {
  _id: string;
  title: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  userId: string;
}

export const PrivacyNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPrivateNotes();
  }, [user]);

  const fetchPrivateNotes = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch all notes from backend
      const response = await API.get('/notes');
      // Filter private notes (isPublic === false means private)
      const privateNotes = response.data.filter((note: Note) => note.isPublic === false);
      setNotes(privateNotes);
    } catch (error) {
      console.error('Error fetching private notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
    fetchPrivateNotes(); // Refresh list
  };

  const togglePrivacy = async (note: Note) => {
    try {
      await API.put(`/notes/${note._id}`, {
        isPublic: !note.isPublic
      });
      fetchPrivateNotes(); // Refresh list
    } catch (error) {
      console.error('Error toggling privacy:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-2">
                <Lock className="w-8 h-8 text-yellow-400" />
                <h1 className="text-3xl font-bold text-white">Private Notes</h1>
              </div>
              <p className="text-gray-400">Your secure and private notes (not shared publicly)</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-4">
                  <Lock className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No private notes yet</h3>
                <p className="text-gray-400">
                  Create a note and uncheck "Public" option to make it private
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Private notes are only visible to you
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <p className="text-gray-400">
                    Showing {notes.length} private note{notes.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {notes.map((note) => (
                    <div key={note._id} className="relative">
                      <NoteCard
                        id={note._id}
                        title={note.title}
                        content={note.content}
                        onClick={() => handleNoteClick(note)}
                      />
                      <button
                        onClick={() => togglePrivacy(note)}
                        className="absolute top-2 right-2 p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                        title={note.isPublic ? "Make Private" : "Make Public"}
                      >
                        {note.isPublic ? (
                          <Unlock className="w-4 h-4 text-green-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-yellow-400" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {isModalOpen && (
        <NoteModal note={selectedNote} onClose={handleCloseModal} />
      )}
    </div>
  );
};