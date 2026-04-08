import { Sidebar } from '../components/Sidebar';
import { Info, Heart, Code, Database, Users, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../contexts/AuthContext';

export const About = () => {
  const [noteCount, setNoteCount] = useState<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchNoteCount();
  }, [user]);

  const fetchNoteCount = async () => {
    if (!user) return;
    try {
      const response = await API.get('/notes');
      setNoteCount(response.data.length);
    } catch (error) {
      console.error('Error fetching note count:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">About Quick Notes</h1>
              <p className="text-gray-400">Learn more about our application</p>
            </div>

            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="backdrop-blur-xl bg-white/5 rounded-xl p-6 border border-white/10 text-center">
                  <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{noteCount !== null ? noteCount : '...'}</p>
                  <p className="text-gray-400 text-sm">Notes Created</p>
                </div>
                <div className="backdrop-blur-xl bg-white/5 rounded-xl p-6 border border-white/10 text-center">
                  <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">1</p>
                  <p className="text-gray-400 text-sm">Active User</p>
                </div>
                <div className="backdrop-blur-xl bg-white/5 rounded-xl p-6 border border-white/10 text-center">
                  <Database className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">MongoDB</p>
                  <p className="text-gray-400 text-sm">Cloud Database</p>
                </div>
              </div>

              {/* What is Quick Notes? */}
              <div className="backdrop-blur-xl bg-white/5 rounded-xl p-8 border border-white/10">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Info className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white">What is Quick Notes?</h2>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Quick Notes is a modern, intuitive note-taking application designed to help you
                  capture and organize your thoughts effortlessly. With a beautiful dark interface
                  and powerful features, it's the perfect companion for your daily note-taking needs.
                </p>
              </div>

              {/* Key Features */}
              <div className="backdrop-blur-xl bg-white/5 rounded-xl p-8 border border-white/10">
                <h2 className="text-2xl font-semibold text-white mb-6">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                      <span>Beautiful dark theme with glassmorphism design</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                      <span>Rich text editing capabilities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                      <span>Privacy-focused with secure note protection</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                      <span>Note history tracking for version control</span>
                    </li>
                  </ul>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                      <span>Multiple export formats (JSON, TXT, Markdown, HTML)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                      <span>Email reminders for important notes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                      <span>Share notes with other users</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                      <span>AI-powered note summarization (Gemini)</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Built With Love */}
              <div className="backdrop-blur-xl bg-white/5 rounded-xl p-8 border border-white/10">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-pink-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white">Built With Love</h2>
                </div>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Quick Notes is crafted with care using modern web technologies to provide you with
                  the best note-taking experience possible.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">React 18</span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">TypeScript</span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Node.js</span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Express</span>
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">MongoDB</span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">Supabase Auth</span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">Gemini AI</span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">Tailwind CSS</span>
                </div>
              </div>

              {/* Version Footer */}
              <div className="backdrop-blur-xl bg-white/5 rounded-xl p-8 border border-white/10 text-center">
                <p className="text-gray-400 mb-2">Version 1.0.0</p>
                <p className="text-gray-500 text-sm">© 2026 Quick Notes. All rights reserved.</p>
                <p className="text-gray-600 text-xs mt-4">
                  Your notes are securely stored in MongoDB Atlas • Powered by Supabase Authentication
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};