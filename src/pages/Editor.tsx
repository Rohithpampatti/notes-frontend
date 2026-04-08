import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Save, FileText, Trash2, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import API from '../api';
import { useAuth } from '../contexts/AuthContext';

export const Editor = () => {
  const { id } = useParams(); // Get note ID from URL if editing existing note
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [wordCount, setWordCount] = useState(0);

  // Load note if editing existing
  useEffect(() => {
    if (id) {
      fetchNote();
    }
  }, [id]);

  // Update word count when content changes
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(words);
  }, [content]);

  const fetchNote = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await API.get(`/notes/${id}`);
      setTitle(response.data.title || '');
      setContent(response.data.content || '');
    } catch (error) {
      console.error('Error fetching note:', error);
      alert('Failed to load note');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      alert('Please add a title or content');
      return;
    }

    setSaving(true);
    setSaveStatus('saving');

    try {
      const noteData = {
        title: title.trim() || 'Untitled',
        content: content.trim(),
        tags: []
      };

      if (id) {
        // Update existing note
        await API.put(`/notes/${id}`, noteData);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        // Create new note
        const response = await API.post('/notes', noteData);
        setSaveStatus('saved');
        setTimeout(() => {
          setSaveStatus('idle');
          // Navigate to the new note
          navigate(`/editor/${response.data._id}`);
        }, 1500);
      }
    } catch (error: any) {
      console.error('Error saving note:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
      alert(error.response?.data?.error || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await API.delete(`/notes/${id}`);
        navigate('/dashboard');
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete note');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+S to save
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0f172a]">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0f172a]" onKeyDown={handleKeyDown}>
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <FileText className="w-8 h-8 text-blue-400" />
                  <h1 className="text-3xl font-bold text-white">
                    {id ? 'Edit Note' : 'New Note'}
                  </h1>
                </div>
                <p className="text-gray-400">
                  {id ? 'Edit your existing note' : 'Create a new note'}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Save Status Indicator */}
                {saveStatus === 'saving' && (
                  <div className="flex items-center gap-2 text-yellow-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-yellow-400"></div>
                    <span className="text-sm">Saving...</span>
                  </div>
                )}
                {saveStatus === 'saved' && (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Saved!</span>
                  </div>
                )}
                {saveStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-400">
                    <XCircle className="w-4 h-4" />
                    <span className="text-sm">Save failed</span>
                  </div>
                )}

                {/* Back Button */}
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 bg-white/5 text-white rounded-lg font-medium hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                {/* Delete Button (only for existing notes) */}
                {id && (
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg font-medium hover:bg-red-600/30 transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>

            {/* Editor */}
            <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <div className="border-b border-white/10 p-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note Title..."
                  className="w-full text-2xl font-bold bg-transparent border-none text-white placeholder-gray-500 focus:outline-none"
                />
              </div>

              <div className="p-6">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your note here... (Supports rich text formatting)"
                  rows={20}
                  className="w-full bg-transparent border-none text-white placeholder-gray-500 focus:outline-none resize-none text-lg leading-relaxed"
                />
              </div>
            </div>

            {/* Stats & Info */}
            <div className="mt-6 backdrop-blur-xl bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Characters</p>
                  <p className="text-white text-xl font-semibold">{content.length}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Words</p>
                  <p className="text-white text-xl font-semibold">{wordCount}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className="text-green-400 text-xl font-semibold">
                    {id ? 'Editing' : 'New Note'}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-gray-500 text-xs">
                  💡 Tip: Press <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Ctrl + S</kbd> to save quickly
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};