import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import API from "../api";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  // LOAD NOTES
  const fetchNotes = async () => {
    if (!user) return;
    
    setLoading(true);
    setError("");
    
    try {
      const response = await API.get("/notes");
      setNotes(response.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError("Failed to load notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [user]);

  // CREATE NOTE
  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Please enter both title and content");
      return;
    }

    setError("");
    
    try {
      await API.post("/notes", { 
        title: title.trim(), 
        content: content.trim(),
        tags: []
      });
      
      setTitle("");
      setContent("");
      fetchNotes(); // Refresh list
    } catch (err) {
      console.error("Error creating note:", err);
      setError("Failed to create note. Please try again.");
    }
  };

  // DELETE NOTE
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    
    try {
      await API.delete(`/notes/${id}`);
      fetchNotes(); // Refresh list
    } catch (err) {
      console.error("Error deleting note:", err);
      setError("Failed to delete note. Please try again.");
    }
  };

  // UPDATE NOTE (toggle complete or edit)
  const handleUpdate = async (id, updatedTitle, updatedContent) => {
    try {
      await API.put(`/notes/${id}`, { 
        title: updatedTitle, 
        content: updatedContent 
      });
      fetchNotes(); // Refresh list
    } catch (err) {
      console.error("Error updating note:", err);
      setError("Failed to update note. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-white mb-6">My Notes</h2>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* CREATE FORM */}
      <div className="backdrop-blur-xl bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Create New Note</h3>
        
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mb-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          placeholder="Note Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full p-3 mb-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />

        <button
          onClick={handleCreate}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Add Note
        </button>
      </div>

      {/* NOTES LIST */}
      {notes.length === 0 ? (
        <div className="text-center py-12 backdrop-blur-xl bg-white/5 rounded-xl border border-white/10">
          <p className="text-gray-400">No notes yet. Create your first note above!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note) => (
            <div
              key={note._id}
              className="backdrop-blur-xl bg-white/5 rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all"
            >
              <h3 className="text-xl font-semibold text-white mb-2">
                {note.title || "Untitled"}
              </h3>
              <p className="text-gray-300 mb-4 line-clamp-3">
                {note.content || "No content"}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-xs">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="px-3 py-1 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;