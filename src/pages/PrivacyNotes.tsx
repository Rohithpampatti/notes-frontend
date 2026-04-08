import { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { NoteCard } from '../components/NoteCard';
import { NoteModal } from '../components/NoteModal';
import { SetPrivacyPasswordModal } from '../components/SetPrivacyPasswordModal';
import { UnlockPrivacyPasswordModal } from '../components/UnlockPrivacyPasswordModal';
import { Lock, Unlock, Shield, Eye } from 'lucide-react';
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
}

export const PrivacyNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    checkPrivacyStatus();
  }, [user]);

  const checkPrivacyStatus = async () => {
    if (!user) return;
    
    try {
      const response = await API.get('/notes/privacy/has-password');
      setHasPassword(response.data.hasPassword);
      
      const unlocked = sessionStorage.getItem('privacyUnlocked') === 'true';
      
      if (response.data.hasPassword && !unlocked) {
        setShowUnlockModal(true);
        setLoading(false);
      } else if (response.data.hasPassword && unlocked) {
        setIsUnlocked(true);
        fetchPrivateNotes();
      } else {
        setShowSetPasswordModal(true);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking privacy status:', error);
      setLoading(false);
    }
  };

  const fetchPrivateNotes = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await API.get('/notes');
      const privateNotes = response.data.filter((note: Note) => note.isPublic === false);
      setNotes(privateNotes);
    } catch (error) {
      console.error('Error fetching private notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPasswordSuccess = () => {
    setHasPassword(true);
    setIsUnlocked(true);
    setShowSetPasswordModal(false);
    fetchPrivateNotes();
  };

  const handleUnlockSuccess = () => {
    setIsUnlocked(true);
    setShowUnlockModal(false);
    fetchPrivateNotes();
  };

  const handleLock = () => {
    sessionStorage.removeItem('privacyUnlocked');
    setIsUnlocked(false);
    setNotes([]);
    setShowUnlockModal(true);
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
    fetchPrivateNotes();
  };

  const togglePrivacy = async (note: Note) => {
    try {
      await API.put(`/notes/${note._id}`, { isPublic: !note.isPublic });
      fetchPrivateNotes();
    } catch (error) {
      console.error('Error toggling privacy:', error);
    }
  };

  const BlurredContent = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center mb-4">
        <Lock className="w-12 h-12 text-gray-500" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Content Locked</h3>
      <p className="text-gray-400 text-center max-w-md">
        Your private notes are protected. Enter your privacy password to unlock.
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0f172a]">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      <Sidebar />
      
      {showSetPasswordModal && (
        <SetPrivacyPasswordModal
          onSuccess={handleSetPasswordSuccess}
          onClose={() => setShowSetPasswordModal(false)}
        />
      )}

      {showUnlockModal && (
        <UnlockPrivacyPasswordModal
          onSuccess={handleUnlockSuccess}
          onClose={() => setShowUnlockModal(false)}
        />
      )}

      <main className="flex-1 overflow-auto p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Lock className="w-8 h-8 text-yellow-400" />
                <h1 className="text-3xl font-bold text-white">Private Notes</h1>
              </div>
              <p className="text-gray-400">
                Your secure and private notes
                {isUnlocked && (
                  <span className="text-green-400 ml-2 text-sm">(Unlocked)</span>
                )}
              </p>
            </div>
            
            {isUnlocked && (
              <button
                onClick={handleLock}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Lock
              </button>
            )}
          </div>

          {!isUnlocked ? (
            <div className="backdrop-blur-xl bg-white/5 rounded-xl p-8 border border-white/10">
              <BlurredContent />
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-xl">
              <Shield className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No private notes yet</h3>
              <p className="text-gray-400">Mark notes as private from the note editor</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note) => (
                <div key={note._id} className="relative group">
                  <NoteCard
                    id={note._id}
                    title={note.title}
                    content={note.content}
                    onClick={() => handleNoteClick(note)}
                  />
                  <button
                    onClick={() => togglePrivacy(note)}
                    className="absolute top-2 right-2 p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
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
          )}
        </div>
      </main>

      {isModalOpen && isUnlocked && (
        <NoteModal note={selectedNote} onClose={handleCloseModal} />
      )}
    </div>
  );
};