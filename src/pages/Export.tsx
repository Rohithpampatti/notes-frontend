import { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { FileText, Download, Loader2, CheckCircle, FileJson, FileCode, File } from 'lucide-react';
import API from '../api';
import { useAuth } from '../contexts/AuthContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

  // Export as PDF
  const exportAsPDF = async () => {
    setExporting('PDF');
    try {
      // Create a temporary div to render content for PDF
      const element = document.createElement('div');
      element.style.padding = '20px';
      element.style.fontFamily = 'Arial, sans-serif';
      element.style.backgroundColor = 'white';
      element.style.color = 'black';
      
      let htmlContent = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1>My Notes Export</h1>
          <p>Exported: ${new Date().toLocaleString()}</p>
          <p>User: ${user?.email}</p>
          <p>Total Notes: ${notes.length}</p>
        </div>
        <hr />
      `;
      
      notes.forEach((note, index) => {
        htmlContent += `
          <div style="margin-bottom: 30px; page-break-inside: avoid;">
            <h2 style="color: #2563eb;">${index + 1}. ${escapeHtml(note.title || 'Untitled')}</h2>
            <p style="color: #666; font-size: 12px;">
              Created: ${new Date(note.createdAt).toLocaleString()} | 
              Updated: ${new Date(note.updatedAt).toLocaleString()}
            </p>
            <div style="margin-top: 10px; line-height: 1.6;">
              ${escapeHtml(note.content || 'No content').replace(/\n/g, '<br/>')}
            </div>
            ${note.tags && note.tags.length > 0 ? `
              <div style="margin-top: 10px;">
                ${note.tags.map(tag => `<span style="background: #e0e7ff; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-right: 5px;">#${escapeHtml(tag)}</span>`).join('')}
              </div>
            ` : ''}
            <hr style="margin: 20px 0;" />
          </div>
        `;
      });
      
      element.innerHTML = htmlContent;
      document.body.appendChild(element);
      
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 280;
      
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 280;
      }
      
      pdf.save(`notes_export_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.removeChild(element);
      
      setSuccess('PDF');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export as PDF');
    } finally {
      setExporting(null);
    }
  };

  // Export as JSON
  const exportAsJSON = () => {
    setExporting('JSON');
    try {
      const exportData = {
        exportedAt: new Date().toISOString(),
        user: { email: user?.email, id: user?.id },
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
      link.click();
      URL.revokeObjectURL(url);
      
      setSuccess('JSON');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
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
        content += `Updated: ${new Date(note.updatedAt).toLocaleString()}\n`;
        if (note.tags?.length) content += `Tags: ${note.tags.join(', ')}\n`;
        content += `\n${note.content || 'No content'}\n`;
        content += `${'-'.repeat(40)}\n\n`;
      });
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `notes_export_${new Date().toISOString().split('T')[0]}.txt`;
      link.click();
      URL.revokeObjectURL(url);
      
      setSuccess('TXT');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      alert('Failed to export as TXT');
    } finally {
      setExporting(null);
    }
  };

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
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Export Notes</h1>
          <p className="text-gray-400 mb-8">Download your notes in various formats</p>
          
          {notes.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-xl">
              <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No notes to export</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PDF Export */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                    <File className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">PDF</h3>
                    <p className="text-gray-400 text-sm">Portable Document Format</p>
                  </div>
                </div>
                <button
                  onClick={exportAsPDF}
                  disabled={exporting !== null}
                  className="w-full py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {exporting === 'PDF' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Export to PDF
                </button>
              </div>
              
              {/* JSON Export */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <FileJson className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">JSON</h3>
                    <p className="text-gray-400 text-sm">JavaScript Object Notation</p>
                  </div>
                </div>
                <button
                  onClick={exportAsJSON}
                  disabled={exporting !== null}
                  className="w-full py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {exporting === 'JSON' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Export to JSON
                </button>
              </div>
              
              {/* TXT Export */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-500/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Text</h3>
                    <p className="text-gray-400 text-sm">Plain text file</p>
                  </div>
                </div>
                <button
                  onClick={exportAsTXT}
                  disabled={exporting !== null}
                  className="w-full py-2 bg-gray-600/20 text-gray-400 rounded-lg hover:bg-gray-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {exporting === 'TXT' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Export to TXT
                </button>
              </div>
              
              {/* Success Message */}
              {success && (
                <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Exported as {success}!
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};