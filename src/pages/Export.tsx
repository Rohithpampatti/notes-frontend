import { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { FileDown, FileText, File, Download, CheckCircle, Loader2 } from 'lucide-react';
import API from '../api';
import { useAuth } from '../contexts/AuthContext';

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export const Export = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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

  // Export as JSON
  const exportAsJSON = () => {
    setExporting('JSON');
    try {
      const exportData = {
        exportedAt: new Date().toISOString(),
        user: {
          email: user?.email,
          id: user?.id
        },
        totalNotes: notes.length,
        notes: notes.map(note => ({
          id: note._id,
          title: note.title,
          content: note.content,
          tags: note.tags,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt
        }))
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `notes_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setSuccess('JSON');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export as JSON');
    } finally {
      setExporting(null);
    }
  };

  // Export as TXT
  const exportAsTXT = () => {
    setExporting('TXT');
    try {
      let content = `NOTES EXPORT\n`;
      content += `Exported: ${new Date().toLocaleString()}\n`;
      content += `User: ${user?.email}\n`;
      content += `Total Notes: ${notes.length}\n`;
      content += `${'='.repeat(60)}\n\n`;
      
      notes.forEach((note, index) => {
        content += `[${index + 1}] ${note.title || 'Untitled'}\n`;
        content += `Created: ${new Date(note.createdAt).toLocaleString()}\n`;
        content += `Last Modified: ${new Date(note.updatedAt).toLocaleString()}\n`;
        if (note.tags && note.tags.length > 0) {
          content += `Tags: ${note.tags.join(', ')}\n`;
        }
        content += `\n${note.content || 'No content'}\n`;
        content += `${'-'.repeat(40)}\n\n`;
      });
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `notes_export_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setSuccess('TXT');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export as TXT');
    } finally {
      setExporting(null);
    }
  };

  // Export as Markdown
  const exportAsMarkdown = () => {
    setExporting('Markdown');
    try {
      let content = `# Notes Export\n\n`;
      content += `**Exported:** ${new Date().toLocaleString()}\n`;
      content += `**User:** ${user?.email}\n`;
      content += `**Total Notes:** ${notes.length}\n\n`;
      content += `---\n\n`;
      
      notes.forEach((note, index) => {
        content += `## ${index + 1}. ${note.title || 'Untitled'}\n\n`;
        content += `*Created: ${new Date(note.createdAt).toLocaleString()}*\n`;
        content += `*Modified: ${new Date(note.updatedAt).toLocaleString()}*\n`;
        if (note.tags && note.tags.length > 0) {
          content += `*Tags: ${note.tags.map(t => `\`${t}\``).join(', ')}*\n`;
        }
        content += `\n${note.content || '*No content*'}\n\n`;
        content += `---\n\n`;
      });
      
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `notes_export_${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setSuccess('Markdown');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export as Markdown');
    } finally {
      setExporting(null);
    }
  };

  // Export as HTML
  const exportAsHTML = () => {
    setExporting('HTML');
    try {
      let html = `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Notes Export - ${new Date().toISOString().split('T')[0]}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 30px; }
          .note { background: white; border-radius: 10px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .note-title { color: #333; margin-bottom: 10px; }
          .note-meta { color: #666; font-size: 12px; margin-bottom: 15px; }
          .tags { display: flex; gap: 5px; margin-top: 10px; }
          .tag { background: #e0e0e0; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
          .content { color: #444; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Notes Export</h1>
          <p>Exported: ${new Date().toLocaleString()}</p>
          <p>User: ${user?.email}</p>
          <p>Total Notes: ${notes.length}</p>
        </div>
      `;
      
      notes.forEach((note) => {
        html += `
        <div class="note">
          <h2 class="note-title">${escapeHtml(note.title || 'Untitled')}</h2>
          <div class="note-meta">
            Created: ${new Date(note.createdAt).toLocaleString()} | 
            Modified: ${new Date(note.updatedAt).toLocaleString()}
          </div>
          <div class="content">${escapeHtml(note.content || 'No content')}</div>
          ${note.tags && note.tags.length > 0 ? `
            <div class="tags">
              ${note.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
            </div>
          ` : ''}
        </div>
        `;
      });
      
      html += `</body></html>`;
      
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `notes_export_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setSuccess('HTML');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export as HTML');
    } finally {
      setExporting(null);
    }
  };

  // Helper function to escape HTML
  const escapeHtml = (text: string) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
    <div className="flex min-h-screen bg-[#0f172a]">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Export Notes</h1>
              <p className="text-gray-400">Download your notes in various formats</p>
              <p className="text-gray-500 text-sm mt-1">
                Total notes available: <span className="text-blue-400 font-semibold">{notes.length}</span>
              </p>
            </div>

            {notes.length === 0 ? (
              <div className="text-center py-16 backdrop-blur-xl bg-white/5 rounded-xl border border-white/10">
                <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No notes to export</h3>
                <p className="text-gray-400">Create some notes first, then export them</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* JSON Export */}
                <div className="backdrop-blur-xl bg-white/5 rounded-xl p-8 border border-white/10 hover:border-blue-500/50 transition-all">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <File className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">JSON</h3>
                      <p className="text-gray-400 text-sm">JavaScript Object Notation</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Export all notes as JSON for backup or migration
                  </p>
                  <button
                    onClick={exportAsJSON}
                    disabled={exporting !== null}
                    className="w-full py-3 bg-blue-600/20 text-blue-400 rounded-lg font-medium hover:bg-blue-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {exporting === 'JSON' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : success === 'JSON' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                    <span>{exporting === 'JSON' ? 'Exporting...' : 'Export to JSON'}</span>
                  </button>
                </div>

                {/* TXT Export */}
                <div className="backdrop-blur-xl bg-white/5 rounded-xl p-8 border border-white/10 hover:border-blue-500/50 transition-all">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-500/20 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Text</h3>
                      <p className="text-gray-400 text-sm">Plain text file</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Export as simple text files for universal compatibility
                  </p>
                  <button
                    onClick={exportAsTXT}
                    disabled={exporting !== null}
                    className="w-full py-3 bg-gray-600/20 text-gray-400 rounded-lg font-medium hover:bg-gray-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {exporting === 'TXT' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : success === 'TXT' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                    <span>{exporting === 'TXT' ? 'Exporting...' : 'Export to TXT'}</span>
                  </button>
                </div>

                {/* Markdown Export */}
                <div className="backdrop-blur-xl bg-white/5 rounded-xl p-8 border border-white/10 hover:border-blue-500/50 transition-all">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Markdown</h3>
                      <p className="text-gray-400 text-sm">Plain text format</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Export notes as Markdown files for easy editing
                  </p>
                  <button
                    onClick={exportAsMarkdown}
                    disabled={exporting !== null}
                    className="w-full py-3 bg-green-600/20 text-green-400 rounded-lg font-medium hover:bg-green-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {exporting === 'Markdown' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : success === 'Markdown' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                    <span>{exporting === 'Markdown' ? 'Exporting...' : 'Export to Markdown'}</span>
                  </button>
                </div>

                {/* HTML Export */}
                <div className="backdrop-blur-xl bg-white/5 rounded-xl p-8 border border-white/10 hover:border-blue-500/50 transition-all">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">HTML</h3>
                      <p className="text-gray-400 text-sm">Web page format</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Export as a styled HTML document for viewing in browser
                  </p>
                  <button
                    onClick={exportAsHTML}
                    disabled={exporting !== null}
                    className="w-full py-3 bg-orange-600/20 text-orange-400 rounded-lg font-medium hover:bg-orange-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {exporting === 'HTML' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : success === 'HTML' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                    <span>{exporting === 'HTML' ? 'Exporting...' : 'Export to HTML'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mt-6 p-4 bg-green-600/20 border border-green-500 rounded-lg">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>Successfully exported as {success}!</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};