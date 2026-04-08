import { useState } from 'react';
import { X, Save, Trash2, Mail } from 'lucide-react';
import API from '../api';
import { useAuth } from '../contexts/AuthContext';

interface Note {
  _id?: string;
  title: string;
  content: string;
  reminder?: boolean;
  reminderDate?: string;
}

interface NoteModalProps {
  note: Note | null;
  onClose: () => void;
}

export const NoteModal = ({ note, onClose }: NoteModalProps) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [loading, setLoading] = useState(false);

  // 🔥 NEW: reminder state - format existing reminder date if present
  const [reminderDate, setReminderDate] = useState(() => {
    if (note?.reminderDate) {
      // Convert ISO date to datetime-local format (YYYY-MM-DDThh:mm)
      return new Date(note.reminderDate).toISOString().slice(0, 16);
    }
    return '';
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { user } = useAuth();

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // ✅ SAVE with proper date handling
  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      showSuccessToast('Please add title or content!');
      return;
    }

    setLoading(true);

    try {
      // Prepare note data
      const noteData: any = { 
        title, 
        content,
        tags: []
      };
      
      // Only add reminder data if date is selected
      if (reminderDate) {
        const selectedDate = new Date(reminderDate);
        if (!isNaN(selectedDate.getTime())) {
          noteData.reminder = true;
          noteData.reminderDate = selectedDate.toISOString();
        }
      } else {
        noteData.reminder = false;
        noteData.reminderDate = null;
      }
      
      console.log('Saving note data:', noteData);
      
      if (note && note._id) {
        await API.put(`/notes/${note._id}`, noteData);
        showSuccessToast('Note updated!');
      } else {
        await API.post('/notes', noteData);
        showSuccessToast('Note created!');
      }

      setTimeout(() => {
        onClose();
        window.location.reload(); // Refresh to show updated notes
      }, 1000);
    } catch (error: any) {
      console.error('Save error:', error);
      showSuccessToast(error.response?.data?.error || 'Error saving note!');
    }

    setLoading(false);
  };

  // ✅ DELETE
  const handleDelete = async () => {
    if (!note || !note._id || !confirm('Are you sure you want to delete this note?')) return;

    setLoading(true);

    try {
      await API.delete(`/notes/${note._id}`);
      showSuccessToast('Deleted successfully!');
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error(error);
      showSuccessToast('Delete failed!');
    }

    setLoading(false);
  };

  // ✅ SHARE
  const handleShare = async () => {
    if (!note?._id) return;

    const email = prompt("Enter email to share with:");

    if (!email) return;

    try {
      await API.post(`/notes/${note._id}/share`, { email, role: 'viewer' });
      showSuccessToast("Shared successfully!");
    } catch (error) {
      console.error(error);
      showSuccessToast("Share failed!");
    }
  };

  // 🤖 AI SUMMARY
  const handleSummarize = async () => {
    if (!content) {
      showSuccessToast('Please add content to summarize!');
      return;
    }

    try {
      const res = await API.post("/notes/ai/summarize", { content });
      alert("📝 Summary:\n\n" + res.data.summary);
    } catch (error) {
      console.error(error);
      alert("Failed to generate summary. Please try again.");
    }
  };

  // ⏰ REMINDER
  const handleReminder = async () => {
    if (!note?._id) {
      showSuccessToast('Please save the note first before setting reminder!');
      return;
    }
    
    if (!reminderDate) {
      showSuccessToast('Please select a date and time for reminder!');
      return;
    }

    setLoading(true);

    try {
      // Convert to proper ISO date format
      const selectedDate = new Date(reminderDate);
      
      if (isNaN(selectedDate.getTime())) {
        showSuccessToast('Invalid date format!');
        return;
      }
      
      const formattedDate = selectedDate.toISOString();
      
      await API.post(`/notes/${note._id}/reminder`, {
        date: formattedDate,
      });

      showSuccessToast(`Reminder set for ${selectedDate.toLocaleString()}!`);
      setReminderDate(''); // Clear after setting
    } catch (error) {
      console.error(error);
      showSuccessToast("Failed to set reminder!");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 p-4 z-50">
      <div className="w-full max-w-3xl bg-[#1e293b] rounded-xl shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between p-4 border-b border-white/10">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="bg-transparent text-white text-xl w-full outline-none placeholder-gray-500"
          />
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="text-white" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note content here..."
            className="w-full h-40 bg-white/5 text-white p-3 rounded placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          {/* ⏰ REMINDER INPUT */}
          <div className="mt-3">
            <label className="text-gray-400 text-sm mb-1 block">Set Reminder (Optional)</label>
            <input
              type="datetime-local"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-between p-4 border-t border-white/10">

          {/* DELETE */}
          {note && (
            <button 
              onClick={handleDelete} 
              className="text-red-400 hover:text-red-300 transition-colors"
              disabled={loading}
            >
              <Trash2 />
            </button>
          )}

          <div className="flex gap-3 flex-wrap">

            {/* SHARE */}
            {note && (
              <button
                onClick={handleShare}
                className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-white transition-colors flex items-center gap-2"
                disabled={loading}
              >
                <Mail size={16} /> Share
              </button>
            )}

            {/* 🤖 SUMMARY */}
            <button
              onClick={handleSummarize}
              className="bg-yellow-500 hover:bg-yellow-600 px-3 py-2 rounded text-black transition-colors"
              disabled={loading}
            >
              🤖 Summary
            </button>

            {/* ⏰ REMINDER */}
            {note && (
              <button
                onClick={handleReminder}
                className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-white transition-colors"
                disabled={loading}
              >
                ⏰ Set Reminder
              </button>
            )}

            {/* SAVE */}
            <button
              onClick={handleSave}
              disabled={loading}
              className={`px-4 py-2 rounded text-white transition-colors ${
                loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>

          </div>
        </div>

      </div>

      {/* TOAST */}
      {showToast && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
};