import { Sidebar } from '../components/Sidebar';
import { FileCheck, Mail, Shield, AlertCircle } from 'lucide-react';

export const Terms = () => {
  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-2">
                <FileCheck className="w-8 h-8 text-blue-400" />
                <h1 className="text-3xl font-bold text-white">Terms & Conditions</h1>
              </div>
              <p className="text-gray-400">Last updated: April 2026</p>
              <p className="text-gray-500 text-sm mt-2">Version 1.0.0</p>
            </div>

            <div className="backdrop-blur-xl bg-white/5 rounded-xl p-8 border border-white/10 space-y-8">
              {/* Quick Navigation */}
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Quick Navigation</h3>
                <div className="flex flex-wrap gap-2">
                  <a href="#acceptance" className="text-blue-400 text-sm hover:text-blue-300">1. Acceptance</a>
                  <a href="#license" className="text-blue-400 text-sm hover:text-blue-300">2. Use License</a>
                  <a href="#privacy" className="text-blue-400 text-sm hover:text-blue-300">3. Privacy</a>
                  <a href="#responsibilities" className="text-blue-400 text-sm hover:text-blue-300">4. Responsibilities</a>
                  <a href="#limitations" className="text-blue-400 text-sm hover:text-blue-300">5. Limitations</a>
                  <a href="#changes" className="text-blue-400 text-sm hover:text-blue-300">6. Changes</a>
                  <a href="#contact" className="text-blue-400 text-sm hover:text-blue-300">7. Contact</a>
                  <a href="#data" className="text-blue-400 text-sm hover:text-blue-300">8. Data Retention</a>
                </div>
              </div>

              <section id="acceptance">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400 font-bold">1</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-white">Acceptance of Terms</h2>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  By accessing and using Quick Notes, you accept and agree to be bound by the terms
                  and provision of this agreement. If you do not agree to these terms, please do not
                  use our service. These terms apply to all users, including those who are simply
                  browsing the application.
                </p>
              </section>

              <section id="license">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400 font-bold">2</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-white">Use License</h2>
                </div>
                <p className="text-gray-300 leading-relaxed mb-3">
                  Permission is granted to temporarily access Quick Notes for personal,
                  non-commercial use only. This includes the right to:
                </p>
                <ul className="space-y-2 text-gray-300 ml-6">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                    <span>Create, edit, and manage personal notes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                    <span>Export your data in multiple formats (JSON, TXT, Markdown, HTML)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                    <span>Use privacy features for secure note storage</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                    <span>Share notes with other registered users</span>
                  </li>
                </ul>
              </section>

              <section id="privacy">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white">Privacy & Data Security</h2>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  We take your privacy seriously. All notes are stored securely in MongoDB Atlas and
                  are only accessible by you through authentication. We do not share, sell, or
                  distribute your personal data to third parties. Private notes (non-public) are
                  only visible to you and users you explicitly share them with.
                </p>
                <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-yellow-400 text-sm">
                      We recommend regularly backing up your important notes using our export feature.
                    </p>
                  </div>
                </div>
              </section>

              <section id="responsibilities">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400 font-bold">4</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-white">User Responsibilities</h2>
                </div>
                <p className="text-gray-300 leading-relaxed mb-3">By using Quick Notes, you agree to:</p>
                <ul className="space-y-2 text-gray-300 ml-6">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                    <span>Provide accurate and complete information during registration</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                    <span>Maintain the security and confidentiality of your account credentials</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                    <span>Not use the service for any illegal or unauthorized purposes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                    <span>Not attempt to gain unauthorized access to the system or other user data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                    <span>Not upload malicious content or attempt to disrupt service</span>
                  </li>
                </ul>
              </section>

              <section id="limitations">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400 font-bold">5</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-white">Limitations of Liability</h2>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Quick Notes is provided "as is" without warranty of any kind, express or implied.
                  We do not guarantee that the service will be uninterrupted, timely, secure, or
                  error-free. We are not responsible for any data loss, damages, or issues arising
                  from the use of this application. Users are strongly advised to maintain their
                  own backups of important information.
                </p>
              </section>

              <section id="changes">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400 font-bold">6</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-white">Changes to Terms</h2>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  We reserve the right to modify these terms at any time. Changes will be effective
                  immediately upon posting to the application. Your continued use of Quick Notes
                  after any changes constitutes acceptance of the modified terms. We will notify
                  users of significant changes via email or in-app notification.
                </p>
              </section>

              <section id="data">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400 font-bold">8</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-white">Data Retention & Deletion</h2>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Your notes remain in our system until you choose to delete them. When you delete a note,
                  it is permanently removed from our database. If you delete your account, all associated
                  notes will be permanently deleted within 30 days. You can request immediate deletion
                  of your data by contacting support.
                </p>
              </section>

              <section id="contact">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white">Contact Information</h2>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  If you have any questions about these Terms & Conditions, please contact our support team:
                </p>
                <div className="mt-3 p-3 bg-white/5 rounded-lg">
                  <p className="text-gray-300">📧 Email: support@quicknotes.com</p>
                  <p className="text-gray-300 mt-1">🌐 Website: https://quicknotes.com</p>
                  <p className="text-gray-300 mt-1">⏰ Response Time: Within 48 hours</p>
                </div>
              </section>

              {/* Footer */}
              <div className="pt-4 border-t border-white/10 text-center">
                <p className="text-gray-500 text-sm">
                  By using Quick Notes, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
                </p>
                <p className="text-gray-600 text-xs mt-4">
                  © 2026 Quick Notes. All rights reserved. | Made with ❤️ for note-takers everywhere
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};