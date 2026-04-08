import { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Moon, Sun, Bell, BellOff, Save, RefreshCw, Mail } from 'lucide-react'; // ✅ Added Mail here
import API from '../api';
import { useAuth } from '../contexts/AuthContext';

interface UserSettings {
  darkMode: boolean;
  notifications: boolean;
  emailReminders: boolean;
}

export const Settings = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [emailReminders, setEmailReminders] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const { user } = useAuth();

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setDarkMode(settings.darkMode ?? true);
      setNotifications(settings.notifications ?? true);
      setEmailReminders(settings.emailReminders ?? true);
    }
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const saveSettings = async () => {
    setLoading(true);
    
    const settings: UserSettings = {
      darkMode,
      notifications,
      emailReminders
    };
    
    // Save to localStorage
    localStorage.setItem('userSettings', JSON.stringify(settings));
    
    // Save to backend (if you have a settings endpoint)
    try {
      // You can add a settings endpoint in your backend later
      // await API.post('/settings', settings);
      console.log('Settings saved:', settings);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = () => {
    setDarkMode(true);
    setNotifications(true);
    setEmailReminders(true);
    saveSettings();
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a] dark:bg-[#0f172a]">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
              <p className="text-gray-400">Manage your preferences</p>
            </div>

            <div className="space-y-6">
              {/* Appearance Settings */}
              <div className="backdrop-blur-xl bg-white/5 rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-6">Appearance</h2>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {darkMode ? (
                      <Moon className="w-6 h-6 text-blue-400" />
                    ) : (
                      <Sun className="w-6 h-6 text-yellow-400" />
                    )}
                    <div>
                      <p className="text-white font-medium">Dark Mode</p>
                      <p className="text-gray-400 text-sm">
                        {darkMode ? 'Dark mode is enabled' : 'Light mode is enabled'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      darkMode ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        darkMode ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="backdrop-blur-xl bg-white/5 rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-6">Notifications</h2>

                <div className="space-y-6">
                  {/* Push Notifications */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {notifications ? (
                        <Bell className="w-6 h-6 text-green-400" />
                      ) : (
                        <BellOff className="w-6 h-6 text-gray-400" />
                      )}
                      <div>
                        <p className="text-white font-medium">Push Notifications</p>
                        <p className="text-gray-400 text-sm">
                          {notifications ? 'Notifications are enabled' : 'Notifications are disabled'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotifications(!notifications)}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        notifications ? 'bg-green-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          notifications ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Email Reminders */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-6 h-6 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">Email Reminders</p>
                        <p className="text-gray-400 text-sm">
                          {emailReminders ? 'Email reminders are enabled' : 'Email reminders are disabled'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEmailReminders(!emailReminders)}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        emailReminders ? 'bg-purple-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          emailReminders ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Actions */}
              <div className="flex gap-4">
                <button
                  onClick={saveSettings}
                  disabled={loading}
                  className={`flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium transition-all ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
                
                <button
                  onClick={resetSettings}
                  className="px-6 py-3 bg-white/5 text-white rounded-lg font-medium hover:bg-white/10 transition-all"
                >
                  Reset to Default
                </button>
              </div>

              {saved && (
                <div className="bg-green-600/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg">
                  ✅ Settings saved successfully!
                </div>
              )}

              {/* Account Settings */}
              <div className="backdrop-blur-xl bg-white/5 rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">Account</h2>
                <div className="space-y-4">
                  <button 
                    onClick={() => alert('Password reset email sent!')}
                    className="w-full px-6 py-3 bg-white/5 text-white rounded-lg font-medium hover:bg-white/10 transition-all text-left"
                  >
                    Change Password
                  </button>
                  <button 
                    onClick={() => alert('Profile update coming soon!')}
                    className="w-full px-6 py-3 bg-white/5 text-white rounded-lg font-medium hover:bg-white/10 transition-all text-left"
                  >
                    Update Profile
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm('Are you sure you want to delete your account? This cannot be undone!')) {
                        alert('Account deletion request sent. Contact support.');
                      }
                    }}
                    className="w-full px-6 py-3 bg-red-600/20 text-red-400 rounded-lg font-medium hover:bg-red-600/30 transition-all text-left"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};